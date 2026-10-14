---
layout: "note"
title: "02_operation-step-count_verify.py"
display_title: "02_operation-step-count_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/operation-step-count/"
parent_title: "연산 횟수와 단계 수 세기"
description: "자료구조 · 연산 횟수와 단계 수 세기 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/02_operation-step-count_verify/"
---
{% raw %}
[연산 횟수와 단계 수 세기](/Hongs_Blog/studies/data-structures/operation-step-count/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""연산 횟수와 단계 수 세기: 삽입 정렬을 실제로 돌리며 세어, 문서의 식과 맞춘다.

문서: 02.연산 횟수와 단계 수 세기 (예시, 비교 횟수, s/e 표, 실용 시간표, 카드)
출처: 자료구조 2주차 슬라이드 p.6~20
실행: python3 02_operation-step-count_verify.py

세는 규칙 (슬라이드 p.14, p.16의 s/e 표 그대로)
  for (i = 1; i < n; i++)                     실행 한 번에 1단계  -> 줄 이름 outer
  int t = a[i];                               1단계              -> t
  for (j = i - 1; j >= 0 && t < a[j]; j--)    1단계              -> inner
      a[j + 1] = a[j];                        1단계              -> shift
  a[j + 1] = t;                               1단계              -> put
  중괄호와 int j; 는 0단계

확인하는 주장
  1. 비교 t < a[j]의 횟수: 최악 (n-1)n/2 (거꾸로 놓인 입력이 그 하나), 최선 n-1 (정렬된 입력이 그 하나).
     비교 횟수만 보면 최악·최선인 입력이 여럿이다.
  2. 단계 수: 최악 n + (n-1)(n+3) (거꾸로 놓인 입력에서만), 최선 4n-3 (정렬된 입력에서만).
     모든 입력에서 단계 수 = 4n - 3 + 2 * (자리가 뒤바뀐 쌍의 수).
  3. 최악일 때 i번째 바퀴: 안쪽 for 머리줄 i+1번, 옮기기 i번, 바퀴 전체 2i+3단계. 비교는 i번.
  4. 평균 비교 횟수 = n(n-1)/4 + n - (1 + 1/2 + ... + 1/n)  (모든 순서가 같은 확률일 때, 분수로 정확히).
  5. 실용 시간표 (초당 10^9 명령): 슬라이드 셋째 줄의 값은 n = 10^6의 값이다.
  6. n을 두 배로 늘리면 최악 단계 수는 약 네 배, 최선 단계 수는 약 두 배.
"""
from fractions import Fraction
from itertools import permutations
import math
import random


def insertion_sort_counts(src):
    """슬라이드의 삽입 정렬을 한 줄씩 그대로 따라가며 센다.
    돌려주는 것: (정렬 결과, 비교 횟수, 줄별 실행 횟수, 바퀴별 기록)"""
    a = list(src)
    n = len(a)
    compares = 0
    lines = {"outer": 0, "t": 0, "inner": 0, "shift": 0, "put": 0}
    rounds = []  # 바퀴 i마다 (i, 비교 횟수, 안쪽 머리줄 횟수, 옮긴 횟수)
    i = 1
    while True:
        lines["outer"] += 1               # 바깥 for의 머리줄을 한 번 실행
        if not i < n:
            break
        t = a[i]
        lines["t"] += 1
        j = i - 1
        c = h = s = 0
        while True:
            lines["inner"] += 1           # 안쪽 for의 머리줄을 한 번 실행
            h += 1
            if not j >= 0:                # j가 -1이면 t < a[j]는 계산하지 않는다
                break
            compares += 1
            c += 1
            if not t < a[j]:
                break
            a[j + 1] = a[j]
            lines["shift"] += 1
            s += 1
            j -= 1
        a[j + 1] = t
        lines["put"] += 1
        rounds.append((i, c, h, s))
        i += 1
    return a, compares, lines, rounds


def steps(lines):
    return sum(lines.values())


def snapshots(src):
    """바퀴가 끝날 때마다의 배열 모습."""
    a = list(src)
    out = []
    for i in range(1, len(a)):
        t = a[i]
        j = i - 1
        while j >= 0 and t < a[j]:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = t
        out.append(list(a))
    return out


def inversions(a):
    """앞의 값이 뒤의 값보다 큰 쌍의 수."""
    return sum(1 for x in range(len(a)) for y in range(x + 1, len(a)) if a[x] > a[y])


def harmonic(n):
    return sum(Fraction(1, k) for k in range(1, n + 1))


def seconds(count, rate=10 ** 9):
    return count / rate


def main():
    # --- 슬라이드 p.11: a = [1, 2, 3, 4]에 t = 0을 끼우면 비교 4번 ---
    _, _, _, rounds = insertion_sort_counts([1, 2, 3, 4, 0])
    assert rounds[-1] == (4, 4, 5, 4)      # i = 4: 비교 4, 머리줄 5, 옮기기 4
    print("[OK] p.11: [1, 2, 3, 4]에 0을 끼우는 바퀴는 비교 4번, 머리줄 5번, 옮기기 4번")

    # --- 문서 예시: [4, 3, 2, 1] 추적 표 ---
    out, cmp_, lines, rounds = insertion_sort_counts([4, 3, 2, 1])
    assert out == [1, 2, 3, 4]
    assert rounds == [(1, 1, 2, 1), (2, 2, 3, 2), (3, 3, 4, 3)]
    assert cmp_ == 6 and steps(lines) == 4 + 3 * 7 == 25
    assert snapshots([4, 3, 2, 1]) == [[3, 4, 2, 1], [2, 3, 4, 1], [1, 2, 3, 4]]
    assert snapshots([3, 1, 2]) == [[1, 3, 2], [1, 2, 3]]
    assert lines == {"outer": 4, "t": 3, "inner": 9, "shift": 6, "put": 3}
    for i, c, h, s in rounds:
        assert c == i and h == i + 1 and s == i and 1 + h + s + 1 == 2 * i + 3
    out, cmp_, lines, rounds = insertion_sort_counts([1, 2, 3, 4])
    assert cmp_ == 3 and steps(lines) == 13 and all(r[1:] == (1, 1, 0) for r in rounds)
    print("[OK] 예시: [4, 3, 2, 1]은 비교 6번·25단계, [1, 2, 3, 4]는 비교 3번·13단계")

    # --- 주장 1~4: n = 1..8의 모든 순서 ---
    total_inputs = 0
    for n in range(1, 9):
        worst_c = best_c = None
        worst_c_inputs, best_c_inputs = [], []
        step_of = {}
        sum_c = sum_s = 0
        count = 0
        for p in permutations(range(1, n + 1)):
            out, c, lines, rounds = insertion_sort_counts(p)
            st = steps(lines)
            assert out == sorted(p)
            assert st == 4 * n - 3 + 2 * inversions(p)
            assert lines["outer"] == n and lines["t"] == lines["put"] == n - 1
            sum_c += c
            sum_s += st
            count += 1
            step_of[p] = st
            if worst_c is None or c > worst_c:
                worst_c, worst_c_inputs = c, [p]
            elif c == worst_c:
                worst_c_inputs.append(p)
            if best_c is None or c < best_c:
                best_c, best_c_inputs = c, [p]
            elif c == best_c:
                best_c_inputs.append(p)
        total_inputs += count
        rev, srt = tuple(range(n, 0, -1)), tuple(range(1, n + 1))
        worst_s, best_s = max(step_of.values()), min(step_of.values())
        assert worst_c == (n - 1) * n // 2 and rev in worst_c_inputs
        assert best_c == n - 1 and srt in best_c_inputs
        assert worst_s == n + (n - 1) * (n + 3) == n * n + 3 * n - 3
        assert best_s == 4 * n - 3
        # 단계 수로 보면 최악은 거꾸로 놓인 입력 하나, 최선은 정렬된 입력 하나뿐이다
        assert [p for p, v in step_of.items() if v == worst_s] == [rev]
        assert [p for p, v in step_of.items() if v == best_s] == [srt]
        if n == 3:
            # 비교 횟수만 보면 최악·최선인 입력이 여럿이다
            assert sorted(worst_c_inputs) == [(1, 3, 2), (2, 3, 1), (3, 1, 2), (3, 2, 1)]
            assert sorted(best_c_inputs) == [(1, 2, 3), (2, 1, 3)]
        avg_c = Fraction(sum_c, count)
        assert avg_c == Fraction(n * (n - 1), 4) + n - harmonic(n)
        assert Fraction(sum_s, count) == 4 * n - 3 + Fraction(n * (n - 1), 2)
    print(f"[OK] n = 1..8의 모든 순서 {total_inputs:,}개: 최악·최선·평균 비교 횟수와 단계 수가 식과 같다")

    # --- 최악 입력에서 바퀴별 2i + 3 (n = 2..60) ---
    for n in range(2, 61):
        _, c, lines, rounds = insertion_sort_counts(range(n, 0, -1))
        assert all(r == (i, i, i + 1, i) for i, r in zip(range(1, n), rounds))
        assert sum(2 * i + 3 for i in range(1, n)) == (n - 1) * (n + 3)
        assert c == (n - 1) * n // 2 and steps(lines) == n + (n - 1) * (n + 3)
    print("[OK] 거꾸로 놓인 입력 n = 2..60: i번째 바퀴는 비교 i번, 2i + 3단계, 합계 n + (n-1)(n+3)")

    # --- 같은 값이 섞인 무작위 입력 2,000개: 범위와 관계식 ---
    rnd = random.Random(20261012)
    for _ in range(2000):
        n = rnd.randint(1, 30)
        a = [rnd.randint(0, 9) for _ in range(n)]
        out, c, lines, _ = insertion_sort_counts(a)
        assert out == sorted(a)
        assert n - 1 <= c <= (n - 1) * n // 2
        assert steps(lines) == 4 * n - 3 + 2 * inversions(a)
    print("[OK] 같은 값이 섞인 무작위 입력 2,000개: 결과가 정렬되어 있고 횟수가 최선과 최악 사이다")

    # --- 주장 6: n을 두 배로 ---
    worst = lambda n: n + (n - 1) * (n + 3)
    best = lambda n: 4 * n - 3
    assert abs(worst(2000) / worst(1000) - 4) < 0.01 and abs(best(2000) / best(1000) - 2) < 0.01
    assert worst(4) == 25 and worst(8) == 85 and worst(1000) == 1002997
    assert worst(100) == 10297 and worst(200) == 40597 and 3.9 < worst(200) / worst(100) < 4
    assert all(worst(n) == n * n + 3 * n - 3 <= 4 * n * n for n in range(1, 2001))   # c = 4, n0 = 1
    assert (100 * 99 // 2, 200 * 199 // 2) == (4950, 19900) and 4 < 19900 / 4950 < 4.03
    print(f"[OK] n을 1,000에서 2,000으로: 최악 단계 수 {worst(2000) / worst(1000):.3f}배, 최선 {best(2000) / best(1000):.3f}배")

    # --- 주장 5: 실용 시간표 (초당 10^9 명령) ---
    def row(n):
        return (seconds(n), seconds(n * math.log2(n)), seconds(n ** 2), seconds(n ** 3))
    year = 365.25 * 24 * 3600
    r3, r4, r6, r9 = row(10 ** 3), row(10 ** 4), row(10 ** 6), row(10 ** 9)
    assert r3[0] == 1e-6 and abs(r3[1] - 10e-6) < 0.1e-6 and r3[2] == 1e-3 and r3[3] == 1.0
    assert r4[0] == 10e-6 and abs(r4[1] - 133e-6) < 1e-6 and r4[2] == 0.1 and abs(r4[3] / 60 - 16.7) < 0.1
    assert r6[0] == 1e-3 and abs(r6[1] - 0.020) < 0.001 and abs(r6[2] / 60 - 16.7) < 0.1 and abs(r6[3] / year - 31.7) < 0.1
    # n = 10^9이라면 n 칸부터 1밀리초가 아니라 1초다
    assert r9[0] == 1.0 and abs(r9[1] - 29.9) < 0.1 and abs(r9[2] / year - 31.7) < 0.1 and r9[3] / year > 3e10
    print("[OK] 시간표: 셋째 줄의 1밀리초·20밀리초·17분·32년은 n = 10^6의 값 (n = 10^9이면 1초·30초·32년·317억 년)")

    # --- p.20: 2^n을 n^3으로 (보충 예 n = 60) ---
    assert abs(seconds(2 ** 60) / year - 36.5) < 0.1 and seconds(60 ** 3) == 0.000216
    assert 2 ** 70 / 2 ** 60 == 1024           # 1,000배 빠른 기계로는 n이 10쯤만 늘어난다
    print(f"[OK] n = 60: 2^n은 {seconds(2 ** 60) / year:.1f}년, n^3은 {seconds(60 ** 3) * 1000:.3f}밀리초")

    # --- 카드 ---
    _, c, lines, rounds = insertion_sort_counts([3, 1, 2])
    assert c == 3 and rounds == [(1, 1, 2, 1), (2, 2, 2, 1)] and steps(lines) == 13
    assert worst(100) == 10297 and (100 - 1) * 100 // 2 == 4950 and best(100) == 397
    print("[OK] 카드: [3, 1, 2]는 비교 3번·13단계, n = 100이면 최악 비교 4,950번·10,297단계, 최선 397단계")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
