---
layout: "note"
title: "28_descriptive-statistics_verify.py"
display_title: "28_descriptive-statistics_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "28"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/descriptive-statistics/"
parent_title: "기술통계"
description: "확률과 통계 · 기술통계 검증 코드"
permalink: "/studies/probability-statistics/code/28_descriptive-statistics_verify/"
---
{% raw %}
[기술통계](/Hongs_Blog/studies/probability-statistics/descriptive-statistics/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""기술통계 검증.

문서: 28.기술통계 (예시, 정의, 예제, 활용, 카드 C1~C3)
주장 1: 예시·카드 C1 — 응답 시간 [12, 13, 13, 14, 15, 15, 16, 18, 20, 250]: 평균 38.6, 중앙값 15,
        250을 25로 바꾸면 평균 16.1, 중앙값 15 그대로. 표본표준편차(n-1) 약 74.3 → 약 4.0.
주장 2: 분위수 규약 — 같은 자료의 90% 분위수가 최근접 순위 20, 선형 보간(inclusive) 43, exclusive 227로 다르다.
주장 3: 사분위 범위는 극단값 하나에 크게 흔들리지 않는다(무작위 자료에 극단값 추가).
주장 4: 경험적 CDF — 계단 높이 1/n, 표본이 늘면 참 CDF에 가까워진다(지수분포, 최대 차이 감소).
"""
import math
import random
import statistics as st


def main():
    lat = [12, 13, 13, 14, 15, 15, 16, 18, 20, 250]
    assert sum(lat) / 10 == 38.6 and st.median(lat) == 15
    lat2 = lat[:-1] + [25]
    assert abs(sum(lat2) / 10 - 16.1) < 1e-12 and st.median(lat2) == 15
    assert abs(st.stdev(lat) - 74.3) < 0.05 and abs(st.stdev(lat2) - 4.0) < 0.05
    print("[OK] 주장 1·카드 C1: 평균과 중앙값")

    s = sorted(lat)
    nearest = s[math.ceil(0.9 * len(s)) - 1]
    incl = st.quantiles(lat, n=10, method="inclusive")[8]
    excl = st.quantiles(lat, n=10, method="exclusive")[8]
    assert nearest == 20 and abs(incl - 43) < 1e-9 and abs(excl - 227) < 1e-9
    print("[OK] 주장 2: 분위수 규약 20·43·227")

    rng = random.Random(28)
    for _ in range(100):
        xs = [rng.gauss(100, 10) for _ in range(200)]
        q = st.quantiles(xs, n=4)
        iqr0, mean0 = q[2] - q[0], sum(xs) / len(xs)
        ys = xs + [1e6]
        q = st.quantiles(ys, n=4)
        assert abs((q[2] - q[0]) - iqr0) < 2 and abs(sum(ys) / len(ys) - mean0) > 1000
    print("[OK] 주장 3: 사분위 범위의 견고성")

    F = lambda x: 1 - math.exp(-x)
    gaps = []
    for n in (20, 200, 2000):
        xs = sorted(-math.log(1 - rng.random()) for _ in range(n))
        gaps.append(max(max(abs((i + 1) / n - F(x)), abs(i / n - F(x))) for i, x in enumerate(xs)))
    assert gaps[0] > gaps[1] > gaps[2] and gaps[2] < 0.05
    print("[OK] 주장 4: 경험적 CDF", [round(g, 3) for g in gaps])
    # 데이터 과학 2회 슬라이드 12·13: 가중 평균, 오른쪽으로 긴 꼬리에서 최빈값 < 중앙값 < 평균
    w = [3, 1]; x = [80, 90]
    assert sum(a * b for a, b in zip(w, x)) / sum(w) == 82.5
    skew = [1, 2, 2, 2, 3, 3, 4, 5, 9, 20]
    assert st.mode(skew) == 2 and st.median(skew) == 3 and st.mean(skew) == 5.1
    print("[OK] 데이터 과학 관점·카드 C4·C5: 가중 평균 82.5, 최빈값 2 < 중앙값 3 < 평균 5.1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
