---
layout: "note"
title: "42_4b5b_verify.py"
display_title: "42_4b5b_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "42"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/4b5b/"
parent_title: "4B/5B"
description: "컴퓨터 통신 · 4B/5B 검증 코드"
permalink: "/studies/computer-communication/code/42_4b5b_verify/"
---
{% raw %}
[4B/5B](/Hongs_Blog/studies/computer-communication/4b5b/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""4B/5B 부호 검증.

문서: 42.4B/5B (예시, 정의, 카드 C2·C3), 4.연습문제/43.인코딩 예제 사다리 (문제 4)
출처: 2장-1 슬라이드 40의 표
주장:
  1. 16개 부호는 서로 다르고, 모두 맨 앞 0이 1개 이하, 맨 뒤 0이 2개 이하다.
  2. 그래서 부호를 어떻게 이어 붙여도 0은 최대 3개까지만 이어진다 (뒤 2 + 앞 1).
     3개가 실제로 나온다 (예: 0010 -> 10100 다음 0001 -> 01001: ...00|0...).
  3. 부호 안에서도 0은 2개 넘게 이어지지 않는다.
  4. 효율 = 4/5 = 80%. 맨체스터는 50%.
  5. 5비트 열 32개 중 슬라이드 조건(앞 0 <= 1, 뒤 0 <= 2)을 만족하는 것은 21개다.
     표는 그중 16개를 고른 것이고, 남는 5개(01100, 01101, 10001, 11001, 11111)는 데이터에 쓰지 않는다.
  6. NRZI로 보내면 1마다 높이가 바뀌므로, 높이가 바뀌지 않는 구간은 최대 3비트 + 다음 1 직전까지다.
"""
from itertools import product

TABLE = {
    "0000": "11110", "0001": "01001", "0010": "10100", "0011": "10101",
    "0100": "01010", "0101": "01011", "0110": "01110", "0111": "01111",
    "1000": "10010", "1001": "10011", "1010": "10110", "1011": "10111",
    "1100": "11010", "1101": "11011", "1110": "11100", "1111": "11101",
}


def lead0(c):
    return len(c) - len(c.lstrip("0"))


def trail0(c):
    return len(c) - len(c.rstrip("0"))


def max_zero_run(s):
    best = run = 0
    for ch in s:
        run = run + 1 if ch == "0" else 0
        best = max(best, run)
    return best


def encode(bits):
    assert len(bits) % 4 == 0
    return "".join(TABLE[bits[i:i + 4]] for i in range(0, len(bits), 4))


def decode(code):
    inv = {v: k for k, v in TABLE.items()}
    return "".join(inv[code[i:i + 5]] for i in range(0, len(code), 5))


def nrzi_levels(bits, start=0):
    level, out = start, []
    for b in bits:
        out.append(level)
        if b == "1":
            level ^= 1
        out.append(level)
    return out


def main():
    codes = list(TABLE.values())
    assert len(set(codes)) == 16
    assert all(lead0(c) <= 1 and trail0(c) <= 2 for c in codes)
    assert all(max_zero_run(c) <= 2 for c in codes)
    print("[OK] 16개 부호: 서로 다름, 앞 0 <= 1, 뒤 0 <= 2, 부호 안 0 연속 <= 2")

    worst = max(max_zero_run(a + b) for a in codes for b in codes)
    assert worst == 3
    assert max_zero_run(TABLE["0010"] + TABLE["0001"]) == 3
    # 세 부호 이상 이어도 3을 넘지 않는다 (가운데 부호에는 1이 반드시 있으므로)
    assert all("1" in c for c in codes)
    assert max(max_zero_run(a + b + c) for a in codes for b in codes for c in codes) == 3
    print("[OK] 아무 두·세 부호를 이어도 0은 최대 3개 연속 (0010,0001 -> 10100 01001)")

    for n in range(1, 4):
        for t in product("01", repeat=4 * n):
            s = "".join(t)
            assert decode(encode(s)) == s
    print("[OK] 4·8·12비트 모든 열: 인코딩 후 디코딩하면 원래대로")

    assert 4 / 5 == 0.8 and 1 / 2 == 0.5
    print("[OK] 효율 4/5 = 80%, 맨체스터 1/2 = 50%")

    ok = ["".join(t) for t in product("01", repeat=5)
          if lead0("".join(t)) <= 1 and trail0("".join(t)) <= 2]
    assert len(ok) == 21 and set(codes) <= set(ok)
    spare = sorted(set(ok) - set(codes))
    assert spare == ["01100", "01101", "10001", "11001", "11111"]
    print("[OK] 조건을 만족하는 5비트 열 21개 중 16개를 표에 씀. 남는 것:", spare)

    # NRZI: 4B/5B 출력의 최장 평평 구간 (반 칸 단위)
    worst_flat = 0
    for a in codes:
        for b in codes:
            lv = nrzi_levels(a + b)
            run = best = 1
            for x, y in zip(lv, lv[1:]):
                run = run + 1 if x == y else 1
                best = max(best, run)
            worst_flat = max(worst_flat, best)
    assert worst_flat == 8   # 반 칸 8개 = 1의 뒤 절반 + 0 세 비트 + 다음 1의 앞 절반
    print("[OK] NRZI로 보내면 높이가 바뀌지 않는 구간은 최대 반 칸 8개(비트 4개 폭)")

    # 카드 C2와 예제 사다리 문제 4
    assert encode("10110000") == "1011111110"
    lv = nrzi_levels("1011111110")
    assert "".join("‾" if x else "_" for x in lv) == "_‾‾‾‾__‾‾__‾‾__‾‾___"   # 문서의 실행 추적 표
    assert encode("00000000") == "1111011110"
    assert decode("0101011011") == "01001101"
    print("[OK] 카드 C2: 1011 0000 -> 10111 11110, 0000 0000 -> 11110 11110; 문제 4 역변환 01001101")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
