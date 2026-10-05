---
layout: "note"
title: "08_perceptron_impl.py"
display_title: "08_perceptron_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "08"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "4-1학기"
parent_url: "/studies/human-interface-media/perceptron/"
parent_title: "퍼셉트론"
description: "휴먼 인터페이스 미디어 · 퍼셉트론 구현 코드"
permalink: "/studies/human-interface-media/code/08_perceptron_impl/"
---
{% raw %}
[퍼셉트론](/Hongs_Blog/studies/human-interface-media/perceptron/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""퍼셉트론 구현과 자체 테스트.

문서: 08.퍼셉트론 (예시로 보기의 추적 표, 정의, 증명, 카드 C2·C3·C4)
모형: 입력 x = (x1, ..., xD), 가중치 w, 바이어스 b.
  출력 y = 1 (w.x + b > 0), 0 (그 밖).  w.x + b = 0은 D차원 공간의 초평면(D = 2면 직선)이다.
학습 규칙 (학습률 eta): 샘플 (x, t)마다 y를 구하고
  w <- w + eta (t - y) x,  b <- b + eta (t - y)
  맞히면 t - y = 0이라 바뀌지 않는다.
주장:
  1. AND를 w = 0, b = 0, eta = 1에서 순서 (0,0),(0,1),(1,0),(1,1)로 학습하면 유한 번 고친 뒤 네 점을 모두 맞힌다.
     추적 표를 출력한다.
  2. OR도 같은 방식으로 수렴한다.
  3. XOR은 1,000번 돌려도 수렴하지 않는다. 어떤 (w1, w2, b)도 XOR 네 점을 맞히지 못한다
     (정수 격자 -10..10 전수 조사, 문서의 부등식 증명과 같은 결론).
  4. 두 층을 쓰면 XOR을 만든다: h1 = OR, h2 = NAND, y = AND(h1, h2).
  5. 선형 분리 가능한 무작위 데이터(2차원, 여백 있음) 200세트에서 학습이 늘 수렴하고,
     실수 횟수가 (R / gamma)^2 이하다 (노비코프 정리의 상한).
"""
import random
from itertools import product

AND = [((0, 0), 0), ((0, 1), 0), ((1, 0), 0), ((1, 1), 1)]
OR = [((0, 0), 0), ((0, 1), 1), ((1, 0), 1), ((1, 1), 1)]
XOR = [((0, 0), 0), ((0, 1), 1), ((1, 0), 1), ((1, 1), 0)]


def predict(w, b, x) -> int:
    return 1 if sum(wi * xi for wi, xi in zip(w, x)) + b > 0 else 0


def train(samples, eta=1, max_epochs=1000, trace=None):
    """반환: (w, b, 수렴 여부, 전체 실수 횟수)."""
    d = len(samples[0][0])
    w = [0] * d
    b = 0
    mistakes = 0
    for epoch in range(1, max_epochs + 1):
        errors = 0
        for x, t in samples:
            y = predict(w, b, x)
            if y != t:
                w = [wi + eta * (t - y) * xi for wi, xi in zip(w, x)]
                b = b + eta * (t - y)
                errors += 1
                mistakes += 1
            if trace is not None:
                trace.append((epoch, x, t, y, tuple(w), b))
        if errors == 0:
            return w, b, True, mistakes
    return w, b, False, mistakes


def main() -> None:
    tr = []
    w, b, ok, m = train(AND, trace=tr)
    assert ok and all(predict(w, b, x) == t for x, t in AND)
    print("[OK] AND 수렴. 추적 표 (epoch, x, t, y, 갱신 후 w, b):")
    for row in tr:
        print("     ", row)
    print(f"     최종 w = {w}, b = {b}, 실수 {m}번")

    w2, b2, ok2, _ = train(OR)
    assert ok2 and all(predict(w2, b2, x) == t for x, t in OR)
    print(f"[OK] OR 수렴: w = {w2}, b = {b2}")

    _, _, ok3, _ = train(XOR, max_epochs=1000)
    assert not ok3
    rng = range(-10, 11)
    solutions = [(a, c, d) for a, c, d in product(rng, rng, rng)
                 if all(predict((a, c), d, x) == t for x, t in XOR)]
    assert solutions == []
    print("[OK] XOR: 1,000 epoch에도 수렴 안 함. 격자 -10..10에서 해 없음")

    def two_layer(x):
        h1 = predict((1, 1), -0.5, x)    # OR
        h2 = predict((-1, -1), 1.5, x)   # NAND
        return predict((1, 1), -1.5, (h1, h2))  # AND
    assert all(two_layer(x) == t for x, t in XOR)
    print("[OK] 두 층 (OR, NAND -> AND)으로 XOR 성공")

    rnd = random.Random(0)
    for _ in range(200):
        wt = (rnd.uniform(-1, 1), rnd.uniform(-1, 1))
        bt = rnd.uniform(-0.5, 0.5)
        data = []
        while len(data) < 30:
            x = (rnd.uniform(-1, 1), rnd.uniform(-1, 1))
            s = wt[0] * x[0] + wt[1] * x[1] + bt
            if abs(s) > 0.1:  # 여백
                data.append((x, 1 if s > 0 else 0))
        # 바이어스를 입력 1개로 흡수한 공간에서 R과 gamma를 잰다
        aug = [((x[0], x[1], 1.0), t) for x, t in data]
        norm = (wt[0] ** 2 + wt[1] ** 2 + bt ** 2) ** 0.5
        gamma = min(abs(wt[0] * x[0] + wt[1] * x[1] + bt * x[2]) / norm for x, _ in aug)
        R = max((x[0] ** 2 + x[1] ** 2 + x[2] ** 2) ** 0.5 for x, _ in aug)
        wf, bf, okf, mf = train(data, eta=1.0, max_epochs=100_000)
        assert okf and all(predict(wf, bf, x) == t for x, t in data)
        assert mf <= (R / gamma) ** 2
    print("[OK] 선형 분리 가능 데이터 200세트: 모두 수렴, 실수 횟수 <= (R/gamma)^2")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
