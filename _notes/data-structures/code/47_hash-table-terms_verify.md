---
layout: "note"
title: "47_hash-table-terms_verify.py"
display_title: "47_hash-table-terms_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "47"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/hash-table-terms/"
parent_title: "해시 테이블의 홈 버킷과 충돌"
description: "자료구조 · 해시 테이블의 홈 버킷과 충돌 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/47_hash-table-terms_verify/"
---
{% raw %}
[해시 테이블의 홈 버킷과 충돌](/Hongs_Blog/studies/data-structures/hash-table-terms/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""해시 테이블 용어(홈 버킷, 동의어, 충돌, 넘침)의 예제 값 검증.

실행: python3 47_hash-table-terms_verify.py
문서: 47.해시 테이블의 홈 버킷과 충돌 (예시, 충돌과 넘침을 가르는 표, 카드 C1~C3)
출처: 자료구조 15주차 슬라이드 p.5~8

주장
  1. 쌍 (22,a), (33,c), (3,d), (73,e), (85,f)를 b = 8, f(k) = k // 11(11로 나눈 몫)로 넣으면
     버킷 0, 2, 3, 6, 7에 하나씩 들어간다. 겹치지 않는다 (p.6).
  2. (26,g)의 홈 버킷은 2로 (22,a)와 같다. 22와 26은 동의어다 (p.7).
  3. 버킷에 한 쌍만 들어가면 충돌과 넘침이 같이 일어난다. 두 쌍이 들어가면 26은 충돌하지만 넘치지 않고,
     같은 버킷에 셋째로 오는 24에서 처음 넘친다 (p.8의 두 정의를 그대로 옮긴 모형).
  4. f(k) = k // 11이 0..7 안에 드는 키는 0부터 87까지다.
  5. 카드의 답.
"""


def home(key):
    return key // 11


def insert_all(keys, b, capacity):
    """버킷마다 capacity쌍까지 담는다. 키마다 (홈 버킷, 충돌했나, 넘쳤나)를 돌려준다."""
    table = [[] for _ in range(b)]
    log = []
    for k in keys:
        h = home(k)
        collision = any(x != k for x in table[h])       # 홈 버킷에 다른 키가 이미 있다
        overflow = len(table[h]) >= capacity            # 홈 버킷에 자리가 없다
        if not overflow:
            table[h].append(k)
        log.append((k, h, collision, overflow))
    return table, log


if __name__ == "__main__":
    keys = [22, 33, 3, 73, 85]

    # 1. 이상적인 경우
    table, log = insert_all(keys, 8, 1)
    assert [h for _, h, _, _ in log] == [2, 3, 0, 6, 7]
    assert table == [[3], [], [22], [33], [], [], [73], [85]]
    assert not any(c or o for _, _, c, o in log)

    # 2. 26
    assert home(26) == home(22) == 2

    # 3. 버킷 크기 1과 2
    _, log1 = insert_all(keys + [26], 8, 1)
    assert log1[-1] == (26, 2, True, True)              # 충돌이자 넘침
    _, log2 = insert_all(keys + [26, 24], 8, 2)
    assert log2[-2] == (26, 2, True, False)             # 충돌했지만 넘치지 않는다
    assert log2[-1] == (24, 2, True, True)              # 셋째 동의어에서 넘친다
    # 버킷 크기가 1이면 충돌과 넘침은 늘 함께다(서로 다른 키 0..87을 아무 차례로 넣어도)
    import random
    rng = random.Random(47)
    for _ in range(500):
        ks = rng.sample(range(88), 20)
        _, lg = insert_all(ks, 8, 1)
        assert all(c == o for _, _, c, o in lg)

    # 4. 키의 범위
    assert [k for k in range(200) if 0 <= home(k) <= 7] == list(range(88))

    # 5. 카드 C2: 14, 40, 47, 58, 80을 차례로 더 넣는다 (버킷 크기 1)
    _, lg = insert_all(keys + [14, 40, 47, 58, 80], 8, 1)
    extra = lg[5:]
    assert [(k, h) for k, h, _, _ in extra] == [(14, 1), (40, 3), (47, 4), (58, 5), (80, 7)]
    assert [k for k, _, c, _ in extra if c] == [40, 80]
    # 카드 C3: 같은 홈 버킷끼리 묶기
    groups = {}
    for k in [22, 26, 33, 40, 85, 80, 3]:
        groups.setdefault(home(k), []).append(k)
    assert groups == {2: [22, 26], 3: [33, 40], 7: [85, 80], 0: [3]}

    print("이상적인 예: 버킷 0, 2, 3, 6, 7 / 26은 22와 동의어(홈 버킷 2)")
    print("버킷 크기 2: 26은 충돌만, 24에서 넘침")
    print("ALL CHECKS PASSED")
```
{% endraw %}
