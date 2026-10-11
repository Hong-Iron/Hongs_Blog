---
layout: "note"
title: "12_random-process_verify.py"
display_title: "12_random-process_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
parent_url: "/studies/data-and-information/random-process/"
parent_title: "확률 과정"
description: "자료와 정보 · 확률 과정 검증 코드"
permalink: "/studies/data-and-information/code/12_random-process_verify/"
---
{% raw %}
[확률 과정](/Hongs_Blog/studies/data-and-information/random-process/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 확률 과정 문서의 주장을 확인한다. 실행: python3 12_random-process_verify.py (표준 라이브러리만)
# 주장 1: 슬라이드 예의 값 읽기 X_3(w1) = 130, X_2(w2) = 300, X_1(w2) = 200
# 주장 2: 두 과정 A(매번 독립인 동전), B(어제 값을 0.9 확률로 그대로 따르는 연쇄)는
#         한 시점만 보면 둘 다 1이 절반이지만, 같은 값이 이어지는 길이의 평균은 2와 10이다.
# 주장 3: 길이 n인 0/1 수열은 2^n가지다.
# 카드 C3: 연쇄 B에서 P(X3 = 1 | X1 = 1) = 0.82.
import random
from fractions import Fraction as F


def run_lengths(seq):
    out, cur = [], 1
    for a, b in zip(seq, seq[1:]):
        if a == b:
            cur += 1
        else:
            out.append(cur)
            cur = 1
    return out                      # 마지막 미완성 구간은 뺀다


def simulate(stay, n, rng):
    """앞 값과 같을 확률이 stay인 0/1 과정. stay = 0.5면 독립인 동전과 같다."""
    x = [rng.randrange(2)]
    for _ in range(n - 1):
        x.append(x[-1] if rng.random() < stay else 1 - x[-1])
    return x


def main():
    w1 = (100, 150, 130)
    w2 = (200, 300, 400)
    X = lambda i, w: w[i - 1]       # X_i(w): 결과 w의 i번째 값 (1부터 센다)
    assert X(3, w1) == 130 and X(2, w2) == 300 and X(1, w2) == 200
    print("[OK] 주장 1: X_3(w1) = 130, X_2(w2) = 300, X_1(w2) = 200")

    # 정확한 값: 정상 분포와 평균 이어짐 길이
    for stay, mean_run in ((F(1, 2), 2), (F(9, 10), 10)):
        pi1 = F(1, 2)                                   # 대칭이라 1의 비율은 1/2
        assert pi1 * stay + (1 - pi1) * (1 - stay) == pi1   # 한 걸음 가도 그대로
        assert 1 / (1 - stay) == mean_run               # 기하분포의 평균 1/(1 - stay)
    rng = random.Random(12)
    n = 400000
    for stay, mean_run in ((0.5, 2), (0.9, 10)):
        x = simulate(stay, n, rng)
        frac = sum(x) / n
        runs = run_lengths(x)
        m = sum(runs) / len(runs)
        assert abs(frac - 0.5) < 0.01, frac
        assert abs(m - mean_run) < 0.03 * mean_run, m
        print(f"[OK] 주장 2: stay={stay} → 1의 비율 {frac:.3f}, 평균 이어짐 길이 {m:.2f}")

    # 예시: 독립이면 P(X2 = 1 | X1 = 1) = 0.5, 연쇄 B면 0.9
    x = simulate(0.9, n, rng)
    after1 = [b for a, b in zip(x, x[1:]) if a == 1]
    assert abs(sum(after1) / len(after1) - 0.9) < 0.01
    x = simulate(0.5, n, rng)
    after1 = [b for a, b in zip(x, x[1:]) if a == 1]
    assert abs(sum(after1) / len(after1) - 0.5) < 0.01
    print("[OK] 예시: 1 다음에 1이 올 비율 0.9(연쇄)와 0.5(독립)")

    # 원본 오류 의심·카드 C3: 어제에만 달려 있는 연쇄 B에서 오늘은 그저께와 독립이 아니다
    stay = F(9, 10)
    p_two_steps = stay * stay + (1 - stay) * (1 - stay)      # P(X3 = 1 | X1 = 1)
    assert p_two_steps == F(41, 50) and p_two_steps != F(1, 2)
    # 어제를 알고 나면 그저께는 더 알려 주는 것이 없다: P(X3 = 1 | X2 = 1, X1 = a)는 a와 무관하게 0.9
    x = simulate(0.9, n, rng)
    for a in (0, 1):
        nxt = [x[i + 2] for i in range(n - 2) if x[i] == a and x[i + 1] == 1]
        assert abs(sum(nxt) / len(nxt) - 0.9) < 0.01
    after = [x[i + 2] for i in range(n - 2) if x[i] == 1]
    assert abs(sum(after) / len(after) - 0.82) < 0.01
    print("[OK] 카드 C3: P(X3 = 1 | X1 = 1) = 0.82 (0.5가 아니다), 어제를 알면 그저께와 무관하게 0.9")

    assert [2 ** k for k in (3, 10)] == [8, 1024]
    print("[OK] 주장 3: 길이 3이면 8가지, 길이 10이면 1024가지")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
