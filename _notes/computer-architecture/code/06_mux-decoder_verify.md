---
layout: "note"
title: "06_mux-decoder_verify.py"
display_title: "06_mux-decoder_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "06"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-architecture/mux-decoder/"
parent_title: "멀티플렉서와 디코더"
description: "컴퓨터 구조 · 멀티플렉서와 디코더 검증 코드"
permalink: "/studies/computer-architecture/code/06_mux-decoder_verify/"
---
{% raw %}
[멀티플렉서와 디코더](/Hongs_Blog/studies/computer-architecture/mux-decoder/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 06.멀티플렉서와 디코더: 게이트로 만든 회로를 전수 검사한다(8비트 너비 포함).
# 실행: python3 06_mux-decoder_verify.py  (표준 라이브러리만 쓴다)
# 실제 하드웨어가 아니라 파이썬으로 게이트를 흉내 낸 것이다.
from itertools import product


def NOT(a): return 1 - a
def AND(*x): return int(all(x))
def OR(*x): return int(any(x))


def mux2(a, b, s):
    """1비트 2입력 멀티플렉서: y = (NOT s)a + sb. s=0이면 a, s=1이면 b."""
    return OR(AND(NOT(s), a), AND(s, b))


def mux4(d0, d1, d2, d3, s1, s0):
    """2입력 멀티플렉서 셋으로 만든 4입력 멀티플렉서."""
    return mux2(mux2(d0, d1, s0), mux2(d2, d3, s0), s1)


def decoder(bits):
    """n비트 입력(윗자리부터) -> 2^n개 출력. 입력이 가리키는 번호만 1."""
    n = len(bits)
    outs = []
    for k in range(2 ** n):
        want = [(k >> (n - 1 - i)) & 1 for i in range(n)]
        outs.append(AND(*[b if w else NOT(b) for b, w in zip(bits, want)]))
    return outs


def mux_from_decoder(data, sel_bits):
    """디코더 + AND 줄 + 큰 OR 하나로 만든 멀티플렉서."""
    onehot = decoder(sel_bits)
    return OR(*[AND(h, d) for h, d in zip(onehot, data)])


def bits_of(x, n):
    return [(x >> i) & 1 for i in range(n)]  # 아랫자리부터


def mux2_wide(a, b, s, n=8):
    """n비트 너비: 1비트 멀티플렉서 n개가 선택 신호 하나를 함께 쓴다."""
    ya = [mux2(x, y, s) for x, y in zip(bits_of(a, n), bits_of(b, n))]
    return sum(bit << i for i, bit in enumerate(ya))


if __name__ == "__main__":
    # 2입력 멀티플렉서 진리표 8줄
    for a, b, s in product((0, 1), repeat=3):
        assert mux2(a, b, s) == (b if s else a)
    # 4입력: 64가지 모두
    for d0, d1, d2, d3, s1, s0 in product((0, 1), repeat=6):
        want = (d0, d1, d2, d3)[2 * s1 + s0]
        assert mux4(d0, d1, d2, d3, s1, s0) == want
        assert mux_from_decoder([d0, d1, d2, d3], [s1, s0]) == want
        # 식: e = s1's0'a + s1's0 b + s1 s0' c + s1 s0 d
        e = OR(AND(NOT(s1), NOT(s0), d0), AND(NOT(s1), s0, d1), AND(s1, NOT(s0), d2), AND(s1, s0, d3))
        assert e == want
    # 8비트 너비 2입력 멀티플렉서 전수: 2 x 256 x 256
    for a in range(256):
        for b in range(256):
            assert mux2_wide(a, b, 0) == a
            assert mux2_wide(a, b, 1) == b
    # 예시의 값
    assert mux2_wide(0b00101101, 0b11110000, 0) == 0b00101101
    assert mux2_wide(0b00101101, 0b11110000, 1) == 0b11110000
    # 디코더: 2->4, 3->8, 5->32 모두 원-핫
    for n in (1, 2, 3, 5):
        for k in range(2 ** n):
            bits = [(k >> (n - 1 - i)) & 1 for i in range(n)]
            out = decoder(bits)
            assert len(out) == 2 ** n and sum(out) == 1 and out[k] == 1
    assert decoder([1, 0, 1]) == [0, 0, 0, 0, 0, 1, 0, 0]       # 101(5) -> Out5만 1
    assert decoder([1, 0]) == [0, 0, 1, 0]
    # 선택 신호 수: 입력 n개면 log2 n개. 32개면 5개
    assert (32).bit_length() - 1 == 5 and (4).bit_length() - 1 == 2
    # 4입력 멀티플렉서에 드는 2입력 멀티플렉서 = 3개, 32입력이면 31개
    assert 2 + 1 == 3 and 16 + 8 + 4 + 2 + 1 == 31
    # 표 찾기: 데이터 입력에 진리표를 꽂으면 아무 2입력 함수나 된다 (XOR: 0,1,1,0)
    for a, b in product((0, 1), repeat=2):
        assert mux4(0, 1, 1, 0, a, b) == a ^ b
    # 카드 C2: d = (1,0,1,1), s1 s0 = 1 0 -> d2 = 1
    assert mux4(1, 0, 1, 1, 1, 0) == 1
    # 카드 C3: 3->8 디코더에 110 -> Out6
    assert decoder([1, 1, 0]).index(1) == 6
    print("ALL CHECKS PASSED")
```
{% endraw %}
