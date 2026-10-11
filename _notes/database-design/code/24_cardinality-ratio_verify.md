---
layout: "note"
title: "24_cardinality-ratio_verify.py"
display_title: "24_cardinality-ratio_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "24"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/cardinality-ratio/"
parent_title: "카디널리티 비율"
description: "데이터베이스 설계 · 카디널리티 비율 검증 코드"
permalink: "/studies/database-design/code/24_cardinality-ratio_verify/"
---
{% raw %}
[카디널리티 비율](/Hongs_Blog/studies/database-design/cardinality-ratio/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""카디널리티 비율 검증.

문서: 24.카디널리티 비율 (예시로 보기, 정의, 카드 C2)
출처: 데이터베이스 설계 5주차 슬라이드 p.12~15 (6주차 6-1 p.3~4에 같은 그림), COMPANY 상태 6-2 p.21
주장:
  1. WORKS_FOR 그림(p.13): 직원은 모두 한 번씩만 나오고, 부서 d1은 세 번 나온다.
     "직원은 많아야 한 부서" 규칙(직원 쪽이 N인 1:N)과 맞고, 1:1 규칙에는 어긋난다.
  2. MANAGES 그림(p.14): 직원도 부서도 많아야 한 번 나온다. 1:1 규칙과 맞다.
  3. WORKS_ON 그림(p.15): e2는 p1, p4 두 프로젝트에, p1에는 e1, e2 두 직원이 있다.
     어느 쪽을 1로 잡아도 1:N 규칙에 어긋난다. M:N이어야 한다.
  4. 1:1 규칙에 맞는 자료는 1:N 규칙에도 M:N 규칙에도 맞는다.
     그래서 자료만 보고 "이 관계는 1:1이다"라고 정할 수는 없다. 자료는 규칙을 어긴 증거만 준다.
  5. COMPANY 상태(6-2 p.21)의 WORKS_ON 16행: 한 직원이 많게는 4개 프로젝트, 한 프로젝트에 많게는 3명.
"""
from collections import Counter

WORKS_FOR = [("e1", "d1"), ("e2", "d2"), ("e3", "d1"), ("e4", "d2"), ("e5", "d3"), ("e6", "d1"), ("e7", "d3")]
MANAGES = [("e3", "d1"), ("e6", "d2"), ("e5", "d3")]
WORKS_ON = [("e1", "p1"), ("e2", "p1"), ("e2", "p4"), ("e3", "p2"), ("e3", "p3"), ("e3", "p4"), ("e4", "p3")]

# 6-2 p.21의 WORKS_ON (Essn, Pno)
STATE_WORKS_ON = [("123456789", 1), ("123456789", 2), ("666884444", 3), ("453453453", 1), ("453453453", 2),
                  ("333445555", 2), ("333445555", 3), ("333445555", 10), ("333445555", 20), ("999887777", 30),
                  ("999887777", 10), ("987987987", 10), ("987987987", 30), ("987654321", 30), ("987654321", 20),
                  ("888665555", 20)]


def most(pairs, side):
    """side(0 = 왼쪽, 1 = 오른쪽) 개체 하나가 낀 인스턴스 수의 최댓값."""
    return max(Counter(p[side] for p in pairs).values())


def fits(pairs, left_max, right_max):
    """왼쪽 개체는 많아야 left_max번, 오른쪽 개체는 많아야 right_max번 낀다는 규칙에 맞는가."""
    return most(pairs, 0) <= left_max and most(pairs, 1) <= right_max


INF = float("inf")
ONE_TO_ONE = (1, 1)       # 양쪽 다 많아야 한 번
LEFT_IS_N = (1, INF)      # 왼쪽 개체는 상대를 많아야 하나: 왼쪽이 N쪽, 오른쪽이 1쪽
RIGHT_IS_N = (INF, 1)
MANY_TO_MANY = (INF, INF)


def main():
    assert most(WORKS_FOR, 0) == 1 and most(WORKS_FOR, 1) == 3
    assert fits(WORKS_FOR, *LEFT_IS_N) and not fits(WORKS_FOR, *ONE_TO_ONE) and not fits(WORKS_FOR, *RIGHT_IS_N)
    print("[OK] p.13 WORKS_FOR: 직원은 한 번씩, d1은 세 번 -> 직원이 N쪽인 1:N 규칙에 맞고 1:1 규칙에는 어긋난다")

    assert most(MANAGES, 0) == 1 and most(MANAGES, 1) == 1 and fits(MANAGES, *ONE_TO_ONE)
    print("[OK] p.14 MANAGES: 양쪽 다 많아야 한 번 -> 1:1 규칙에 맞는다")

    assert sorted(p for e, p in WORKS_ON if e == "e2") == ["p1", "p4"]
    assert sorted(e for e, p in WORKS_ON if p == "p1") == ["e1", "e2"]
    assert most(WORKS_ON, 0) == 3 and most(WORKS_ON, 1) == 2
    assert not fits(WORKS_ON, *LEFT_IS_N) and not fits(WORKS_ON, *RIGHT_IS_N) and fits(WORKS_ON, *MANY_TO_MANY)
    print("[OK] p.15 WORKS_ON: e2는 프로젝트 둘, p1에는 직원 둘 -> M:N 규칙에만 맞는다")

    # 1:1에 맞는 자료는 더 느슨한 규칙에도 다 맞는다
    for rule in (ONE_TO_ONE, LEFT_IS_N, RIGHT_IS_N, MANY_TO_MANY):
        assert fits(MANAGES, *rule)
    for rule in (LEFT_IS_N, MANY_TO_MANY):
        assert fits(WORKS_FOR, *rule)
    print("[OK] MANAGES 자료는 네 규칙 모두에 맞는다 -> 자료만으로는 비율을 정하지 못한다")

    assert len(STATE_WORKS_ON) == 16 and most(STATE_WORKS_ON, 0) == 4 and most(STATE_WORKS_ON, 1) == 3
    print("[OK] 6-2 p.21 WORKS_ON 16행: 한 직원 최대 4개 프로젝트, 한 프로젝트 최대 3명")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
