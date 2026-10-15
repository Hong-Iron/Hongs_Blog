---
layout: "note"
title: "53_bios-keyboard-int16h_verify.py"
display_title: "53_bios-keyboard-int16h_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "53"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/bios-keyboard-int16h/"
parent_title: "BIOS 키보드 입력 INT 16h"
description: "어셈블리어 · BIOS 키보드 입력 INT 16h 검증 코드"
sitemap: false
permalink: "/studies/assembly-language/code/53_bios-keyboard-int16h_verify/"
---
{% raw %}
[BIOS 키보드 입력 INT 16h](/Hongs_Blog/studies/assembly-language/bios-keyboard-int16h/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 53.BIOS 키보드 입력 INT 16h 문서의 확인. 실행: python3 53_bios-keyboard-int16h_verify.py
# BIOS를 실제로 부르지 않는다. 키보드 버퍼를 큐로 흉내 내고 문서의 표와 코드 흐름만 확인한다.
from collections import deque


def linear(seg, off):
    return ((seg << 4) + off) & 0xFFFFF


class Bios:
    def __init__(self):
        self.buf = deque()      # (스캔 코드, ASCII 코드)
        self.flags = 0

    def int9(self, sc, ac):     # 키가 눌리면 INT 9h 처리기가 버퍼에 넣는다
        self.buf.append((sc, ac))

    def f10(self):              # 기다렸다가 꺼낸다: AH = 스캔 코드, AL = ASCII
        return self.buf.popleft()

    def f11(self):              # 들여다보기만 한다: 키가 있으면 ZF = 0
        return 0 if self.buf else 1

    def f12(self):
        return self.flags


def clear_buffer(bios, exit_scan):
    """문서의 버퍼 비우기 코드 흐름. 끝났을 때의 ZF를 돌려준다."""
    while True:
        if bios.f11():                  # jz noKey
            al = 0
            return 1 if (al | 1) == 0 else 0   # or al,1 -> ZF = 0
        ah, al = bios.f10()
        if ah == exit_scan:             # cmp ah,scanCode / je quit
            return 1                    # ZF = 1
        # jmp L1


if __name__ == "__main__":
    # 키보드 상태 플래그의 자리
    assert linear(0x0040, 0x0017) == 0x00417 and linear(0x0040, 0x0018) == 0x00418
    # 자판 미리 입력 버퍼 001E~003D: 32바이트 = (스캔 코드, ASCII) 16쌍
    assert 0x003D - 0x001E + 1 == 32 and 32 // 2 == 16
    # 비트 번호 -> 마스크
    names = ["Right Shift", "Left Shift", "Ctrl", "Alt", "Scroll Lock on", "Num Lock on",
             "Caps Lock on", "Insert on", "Left Ctrl", "Left Alt", "Right Ctrl", "Right Alt",
             "Scroll down", "Num Lock down", "Caps Lock down", "SysReq down"]
    masks = {n: 1 << i for i, n in enumerate(names)}
    assert masks["Ctrl"] == 0x0004 and masks["Alt"] == 0x0008
    assert masks["Caps Lock on"] == 0x0040 and masks["Left Ctrl"] == 0x0100
    assert masks["SysReq down"] == 0x8000
    # 카드 C3: keyFlags = 0045h -> 비트 0, 2, 6
    kf = 0x0045
    assert [n for n in names if kf & masks[n]] == ["Right Shift", "Ctrl", "Caps Lock on"]

    # 스캔 코드 표 몇 칸
    fkeys = {"F1": (0x3B, 0x54, 0x5E, 0x68), "F10": (0x44, 0x5D, 0x67, 0x71),
             "F11": (0x85, 0x87, 0x89, 0x8B), "F12": (0x86, 0x88, 0x8A, 0x8C)}
    # F1~F10은 줄마다 1씩 커진다
    for k in range(10):
        assert 0x3B + k <= 0x44 and 0x54 + k <= 0x5D and 0x5E + k <= 0x67 and 0x68 + k <= 0x71
    assert fkeys["F10"][0] - fkeys["F1"][0] == 9
    nav = {"Home": (0x47, 0x77), "End": (0x4F, 0x75), "Up": (0x48, 0x8D), "Down": (0x50, 0x91),
           "Left": (0x4B, 0x73), "Right": (0x4D, 0x74), "Del": (0x53, 0x93), "Ins": (0x52, 0x92)}
    assert nav["Del"][0] == 0x53

    # or al,1 은 AL이 무엇이든 결과가 0이 아니다 -> ZF = 0 (8비트 전수)
    assert all((al | 1) != 0 for al in range(256))

    # 버퍼 비우기: 끝내는 키(Esc, 스캔 코드 01h라고 하자)가 없으면 ZF=0, 버퍼는 빈다
    b = Bios()
    for sc, ac in [(0x1E, ord("a")), (0x30, ord("b")), (0x3B, 0)]:
        b.int9(sc, ac)
    assert clear_buffer(b, 0x01) == 0 and not b.buf
    # 끝내는 키가 중간에 있으면 거기서 ZF=1로 끝나고 뒤 키는 남는다
    b = Bios()
    for sc, ac in [(0x1E, ord("a")), (0x01, 0x1B), (0x30, ord("b"))]:
        b.int9(sc, ac)
    assert clear_buffer(b, 0x01) == 1 and list(b.buf) == [(0x30, ord("b"))]
    # 10h는 먼저 누른 키부터 준다
    b = Bios()
    b.int9(0x3B, 0)
    b.int9(0x1E, ord("a"))
    assert b.f11() == 0 and b.f10() == (0x3B, 0) and b.f10() == (0x1E, ord("a")) and b.f11() == 1
    print("ALL CHECKS PASSED")
```
{% endraw %}
