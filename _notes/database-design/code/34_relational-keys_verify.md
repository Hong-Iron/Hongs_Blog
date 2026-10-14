---
layout: "note"
title: "34_relational-keys_verify.py"
display_title: "34_relational-keys_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "34"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/relational-keys/"
parent_title: "슈퍼키·후보 키·기본 키"
description: "데이터베이스 설계 · 슈퍼키·후보 키·기본 키 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/34_relational-keys_verify/"
---
{% raw %}
[슈퍼키·후보 키·기본 키](/Hongs_Blog/studies/database-design/relational-keys/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""슈퍼키·후보 키·기본 키 검증.

문서: 34.슈퍼키·후보 키·기본 키 (예시, 정의, 오해, 카드 C1~C5)
출처: 데이터베이스 설계 6-2 슬라이드 p.17~19 (STUDENT, CAR), 6-2 p.21 (WORKS_ON 상태)
실행: python3 34_relational-keys_verify.py   (표준 라이브러리만 쓴다)
하는 일: 표의 상태 하나에서 "값이 겹치지 않는 속성 묶음"을 모두 세고(전수), 그중 더 줄일 수 없는 것을 고른다.
  주의: 상태 하나로는 "키가 아니다"만 확정할 수 있다(겹치는 두 튜플이 반례다).
        "키다"는 스키마의 뜻으로 정하는 것이라 상태 하나로는 확정하지 못한다.
주장:
  1. STUDENT(속성 7개)의 속성 묶음은 127개다. 이 상태에서 값이 안 겹치는 묶음은 124개,
     그중 더 줄일 수 없는 것은 {Name}, {Ssn}, {Home_phone}, {Address}, {Gpa} 다섯 개다.
     뜻으로 정한 후보 키는 {Ssn} 하나이고, 슈퍼키는 Ssn을 품은 묶음 2^6 = 64개다.
  2. {Age}, {Office_phone}, {Office_phone, Age}는 이 상태에서 값이 겹친다. 그래서 어떤 경우에도 키가 아니다.
  3. CAR(p.19)의 상태에서 혼자 값이 안 겹치는 속성은 License_number, Engine_serial_number, Model 셋이다.
     Model은 같은 차종 한 대를 더 넣으면 겹친다. 슬라이드가 말하는 후보 키는 앞의 둘이다.
     후보 키가 둘일 때 슈퍼키는 둘 중 하나라도 품은 묶음 2^5 − 2^3 = 24개다.
  4. WORKS_ON의 {Essn, Pno}는 16행에서 안 겹치고, Essn만으로도 Pno만으로도 겹친다(최소성).
  5. 카드 C4: R(A, B, C)의 상태 {(1, x, p), (1, y, p), (2, x, q)}에서 값이 안 겹치는 묶음은 {A, B}, {B, C}, {A, B, C}.
  6. 안 겹치는 묶음에 속성을 더해도 안 겹친다. 그래서 "속성 하나를 빼면 겹친다"와 "어떤 진부분집합도 겹친다"는
     같은 묶음을 고른다(최소성의 두 정의).
  7. 최소가 아닌 {Ssn, Name}을 기본 키로 선언하면 Ssn이 같은 두 튜플이 들어간다. {Ssn}으로 선언하면 거부된다.
"""
import sqlite3
from itertools import combinations

STUDENT_ATTRS = ("Name", "Ssn", "Home_phone", "Address", "Office_phone", "Age", "Gpa")
STUDENT = [
    ("Benjamin Bayer", "305-61-2435", "(817)373-1616", "2918 Bluebonnet Lane", None, 19, 3.21),
    ("Chung-cha Kim", "381-62-1245", "(817)375-4409", "125 Kirby Road", None, 18, 2.89),
    ("Dick Davidson", "422-11-2320", None, "3452 Elgin Road", "(817)749-1253", 25, 3.53),
    ("Rohan Panchal", "489-22-1100", "(817)376-9821", "265 Lark Lane", "(817)749-6492", 28, 3.93),
    ("Barbara Benson", "533-69-1238", "(817)839-8461", "7384 Fontana Lane", None, 19, 3.25),
]
CAR_ATTRS = ("License_number", "Engine_serial_number", "Make", "Model", "Year")
CAR = [
    ("Texas ABC-739", "A69352", "Ford", "Mustang", "02"),
    ("Florida TVP-347", "B43696", "Oldsmobile", "Cutlass", "05"),
    ("New York MPO-22", "X83554", "Oldsmobile", "Delta", "01"),
    ("California 432-TFY", "C43742", "Mercedes", "190-D", "99"),
    ("California RSK-629", "Y82935", "Toyota", "Camry", "04"),
    ("Texas RSK-629", "U028365", "Jaguar", "XJS", "04"),
]
WORKS_ON_ATTRS = ("Essn", "Pno", "Hours")
WORKS_ON = [("123456789", 1, 32.5), ("123456789", 2, 7.5), ("666884444", 3, 40.0), ("453453453", 1, 20.0),
            ("453453453", 2, 20.0), ("333445555", 2, 10.0), ("333445555", 3, 10.0), ("333445555", 10, 10.0),
            ("333445555", 20, 10.0), ("999887777", 30, 30.0), ("999887777", 10, 10.0), ("987987987", 10, 35.0),
            ("987987987", 30, 5.0), ("987654321", 30, 20.0), ("987654321", 20, 15.0), ("888665555", 20, None)]


def unique_in_state(attrs, rows, subset):
    """이 상태에서 subset의 값이 튜플마다 다른가. (NULL도 한 값으로 쳐서 비교한다.)"""
    idx = [attrs.index(a) for a in subset]
    seen = {tuple(r[i] for i in idx) for r in rows}
    return len(seen) == len(rows)


def all_subsets(attrs):
    return [frozenset(c) for k in range(1, len(attrs) + 1) for c in combinations(attrs, k)]


def unique_sets(attrs, rows):
    return [s for s in all_subsets(attrs) if unique_in_state(attrs, rows, sorted(s))]


def minimal(sets):
    return [s for s in sets if not any(t < s for t in sets)]


def minimal_by_one_removal(sets):
    """속성 하나를 뺀 묶음이 모두 목록에 없는 것(슬라이드 p.18의 정의)."""
    have = set(sets)
    return [s for s in sets if not any((s - {a}) in have for a in s if len(s) > 1)]


def superkeys_from_candidates(attrs, candidate_keys):
    """후보 키가 정해졌을 때의 슈퍼키: 후보 키 하나라도 품은 묶음."""
    return [s for s in all_subsets(attrs) if any(k <= s for k in candidate_keys)]


def main():
    # 1. STUDENT
    subs = all_subsets(STUDENT_ATTRS)
    assert len(subs) == 2 ** 7 - 1 == 127
    uniq = unique_sets(STUDENT_ATTRS, STUDENT)
    assert len(uniq) == 124
    mins = minimal(uniq)
    assert set(mins) == {frozenset({a}) for a in ("Name", "Ssn", "Home_phone", "Address", "Gpa")}
    sk = superkeys_from_candidates(STUDENT_ATTRS, [frozenset({"Ssn"})])
    assert len(sk) == 2 ** 6 == 64
    assert frozenset(STUDENT_ATTRS) in sk and frozenset({"Ssn", "Name", "Age"}) in sk   # p.17, p.18의 예
    assert minimal(sk) == [frozenset({"Ssn"})]
    print("[OK] STUDENT: 묶음 127개, 이 상태에서 안 겹치는 것 124개, 그중 최소 5개. Ssn을 품은 슈퍼키 64개")

    # 2. 상태가 반례를 주는 묶음
    for bad in (["Age"], ["Office_phone"], ["Office_phone", "Age"]):
        assert not unique_in_state(STUDENT_ATTRS, STUDENT, bad)
    assert len(subs) - len(uniq) == 3
    print("[OK] {Age}, {Office_phone}, {Office_phone, Age}는 값이 겹쳐 키가 아니다 (Bayer와 Benson)")

    # 3. CAR
    singles = [a for a in CAR_ATTRS if unique_in_state(CAR_ATTRS, CAR, [a])]
    assert singles == ["License_number", "Engine_serial_number", "Model"]
    more = CAR + [("Ohio XYZ-111", "Z11111", "Ford", "Mustang", "03")]      # 머스탱 한 대를 더 등록
    assert not unique_in_state(CAR_ATTRS, more, ["Model"])
    assert unique_in_state(CAR_ATTRS, more, ["License_number"]) and unique_in_state(CAR_ATTRS, more, ["Engine_serial_number"])
    cks = [frozenset({"License_number"}), frozenset({"Engine_serial_number"})]
    sk = superkeys_from_candidates(CAR_ATTRS, cks)
    assert len(sk) == 2 ** 5 - 2 ** 3 == 24 and set(minimal(sk)) == set(cks)
    assert not unique_in_state(CAR_ATTRS, CAR, ["Make"]) and not unique_in_state(CAR_ATTRS, CAR, ["Year"])
    print("[OK] CAR: 이 상태에서 혼자 안 겹치는 속성 3개(Model 포함). 머스탱을 더 넣으면 Model이 겹친다. 슈퍼키 24개")

    # 4. WORKS_ON
    assert unique_in_state(WORKS_ON_ATTRS, WORKS_ON, ["Essn", "Pno"])
    assert not unique_in_state(WORKS_ON_ATTRS, WORKS_ON, ["Essn"]) and not unique_in_state(WORKS_ON_ATTRS, WORKS_ON, ["Pno"])
    print("[OK] WORKS_ON: {Essn, Pno}는 16행에서 안 겹치고 하나씩은 겹친다")

    # 5. 카드 C4
    attrs, rows = ("A", "B", "C"), [(1, "x", "p"), (1, "y", "p"), (2, "x", "q")]
    uniq = {tuple(sorted(s)) for s in unique_sets(attrs, rows)}
    assert uniq == {("A", "B"), ("B", "C"), ("A", "B", "C")}
    assert {tuple(sorted(s)) for s in minimal(unique_sets(attrs, rows))} == {("A", "B"), ("B", "C")}
    print("[OK] 카드 C4: 안 겹치는 묶음 {A,B}, {B,C}, {A,B,C}. 최소는 {A,B}, {B,C}")

    # 6. 최소성의 두 정의
    for a, r in ((STUDENT_ATTRS, STUDENT), (CAR_ATTRS, CAR), (WORKS_ON_ATTRS, WORKS_ON), (attrs, rows)):
        u = unique_sets(a, r)
        have = set(u)
        assert all(t in have for s in u for t in all_subsets(a) if s < t)          # 속성을 더해도 안 겹친다
        assert set(minimal(u)) == set(minimal_by_one_removal(u))
    print("[OK] 속성을 더해도 안 겹치고, 최소성의 두 정의가 같은 묶음을 고른다 (네 상태)")

    # 7. 최소가 아닌 묶음을 기본 키로 선언하면
    c = sqlite3.connect(":memory:")
    c.execute("CREATE TABLE LOOSE (Ssn CHAR(11) NOT NULL, Name VARCHAR(30) NOT NULL, PRIMARY KEY (Ssn, Name))")
    c.execute("CREATE TABLE TIGHT (Ssn CHAR(11) NOT NULL, Name VARCHAR(30) NOT NULL, PRIMARY KEY (Ssn))")
    two = [("305-61-2435", "Benjamin Bayer"), ("305-61-2435", "Ben Bayer")]
    c.executemany("INSERT INTO LOOSE VALUES (?, ?)", two)
    assert c.execute("SELECT COUNT(*) FROM LOOSE WHERE Ssn = '305-61-2435'").fetchone()[0] == 2
    c.execute("INSERT INTO TIGHT VALUES (?, ?)", two[0])
    try:
        c.execute("INSERT INTO TIGHT VALUES (?, ?)", two[1])
        raise AssertionError("같은 Ssn이 두 번 들어갔다")
    except sqlite3.IntegrityError as e:
        assert "UNIQUE constraint failed: TIGHT.Ssn" in str(e)
    print("[OK] 기본 키가 {Ssn, Name}이면 같은 Ssn이 두 번 들어간다. {Ssn}이면 거부된다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
