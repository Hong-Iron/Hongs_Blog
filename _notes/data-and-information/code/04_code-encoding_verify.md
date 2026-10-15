---
layout: "note"
title: "04_code-encoding_verify.py"
display_title: "04_code-encoding_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/data-and-information/code-encoding/"
parent_title: "부호와 부호화"
description: "자료와 정보 · 부호와 부호화 검증 코드"
sitemap: false
permalink: "/studies/data-and-information/code/04_code-encoding_verify/"
---
{% raw %}
[부호와 부호화](/Hongs_Blog/studies/data-and-information/code-encoding/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""부호와 부호화 문서의 값 확인.

문서: 04.부호와 부호화
주장:
  1. '가'의 유니코드 번호는 44032 = U+AC00 = 1010 1100 0000 0000(2).
  2. UTF-8 변환 표: U+0000~007F 1바이트, ~07FF 2바이트, ~FFFF 3바이트, ~10FFFF 4바이트.
     '가' -> 1110 1010 / 10 110000 / 10 000000 = EA B0 80.
  3. UTF-16은 '가'를 2바이트, UTF-32는 4바이트로 적는다.
  4. 부호 비율 R = log|C| / (n log|Sigma|): 반복 부호 {000, 111}은 1/3, 4비트에 패리티 1비트는 4/5,
     해밍 (7,4)는 4/7, 길이 n의 모든 2진 열은 1.
  5. 부호화는 1:1이어야 복호화할 수 있다.
실행: python3 04_code-encoding_verify.py
"""
import math
from fractions import Fraction
from itertools import product


def utf8_manual(cp):
    if cp <= 0x7F:
        return [cp]
    if cp <= 0x7FF:
        return [0b11000000 | cp >> 6, 0b10000000 | cp & 0x3F]
    if cp <= 0xFFFF:
        return [0b11100000 | cp >> 12, 0b10000000 | (cp >> 6) & 0x3F, 0b10000000 | cp & 0x3F]
    return [0b11110000 | cp >> 18, 0b10000000 | (cp >> 12) & 0x3F,
            0b10000000 | (cp >> 6) & 0x3F, 0b10000000 | cp & 0x3F]


def rate(code, q):
    n = len(next(iter(code)))
    return math.log(len(code)) / (n * math.log(q))


if __name__ == "__main__":
    assert ord("가") == 44032 == 0xAC00 and format(44032, "016b") == "1010110000000000"
    for cp in list(range(0, 0xD800, 7)) + list(range(0xE000, 0x110000, 101)) + [0x7F, 0x80, 0x7FF, 0x800, 0xFFFF, 0x10000, 0x10FFFF]:
        assert bytes(utf8_manual(cp)) == chr(cp).encode("utf-8")
    assert "가".encode("utf-8").hex().upper() == "EAB080"
    assert [format(b, "08b") for b in "가".encode("utf-8")] == ["11101010", "10110000", "10000000"]
    assert len("A".encode("utf-8")) == 1 and len("é".encode("utf-8")) == 2 and len("😀".encode("utf-8")) == 4
    assert len("가".encode("utf-16-be")) == 2 and len("가".encode("utf-32-be")) == 4
    assert ord("A") == 65 and format(65, "07b") == "1000001"
    # "가A"는 UTF-8로 4바이트
    assert len("가A".encode("utf-8")) == 4

    rep = {"000", "111"}
    assert abs(rate(rep, 2) - 1 / 3) < 1e-12
    par = {"".join(m) + str(sum(map(int, m)) % 2) for m in product("01", repeat=4)}
    assert len(par) == 16 and abs(rate(par, 2) - 4 / 5) < 1e-12
    assert Fraction(4, 7) == Fraction(int(math.log2(16)), 7)
    full = {"".join(m) for m in product("01", repeat=5)}
    assert abs(rate(full, 2) - 1) < 1e-12
    # 카드: 길이 5, 부호어 8개인 2진 부호 -> (5, 8) 부호, 비율 3/5
    assert abs(math.log2(8) / 5 - 0.6) < 1e-12
    # 1:1이 아니면 복호화가 갈린다
    bad = {"a": "0", "b": "0"}
    assert len(set(bad.values())) < len(bad)
    print("ALL CHECKS PASSED")
```
{% endraw %}
