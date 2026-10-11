---
layout: "note"
title: "49_linear-probing-ladder_p4.py"
display_title: "49_linear-probing-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "49"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/linear-probing-ladder/"
parent_title: "선형 탐사 삽입·삭제 예제 사다리"
description: "자료구조 · 선형 탐사 삽입·삭제 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/data-structures/code/49_linear-probing-ladder_p4/"
---
{% raw %}
[선형 탐사 삽입·삭제 예제 사다리](/Hongs_Blog/studies/data-structures/linear-probing-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""선형 탐사 삽입·삭제 예제 사다리: 문제 1~4의 답 확인.

실행: python3 49_linear-probing-ladder_p4.py
문서: 4.연습문제/49.선형 탐사 삽입·삭제 예제 사다리
출처: 자료구조 15주차 슬라이드 p.21~24, p.31
넣기와 지우기는 3.개념집/49_linear-probing_impl.c와 같은 규칙으로 다시 짰다(파일끼리 불러오지 않는다).
먼저 슬라이드의 표와 지우기 세 개가 그대로 나오는지 확인해 이 코드가 맞는지 본다.
"""
E = None


def insert_all(keys, b):
    """(표, 키마다 지나친 버킷 수 + 1)"""
    table = [E] * b
    probes = {}
    for k in keys:
        i = k % b
        c = 1
        while table[i] is not E:
            i = (i + 1) % b
            c += 1
        table[i] = k
        probes[k] = c
    return table, probes


def delete(table, key):
    """지운 뒤의 표와 (키, 옮기기 전 버킷, 옮긴 버킷 또는 '그대로') 기록."""
    table = list(table)
    b = len(table)
    hole = table.index(key)
    table[hole] = E
    log = []
    j = hole
    while True:
        j = (j + 1) % b
        if table[j] is E:
            break
        home = table[j] % b
        between = (hole < home <= j) if hole < j else (home > hole or home <= j)
        if between:
            log.append((table[j], j, "그대로"))
        else:
            log.append((table[j], j, hole))
            table[hole] = table[j]
            table[j] = E
            hole = j
    return table, log


def chains(keys, b):
    out = {}
    for k in sorted(keys):
        out.setdefault(k % b, []).append(k)
    return out


def all_found(table):
    b = len(table)
    for p, k in enumerate(table):
        if k is E:
            continue
        i = k % b
        while i != p:
            if table[i] is E:
                return False
            i = (i + 1) % b
    return True


if __name__ == "__main__":
    # 이 코드가 슬라이드와 같은 답을 내는지 먼저 확인한다 (p.21~24)
    slide, _ = insert_all([6, 12, 34, 29, 28, 11, 23, 7, 0, 33, 30, 45], 17)
    assert slide == [34, 0, 45, E, E, E, 6, 23, 7, E, E, 28, 12, 29, 11, 30, 33]
    assert delete(slide, 0)[0] == [34, 45, E, E, E, E, 6, 23, 7, E, E, 28, 12, 29, 11, 30, 33]
    assert delete(slide, 34)[0] == [0, 45, E, E, E, E, 6, 23, 7, E, E, 28, 12, 29, 11, 30, 33]
    assert delete(slide, 29)[0] == [34, 0, E, E, E, E, 6, 23, 7, E, E, 28, 12, 11, 30, 45, 33]

    # 문제 1: b = 11, 키 1, 12, 3, 23, 4, 14를 넣고 12를 지운다
    t1, pr = insert_all([1, 12, 3, 23, 4, 14], 11)
    assert t1 == [E, 1, 12, 3, 23, 4, 14, E, E, E, E]
    assert pr == {1: 1, 12: 2, 3: 1, 23: 4, 4: 2, 14: 4}
    after, log = delete(t1, 12)
    assert log == [(3, 3, "그대로"), (23, 4, 2), (4, 5, 4), (14, 6, 5)]
    assert after == [E, 1, 23, 3, 4, 14, E, E, E, E, E] and all_found(after)

    # 문제 2: 같은 표에서 1을 지운다
    after, log = delete(t1, 1)
    assert log == [(12, 2, 1), (3, 3, "그대로"), (23, 4, 2), (4, 5, 4), (14, 6, 5)]
    assert after == [E, 12, 23, 3, 4, 14, E, E, E, E, E] and all_found(after)

    # 문제 3: b = 7, 키 5, 12, 0, 19, 8을 넣고 5를 지운다 (끝을 넘어 0번으로 이어지는 뭉치)
    t3, pr = insert_all([5, 12, 0, 19, 8], 7)
    assert t3 == [0, 19, 8, E, E, 5, 12]
    assert pr == {5: 1, 12: 2, 0: 1, 19: 4, 8: 2}
    after, log = delete(t3, 5)
    assert log == [(12, 6, 5), (0, 0, "그대로"), (19, 1, 6), (8, 2, 1)]
    assert after == [0, 8, E, E, E, 12, 19] and all_found(after)

    # 문제 4: b = 13, 키 14, 27, 16, 40, 5, 29, 18, 6
    keys4 = [14, 27, 16, 40, 5, 29, 18, 6]
    t4, pr = insert_all(keys4, 13)
    assert t4 == [E, 14, 27, 16, 40, 5, 29, 18, 6, E, E, E, E]
    assert pr == {14: 1, 27: 2, 16: 1, 40: 4, 5: 1, 29: 4, 18: 3, 6: 3}
    assert sum(pr.values()) == 19                                   # 평균 19/8 = 2.375
    after, log = delete(t4, 27)
    assert log == [(16, 3, "그대로"), (40, 4, 2), (5, 5, "그대로"), (29, 6, 4), (18, 7, 6), (6, 8, 7)]
    assert after == [E, 14, 40, 16, 29, 5, 18, 6, E, E, E, E, E] and all_found(after)
    ch = chains(keys4, 13)
    assert ch == {1: [14, 27, 40], 3: [16, 29], 5: [5, 18], 6: [6]}
    assert sum(c.index(k) + 1 for c in ch.values() for k in c) == 13    # 평균 13/8 = 1.625
    ch[1].remove(27)
    assert ch[1] == [14, 40]

    print("슬라이드 표와 지우기 세 개 재현, 문제 1~4의 표와 옮긴 차례 확인")
    print("ALL CHECKS PASSED")
```
{% endraw %}
