---
layout: "note"
title: "46_zero-injection_verify.py"
display_title: "46_zero-injection_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "46"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/zero-injection/"
parent_title: "0 주입"
description: "데이터 과학 · 0 주입 검증 코드"
permalink: "/studies/data-science/code/46_zero-injection_verify/"
---
{% raw %}
[0 주입](/Hongs_Blog/studies/data-science/zero-injection/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""0 주입(Zero-Injection) 검증.

문서: 46.0 주입 (예시, 정의, 카드)
출처: 데이터 과학 12회 슬라이드 12-2 p.9~16
주장:
  1. 평점 행렬에서 사용자 1과 2가 함께 평가한 아이템이 없으면 사용자 기반 협업 필터링의 유사도를 계산할 수 없다.
     "관심 없는 아이템"에 0을 넣으면 함께 채워진 칸이 생겨 유사도를 계산할 수 있다(p.15).
  2. 사용 전 선호도 행렬 P(평가했으면 1, 아니면 추정값)에서 하위 θ% 빈칸만 0으로 넣는다.
     θ를 키우면 0이 많아져 행렬이 더 빽빽해진다.
  3. 0을 넣은 아이템은 추천 후보에서도 뺀다.
  4. 슬라이드 p.14 예의 추정 사용 전 선호도 0.1, 0.9, 0.8, 0.2, 0.8, 0.4, 0.1, 0.8, 0.3에서
     θ = 20%이면 가장 낮은 0.1 두 칸만 0이 된다(9칸 × 20% = 1.8 -> 아래에서 2칸).
  5. 카드 C2: 빈칸 100개, θ = 80% -> 0을 넣는 칸 80개, 남는 빈칸 20개.
"""
import math


def pcc(x, y):
    S = [i for i in range(len(x)) if x[i] is not None and y[i] is not None]
    if len(S) < 2:
        return None
    mx = sum(x[i] for i in S) / len(S); my = sum(y[i] for i in S) / len(S)
    num = sum((x[i] - mx) * (y[i] - my) for i in S)
    den = math.sqrt(sum((x[i] - mx) ** 2 for i in S) * sum((y[i] - my) ** 2 for i in S))
    return num / den if den else None


def main():
    N = None
    u1 = [5, 4, N, N, N]
    u2 = [N, N, 4, 5, N]
    assert pcc(u1, u2) is None
    # 사용 전 선호도 추정: 각 사용자가 관심 없을 아이템(낮은 추정값)에 0 주입
    pre1 = [1, 1, 0.2, 0.9, 0.1]; pre2 = [0.1, 0.8, 1, 1, 0.2]
    def inject(r, pre, theta):
        blanks = sorted((pre[i], i) for i in range(len(r)) if r[i] is None)
        z = r[:]
        for _, i in blanks[:int(len(blanks) * theta + 0.999)]:
            z[i] = 0
        return z
    z1 = inject(u1, pre1, 0.67); z2 = inject(u2, pre2, 0.67)
    s = pcc(z1, z2)
    assert s is not None
    print(f"[OK] p.15: 0 주입 전 유사도 계산 불가, 후 {z1} / {z2} -> 피어슨 {s:.3f}")

    est = [0.1, 0.9, 0.8, 0.2, 0.8, 0.4, 0.1, 0.8, 0.3]     # p.14 행렬에서 1이 아닌 칸
    order = sorted(range(9), key=lambda i: est[i])
    k20 = math.ceil(9 * 0.2)
    assert k20 == 2 and sorted(est[i] for i in order[:k20]) == [0.1, 0.1]
    print("[OK] p.14: 추정 선호도 9칸 중 θ = 20%면 가장 낮은 0.1 두 칸에 0 주입")
    assert 100 * 0.8 == 80
    print("[OK] 카드 C2: 80칸")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
