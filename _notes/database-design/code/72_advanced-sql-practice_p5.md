---
layout: "note"
title: "72_advanced-sql-practice_p5.py"
display_title: "72_advanced-sql-practice_p5.py"
kind: "code"
kind_label: "코드 · 문제 5 풀이"
num: "72"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/advanced-sql-practice/"
parent_title: "JOIN·GROUP BY 종합 연습"
description: "데이터베이스 설계 · JOIN·GROUP BY 종합 연습 문제 5 풀이 코드"
permalink: "/studies/database-design/code/72_advanced-sql-practice_p5/"
---
{% raw %}
[JOIN·GROUP BY 종합 연습](/Hongs_Blog/studies/database-design/advanced-sql-practice/) 문서의 문제 5 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""JOIN·GROUP BY 종합 연습의 연습 4~5 (달리기 모임, GROUP BY) 확인. SQLite.

문서: 72.JOIN·GROUP BY 종합 연습
출처: 14주차 슬라이드 14-Adavanced-SQL-practice p.7~9(문제), 풀이 덱 p.7~8
슬라이드에는 표의 열 설명만 있고 행이 없다. 아래 행은 답이 갈리도록 이 문서에서 만든 것이다.
확인하는 것:
  연습 4. 슬라이드 풀이의 "COUNT(*) AS R.runners_number"는 구문 오류다(열 별칭에 표 이름을 못 붙인다).
          고치면 (5, 4) 한 줄. 3명인 10 km 묶음은 "3보다 많다"가 아니라서 빠진다.
  연습 5. 슬라이드 풀이의 "COUNT(runner.id)"는 없는 열이다(표의 별칭이 R이다). COUNT(R.id)로 고치면
          Seoul Marathon 3, Han River 10K 2, Jeju Trail Run 0, Busan Night Run 1.
          COUNT(*)로 세면 아무도 안 나간 대회가 1로 나온다. 내부 조인이면 그 대회가 아예 빠진다.
  변형.   이름이 같은 대회가 둘이면 GROUP BY E.name은 둘을 한 줄로 합친다. GROUP BY E.id, E.name은 따로 센다.
실행: python3 72_advanced-sql-practice_p5.py
"""
import sqlite3


DDL = """
CREATE TABLE RUNNER (id INT PRIMARY KEY, name VARCHAR(20), main_distance INT, age INT, is_female BOOLEAN);
CREATE TABLE EVENT (id INT PRIMARY KEY, name VARCHAR(30), start_date DATE, city VARCHAR(20));
CREATE TABLE RUNNER_EVENT (runner_id INT REFERENCES RUNNER(id), event_id INT REFERENCES EVENT(id),
  PRIMARY KEY (runner_id, event_id));
"""
# main_distance는 km
RUNNER = [(1, "Ara", 5, 24, 1), (2, "Bin", 5, 31, 0), (3, "Chan", 5, 28, 0), (4, "Dana", 5, 35, 1), (5, "Eun", 10, 22, 1),
          (6, "Gun", 10, 40, 0), (7, "Hyun", 10, 29, 0), (8, "Jin", 42, 33, 0), (9, "Kyu", 42, 45, 0)]
EVENT = [(1, "Seoul Marathon", "2024-03-17", "Seoul"), (2, "Han River 10K", "2024-05-05", "Seoul"),
         (3, "Jeju Trail Run", "2024-09-21", "Jeju"), (4, "Busan Night Run", "2024-10-12", "Busan")]
RUNNER_EVENT = [(8, 1), (9, 1), (5, 1), (5, 2), (6, 2), (1, 4)]

# 슬라이드 풀이 그대로 (풀이 덱 p.7, p.8)
EX4_SLIDE = """SELECT R.main_distance, COUNT(*) AS R.runners_number
FROM RUNNER AS R
GROUP BY R.main_distance
HAVING COUNT(*) > 3"""
EX5_SLIDE = """SELECT E.name, COUNT(runner.id) AS runner_count
FROM EVENT AS E
  LEFT JOIN RUNNER_EVENT AS RE ON RE.event_id = E.id
  LEFT JOIN RUNNER AS R ON RE.runner_id = R.id
