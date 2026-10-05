---
layout: "note"
title: "06_chain-rule_verify.py"
display_title: "06_chain-rule_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "06"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/chain-rule/"
parent_title: "연쇄 법칙"
description: "미분적분학 · 연쇄 법칙 검증 코드"
permalink: "/studies/calculus/code/06_chain-rule_verify/"
---
{% raw %}
[연쇄 법칙](/Hongs_Blog/studies/calculus/chain-rule/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""연쇄 법칙 검증.

문서: 06.연쇄 법칙 (예시, 정리, 증명, 예제, 활용, 카드 C1~C4, 자주 하는 오해),
      4.연습문제/06.미분 계산 예제 사다리
방법: 무작위 점에서 중앙 차분과 비교(실험. 증명은 문서).
주장 1: (sin x²)' = 2x cos x², (e^(-x²/2))' = -x e^(-x²/2).
주장 2: softplus ln(1 + e^x)의 도함수는 시그모이드 σ(x) = 1/(1 + e^(-x)), σ' = σ(1 - σ).
주장 3: 역함수 미분 (ln x)' = 1/x를 e^(ln x) = x에서 얻는다. (x^x)' = x^x (ln x + 1).
주장 4: 뉴런 하나 L = (σ(wx + b) - t)²에서 ∂L/∂w = 2(y - t)·σ(1-σ)·x.
주장 5: f(u) = u², g(x) = |x|이면 g는 0에서 미분 불가인데 f∘g = x²는 미분 가능하다(가정은 충분조건).
        f(u) = |u|, g(x) = x이면 f∘g = |x|는 0에서 미분 불가.
주장 6: 오해 — (sin x²)'를 cos(2x)로 계산하면 x = 1에서 -0.416, 올바른 값은 2cos 1 = 1.081.
사다리: ((x²+1)^5)' = 10x(x²+1)^4, (x e^(2x))' = (1 + 2x)e^(2x), (sin³ 2x)' = 6 sin² 2x cos 2x, (x^x)', σ'.
"""
import math
import random


def d(f, x, h=1e-6):
    return (f(x + h) - f(x - h)) / (2 * h)


def close(a, b, tol=1e-6):
    return abs(a - b) <= tol * max(1, abs(a), abs(b))


sig = lambda x: 1 / (1 + math.exp(-x))


def main():
    rng = random.Random(6)
    for _ in range(3000):
        x = rng.uniform(-3, 3)
        assert close(d(lambda t: math.sin(t * t), x), 2 * x * math.cos(x * x))
        assert close(d(lambda t: math.exp(-t * t / 2), x), -x * math.exp(-x * x / 2))
        assert close(d(lambda t: math.log(1 + math.exp(t)), x), sig(x))
        assert close(d(sig, x), sig(x) * (1 - sig(x)))
        assert close(d(lambda t: (t * t + 1) ** 5, x), 10 * x * (x * x + 1) ** 4, 1e-5)
        assert close(d(lambda t: t * math.exp(2 * t), x), (1 + 2 * x) * math.exp(2 * x))
        assert close(d(lambda t: math.sin(2 * t) ** 3, x), 6 * math.sin(2 * x) ** 2 * math.cos(2 * x))
    g = lambda t: (t * t + 1) ** 5
    assert 10 * 1 * 2 ** 4 == 160 and abs((g(1.001) - g(0.999)) / 0.002 - 160) < 0.1
    print("[OK] 주장 1·2·카드 C2·사다리 1~3 (사다리 1의 수치 검산 160.0)")

    for _ in range(2000):
        x = rng.uniform(0.2, 3)
        assert close(d(math.log, x), 1 / math.exp(math.log(x)))
        assert close(d(lambda t: t ** t, x), x ** x * (math.log(x) + 1))
    print("[OK] 주장 3·카드 C3·사다리 4")

    for _ in range(2000):
        w, b, x, t = (rng.uniform(-2, 2) for _ in range(4))
        L = lambda ww: (sig(ww * x + b) - t) ** 2
        y = sig(w * x + b)
        assert close(d(L, w), 2 * (y - t) * y * (1 - y) * x)
    print("[OK] 주장 4: 뉴런 하나의 기울기")

    h = 1e-6
    assert ((h * h) - 0) / h < 1e-5 and ((-h) ** 2 - 0) / (-h) > -1e-5   # (|x|)² = x²는 미분 가능
    assert abs(h) / h == 1 and abs(-h) / (-h) == -1
    print("[OK] 주장 5·카드 C4")

    assert f"{math.cos(2):.3f}" == "-0.416" and f"{2 * math.cos(1):.3f}" == "1.081"
    print("[OK] 주장 6·오해")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
