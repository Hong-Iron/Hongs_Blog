---
layout: "note"
title: "49_msdos-memory-map_verify.py"
display_title: "49_msdos-memory-map_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "49"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/msdos-memory-map/"
parent_title: "MS-DOS 메모리 배치"
description: "어셈블리어 · MS-DOS 메모리 배치 검증 코드"
permalink: "/studies/assembly-language/code/49_msdos-memory-map_verify/"
---
{% raw %}
[MS-DOS 메모리 배치](/Hongs_Blog/studies/assembly-language/msdos-memory-map/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 49.MS-DOS 메모리 배치 문서의 주소 계산 확인. 실행: python3 49_msdos-memory-map_verify.py
# 실제 DOS 메모리를 읽지 않는다. 슬라이드 메모리 맵(wk13-2-1 p.9)의 경계 주소로 크기만 계산한다.

def linear(seg, off):
    """실주소 모드: 세그먼트 × 16 + 오프셋 (20비트)."""
    return ((seg << 4) + off) & 0xFFFFF


K = 1024

if __name__ == "__main__":
    # 1MB = 2^20바이트 = 00000h ~ FFFFFh
    assert 2 ** 20 == 0x100000 and 0xFFFFF + 1 == 1024 * K
    # 슬라이드 경계: 00000, 00400, A0000, B8000, C0000, F0000, FFFFF
    assert 0x00400 == 1024 == 256 * 4          # 인터럽트 벡터 표: 칸 256개 × 4바이트
    assert 0xA0000 == 640 * K                  # 640K RAM
    assert 0xC0000 - 0xA0000 == 128 * K        # VRAM 전체
    assert 0xB8000 - 0xA0000 == 96 * K         # Video Graphics
    assert 0xC0000 - 0xB8000 == 32 * K         # Video Text & Graphics
    assert 0xF0000 - 0xC0000 == 192 * K        # Reserved
    assert 0x100000 - 0xF0000 == 64 * K        # ROM BIOS
    assert 640 + 128 + 192 + 64 == 1024
    # wk13-2-1 p.8: 08F1:0100 -> 09010h
    assert linear(0x08F1, 0x0100) == 0x09010
    # BIOS 데이터 영역: 세그먼트 0040h = 선형 00400h (wk14-16 p.5~6)
    assert linear(0x0040, 0x0000) == 0x00400
    assert linear(0x0040, 0x0017) == 0x00417   # 키보드 상태 플래그
    # 글자 화면 메모리 B8000h는 B800:0000
    assert linear(0xB800, 0x0000) == 0xB8000
    # ROM BIOS F000:0000 ~ F000:FFFF
    assert linear(0xF000, 0x0000) == 0xF0000 and linear(0xF000, 0xFFFF) == 0xFFFFF
    # 한 세그먼트는 64KB
    assert 0xFFFF + 1 == 64 * K
    # 카드 C2: 0040:001E -> 0041Eh, B800:00A0 -> B80A0h
    assert linear(0x0040, 0x001E) == 0x0041E
    assert linear(0xB800, 0x00A0) == 0xB80A0
    print("ALL CHECKS PASSED")
```
{% endraw %}