GROUP BY E.name"""
EX4 = EX4_SLIDE.replace("AS R.runners_number", "AS runners_number")
EX5 = EX5_SLIDE.replace("COUNT(runner.id)", "COUNT(R.id)")
ANSWER5 = [("Busan Night Run", 1), ("Han River 10K", 2), ("Jeju Trail Run", 0), ("Seoul Marathon", 3)]


def make():
    c = sqlite3.connect(":memory:")
    c.execute("PRAGMA foreign_keys=ON")
    c.executescript(DDL)
    c.executemany("INSERT INTO RUNNER VALUES (?,?,?,?,?)", RUNNER)
    c.executemany("INSERT INTO EVENT VALUES (?,?,?,?)", EVENT)
    c.executemany("INSERT INTO RUNNER_EVENT VALUES (?,?)", RUNNER_EVENT)
    c.commit()
    return c


def q(c, sql):
    return c.execute(sql).fetchall()


def fails(c, sql, part):
    try:
        c.execute(sql)
    except sqlite3.Error as e:
        assert part in str(e), str(e)
        return str(e)
    raise AssertionError("오류가 나야 하는데 실행됐다")


def main():
    c = make()

    # 연습 4
    print("[OK] 연습 4 슬라이드 풀이 그대로:", fails(c, EX4_SLIDE, "syntax error"))
    assert q(c, "SELECT main_distance, COUNT(*) FROM RUNNER GROUP BY main_distance ORDER BY 1") == [(5, 4), (10, 3), (42, 2)]
    assert q(c, EX4) == [(5, 4)]
    assert [d[0] for d in c.execute(EX4).description] == ["main_distance", "runners_number"]
    assert q(c, EX4.replace("> 3", ">= 3")) == [(5, 4), (10, 3)]
    print("[OK] 연습 4 고친 풀이: 묶음은 (5, 4), (10, 3), (42, 2)이고 HAVING COUNT(*) > 3을 지나는 것은 (5, 4)뿐")
    # HAVING의 조건을 WHERE에 쓰면 오류다 (묶기 전에는 COUNT가 없다)
    fails(c, "SELECT main_distance, COUNT(*) FROM RUNNER WHERE COUNT(*) > 3 GROUP BY main_distance", "misuse of aggregate")
    print("[OK] 연습 4: 같은 조건을 WHERE에 쓰면 오류")

    # 연습 5
    print("[OK] 연습 5 슬라이드 풀이 그대로:", fails(c, EX5_SLIDE, "no such column: runner.id"))
    assert sorted(q(c, EX5)) == ANSWER5
    star = dict(q(c, EX5.replace("COUNT(R.id)", "COUNT(*)")))
    assert star["Jeju Trail Run"] == 1 and star["Seoul Marathon"] == 3
    inner = q(c, EX5.replace("LEFT JOIN", "JOIN"))
    assert len(inner) == 3 and all(r[0] != "Jeju Trail Run" for r in inner)
    # RUNNER까지 잇지 않아도 된다: 참가 표의 runner_id를 세면 같은 답이다
    short = q(c, """SELECT E.name, COUNT(RE.runner_id) AS runner_count
                    FROM EVENT AS E LEFT JOIN RUNNER_EVENT AS RE ON RE.event_id = E.id
                    GROUP BY E.name""")
    assert sorted(short) == ANSWER5
    print("[OK] 연습 5 고친 풀이:", sorted(q(c, EX5)), "/ COUNT(*)면 Jeju가 1, 내부 조인이면 Jeju가 빠진다")

    # 변형: 이름이 같은 대회
    c.execute("INSERT INTO EVENT VALUES (5, 'Seoul Marathon', '2025-03-16', 'Seoul')")
    c.execute("INSERT INTO RUNNER_EVENT VALUES (8, 5)")
    by_name = dict(q(c, EX5))
    assert by_name["Seoul Marathon"] == 4 and len(by_name) == 4
    by_id = q(c, EX5.replace("GROUP BY E.name", "GROUP BY E.id, E.name"))
    assert sorted(by_id) == sorted([("Seoul Marathon", 3), ("Seoul Marathon", 1), ("Han River 10K", 2),
                                    ("Jeju Trail Run", 0), ("Busan Night Run", 1)])
    print("[OK] 변형: 이름이 같은 대회 둘은 GROUP BY E.name이면 4명 한 줄, GROUP BY E.id, E.name이면 3명과 1명 두 줄")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
