---
layout: "note"
title: "07_neuron-computational-model_verify.py"
display_title: "07_neuron-computational-model_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "신호와 미디어"
parent_url: "/studies/human-interface-media/neuron-computational-model/"
parent_title: "뉴런의 연산 모형"
description: "휴먼 인터페이스 미디어 · 뉴런의 연산 모형 검증 코드"
permalink: "/studies/human-interface-media/code/07_neuron-computational-model_verify/"
---
{% raw %}
[뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""뉴런의 연산 모형 검증.

문서: 07.뉴런의 연산 모형 (예시로 보기, 정의, 원본 오류 의심, 카드 C2·C3)
주장:
  1. A가 R x D, x가 D x 1이면 Ax는 R x 1이다. 그래서 바이어스 b는 R x 1이어야 한다.
     슬라이드처럼 b를 D x 1로 두면 R != D일 때 더할 수 없다.
  2. 활성 함수 없이 선형(아핀) 층을 두 번 쌓으면 한 층과 같다:
     A2 (A1 x + b1) + b2 = (A2 A1) x + (A2 b1 + b2).
  3. 예시: 가중치 (1, 1, -1), b = 0인 뉴런에 x = (3, 2, 4)면 o = 1, x = (1, 0, 4)면 o = -3.
     발화율은 음수가 될 수 없으므로 a(o) = max(0, o)를 거치면 0이다.
  4. 활성 함수 a(o) = min(max(o, 0), r_max)의 출력은 늘 [0, r_max] 안에 있다.
방법: 분수(정확 계산)로 행렬 연산을 직접 구현해 무작위 입력으로 확인한다.
"""
import random
from fractions import Fraction as F

Matrix = list  # 행 목록. 열벡터는 R x 1 행렬로 쓴다.


def shape(m: Matrix) -> tuple[int, int]:
    return len(m), len(m[0])


def matmul(a: Matrix, b: Matrix) -> Matrix:
    ra, ca = shape(a)
    rb, cb = shape(b)
    if ca != rb:
        raise ValueError(f"곱할 수 없음: {ra}x{ca} @ {rb}x{cb}")
    return [[sum(a[i][k] * b[k][j] for k in range(ca)) for j in range(cb)] for i in range(ra)]


def matadd(a: Matrix, b: Matrix) -> Matrix:
    if shape(a) != shape(b):
        raise ValueError(f"더할 수 없음: {shape(a)} + {shape(b)}")
    return [[x + y for x, y in zip(ra, rb)] for ra, rb in zip(a, b)]


def rand_matrix(r: int, c: int, rng: random.Random) -> Matrix:
    return [[F(rng.randint(-5, 5)) for _ in range(c)] for _ in range(r)]


def activation(o: F, r_max: F) -> F:
    return min(max(o, F(0)), r_max)


def main() -> None:
    rng = random.Random(0)

    # 주장 1: 차원
    R, D = 2, 3
    A = rand_matrix(R, D, rng)
    x = rand_matrix(D, 1, rng)
    Ax = matmul(A, x)
    assert shape(Ax) == (R, 1)
    try:
        matadd(Ax, rand_matrix(D, 1, rng))  # 슬라이드의 D x 1 바이어스
        raise AssertionError("D x 1 바이어스가 더해지면 안 된다")
    except ValueError:
        pass
    o = matadd(Ax, rand_matrix(R, 1, rng))
    assert shape(o) == (R, 1)
    print("[OK] R=2, D=3: Ax는 2x1. b가 3x1이면 더할 수 없고 2x1이면 된다")

    # R = D일 때만 D x 1도 우연히 맞는다
    Asq = rand_matrix(3, 3, rng)
    matadd(matmul(Asq, x), rand_matrix(3, 1, rng))
    print("[OK] R = D일 때만 D x 1 바이어스가 우연히 맞는다")

    # 주장 2: 선형 층 두 개 = 선형 층 하나
    for _ in range(200):
        d, h, r = rng.randint(1, 5), rng.randint(1, 5), rng.randint(1, 5)
        A1, b1 = rand_matrix(h, d, rng), rand_matrix(h, 1, rng)
        A2, b2 = rand_matrix(r, h, rng), rand_matrix(r, 1, rng)
        xx = rand_matrix(d, 1, rng)
        two_layers = matadd(matmul(A2, matadd(matmul(A1, xx), b1)), b2)
        one_layer = matadd(matmul(matmul(A2, A1), xx), matadd(matmul(A2, b1), b2))
        assert two_layers == one_layer
    print("[OK] 무작위 200회: A2(A1x+b1)+b2 = (A2A1)x + (A2b1+b2)")

    # 주장 3: 예시
    w = [[F(1), F(1), F(-1)]]
    for xs, expect_o, expect_a in (((3, 2, 4), 1, 1), ((1, 0, 4), -3, 0)):
        xv = [[F(v)] for v in xs]
        o1 = matmul(w, xv)[0][0]
        assert o1 == expect_o and activation(o1, F(800)) == expect_a
        print(f"[OK] 예시 x={xs}: o={o1}, a(o)={activation(o1, F(800))}")

    # 주장 4: 활성 함수의 출력 범위
    r_max = F(800)
    for _ in range(1000):
        val = F(rng.randint(-5000, 5000), rng.randint(1, 7))
        out = activation(val, r_max)
        assert 0 <= out <= r_max
    print("[OK] 무작위 1,000회: a(o)는 늘 [0, 800] 안")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
