---
layout: "note"
title: "11_assemble-link-execute_verify.py"
display_title: "11_assemble-link-execute_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
parent_url: "/studies/assembly-language/assemble-link-execute/"
parent_title: "어셈블·링크·실행 과정"
description: "어셈블리어 · 어셈블·링크·실행 과정 검증 코드"
permalink: "/studies/assembly-language/code/11_assemble-link-execute_verify/"
---
{% raw %}
[어셈블·링크·실행 과정](/Hongs_Blog/studies/assembly-language/assemble-link-execute/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""어셈블·링크·실행 과정 검증 (MASM이 없어 파이썬 흉내로 확인).

문서: 11.어셈블·링크·실행 과정
출처: 어셈블리어 4주차 4-2 p.3~4, 6주차 3-1 p.1 (리스팅 파일의 예)
주장:
  1. 네 단계: 편집기 → 어셈블러 → 링커 → 운영체제 로더. 원본을 고치면 2~4단계를 다시 한다.
  2. 리스팅 파일(6주차 3-1 p.1)의 오프셋은 앞 줄의 오프셋에 앞 줄 기계어의 바이트 수를 더한 값이다.
     00000000 66 B8 0000    (4바이트) → 00000004
     00000004 B9 00000005   (5바이트) → 00000009
     00000009 66 03 C1      (3바이트) → 0000000C
     0000000C E2 FB         (2바이트) → 0000000E
  3. loop L1의 FBh는 8비트 부호 있는 수로 -5다. 0000000Eh + (-5) = 00000009h = L1.
  4. 이 반복을 흉내 내면 AX = 5 + 4 + 3 + 2 + 1 = 15 (000Fh).
  5. 만들어지는 파일: 어셈블러 → 목적 파일, 리스팅 파일 / 링커 → 실행 파일, 맵 파일.
"""

LISTING = [
    (0x00000000, "66 B8 0000", "mov ax,0"),
    (0x00000004, "B9 00000005", "mov ecx,5"),
    (0x00000009, "66 03 C1", "L1:add ax,cx"),
    (0x0000000C, "E2 FB", "loop L1"),
]
END = 0x0000000E

STEPS = [("편집기", "원본 파일"), ("어셈블러", "목적 파일"), ("링커", "실행 파일"), ("운영체제 로더", "출력")]
SIDE = {"어셈블러": "리스팅 파일", "링커": "맵 파일"}
LINKER_INPUT = ["목적 파일", "링크 라이브러리"]


def nbytes(code):
    return sum(len(tok) // 2 for tok in code.split())


def signed8(b):
    return b - 256 if b >= 128 else b


def run_loop():
    ax, ecx = 0, 5
    turns = 0
    while True:
        ax = (ax + (ecx & 0xFFFF)) & 0xFFFF      # add ax,cx
        turns += 1
        ecx = (ecx - 1) & 0xFFFFFFFF             # loop: ECX를 1 줄이고 0이 아니면 뛴다
        if ecx == 0:
            break
    return ax, turns


def main():
    assert [s[0] for s in STEPS] == ["편집기", "어셈블러", "링커", "운영체제 로더"]
    assert len(STEPS) == 4 and list(SIDE) == ["어셈블러", "링커"]
    print("[OK] 네 단계와 곁가지 파일 둘")

    sizes = [nbytes(code) for _, code, _ in LISTING]
    assert sizes == [4, 5, 3, 2]
    off = 0
    for (want, code, _), size in zip(LISTING, sizes):
        assert off == want
        off += size
    assert off == END == sum(sizes) == 14
    print("[OK] 리스팅 파일의 오프셋 00, 04, 09, 0C, 끝 0E = 바이트 수 4, 5, 3, 2의 누적")

    assert signed8(0xFB) == -5
    assert END + signed8(0xFB) == 0x00000009 == LISTING[2][0]
    print("[OK] FBh = -5, 0Eh - 5 = 09h (L1)")

    ax, turns = run_loop()
    assert (ax, turns) == (15, 5) and ax == 0x000F
    print("[OK] 흉내 실행: AX = 15 (5번 돈다)")

    # 카드: jmp/loop 변위 계산 연습. 다음 명령 오프셋 0020h, 목표 0012h → 변위 -14 = F2h
    disp = 0x12 - 0x20
    assert disp == -14 and (disp & 0xFF) == 0xF2 and signed8(0xF2) == -14
    # 카드: 3바이트, 2바이트, 5바이트 명령이 00000010h부터 놓이면 오프셋은 10h, 13h, 15h, 다음은 1Ah
    offs, o = [], 0x10
    for size in (3, 2, 5):
        offs.append(o)
        o += size
    assert offs == [0x10, 0x13, 0x15] and o == 0x1A
    print("[OK] 카드: 변위 F2h, 오프셋 10h·13h·15h·1Ah")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
