---
layout: "note"
title: "09_neuron-convergence_verify.py"
display_title: "09_neuron-convergence_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "09"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "4-1학기"
parent_url: "/studies/human-interface-media/neuron-convergence/"
parent_title: "뉴런의 수렴"
description: "휴먼 인터페이스 미디어 · 뉴런의 수렴 검증 코드"
permalink: "/studies/human-interface-media/code/09_neuron-convergence_verify/"
---
{% raw %}
[뉴런의 수렴](/Hongs_Blog/studies/human-interface-media/neuron-convergence/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""뉴런의 수렴 검증 (뉴런 수렴 모델링 연습의 답 포함).

문서: 09.뉴런의 수렴, 4.연습문제/09.뉴런 수렴 모델링 연습
슬라이드(강의 2, p.12~14)의 세 회로. 수용기 1~7, 자극받은 수용기는 1, 아니면 0.
  회로 1 (수렴 없음): B = x4
  회로 2 (흥분성 수렴): A = x1 + x2, C = x6 + x7, B = x3 + x4 + x5 + A + C
  회로 3 (억제성 수렴): B = max(0, x3 + x4 + x5 - A - C)
주장:
  1. 자극 4, 3~5, 2~6, 1~7에 대한 B의 발화율이 그래프와 같다: 회로 1은 1,1,1,1, 회로 2는 1,3,5,7,
     회로 3은 1,3,1, 그리고 1~7에서 0 (그래프는 0에 가까운 값).
  2. 세 회로는 한 줄짜리 가중치 벡터 w와 활성 함수 max(0, .)로 쓸 수 있다.
  3. 회로 3에서 B가 가장 세게(3) 반응하는 자극은 정확히 {3, 4, 5} 하나다 (2^7가지 전수 조사).
  4. 회로 2에서 자극 {1}, {4}, {7}은 모두 B = 1이다. 어디가 자극됐는지 B만으로는 알 수 없다.
  5. 연습 p4: 억제 가중치를 0.5로 줄이면 1, 3, 2, 1이다.
  6. 연습 p5: 수용기 하나의 출력이 0.3이고 발화 문턱이 1이면, 수렴 없는 뉴런은 발화하지 못하고
     일곱 개를 모은 뉴런은 2.1로 문턱을 넘는다.
  7. 신호 관점: 수용기마다 서로 독립인 잡음(표준편차 sigma)이 있으면, N개를 평균한 값의 잡음은
     sigma / sqrt(N)으로 줄어든다. N = 7이면 약 2.65배 줄어든다 (몬테카를로 20,000회).
"""
import math
import random
from fractions import Fraction as F
from itertools import product

STIMULI = {"4": {4}, "3-5": {3, 4, 5}, "2-6": {2, 3, 4, 5, 6}, "1-7": {1, 2, 3, 4, 5, 6, 7}}


def as_vector(cells: set[int], level: F = F(1)) -> list[F]:
    return [level if i in cells else F(0) for i in range(1, 8)]


def circuit1(x: list[F]) -> F:
    return x[3]


def circuit2(x: list[F]) -> F:
    a = x[0] + x[1]
    c = x[5] + x[6]
    return x[2] + x[3] + x[4] + a + c


def circuit3(x: list[F], inhibit: F = F(1)) -> F:
    a = x[0] + x[1]
    c = x[5] + x[6]
    return max(F(0), x[2] + x[3] + x[4] - inhibit * (a + c))


def weighted(w: list[F], x: list[F]) -> F:
    return max(F(0), sum(wi * xi for wi, xi in zip(w, x)))


def main() -> None:
    expected = {
        "회로 1": (circuit1, [1, 1, 1, 1]),
        "회로 2": (circuit2, [1, 3, 5, 7]),
        "회로 3": (circuit3, [1, 3, 1, 0]),
    }
    for name, (fn, exp) in expected.items():
        got = [fn(as_vector(s)) for s in STIMULI.values()]
        assert got == exp, (name, got)
        print(f"[OK] {name}: 자극 4, 3~5, 2~6, 1~7 -> {[int(g) for g in got]}")

    # 주장 2: 가중치 벡터 형태
    w1 = [F(v) for v in (0, 0, 0, 1, 0, 0, 0)]
    w2 = [F(1)] * 7
    w3 = [F(v) for v in (-1, -1, 1, 1, 1, -1, -1)]
    for bits in product((0, 1), repeat=7):
        x = [F(b) for b in bits]
        assert weighted(w1, x) == circuit1(x)
        assert weighted(w2, x) == circuit2(x)
        assert weighted(w3, x) == circuit3(x)
    print("[OK] 128가지 자극 모두: 회로 = max(0, w.x)  (w1=e4, w2=모두 1, w3=(-1,-1,1,1,1,-1,-1))")

    # 주장 3: 회로 3의 최대 반응
    best = max(circuit3([F(b) for b in bits]) for bits in product((0, 1), repeat=7))
    argmax = [bits for bits in product((0, 1), repeat=7) if circuit3([F(b) for b in bits]) == best]
    assert best == 3 and argmax == [(0, 0, 1, 1, 1, 0, 0)]
    print("[OK] 회로 3의 최대 반응 3은 자극 {3,4,5}에서만 나온다")

    # 주장 4: 위치 정보 손실
    assert circuit2(as_vector({1})) == circuit2(as_vector({4})) == circuit2(as_vector({7})) == 1
    assert circuit1(as_vector({1})) == 0 and circuit1(as_vector({4})) == 1
    print("[OK] 회로 2: {1},{4},{7} 모두 B=1 (위치 구별 불가). 회로 1은 {4}에만 반응")

    # 주장 5: 연습 p4
    got = [circuit3(as_vector(s), inhibit=F(1, 2)) for s in STIMULI.values()]
    assert got == [1, 3, 2, 1], got
    print(f"[OK] 연습 p4: 억제 가중치 0.5 -> {[int(g) for g in got]}")

    # 주장 6: 연습 p5
    weak = F(3, 10)
    threshold = F(1)
    single = circuit1(as_vector(set(range(1, 8)), weak))
    pooled = circuit2(as_vector(set(range(1, 8)), weak))
    assert single < threshold <= pooled and pooled == F(21, 10)
    print(f"[OK] 연습 p5: 약한 빛 0.3 -> 수렴 없음 {float(single)} (문턱 미만), 수렴 {float(pooled)} (문턱 이상)")

    # 주장 7: 평균하면 잡음이 sqrt(N)배 줄어든다
    rng = random.Random(1)
    n, trials = 7, 20_000
    single = [rng.gauss(0, 1) for _ in range(trials)]
    pooled = [sum(rng.gauss(0, 1) for _ in range(n)) / n for _ in range(trials)]

    def rms(v):
        return math.sqrt(sum(x * x for x in v) / len(v))

    ratio = rms(single) / rms(pooled)
    assert abs(ratio - math.sqrt(n)) < 0.1, ratio
    print(f"[OK] 신호 관점: 7개 평균의 잡음 감소 {ratio:.2f}배 (sqrt(7) = {math.sqrt(n):.2f})")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
