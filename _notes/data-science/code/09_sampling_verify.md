---
layout: "note"
title: "09_sampling_verify.py"
display_title: "09_sampling_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "09"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/sampling/"
parent_title: "표본 추출"
description: "데이터 과학 · 표본 추출 검증 코드"
permalink: "/studies/data-science/code/09_sampling_verify/"
---
{% raw %}
[표본 추출](/Hongs_Blog/studies/data-science/sampling/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""표본 추출 검증.

문서: 09.표본 추출 (예시, 카드 C1·C2)
출처: 데이터 과학 2회 슬라이드 p.44
주장:
  1. 비복원 추출은 같은 자료를 두 번 뽑지 않는다. 복원 추출은 두 번 뽑을 수 있다.
     자료 100개에서 복원으로 100개를 뽑으면 서로 다른 자료는 평균 약 63.4개다 (1 - (1 - 1/100)^100).
  2. 층화 추출은 층(예: 등급)마다 같은 비율로 뽑아 표본의 층 비율이 모집단과 정확히 같다.
     희귀 층(1%)이 있을 때 단순 무작위 표본 20개는 그 층을 놓칠 확률이 약 0.818이다 (0.99^20).
"""
import random


def main():
    rnd = random.Random(1)
    data = list(range(100))
    s = rnd.sample(data, 30)
    assert len(set(s)) == 30
    trials = 2000
    avg = sum(len(set(rnd.choices(data, k=100))) for _ in range(trials)) / trials
    expect = 100 * (1 - (1 - 1 / 100) ** 100)
    assert abs(avg - expect) < 0.5 and round(expect, 1) == 63.4
    print(f"[OK] 비복원은 중복 없음, 복원 100번 추출의 서로 다른 개수 평균 {avg:.1f} (이론 {expect:.1f})")

    pop = ["VIP"] * 10 + ["일반"] * 990
    strat = rnd.sample(pop[:10], 1) + rnd.sample(pop[10:], 99)
    assert strat.count("VIP") == 1 and len(strat) == 100
    miss = 0.99 ** 20
    sim = sum("VIP" not in rnd.sample(pop, 20) for _ in range(5000)) / 5000
    assert abs(sim - miss) < 0.03 and round(miss, 3) == 0.818
    print(f"[OK] 층화 표본 100개의 VIP 비율 1% 그대로. 단순 표본 20개가 VIP를 놓칠 확률 {miss:.3f} (모의 {sim:.3f})")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
