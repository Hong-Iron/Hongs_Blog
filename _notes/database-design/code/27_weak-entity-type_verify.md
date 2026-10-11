---
layout: "note"
title: "27_weak-entity-type_verify.py"
display_title: "27_weak-entity-type_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "27"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/weak-entity-type/"
parent_title: "약한 개체 타입"
description: "데이터베이스 설계 · 약한 개체 타입 검증 코드"
permalink: "/studies/database-design/code/27_weak-entity-type_verify/"
---
{% raw %}
[약한 개체 타입](/Hongs_Blog/studies/database-design/weak-entity-type/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""약한 개체 타입 검증.

문서: 27.약한 개체 타입 (예시로 보기, 카드 C1·C3), 28.일반 개체 타입과 약한 개체 타입 비교
출처: 데이터베이스 설계 5주차 슬라이드 p.21~22, p.30, COMPANY 상태 6-2 p.21
주장:
  1. DEPENDENT 7명 가운데 이름 Alice가 두 명이다(Wong의 딸, Smith의 딸).
     Dependent_name만으로는 부양가족을 가려내지 못한다.
  2. 주인 직원(Essn)과 이름을 함께 대면 7명이 모두 가려진다. Dependent_name은 부분 키다.
  3. 생일(Bdate)은 이 7명에서 우연히 다 다르지만, 생일이 같은 부양가족이 들어오면 깨진다. 키가 아니다.
  4. 부양가족은 모두 실제로 있는 직원에 딸려 있다(전체 참여). 직원 8명 중 부양가족이 있는 직원은 3명(부분 참여).
"""

# 6-2 p.21: (Essn, Dependent_name, Sex, Bdate, Relationship)
DEPENDENT = [("333445555", "Alice", "F", "1986-04-05", "Daughter"), ("333445555", "Theodore", "M", "1983-10-25", "Son"),
             ("333445555", "Joy", "F", "1958-05-03", "Spouse"), ("987654321", "Abner", "M", "1942-02-28", "Spouse"),
             ("123456789", "Michael", "M", "1988-01-04", "Son"), ("123456789", "Alice", "F", "1988-12-30", "Daughter"),
             ("123456789", "Elizabeth", "F", "1967-05-05", "Spouse")]
EMPLOYEE_SSN = ["123456789", "333445555", "999887777", "987654321", "666884444", "453453453", "987987987", "888665555"]
ESSN, NAME, SEX, BDATE, REL = range(5)


def unique(rows, cols):
    seen = [tuple(r[c] for c in cols) for r in rows]
    return len(set(seen)) == len(seen)


def main():
    assert len(DEPENDENT) == 7 and not unique(DEPENDENT, [NAME])
    alices = sorted(r[ESSN] for r in DEPENDENT if r[NAME] == "Alice")
    assert alices == ["123456789", "333445555"]
    print("[OK] Alice가 두 명(직원 333445555와 123456789의 딸) -> 이름만으로는 못 가린다")

    assert unique(DEPENDENT, [ESSN, NAME])
    # 같은 직원 안에서는 이름이 겹치지 않는다
    for ssn in set(r[ESSN] for r in DEPENDENT):
        assert unique([r for r in DEPENDENT if r[ESSN] == ssn], [NAME])
    print("[OK] (주인 직원, 이름)은 7명이 모두 다르다 -> Dependent_name은 부분 키")

    assert not unique(DEPENDENT, [SEX]) and not unique(DEPENDENT, [REL])
    assert unique(DEPENDENT, [BDATE])
    twin = DEPENDENT + [("987654321", "Bella", "F", "1986-04-05", "Daughter")]  # 생일이 같은 부양가족(보충)
    assert not unique(twin, [BDATE]) and unique(twin, [ESSN, NAME])
    print("[OK] 생일은 우연히 다 다를 뿐이다: 같은 생일을 넣으면 겹치고, (주인, 이름)은 그대로 안 겹친다")

    assert all(r[ESSN] in EMPLOYEE_SSN for r in DEPENDENT)
    owners = sorted(set(r[ESSN] for r in DEPENDENT))
    assert len(owners) == 3 and len(EMPLOYEE_SSN) == 8
    print("[OK] 부양가족 7명 모두 주인 직원이 있다. 직원 8명 중 3명만 부양가족이 있다")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
