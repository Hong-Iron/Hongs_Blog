---
layout: "note"
title: "43_sort-tracing-practice_p5.py"
display_title: "43_sort-tracing-practice_p5.py"
kind: "code"
kind_label: "코드 · 문제 5 풀이"
num: "43"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/sort-tracing-practice/"
parent_title: "정렬 추적 연습"
description: "자료구조 · 정렬 추적 연습 문제 5 풀이 코드"
permalink: "/studies/data-structures/code/43_sort-tracing-practice_p5/"
---
{% raw %}
[정렬 추적 연습](/Hongs_Blog/studies/data-structures/sort-tracing-practice/) 문서의 문제 5 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""정렬 추적 연습: 문제 p1~p5의 답 확인.

실행: python3 43_sort-tracing-practice_p5.py
문서: 4.연습문제/43.정렬 추적 연습
출처: 자료구조 2주차 슬라이드 p.6, 14주차 p.4~5, p.20~24
세 정렬은 3.개념집의 40, 41, 43번 구현과 같은 규칙으로 다시 짰다(파일끼리 불러오지 않는다).
"""


def insertion_trace(a):
    """끼울 때마다 (배열, 그 바퀴의 비교 횟수)를 적는다."""
    a = list(a)
    out = []
    for i in range(1, len(a)):
        t = a[i]
        j = i - 1
        c = 0
        while j >= 0:
            c += 1
            if not (t < a[j]):
                break
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = t
        out.append((list(a), c))
    return out


def selection_trace(a):
    """한 바퀴마다 (배열, 가장 큰 값, 맞바꿨는가)를 적는다."""
    a = list(a)
    out = []
    for size in range(len(a), 1, -1):
        big = 0
        for i in range(1, size):
            if a[i] > a[big]:
                big = i
        swapped = big != size - 1
        value = a[big]
        a[big], a[size - 1] = a[size - 1], a[big]
        out.append((list(a), value, swapped))
    return out


def merge_steps(A, B):
    A, B, C = list(A), list(B), []
    steps = []
    cmp_count = 0
    while A and B:
        cmp_count += 1
        C.append(B.pop(0) if B[0] < A[0] else A.pop(0))
        steps.append((tuple(A), tuple(B), tuple(C)))
    C.extend(A + B)
    return C, cmp_count, steps


def merge_sort_log(a, splits, merged):
    n = len(a)
    if n <= 1:
        return list(a)
    half = (n + 1) // 2
    splits.append((list(a[:half]), list(a[half:])))
    left = merge_sort_log(a[:half], splits, merged)
    right = merge_sort_log(a[half:], splits, merged)
    out, _, _ = merge_steps(left, right)
    merged.append(out)
    return out


def merge_pass(a, length):
    """길이 length짜리 이웃 조각을 둘씩 합치는 한 바퀴."""
    out = []
    for lo in range(0, len(a), 2 * length):
        out.extend(merge_steps(a[lo:lo + length], a[lo + length:lo + 2 * length])[0])
    return out


if __name__ == "__main__":
    # p1: 삽입 정렬
    tr = insertion_trace([5, 2, 4, 6, 1, 3])
    assert tr == [
        ([2, 5, 4, 6, 1, 3], 1),
        ([2, 4, 5, 6, 1, 3], 2),
        ([2, 4, 5, 6, 1, 3], 1),
        ([1, 2, 4, 5, 6, 3], 4),
        ([1, 2, 3, 4, 5, 6], 4),
    ]
    assert sum(c for _, c in tr) == 12
    # p1 변형: 역순 6개는 15번
    assert sum(c for _, c in insertion_trace([6, 5, 4, 3, 2, 1])) == 15

    # p2: 선택 정렬
    tr = selection_trace([5, 2, 4, 6, 1, 3])
    assert tr == [
        ([5, 2, 4, 3, 1, 6], 6, True),
        ([1, 2, 4, 3, 5, 6], 5, True),
        ([1, 2, 3, 4, 5, 6], 4, True),
        ([1, 2, 3, 4, 5, 6], 3, False),
        ([1, 2, 3, 4, 5, 6], 2, False),
    ]
    assert 5 + 4 + 3 + 2 + 1 == 15

    # p3: 두 줄 합치기
    C, c, steps = merge_steps((3, 7, 8, 12), (1, 4, 9))
    assert steps == [
        ((3, 7, 8, 12), (4, 9), (1,)),
        ((7, 8, 12), (4, 9), (1, 3)),
        ((7, 8, 12), (9,), (1, 3, 4)),
        ((8, 12), (9,), (1, 3, 4, 7)),
        ((12,), (9,), (1, 3, 4, 7, 8)),
        ((12,), (), (1, 3, 4, 7, 8, 9)),
    ]
    assert C == [1, 3, 4, 7, 8, 9, 12] and c == 6
    # p3 변형: A의 값이 모두 B보다 작으면 비교는 A의 길이만큼
    assert merge_steps((1, 2), (5, 6, 7, 8))[1] == 2

    # p4: 병합 정렬의 나누기와 합치기
    splits, merged = [], []
    assert merge_sort_log([9, 4, 7, 1, 8, 2, 6, 3, 5], splits, merged) == list(range(1, 10))
    assert splits == [
        ([9, 4, 7, 1, 8], [2, 6, 3, 5]),
        ([9, 4, 7], [1, 8]),
        ([9, 4], [7]),
        ([9], [4]),
        ([1], [8]),
        ([2, 6], [3, 5]),
        ([2], [6]),
        ([3], [5]),
    ]
    assert merged == [
        [4, 9], [4, 7, 9], [1, 8], [1, 4, 7, 8, 9],
        [2, 6], [3, 5], [2, 3, 5, 6],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
    ]
    assert len(merged) == 8

    # p5: 같은 입력, 세 방법의 중간 모습
    a = [6, 3, 8, 1, 7, 2]
    assert insertion_trace(a)[1][0] == [3, 6, 8, 1, 7, 2]         # i = 2까지
    assert selection_trace(a)[1][0] == [6, 3, 2, 1, 7, 8]         # 두 바퀴
    assert merge_pass(a, 1) == [3, 6, 1, 8, 2, 7]                 # 길이 1짜리 조각의 병합 패스 한 번
    assert merge_pass(merge_pass(a, 1), 2) == [1, 3, 6, 8, 2, 7]

    print("p1 비교 12번, p2 비교 15번, p3 비교 6번, p4 합치기 8번, p5 세 모습 확인")
    print("ALL CHECKS PASSED")
```
{% endraw %}
