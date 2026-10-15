---
layout: "note"
title: "22_relationship-type-and-set_verify.py"
display_title: "22_relationship-type-and-set_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "22"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/relationship-type-and-set/"
parent_title: "관계 타입과 관계 집합"
description: "데이터베이스 설계 · 관계 타입과 관계 집합 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/22_relationship-type-and-set_verify/"
---
{% raw %}
[관계 타입과 관계 집합](/Hongs_Blog/studies/database-design/relationship-type-and-set/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""관계 타입과 관계 집합 검증.

문서: 22.관계 타입과 관계 집합 (예시로 보기, 정의, 카드 C2·C3)
출처: Elmasri & Navathe, Fundamentals of Database Systems 3장의 WORKS_FOR 예
주장:
  1. 문서의 WORKS_FOR 표의 관계 인스턴스는 7개이고, 하나하나가 (직원, 부서) 짝이다.
     r4 = (e4, d2)다(문서에서 예로 든 인스턴스).
  2. 관계 집합은 개체 집합들의 곱집합의 부분집합이다: WORKS_FOR ⊆ EMPLOYEE × DEPARTMENT.
     문서의 표에 보이는 범위에서 가능한 짝은 7 × 3 = 21개, 그 가운데 7개가 들어 있다.
  3. 차수는 인스턴스 하나가 잇는 개체의 수다. WORKS_FOR는 2(이항), SUPPLY는 3(삼항).
  4. 집합이므로 같은 짝은 한 번만 들어간다.
"""
from itertools import product

EMPLOYEE = [f"e{i}" for i in range(1, 8)]
DEPARTMENT = ["d1", "d2", "d3"]
# 문서의 WORKS_FOR 표: r1..r7
WORKS_FOR = {
    "r1": ("e1", "d1"), "r2": ("e2", "d2"), "r3": ("e3", "d1"), "r4": ("e4", "d2"),
    "r5": ("e5", "d3"), "r6": ("e6", "d1"), "r7": ("e7", "d3"),
}

# 삼항 관계 SUPPLY의 작은 예(문서의 예, 보충): (공급자, 부품, 프로젝트)
SUPPLIER, PART, PROJECT = ["s1", "s2"], ["p1", "p2", "p3"], ["j1", "j2", "j3"]
SUPPLY = {("s1", "p1", "j1"), ("s1", "p2", "j1"), ("s2", "p1", "j2")}


def main():
    assert len(WORKS_FOR) == 7 and WORKS_FOR["r4"] == ("e4", "d2")
    print("[OK] WORKS_FOR: 관계 인스턴스 7개, r4 = (e4, d2)")

    pairs = set(WORKS_FOR.values())
    space = set(product(EMPLOYEE, DEPARTMENT))
    assert pairs <= space and len(space) == 21 and len(pairs) == 7
    print("[OK] WORKS_FOR ⊆ EMPLOYEE × DEPARTMENT, 가능한 짝 21개 중 7개")

    assert {len(t) for t in pairs} == {2} and {len(t) for t in SUPPLY} == {3}
    assert SUPPLY <= set(product(SUPPLIER, PART, PROJECT))
    print("[OK] 차수: WORKS_FOR 2, SUPPLY 3")

    # d1에서 일하는 직원
    assert sorted(e for e, d in pairs if d == "d1") == ["e1", "e3", "e6"]
    print("[OK] d1에서 일하는 직원: e1, e3, e6")

    # 집합이라 같은 짝을 또 넣어도 늘지 않는다
    again = set(pairs)
    again.add(("e1", "d1"))
    assert len(again) == 7
    print("[OK] 같은 짝을 다시 넣어도 7개 그대로다")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
