---
layout: "note"
title: "17_lift_verify.py"
display_title: "17_lift_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "17"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/lift/"
parent_title: "리프트"
description: "데이터 과학 · 리프트 검증 코드"
permalink: "/studies/data-science/code/17_lift_verify/"
---
{% raw %}
[리프트](/Hongs_Blog/studies/data-science/lift/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""리프트 검증.

문서: 17.리프트 (예시, 정의, 원본 오류 의심, 카드)
출처: 데이터 과학 3회 슬라이드 3-2 p.11~14
주장:
  1. 학생 1,000명: 축구 600, 시리얼 750, 둘 다 400. 축구 -> 시리얼 [지지도 40%, 신뢰도 66.7%]이지만
     시리얼 전체 비율 75%보다 낮다. 축구 안 함 -> 시리얼 [35%, 87.5%].
  2. lift = s(A∪B) / (s(A) s(B)) = c(A -> B) / s(B) = 0.4 / (0.6 × 0.75) = 0.889 < 1: 음의 상관.
  3. 기대 빈도 450, 300, 150, 100 (네 번째는 250 × 400 / 1000 = 100. 슬라이드는 150 식을 한 번 더 적었다).
     카이제곱 = 5.56 + 8.33 + 16.67 + 25 = 55.56. 실제 400 < 기대 450이라 음의 상관.
  4. lift(A, B) = lift(B, A) (대칭). 독립이면 1.
"""


def lift(n_ab, n_a, n_b, n):
    return (n_ab / n) / ((n_a / n) * (n_b / n))


def chi2(t):
    rows = [sum(r) for r in t]; cols = [sum(c) for c in zip(*t)]; n = sum(rows)
    e = [[rows[i] * cols[j] / n for j in range(2)] for i in range(2)]
    return sum((t[i][j] - e[i][j]) ** 2 / e[i][j] for i in range(2) for j in range(2)), e


def main():
    n, soc, cer, both = 1000, 600, 750, 400
    assert both / n == 0.4 and round(both / soc, 3) == 0.667 and cer / n == 0.75
    assert 350 / n == 0.35 and 350 / 400 == 0.875
    print("[OK] p.11: 축구 -> 시리얼 [40%, 66.7%] < 시리얼 비율 75%, 축구 안 함 -> 시리얼 [35%, 87.5%]")
    l = lift(both, soc, cer, n)
    assert round(l, 2) == 0.89 and abs(l - (both / soc) / (cer / n)) < 1e-12
    assert lift(both, cer, soc, n) == l
    print(f"[OK] p.13: lift = {l:.3f} < 1 (음의 상관), 대칭")
    x, e = chi2([[400, 350], [200, 50]])
    assert e == [[450, 300], [150, 100]] and round(x, 2) == 55.56
    print(f"[OK] p.14: 기대 빈도 {e}, 카이제곱 {x:.2f}")
    assert round(lift(30, 60, 50, 100), 9) == 1
    # 카드 C2: 거래 200, 우유 80, 빵 100, 둘 다 60
    assert round(lift(60, 80, 100, 200), 9) == 1.5 and 60 / 80 == 0.75
    print("[OK] 독립이면 1. 카드 C2: lift 1.5, 신뢰도 75%")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
