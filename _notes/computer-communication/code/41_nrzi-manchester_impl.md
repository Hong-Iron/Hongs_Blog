---
layout: "note"
title: "41_nrzi-manchester_impl.py"
display_title: "41_nrzi-manchester_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "41"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/nrzi-manchester/"
parent_title: "NRZI와 맨체스터"
description: "컴퓨터 통신 · NRZI와 맨체스터 구현 코드"
permalink: "/studies/computer-communication/code/41_nrzi-manchester_impl/"
---
{% raw %}
[NRZI와 맨체스터](/Hongs_Blog/studies/computer-communication/nrzi-manchester/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""NRZ, NRZI, 맨체스터 인코딩의 구현과 자체 테스트.

문서: 41.NRZI와 맨체스터 (예시, 정의, 실행 추적, 카드), 43.인코딩 방식 비교,
      4.연습문제/43.인코딩 예제 사다리 (문제 1~3)
표현: 비트 하나를 앞 절반·뒤 절반 두 칸으로 나누고, 칸마다 신호 높이 0(낮음) 또는 1(높음)을 적는다.
      그림 문자열에서는 0 -> '_', 1 -> '‾'.
규칙 (2장-1 슬라이드 38·39):
  - NRZ: 1은 높음, 0은 낮음. 비트 안에서 바뀌지 않는다.
  - NRZI: 1이면 비트 한가운데서 지금 높이를 뒤집고, 0이면 지금 높이를 그대로 둔다. 처음 높이는 낮음.
  - 맨체스터: NRZ 높이 XOR 클럭. 클럭은 비트마다 앞 절반 0, 뒤 절반 1.
    그래서 0은 낮음→높음(올라감), 1은 높음→낮음(내려감).
"""

SLIDE_BITS = "0010111101000010"  # 슬라이드 35~39의 예시 비트열


def nrz(bits):
    return [int(b) for b in bits for _ in range(2)]


def clock(n_bits):
    return [0, 1] * n_bits


def nrzi(bits, start=0):
    level = start
    out = []
    for b in bits:
        out.append(level)          # 앞 절반: 지금 높이
        if b == "1":
            level ^= 1             # 한가운데서 뒤집기
        out.append(level)          # 뒤 절반
    return out


def manchester(bits):
    return [d ^ c for d, c in zip(nrz(bits), clock(len(bits)))]


def decode_nrzi(levels):
    """한 비트의 두 칸이 다르면(한가운데서 바뀌었으면) 1, 같으면 0."""
    return "".join("1" if levels[i] != levels[i + 1] else "0" for i in range(0, len(levels), 2))


def decode_manchester(levels):
    """앞 절반의 클럭이 0이므로 앞 절반 높이가 곧 데이터다."""
    return "".join(str(levels[i]) for i in range(0, len(levels), 2))


def recover_clock(received, data_bits):
    """슬라이드 39: M' XOR Data = (Data XOR Clock) XOR Data = Clock."""
    return [m ^ d for m, d in zip(received, nrz(data_bits))]


def draw(levels):
    return "".join("‾" if x else "_" for x in levels)


def longest_flat(levels):
    """높이가 바뀌지 않고 이어지는 가장 긴 칸 수 (클럭을 맞출 단서가 없는 구간)."""
    best = run = 1
    for a, b in zip(levels, levels[1:]):
        run = run + 1 if a == b else 1
        best = max(best, run)
    return best


def transitions(levels):
    return sum(a != b for a, b in zip(levels, levels[1:]))


def main():
    b = SLIDE_BITS
    # 슬라이드 38 그림과 같은 모양
    assert draw(nrz(b)) == "____‾‾__‾‾‾‾‾‾‾‾__‾‾________‾‾__"
    assert draw(manchester(b)) == "_‾_‾‾__‾‾_‾_‾_‾__‾‾__‾_‾_‾_‾‾__‾"
    assert draw(nrzi(b)) == "_____‾‾‾‾__‾‾__‾‾‾‾__________‾‾‾"
    print("[OK] 슬라이드 비트열", b)
    print("     NRZ       ", draw(nrz(b)))
    print("     클럭      ", draw(clock(len(b))))
    print("     맨체스터  ", draw(manchester(b)))
    print("     NRZI      ", draw(nrzi(b)))

    # 맨체스터: 0은 올라감, 1은 내려감
    assert manchester("0") == [0, 1] and manchester("1") == [1, 0]
    # 되돌리기와 클럭 꺼내기 (모든 4~10비트 열)
    for n in range(1, 11):
        for x in range(2 ** n):
            s = format(x, f"0{n}b")
            assert decode_manchester(manchester(s)) == s
            assert decode_nrzi(nrzi(s)) == s
            assert decode_nrzi(nrzi(s, start=1)) == s
            assert recover_clock(manchester(s), s) == clock(n)
            # 맨체스터는 모든 비트 한가운데서 바뀐다
            m = manchester(s)
            assert all(m[2 * i] != m[2 * i + 1] for i in range(n))
            assert longest_flat(m) <= 2
    print("[OK] 1~10비트 모든 열: 복호 일치, M' XOR Data = Clock, 맨체스터는 매 비트 중앙 전이")

    # NRZI: 1이 아무리 이어져도 비트마다 전이, 0이 이어지면 평평
    assert longest_flat(nrzi("1" * 20)) == 2
    assert longest_flat(nrzi("0" * 20)) == 40
    assert longest_flat(nrz("1" * 20)) == 40 and longest_flat(nrz("0" * 20)) == 40
    print("[OK] NRZI: 1 20개는 비트마다 전이, 0 20개는 40칸 평평 (NRZ는 둘 다 평평)")

    # 효율: 맨체스터는 비트 하나에 신호 변화 칸이 두 개 -> 같은 신호 속도에서 데이터 속도 절반
    assert len(manchester(b)) == 2 * len(b)
    print("[OK] 맨체스터 효율 50%: 비트 16개에 신호 칸 32개")

    # 예제 사다리 문제 1~3 (4.연습문제/43.인코딩 예제 사다리)
    assert draw(nrz("1100")) == "‾‾‾‾____"
    assert draw(nrzi("1100")) == "_‾‾_____"
    assert draw(manchester("1100")) == "‾_‾__‾_‾"
    assert draw(nrzi("0110")) == "___‾‾___"
    assert draw(manchester("0110")) == "_‾‾_‾__‾"
    assert draw(nrzi("101100", start=1)) == "‾____‾‾_____"
    assert draw(manchester("101100")) == "‾__‾‾_‾__‾_‾"
    assert decode_manchester([0, 1, 1, 0, 1, 0, 0, 1, 0, 1]) == "01100"
    assert decode_nrzi([0, 0, 0, 1, 1, 0, 0, 0, 0, 1]) == "01101"
    print("[OK] 예제 사다리 문제 1~3의 답")

    # 43.인코딩 방식 비교 카드 C3: 맨체스터 1001
    assert draw(manchester("1001")) == "‾__‾_‾‾_"
    assert decode_manchester([1, 0, 0, 1, 0, 1, 1, 0]) == "1001"

    # 문서의 실행 추적 표: 10110
    assert draw(nrzi("10110")) == "_‾‾‾‾__‾‾‾"
    assert draw(manchester("10110")) == "‾__‾‾_‾__‾"
    print("[OK] 실행 추적 표 10110")

    # 카드 C3 (41): 1111 0000 의 맨체스터와 NRZI
    assert draw(manchester("11110000")) == "‾_‾_‾_‾__‾_‾_‾_‾"
    assert draw(nrzi("11110000")) == "_‾‾__‾‾_________"
    print("[OK] 카드 C3")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
