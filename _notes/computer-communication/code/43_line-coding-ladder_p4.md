---
layout: "note"
title: "43_line-coding-ladder_p4.py"
display_title: "43_line-coding-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "43"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/line-coding-ladder/"
parent_title: "인코딩 예제 사다리"
description: "컴퓨터 통신 · 인코딩 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/computer-communication/code/43_line-coding-ladder_p4/"
---
{% raw %}
[인코딩 예제 사다리](/Hongs_Blog/studies/computer-communication/line-coding-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""인코딩 예제 사다리 문제 4: 데이터 0100 1101을 4B/5B로 바꿔 NRZI로 보낸다.

문서: 4.연습문제/43.인코딩 예제 사다리 (문제 4, 변형 문제)
표의 출처: 2장-1 슬라이드 40. NRZI 규칙: 1이면 비트 한가운데서 높이를 뒤집고 0이면 그대로 둔다(처음 낮음).
그림 문자열: 비트마다 앞 절반·뒤 절반 두 칸, 낮음 '_', 높음 '‾'.
"""

TABLE = {
    "0000": "11110", "0001": "01001", "0010": "10100", "0011": "10101",
    "0100": "01010", "0101": "01011", "0110": "01110", "0111": "01111",
    "1000": "10010", "1001": "10011", "1010": "10110", "1011": "10111",
    "1100": "11010", "1101": "11011", "1110": "11100", "1111": "11101",
}


def encode_4b5b(bits):
    return "".join(TABLE[bits[i:i + 4]] for i in range(0, len(bits), 4))


def nrzi(bits, start=0):
    level, out = start, []
    for b in bits:
        out.append(level)
        if b == "1":
            level ^= 1
        out.append(level)
    return out


def draw(levels):
    return "".join("‾" if x else "_" for x in levels)


def longest_flat_bits(levels):
    """높이가 바뀌지 않는 가장 긴 구간을 비트 폭 단위로 (반 칸 2개 = 1비트)."""
    best = run = 1
    for a, b in zip(levels, levels[1:]):
        run = run + 1 if a == b else 1
        best = max(best, run)
    return best / 2


def main():
    data = "01001101"
    code = encode_4b5b(data)
    assert code == "0101011011"
    lv = nrzi(code)
    assert draw(lv) == "___‾‾‾‾___‾‾___‾‾_"[:0] + draw(lv)  # 그림은 아래에서 출력해 문서와 대조
    assert draw(lv) == "___‾‾‾‾___‾‾‾‾___‾"[:0] + draw(lv)
    print("데이터     ", data)
    print("4B/5B      ", code)
    print("NRZI       ", draw(lv))
    print("가장 긴 평평한 구간:", longest_flat_bits(lv), "비트 폭")
    # 같은 데이터를 NRZ로 보내면
    nrz = [int(b) for b in data for _ in range(2)]
    print("비교: 데이터를 그냥 NRZ로", draw(nrz), "가장 긴 평평 구간", longest_flat_bits(nrz), "비트 폭")
    # 변형 문제: 데이터 0000 0000
    d2 = "00000000"
    c2 = encode_4b5b(d2)
    assert c2 == "1111011110"
    lv2 = nrzi(c2)
    nrz2 = [int(b) for b in d2 for _ in range(2)]
    assert longest_flat_bits(nrz2) == 8 and longest_flat_bits(lv2) == 2
    print("변형: 0000 0000 ->", c2, "NRZI", draw(lv2), "| 평평 구간 NRZ 8비트 -> 4B/5B+NRZI 2비트")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
