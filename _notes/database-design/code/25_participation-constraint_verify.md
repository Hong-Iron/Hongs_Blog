---
layout: "note"
title: "25_participation-constraint_verify.py"
display_title: "25_participation-constraint_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "25"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/participation-constraint/"
parent_title: "참여 제약"
description: "데이터베이스 설계 · 참여 제약 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/25_participation-constraint_verify/"
---
{% raw %}
[참여 제약](/Hongs_Blog/studies/database-design/participation-constraint/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""참여 제약 검증.

문서: 25.참여 제약 (예시로 보기, COMPANY 표, 카드 C3)
출처: 데이터베이스 설계 5주차 슬라이드 p.12, p.16, p.25~30 (6주차 6-1 p.5에 같은 그림), COMPANY 상태 6-2 p.21
주장:
  1. WORKS_FOR 그림(p.16): 직원 e1~e7이 모두 선에 이어져 있다(전체 참여 규칙과 맞는다).
  2. MANAGES 그림(p.16): 직원 7명 중 e3, e5, e6 세 명만 이어져 있다(부분 참여). 부서 d1~d3은 모두 이어져 있다.
  3. 전체 참여 규칙이 걸린 쪽에 선이 없는 개체를 넣으면 규칙에 어긋난다.
  4. COMPANY 상태(6-2 p.21): 직원 8명 모두 부서가 있다. 부서를 관리하는 직원은 3명, 부양가족이 있는 직원은 3명이다.
  5. 상태만 보고 규칙을 알 수는 없다: CONTROLS에서 부서는 부분 참여 규칙인데(p.27),
     이 상태에서는 세 부서가 모두 프로젝트를 하나 이상 관리한다.
"""

EMPLOYEE = [f"e{i}" for i in range(1, 8)]
DEPARTMENT = ["d1", "d2", "d3"]
WORKS_FOR = [("e1", "d1"), ("e2", "d2"), ("e3", "d1"), ("e4", "d2"), ("e5", "d3"), ("e6", "d1"), ("e7", "d3")]
MANAGES = [("e3", "d1"), ("e6", "d2"), ("e5", "d3")]


def missing(entities, pairs, side):
    """관계에 한 번도 끼지 않은 개체들."""
    seen = {p[side] for p in pairs}
    return [e for e in entities if e not in seen]


def total(entities, pairs, side):
    return not missing(entities, pairs, side)


# 6-2 p.21
EMP_DNO = {"123456789": 5, "333445555": 5, "999887777": 4, "987654321": 4,
           "666884444": 5, "453453453": 5, "987987987": 4, "888665555": 1}
DEPT_MGR = {5: "333445555", 4: "987654321", 1: "888665555"}
PROJ_DNUM = {1: 5, 2: 5, 3: 5, 10: 4, 20: 1, 30: 4}
DEPENDENT_ESSN = ["333445555", "333445555", "333445555", "987654321", "123456789", "123456789", "123456789"]


def main():
    assert total(EMPLOYEE, WORKS_FOR, 0) and total(DEPARTMENT, WORKS_FOR, 1)
    print("[OK] p.16 WORKS_FOR: 직원 7명, 부서 3개가 모두 이어져 있다")

    assert missing(EMPLOYEE, MANAGES, 0) == ["e1", "e2", "e4", "e7"]
    assert not total(EMPLOYEE, MANAGES, 0) and total(DEPARTMENT, MANAGES, 1)
    print("[OK] p.16 MANAGES: 직원은 e3, e5, e6만 이어져 있고(부분), 부서는 모두 이어져 있다")

    # 선이 없는 직원 e8을 넣으면 WORKS_FOR의 전체 참여 규칙에 어긋난다
    assert missing(EMPLOYEE + ["e8"], WORKS_FOR, 0) == ["e8"]
    print("[OK] 선 없는 e8을 넣으면 전체 참여가 깨진다")

    emps = list(EMP_DNO)
    works_for = [(e, d) for e, d in EMP_DNO.items()]
    manages = [(m, d) for d, m in DEPT_MGR.items()]
    controls = [(d, p) for p, d in PROJ_DNUM.items()]
    dependents_of = [(e, i) for i, e in enumerate(DEPENDENT_ESSN)]
    assert total(emps, works_for, 0) and total(list(DEPT_MGR), works_for, 1)
    assert len(emps) - len(missing(emps, manages, 0)) == 3 and total(list(DEPT_MGR), manages, 1)
    assert len(emps) - len(missing(emps, dependents_of, 0)) == 3
    print("[OK] 6-2 p.21: 직원 8명 모두 부서가 있다. 관리자 3명, 부양가족이 있는 직원 3명")

    assert total(list(PROJ_DNUM), controls, 1)
    assert total(list(DEPT_MGR), controls, 0)   # 규칙은 부분 참여지만 이 상태에서는 모두 낀다
    print("[OK] CONTROLS: 이 상태에서는 세 부서가 모두 프로젝트를 관리한다(규칙은 부분 참여)")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
