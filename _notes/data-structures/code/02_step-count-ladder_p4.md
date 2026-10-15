---
layout: "note"
title: "02_step-count-ladder_p4.py"
display_title: "02_step-count-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "02"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/step-count-ladder/"
parent_title: "단계 수 세기 예제 사다리"
description: "자료구조 · 단계 수 세기 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/02_step-count-ladder_p4/"
---
{% raw %}
[단계 수 세기 예제 사다리](/Hongs_Blog/studies/data-structures/step-count-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""단계 수 세기 예제 사다리: 문제 1~4의 답을 코드를 실제로 돌리며 세어 확인한다.

문서: 4.연습문제/02.단계 수 세기 예제 사다리
실행: python3 02_step-count-ladder_p4.py

세는 규칙: 줄을 한 번 실행하면 1단계. for의 머리줄은 조건을 검사할 때마다 한 번 실행한 것으로 센다.
중괄호와 값을 넣지 않는 선언(int i;)은 0단계.
"""
from itertools import permutations, product


def insertion_steps(src):
    """문제 1, 2: 삽입 정렬. 돌려주는 것: (바깥 머리줄, t 넣기, 안쪽 머리줄, 옮기기, 끼우기) 횟수"""
    a = list(src)
    n = len(a)
    outer = t_line = inner = shift = put = 0
    i = 1
    while True:
        outer += 1
        if not i < n:
            break
        t = a[i]
        t_line += 1
        j = i - 1
        while True:
            inner += 1
            if not (j >= 0 and t < a[j]):
                break
            a[j + 1] = a[j]
            shift += 1
            j -= 1
        a[j + 1] = t
        put += 1
        i += 1
    assert a == sorted(src)
    return outer, t_line, inner, shift, put


def sum_steps(a):
    """문제 3: 배열의 합. 돌려주는 것: (합, 줄별 횟수)"""
    n = len(a)
    lines = {"s = 0": 0, "for": 0, "s += a[i]": 0, "return": 0}
    s = 0
    lines["s = 0"] += 1
    i = 0
    while True:
        lines["for"] += 1
        if not i < n:
            break
        s += a[i]
        lines["s += a[i]"] += 1
        i += 1
    lines["return"] += 1
    return s, lines


def pair_steps(a):
    """문제 4: 값이 같은 쌍 세기. 돌려주는 것: (같은 쌍의 수, 비교 횟수, 줄별 횟수)"""
    n = len(a)
    lines = {"count = 0": 0, "outer": 0, "inner": 0, "if": 0, "count++": 0}
    count = 0
    lines["count = 0"] += 1
    i = 0
    while True:
        lines["outer"] += 1
        if not i < n:
            break
        j = i + 1
        while True:
            lines["inner"] += 1
            if not j < n:
                break
            lines["if"] += 1
            if a[i] == a[j]:
                count += 1
                lines["count++"] += 1
            j += 1
        i += 1
    return count, lines["if"], lines


def main():
    # --- 문제 1: 삽입 정렬, 거꾸로 놓인 입력 (최악) ---
    for n in range(1, 41):
        outer, t_line, inner, shift, put = insertion_steps(range(n, 0, -1))
        assert outer == n and t_line == n - 1 and put == n - 1
        assert inner == sum(i + 1 for i in range(1, n)) and shift == sum(range(1, n))
        assert t_line + inner + shift + put == (n - 1) * (n + 3)
        assert outer + t_line + inner + shift + put == n + (n - 1) * (n + 3)
    assert sum(insertion_steps([5, 4, 3, 2, 1])) == 5 + 4 * 8 == 37
    print("[OK] 문제 1: 최악 단계 수 n + (n-1)(n+3). n = 5이면 37")

    # --- 문제 2: 삽입 정렬, 정렬된 입력 (최선) ---
    for n in range(1, 41):
        outer, t_line, inner, shift, put = insertion_steps(range(1, n + 1))
        assert (outer, t_line, inner, shift, put) == (n, n - 1, n - 1, 0, n - 1)
        assert outer + t_line + inner + shift + put == n + 3 * (n - 1) == 4 * n - 3
    assert sum(insertion_steps([1, 2, 3, 4, 5])) == 17
    for p in permutations(range(6)):                   # 최악과 최선 사이: n = 6의 모든 순서
        assert 4 * 6 - 3 <= sum(insertion_steps(p)) <= 6 + 5 * 9
    print("[OK] 문제 2: 최선 단계 수 n + 3(n-1) = 4n - 3. n = 5이면 17")

    # --- 문제 3: 배열의 합 ---
    for n in range(0, 41):
        a = list(range(1, n + 1))
        s, lines = sum_steps(a)
        assert s == n * (n + 1) // 2
        assert lines == {"s = 0": 1, "for": n + 1, "s += a[i]": n, "return": 1}
        assert sum(lines.values()) == 2 * n + 3
    assert sum(sum_steps([7] * 10)[1].values()) == 23
    print("[OK] 문제 3: 합 구하기는 1 + (n+1) + n + 1 = 2n + 3. n = 10이면 23")

    # --- 문제 4: 값이 같은 쌍 세기 ---
    for n in range(0, 7):
        totals = []
        for a in product(range(3), repeat=n):          # 값 세 가지로 만들 수 있는 모든 입력
            count, compares, lines = pair_steps(a)
            total = sum(lines.values())
            assert compares == n * (n - 1) // 2          # 비교 횟수는 입력과 상관없다
            assert lines["count = 0"] == 1 and lines["outer"] == n + 1
            assert lines["inner"] == n * (n + 1) // 2
            assert total == n * n + n + 2 + count
            totals.append(total)
        # 최악: 모두 같은 값
        assert max(totals) == n * n + n + 2 + n * (n - 1) // 2 == (3 * n * n + n + 4) // 2
        if n <= 3:                                       # 값이 세 가지뿐이라 모두 다른 입력은 n <= 3에서만 나온다
            assert min(totals) == n * n + n + 2
    for n in range(0, 41):
        count, compares, lines = pair_steps(list(range(n)))           # 모두 다른 값: 최선
        assert count == 0 and sum(lines.values()) == n * n + n + 2
        count, compares, lines = pair_steps([1] * n)                  # 모두 같은 값: 최악
        assert count == n * (n - 1) // 2 and sum(lines.values()) == (3 * n * n + n + 4) // 2
    assert pair_steps([1, 2, 3, 4])[1] == 6
    assert sum(pair_steps([1, 2, 3, 4])[2].values()) == 22 and sum(pair_steps([5, 5, 5, 5])[2].values()) == 28
    count, compares, lines = pair_steps([3, 1, 3, 3])
    assert (count, compares, sum(lines.values())) == (3, 6, 25)
    print("[OK] 문제 4: 비교는 늘 n(n-1)/2번. 단계 수는 최선 n^2 + n + 2, 최악 (3n^2 + n + 4)/2. n = 4이면 22와 28")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
