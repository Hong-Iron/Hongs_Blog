---
layout: "note"
title: "21_key-attribute_verify.py"
display_title: "21_key-attribute_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "21"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/key-attribute/"
parent_title: "키 속성"
description: "데이터베이스 설계 · 키 속성 검증 코드"
permalink: "/studies/database-design/code/21_key-attribute_verify/"
---
{% raw %}
[키 속성](/Hongs_Blog/studies/database-design/key-attribute/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""키 속성 검증.

문서: 21.키 속성 (예시로 보기, 카드 C1~C3)
출처: 데이터베이스 설계 4주차 슬라이드 4-2 p.12~13 (5주차 p.6에 같은 그림)
주장:
  1. CAR 개체 집합(p.12)에서 번호판 Number만으로는 차가 가려지지 않는다('ABC 123'이 두 대).
     State만으로도 안 된다(TEXAS가 두 대). 둘을 묶은 Registration(Number, State)은 세 대가 다 다르다.
  2. Vehicle_id도 세 대가 다 다르다. 그래서 CAR에는 키가 둘 있다(Registration, Vehicle_id).
  3. Year도 세 대가 우연히 다 다르지만(2004, 2005, 2002) 키가 아니다.
     같은 해에 만든 차가 한 대 들어오면 깨진다. 지금 자료에서 안 겹치는 것만으로는 키라고 못 한다.
  4. "키가 둘"과 "둘을 묶은 키 하나"는 다르다: DEPARTMENT의 Name, Number는 각각 혼자서 키이고(p.13),
     CAR의 Number, State는 묶어야만 키다.
"""
from itertools import combinations

ATTRS = ("Number", "State", "Vehicle_id", "Make", "Model", "Year")
# 4-2 p.12의 개체 집합. Color(다치 속성)는 키 후보가 아니라 뺐다.
CARS = [
    ("ABC 123", "TEXAS", "TK629", "Ford Mustang", "convertible", 2004),
    ("ABC 123", "NEW YORK", "WP9872", "Nissan Maxima", "4-door", 2005),
    ("VSY 720", "TEXAS", "TD729", "Chrysler LeBaron", "4-door", 2002),
]


def unique(rows, names, attrs=ATTRS):
    """rows에서 names 속성들의 값 묶음이 개체마다 다른가."""
    idx = [attrs.index(n) for n in names]
    seen = [tuple(r[i] for i in idx) for r in rows]
    return len(set(seen)) == len(seen)


def main():
    assert not unique(CARS, ["Number"]) and not unique(CARS, ["State"])
    assert unique(CARS, ["Number", "State"])
    print("[OK] Number만, State만으로는 겹친다. (Number, State)는 세 대가 다 다르다")

    assert unique(CARS, ["Vehicle_id"])
    print("[OK] Vehicle_id는 세 대가 다 다르다 -> CAR의 키는 Registration과 Vehicle_id 둘")

    # 지금 자료에서 혼자 안 겹치는 속성을 모두 센다
    singles = [a for a in ATTRS if unique(CARS, [a])]
    assert singles == ["Vehicle_id", "Make", "Year"]
    print("[OK] 이 세 대에서 혼자 안 겹치는 속성:", singles)

    # Year는 우연히 안 겹칠 뿐이다: 2004년식 차를 한 대 더 넣으면 깨진다
    more = CARS + [("KLM 555", "OHIO", "ZZ101", "Honda Civic", "4-door", 2004)]
    assert not unique(more, ["Year"])
    assert unique(more, ["Vehicle_id"]) and unique(more, ["Number", "State"])
    print("[OK] 2004년식 한 대를 넣으면 Year는 겹치고, 두 키는 그대로 안 겹친다")

    # 묶어야만 키인 것과 각각 키인 것
    pairs = [c for c in combinations(["Number", "State"], 1) if unique(CARS, list(c))]
    assert pairs == []
    departments = [("Research", 5), ("Administration", 4), ("Headquarters", 1)]  # 6-2 p.21
    assert unique(departments, ["Name"], ("Name", "Number")) and unique(departments, ["Number"], ("Name", "Number"))
    print("[OK] CAR의 Number, State는 묶어야만 다르고, DEPARTMENT의 Name, Number는 각각 다르다")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
