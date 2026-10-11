---
layout: "note"
title: "19_entity-type-and-set_verify.py"
display_title: "19_entity-type-and-set_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "19"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/entity-type-and-set/"
parent_title: "개체 타입과 개체 집합"
description: "데이터베이스 설계 · 개체 타입과 개체 집합 검증 코드"
permalink: "/studies/database-design/code/19_entity-type-and-set_verify/"
---
{% raw %}
[개체 타입과 개체 집합](/Hongs_Blog/studies/database-design/entity-type-and-set/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""개체 타입과 개체 집합 검증.

문서: 19.개체 타입과 개체 집합 (예시로 보기, 정의, 카드 C2)
출처: 데이터베이스 설계 4주차 슬라이드 4-2 p.8, p.11 (5주차 p.3, p.5에 같은 그림)
주장:
  1. 개체 타입은 (이름, 속성 목록)이다. 개체 집합에 든 개체는 모두 그 속성마다 값을 하나씩 갖는다.
  2. 개체를 넣거나 빼면 개체 집합은 바뀌지만 개체 타입은 그대로다.
  3. p.11 그림: EMPLOYEE 개체 집합에 e1, e2, e3 세 개, COMPANY 개체 집합에 c1, c2 두 개가 보인다.
"""

# 개체 타입: 이름 -> 속성 목록 (4-2 p.11)
ENTITY_TYPES = {
    "EMPLOYEE": ("Name", "Age", "Salary"),
    "COMPANY": ("Name", "Headquarters", "President"),
}

# 개체 집합: 그림에 보이는 개체들 (4-2 p.11). 80k, 30K는 슬라이드 표기를 수로 옮겼다.
ENTITY_SETS = {
    "EMPLOYEE": {
        "e1": ("John Smith", 55, 80_000),
        "e2": ("Fred Brown", 40, 30_000),
        "e3": ("Judy Clark", 25, 20_000),
    },
    "COMPANY": {
        "c1": ("Sunco Oil", "Houston", "John Smith"),
        "c2": ("Fast Computer", "Dallas", "Bob King"),
    },
}


def fits(entity_type, entity):
    """개체가 그 타입의 속성마다 값을 하나씩 갖는가."""
    return len(entity) == len(ENTITY_TYPES[entity_type])


def main():
    for name, entities in ENTITY_SETS.items():
        assert all(fits(name, e) for e in entities.values())
    assert len(ENTITY_SETS["EMPLOYEE"]) == 3 and len(ENTITY_SETS["COMPANY"]) == 2
    print("[OK] p.11: EMPLOYEE 3개, COMPANY 2개, 모든 개체가 타입의 속성 수와 맞는다")

    # 개체를 넣어도 타입은 그대로다
    type_before = dict(ENTITY_TYPES)
    set_before = dict(ENTITY_SETS["EMPLOYEE"])
    ENTITY_SETS["EMPLOYEE"]["e4"] = ("Kim Lee", 31, 45_000)  # 문서의 예(보충)
    assert ENTITY_TYPES == type_before
    assert ENTITY_SETS["EMPLOYEE"] != set_before and len(ENTITY_SETS["EMPLOYEE"]) == 4
    del ENTITY_SETS["EMPLOYEE"]["e2"]
    assert ENTITY_TYPES == type_before and len(ENTITY_SETS["EMPLOYEE"]) == 3
    print("[OK] 개체를 넣고 빼면 개체 집합만 바뀌고 개체 타입은 그대로다")

    # 속성 수가 다른 것은 그 타입의 개체가 아니다
    assert not fits("EMPLOYEE", ("Sunco Oil", "Houston"))
    print("[OK] 속성이 맞지 않으면 그 타입의 개체가 아니다")

    # p.8: e1의 Name과 c1의 President가 같은 값 'John Smith'다
    assert ENTITY_SETS["EMPLOYEE"]["e1"][0] == ENTITY_SETS["COMPANY"]["c1"][2] == "John Smith"
    print("[OK] p.8: e1의 Name과 c1의 President가 같은 값이다")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
