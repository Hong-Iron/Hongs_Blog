---
layout: "note"
title: "37_foreign-key-practice_p1.py"
display_title: "37_foreign-key-practice_p1.py"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "37"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/foreign-key-practice/"
parent_title: "외래 키 찾기 연습"
description: "데이터베이스 설계 · 외래 키 찾기 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/37_foreign-key-practice_p1/"
---
{% raw %}
[외래 키 찾기 연습](/Hongs_Blog/studies/database-design/foreign-key-practice/) 문서의 문제 1 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""외래 키 찾기 연습 문제 1 (출장 데이터베이스) 검증.

문서: 37.외래 키 찾기 연습 p1
출처: 데이터베이스 설계 6-2 슬라이드 p.26 (문제), 7 풀이 슬라이드 p.1 (답)
실행: python3 37_foreign-key-practice_p1.py   (표준 라이브러리 sqlite3만 쓴다)
스키마: SALESPERSON(Ssn, Name, Start_year, Dept_no), TRIP(Ssn, From_city, To_city, Departure_date, Return_date, Trip_id),
        EXPENSE(Trip_id, Account#, Amount). 기본 키는 Ssn / Trip_id / (Trip_id, Account#).
확인하는 것:
  1. "다른 릴레이션의 기본 키 속성을 모두 가진 릴레이션"을 기계적으로 찾으면 후보가 2개 나온다:
     TRIP.Ssn → SALESPERSON, EXPENSE.Trip_id → TRIP. 슬라이드의 답과 같다.
  2. Dept_no는 가리킬 부서 릴레이션이 이 스키마에 없어서 외래 키가 아니다.
  3. 답대로 표를 만들면 없는 판매원의 출장, 없는 출장의 경비는 들어가지 않는다. (행은 지어낸 것)
  4. 한 출장의 경비를 계정 둘에 나눠 적을 수 있다(기본 키가 (Trip_id, Account#)이라서).
"""
import sqlite3

SCHEMA = {   # 이름: (속성, 기본 키)
    "SALESPERSON": (["Ssn", "Name", "Start_year", "Dept_no"], ["Ssn"]),
    "TRIP": (["Ssn", "From_city", "To_city", "Departure_date", "Return_date", "Trip_id"], ["Trip_id"]),
    "EXPENSE": (["Trip_id", "Account#", "Amount"], ["Trip_id", "Account#"]),
}
ANSWER = {("TRIP", ("Ssn",), "SALESPERSON"), ("EXPENSE", ("Trip_id",), "TRIP")}       # 풀이 슬라이드 p.1


def candidates(schema):
    """R1이 R2(≠ R1)의 기본 키 속성을 모두 가지면 (R1, 그 속성들, R2)를 후보로 낸다. 이름만 본 것이라 뜻으로 걸러야 한다."""
    out = set()
    for r1, (attrs, _) in schema.items():
        for r2, (_, pk) in schema.items():
            if r1 != r2 and set(pk) <= set(attrs):
                out.add((r1, tuple(pk), r2))
    return out


def main():
    cand = candidates(SCHEMA)
    assert cand == ANSWER and len(cand) == 2
    print("[OK] 후보 2개가 슬라이드의 답과 같다:", sorted(cand))

    pk_attrs = {a for _, pk in SCHEMA.values() for a in pk}
    assert "Dept_no" not in pk_attrs
    print("[OK] Dept_no를 기본 키로 가진 릴레이션이 없다. 외래 키가 아니다")

    c = sqlite3.connect(":memory:")
    c.execute("PRAGMA foreign_keys=ON")
    c.executescript("""
      CREATE TABLE SALESPERSON (Ssn CHAR(9) NOT NULL, Name VARCHAR(20), Start_year INT, Dept_no INT, PRIMARY KEY (Ssn));
      CREATE TABLE TRIP (Ssn CHAR(9) NOT NULL, From_city VARCHAR(20), To_city VARCHAR(20), Departure_date DATE,
        Return_date DATE, Trip_id INT NOT NULL, PRIMARY KEY (Trip_id), FOREIGN KEY (Ssn) REFERENCES SALESPERSON(Ssn));
      CREATE TABLE EXPENSE (Trip_id INT NOT NULL, "Account#" INT NOT NULL, Amount DECIMAL(8,2),
        PRIMARY KEY (Trip_id, "Account#"), FOREIGN KEY (Trip_id) REFERENCES TRIP(Trip_id));
      INSERT INTO SALESPERSON VALUES ('111111111', 'Kim', 2020, 3);
      INSERT INTO TRIP VALUES ('111111111', 'Seoul', 'Busan', '2024-10-01', '2024-10-03', 1);
      INSERT INTO EXPENSE VALUES (1, 100, 50000), (1, 200, 30000);""")
    for sql in ("INSERT INTO TRIP VALUES ('999999999', 'Seoul', 'Daegu', '2024-10-05', '2024-10-06', 2)",
                'INSERT INTO EXPENSE VALUES (7, 100, 10000)'):
        try:
            c.execute(sql)
            raise AssertionError(sql)
        except sqlite3.IntegrityError as e:
            assert "FOREIGN KEY constraint failed" in str(e)
    print("[OK] 없는 판매원의 출장, 없는 출장의 경비는 거부된다")

    assert c.execute('SELECT COUNT(*), COUNT(DISTINCT "Account#") FROM EXPENSE WHERE Trip_id = 1').fetchone() == (2, 2)
    try:
        c.execute("INSERT INTO EXPENSE VALUES (1, 100, 999)")
        raise AssertionError("같은 (출장, 계정)이 두 번 들어갔다")
    except sqlite3.IntegrityError as e:
        assert "UNIQUE constraint failed" in str(e)
    print("[OK] 출장 1의 경비가 계정 100, 200에 나뉘어 들어간다. 같은 (출장, 계정)은 한 번만")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
