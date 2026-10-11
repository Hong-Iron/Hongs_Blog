---
layout: "note"
title: "33_relation-characteristics_verify.py"
display_title: "33_relation-characteristics_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "33"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/relation-characteristics/"
parent_title: "릴레이션의 특성"
description: "데이터베이스 설계 · 릴레이션의 특성 검증 코드"
permalink: "/studies/database-design/code/33_relation-characteristics_verify/"
---
{% raw %}
[릴레이션의 특성](/Hongs_Blog/studies/database-design/relation-characteristics/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""릴레이션의 특성 검증.

문서: 33.릴레이션의 특성 (예시, 정의, 카드 C1~C3)
출처: 데이터베이스 설계 6-2 슬라이드 p.12~14, 7 슬라이드 p.5
실행: python3 33_relation-characteristics_verify.py   (표준 라이브러리만 쓴다)
주장:
  1. 튜플의 순서를 바꾼 두 표(p.12의 Tuple ordering 1, 2)는 같은 릴레이션이다. 목록으로 보면 다르다.
  2. 튜플을 (속성, 값) 짝의 모음으로 보면, 짝의 순서를 바꾼 두 튜플(p.13)은 같다.
  3. 값은 더 쪼갤 수 없어야 한다. 여러 값인 부서 위치는 행을 나눠 DEPT_LOCATIONS에 5행으로 들어간다.
     5번 부서는 위치가 3곳이라 3행이다. 여러 부분으로 된 이름은 Fname, Minit, Lname 세 속성이 된다.
  4. STUDENT 표의 NULL은 4개다(Home_phone 1, Office_phone 3).
     SQL에서 NULL = NULL은 참이 아니다. "= NULL"로는 0행, "IS NULL"로 3행이 나온다.
  5. 키를 정하지 않은 SQL 표는 같은 행을 두 번 받는다. 릴레이션(집합)과 다른 점이다.
"""
import sqlite3

ATTRS = ("Name", "Ssn", "Home_phone", "Address", "Office_phone", "Age", "Gpa")
BAYER = ("Benjamin Bayer", "305-61-2435", "(817)373-1616", "2918 Bluebonnet Lane", None, 19, 3.21)
KIM = ("Chung-cha Kim", "381-62-1245", "(817)375-4409", "125 Kirby Road", None, 18, 2.89)
DAVIDSON = ("Dick Davidson", "422-11-2320", None, "3452 Elgin Road", "(817)749-1253", 25, 3.53)
PANCHAL = ("Rohan Panchal", "489-22-1100", "(817)376-9821", "265 Lark Lane", "(817)749-6492", 28, 3.93)
BENSON = ("Barbara Benson", "533-69-1238", "(817)839-8461", "7384 Fontana Lane", None, 19, 3.25)

ORDERING1 = [BAYER, KIM, DAVIDSON, PANCHAL, BENSON]       # p.12 왼쪽 표
ORDERING2 = [DAVIDSON, BENSON, PANCHAL, KIM, BAYER]       # p.12 오른쪽 표

DEPT_LOCATIONS = [(1, "Houston"), (4, "Stafford"), (5, "Bellaire"), (5, "Sugarland"), (5, "Houston")]


def main():
    # 1. 튜플 순서
    assert ORDERING1 != ORDERING2 and set(ORDERING1) == set(ORDERING2)
    print("[OK] p.12: 두 순서는 목록으로는 다르고 집합으로는 같다")

    # 2. 속성 순서 (p.13의 두 줄)
    t1 = [("Name", "Dick Davidson"), ("Ssn", "422-11-2320"), ("Home_phone", None), ("Address", "3452 Elgin Road"),
          ("Office_phone", "(817)749-1253"), ("Age", 25), ("Gpa", 3.53)]
    t2 = [("Address", "3452 Elgin Road"), ("Name", "Dick Davidson"), ("Ssn", "422-11-2320"), ("Age", 25),
          ("Office_phone", "(817)749-1253"), ("Gpa", 3.53), ("Home_phone", None)]
    assert t1 != t2 and dict(t1) == dict(t2) == dict(zip(ATTRS, DAVIDSON))
    # 짝을 잃으면 다른 튜플이 된다: 값만 순서를 바꾸면 Age와 Gpa가 뒤바뀐다
    swapped = dict(zip(ATTRS, DAVIDSON[:5] + (3.53, 25)))
    assert swapped != dict(t1)
    print("[OK] p.13: (속성, 값) 짝의 순서를 바꿔도 같은 튜플. 짝이 어긋나면 다른 튜플")

    # 3. 원자값
    locs = {}
    for dno, loc in DEPT_LOCATIONS:
        locs.setdefault(dno, set()).add(loc)
    assert locs == {1: {"Houston"}, 4: {"Stafford"}, 5: {"Bellaire", "Sugarland", "Houston"}}
    assert len(DEPT_LOCATIONS) == 5 and len(locs[5]) == 3
    assert all(isinstance(v, (int, str)) for row in DEPT_LOCATIONS for v in row)   # 칸마다 값 하나
    print("[OK] 부서 위치: 부서 3개의 위치 5곳이 5행. 5번 부서는 3행")

    # 4. NULL
    nulls = {a: sum(1 for t in ORDERING1 if t[i] is None) for i, a in enumerate(ATTRS)}
    assert nulls["Home_phone"] == 1 and nulls["Office_phone"] == 3 and sum(nulls.values()) == 4
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE STUDENT (Name, Ssn, Home_phone, Address, Office_phone, Age, Gpa)")
    con.executemany("INSERT INTO STUDENT VALUES (?,?,?,?,?,?,?)", ORDERING1)
    assert con.execute("SELECT NULL = NULL").fetchone()[0] is None          # 참도 거짓도 아니다
    assert con.execute("SELECT COUNT(*) FROM STUDENT WHERE Office_phone = NULL").fetchone()[0] == 0
    assert con.execute("SELECT COUNT(*) FROM STUDENT WHERE Office_phone IS NULL").fetchone()[0] == 3
    print("[OK] NULL 4개. NULL = NULL은 참이 아니고, = NULL은 0행, IS NULL은 3행")

    # 5. 키가 없는 SQL 표는 같은 행을 두 번 받는다
    con.execute("INSERT INTO STUDENT VALUES (?,?,?,?,?,?,?)", BENSON)
    assert con.execute("SELECT COUNT(*) FROM STUDENT").fetchone()[0] == 6
    assert con.execute("SELECT COUNT(*) FROM (SELECT DISTINCT * FROM STUDENT)").fetchone()[0] == 5
    print("[OK] 키가 없는 SQL 표: 같은 행을 또 넣으면 6행, 집합으로 보면 5개")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
