---
layout: "note"
title: "54_bios-video-int10h_verify.py"
display_title: "54_bios-video-int10h_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "54"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
parent_url: "/studies/assembly-language/bios-video-int10h/"
parent_title: "BIOS 비디오 INT 10h와 속성 바이트"
description: "어셈블리어 · BIOS 비디오 INT 10h와 속성 바이트 검증 코드"
permalink: "/studies/assembly-language/code/54_bios-video-int10h_verify/"
---
{% raw %}
[BIOS 비디오 INT 10h와 속성 바이트](/Hongs_Blog/studies/assembly-language/bios-video-int10h/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 54.BIOS 비디오 INT 10h와 속성 바이트 문서의 계산 확인. 실행: python3 54_bios-video-int10h_verify.py
# 화면에 실제로 그리지 않는다. 속성 바이트와 레지스터 값의 비트 계산만 확인한다.

BLUE, GREEN, RED, INTENSITY = 0b0001, 0b0010, 0b0100, 0b1000


def attribute(background, foreground):
    """(배경 SHL 4) OR 글자색"""
    return ((background << 4) | foreground) & 0xFF


def split(attr):
    return attr >> 4, attr & 0x0F


if __name__ == "__main__":
    # 색 4비트 (wk14-16 p.28)
    light_gray = RED | GREEN | BLUE
    white = INTENSITY | RED | GREEN | BLUE
    cyan = GREEN | BLUE
    magenta = RED | BLUE
    assert (light_gray, white, cyan, magenta) == (0b0111, 0b1111, 0b0011, 0b0101)
    # 속성 바이트 (wk14-16 p.29)
    assert attribute(BLUE, light_gray) == 0x17
    assert attribute(RED, white) == 0x4F
    # SHL 4 = × 16. wk07-3-1 p.14의 yellow + (blue * 16)과 같은 계산
    yellow = INTENSITY | RED | GREEN
    assert yellow == 14 and yellow + BLUE * 16 == attribute(BLUE, yellow) == 0x1E
    # 겹치는 비트가 없으니 더하기와 OR가 같다 (모든 조합 전수)
    for bg in range(16):
        for fg in range(16):
            a = attribute(bg, fg)
            assert a == bg * 16 + fg and split(a) == (bg, fg)
    # 보통 속성 7 = 검은 배경에 밝은 회색 글자 (wk14-16 p.33의 bh,7)
    assert split(0x07) == (0, light_gray)
    # or bl,10000000b: 맨 윗비트만 켠다 (wk14-16 p.32)
    for bl in range(256):
        r = bl | 0b10000000
        assert r & 0x80 and (r & 0x7F) == (bl & 0x7F)
    assert 0x17 | 0x80 == 0x97

    # Clrscr (wk14-16 p.33): mov ax,0600h -> AH=6(위로 스크롤), AL=0
    assert (0x0600 >> 8, 0x0600 & 0xFF) == (6, 0)
    # mov cx,0 -> CH=0, CL=0 (왼쪽 위 0,0). mov dx,184Fh -> DH=24, DL=79
    assert (0x184F >> 8, 0x184F & 0xFF) == (24, 79)
    # 25줄 × 80칸, 칸마다 글자 1바이트 + 속성 1바이트 = 4,000바이트
    assert 25 * 80 * 2 == 4000

    # 카드 C2: 파란 배경 노란 글자 = 1Eh, 깜빡임 비트까지 켜면 9Eh
    assert attribute(BLUE, yellow) | 0x80 == 0x9E
    # 카드 C3: 속성 4Eh -> 배경 4(빨강), 글자 14(노랑)
    assert split(0x4E) == (RED, yellow)
    print("ALL CHECKS PASSED")
```
{% endraw %}
