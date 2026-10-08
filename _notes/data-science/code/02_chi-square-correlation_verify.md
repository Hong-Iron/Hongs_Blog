---
layout: "note"
title: "02_chi-square-correlation_verify.py"
display_title: "02_chi-square-correlation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/chi-square-correlation/"
parent_title: "카이제곱 상관 분석"
description: "데이터 과학 · 카이제곱 상관 분석 검증 코드"
permalink: "/studies/data-science/code/02_chi-square-correlation_verify/"
---
{% raw %}
[카이제곱 상관 분석](/Hongs_Blog/studies/data-science/chi-square-correlation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""카이제곱 상관 분석 검증.

문서: 02.카이제곱 상관 분석 (예시, 정의, 카드 C2·C3)
출처: 데이터 과학 2회 슬라이드 p.19 (성별 × 선호 도서 분할표)
주장:
  1. 기대 빈도 e_ij = (행 합 × 열 합) / n. e11 = 300 × 450 / 1500 = 90.
  2. 카이제곱 = Σ (o - e)^2 / e = 284.44 + 121.90 + 71.11 + 30.48 = 507.93 (항을 반올림해 더한 값, 정확히는 507.937).
  3. 자유도 (r-1)(c-1) = 1의 유의수준 0.001 임계값 10.828보다 훨씬 커서 독립 가설을 버린다.
  4. 두 속성이 독립이면(관측 = 기대) 카이제곱은 0이다. 표 전체를 k배하면 카이제곱도 k배가 된다.
  5. 카드 C2: 2×2 표 [[30, 20], [20, 30]]의 카이제곱은 4.
"""


def expected(table):
    rows = [sum(r) for r in table]
    cols = [sum(c) for c in zip(*table)]
    n = sum(rows)
    return [[rows[i] * cols[j] / n for j in range(len(cols))] for i in range(len(rows))]


def chi2(table):
    e = expected(table)
    return sum((table[i][j] - e[i][j]) ** 2 / e[i][j] for i in range(len(table)) for j in range(len(table[0])))


def main():
    t = [[250, 200], [50, 1000]]          # 행: 소설, 비소설 / 열: 남, 여
    e = expected(t)
    assert e == [[90, 360], [210, 840]]
    terms = [(t[i][j] - e[i][j]) ** 2 / e[i][j] for i in range(2) for j in range(2)]
    assert [round(x, 2) for x in terms] == [284.44, 71.11, 121.9, 30.48]
    x = chi2(t)
    assert round(x, 2) == 507.94 or round(x, 2) == 507.93
    print(f"[OK] 슬라이드 p.19: 기대 빈도 {e}, 카이제곱 {x:.3f}")
    print("     항목:", [round(v, 2) for v in terms])
    assert x > 10.828
    print("[OK] 자유도 1, 유의수준 0.001 임계값 10.828보다 크다")

    indep = [[30, 60], [10, 20]]
    assert chi2(indep) == 0
    assert abs(chi2([[3 * v for v in r] for r in t]) - 3 * x) < 1e-6
    print("[OK] 독립이면 0, 표를 3배 하면 카이제곱도 3배")

    assert abs(chi2([[30, 20], [20, 30]]) - 4) < 1e-12
    print("[OK] 카드 C2: [[30, 20], [20, 30]] -> 4")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
