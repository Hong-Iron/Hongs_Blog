---
layout: "note"
title: "72_advanced-sql-practice_p3.py"
display_title: "72_advanced-sql-practice_p3.py"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "72"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/advanced-sql-practice/"
parent_title: "JOIN·GROUP BY 종합 연습"
description: "데이터베이스 설계 · JOIN·GROUP BY 종합 연습 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/database-design/code/72_advanced-sql-practice_p3/"
---
{% raw %}
[JOIN·GROUP BY 종합 연습](/Hongs_Blog/studies/database-design/advanced-sql-practice/) 문서의 문제 3 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""JOIN·GROUP BY 종합 연습의 연습 1~3 (운동복 가게, JOIN) 확인. SQLite.

문서: 72.JOIN·GROUP BY 종합 연습
출처: 14주차 슬라이드 14-Adavanced-SQL-practice p.3~6(문제), 풀이 덱 p.1~6
슬라이드에는 표의 열 설명만 있고 행이 없다. 아래 행은 답이 갈리도록 이 문서에서 만든 것이다.
확인하는 것:
  연습 1. 슬라이드 풀이의 "FROM ORDER AS O"는 구문 오류다(ORDER는 예약어). 표 이름을 큰따옴표로 감싸면
          4행이 나온다: Blue 3행 뒤에 Red 1행.
  연습 2. 같은 까닭으로 오류. 고치면 주문이 없는 손님 2명(Jung, Han). NOT EXISTS, NOT IN으로 써도 같다.
  연습 3. 슬라이드 풀이(내부 조인)는 3행. 하위 범주가 없는 주 범주 Accessories가 빠진다.
          LEFT JOIN이면 (Accessories, NULL)이 더해져 4행이다.
실행: python3 72_advanced-sql-practice_p3.py
"""
import sqlite3


DDL = """
CREATE TABLE COLOR (id INT PRIMARY KEY, name VARCHAR(20), extra_fee INT);
CREATE TABLE CUSTOMER (id INT PRIMARY KEY, first_name VARCHAR(20), last_name VARCHAR(20),
  favorite_color_id INT REFERENCES COLOR(id));
CREATE TABLE CATEGORY (id INT PRIMARY KEY, name VARCHAR(20), parent_id INT REFERENCES CATEGORY(id));
CREATE TABLE CLOTHING (id INT PRIMARY KEY, name VARCHAR(20), size VARCHAR(3), price INT,
  color_id INT REFERENCES COLOR(id), category_id INT REFERENCES CATEGORY(id));
CREATE TABLE "ORDER" (id INT PRIMARY KEY, customer_id INT REFERENCES CUSTOMER(id),
  clothing_id INT REFERENCES CLOTHING(id), items INT, order_date DATE);
"""
COLOR = [(1, "Red", 0), (2, "Blue", 5), (3, "Green", 0), (4, "Black", 10)]
CUSTOMER = [(1, "Mina", "Kim", 1), (2, "Jisu", "Park", 2), (3, "Hana", "Lee", 3), (4, "Doyun", "Choi", 2),
            (5, "Sora", "Jung", 4), (6, "Yuna", "Han", 1)]
CATEGORY = [(1, "Tops", None), (2, "Bottoms", None), (3, "Accessories", None), (4, "T-shirts", 1), (5, "Hoodies", 1),
            (6, "Shorts", 2), (7, "Graphic tees", 4)]
CLOTHING = [(1, "Running Tee", "M", 25, 1, 4), (2, "Trail Hoodie", "L", 60, 2, 5), (3, "Track Shorts", "M", 30, 3, 6),
            (4, "Rain Jacket", "L", 90, 2, 1), (5, "Logo Tee", "S", 20, 4, 7)]
ORDERS = [(1, 1, 1, 1, "2024-11-02"), (2, 1, 2, 1, "2024-11-02"), (3, 2, 2, 2, "2024-11-05"), (4, 2, 4, 1, "2024-11-09"),
          (5, 3, 1, 1, "2024-11-12"), (6, 4, 2, 1, "2024-11-20"), (7, 3, 5, 3, "2024-11-21")]

# 슬라이드 풀이 그대로 (풀이 덱 p.1, p.3, p.6)
EX1_SLIDE = """SELECT CL.name AS clothes, C.name AS color, CUS.last_name, CUS.first_name
FROM ORDER AS O
  JOIN CLOTHING AS CL ON CL.id = O.clothing_id
  JOIN COLOR AS C ON C.id = CL.color_id
  JOIN CUSTOMER AS CUS ON CUS.id = O.customer_id
WHERE CUS.favorite_color_id = CL.color_id
ORDER BY C.name"""
EX2_SLIDE = """SELECT CUS.last_name, CUS.first_name, C.name
FROM CUSTOMER AS CUS
  JOIN COLOR AS C ON C.id = CUS.favorite_color_id
  LEFT JOIN ORDER AS O ON O.customer_id = CUS.id
WHERE O.customer_id IS NULL"""
EX3_SLIDE = """SELECT C1.name AS category, C2.name AS subcategory
FROM CATEGORY AS C1
  JOIN CATEGORY AS C2 ON C2.parent_id = C1.id
WHERE C1.parent_id IS NULL"""
EX1 = EX1_SLIDE.replace("FROM ORDER AS O", 'FROM "ORDER" AS O')
EX2 = EX2_SLIDE.replace("LEFT JOIN ORDER AS O", 'LEFT JOIN "ORDER" AS O')
EX3_LEFT = EX3_SLIDE.replace("  JOIN CATEGORY AS C2", "  LEFT JOIN CATEGORY AS C2")


def make():
    c = sqlite3.connect(":memory:")
    c.execute("PRAGMA foreign_keys=ON")
    c.executescript(DDL)
    c.executemany("INSERT INTO COLOR VALUES (?,?,?)", COLOR)
    c.executemany("INSERT INTO CUSTOMER VALUES (?,?,?,?)", CUSTOMER)
    c.executemany("INSERT INTO CATEGORY VALUES (?,?,?)", CATEGORY)
    c.executemany("INSERT INTO CLOTHING VALUES (?,?,?,?,?,?)", CLOTHING)
    c.executemany('INSERT INTO "ORDER" VALUES (?,?,?,?,?)', ORDERS)
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

    # 연습 1
    print("[OK] 연습 1 슬라이드 풀이 그대로:", fails(c, EX1_SLIDE, "syntax error"))
    r1 = q(c, EX1)
    assert [r[1] for r in r1] == ["Blue", "Blue", "Blue", "Red"]                 # 색 이름 오름차순
    assert sorted(r1) == sorted([("Trail Hoodie", "Blue", "Park", "Jisu"), ("Rain Jacket", "Blue", "Park", "Jisu"),
                                 ("Trail Hoodie", "Blue", "Choi", "Doyun"), ("Running Tee", "Red", "Kim", "Mina")])
    assert [d[0] for d in c.execute(EX1).description] == ["clothes", "color", "last_name", "first_name"]
    print("[OK] 연습 1 고친 풀이: 4행", r1)
    # 주문 7건 가운데 좋아하는 색과 옷 색이 같은 것만 남는다
    assert q(c, 'SELECT COUNT(*) FROM "ORDER"') == [(7,)]
    assert len(q(c, EX1.replace("WHERE CUS.favorite_color_id = CL.color_id\n", ""))) == 7
    # 같은 손님이 같은 옷을 또 사면 같은 줄이 한 번 더 나온다 (DISTINCT를 쓰면 한 줄)
    c.execute("INSERT INTO \"ORDER\" VALUES (8, 2, 2, 1, '2024-12-01')")
    assert len(q(c, EX1)) == 5 and len(q(c, EX1.replace("SELECT CL.name", "SELECT DISTINCT CL.name"))) == 4
    c.execute('DELETE FROM "ORDER" WHERE id = 8')
    print("[OK] 연습 1 변형: 같은 주문이 또 있으면 5행, DISTINCT면 4행")

    # 연습 2
    fails(c, EX2_SLIDE, "syntax error")
    r2 = q(c, EX2)
    assert sorted(r2) == [("Han", "Yuna", "Red"), ("Jung", "Sora", "Black")]
    not_exists = q(c, """SELECT CUS.last_name, CUS.first_name, C.name
        FROM CUSTOMER AS CUS JOIN COLOR AS C ON C.id = CUS.favorite_color_id
        WHERE NOT EXISTS (SELECT * FROM "ORDER" AS O WHERE O.customer_id = CUS.id)""")
    not_in = q(c, """SELECT CUS.last_name, CUS.first_name, C.name
        FROM CUSTOMER AS CUS JOIN COLOR AS C ON C.id = CUS.favorite_color_id
        WHERE CUS.id NOT IN (SELECT O.customer_id FROM "ORDER" AS O)""")
    assert sorted(not_exists) == sorted(not_in) == sorted(r2)
    # LEFT JOIN을 그냥 JOIN으로 쓰면 주문 없는 손님이 조인에서 이미 빠져 0행이 된다
    assert q(c, EX2.replace("LEFT JOIN", "JOIN")) == []
    print("[OK] 연습 2: 주문 없는 손님", sorted(r2), "(NOT EXISTS, NOT IN 판도 같다. 내부 조인이면 0행)")
    # 변형: 좋아하는 색이 없는(NULL) 손님은 COLOR와의 내부 조인에서 빠진다
    c.execute("INSERT INTO CUSTOMER VALUES (7, 'Noah', 'Lim', NULL)")
    assert len(q(c, EX2)) == 2
    both_left = q(c, EX2.replace("  JOIN COLOR AS C", "  LEFT JOIN COLOR AS C"))
    assert sorted(both_left, key=str) == sorted([("Han", "Yuna", "Red"), ("Jung", "Sora", "Black"), ("Lim", "Noah", None)],
                                                key=str)
    c.execute("DELETE FROM CUSTOMER WHERE id = 7")
    print("[OK] 연습 2 변형: 좋아하는 색이 NULL인 손님은 COLOR도 LEFT JOIN으로 이어야 남는다")

    # 연습 3
    r3 = q(c, EX3_SLIDE)
    assert sorted(r3) == [("Bottoms", "Shorts"), ("Tops", "Hoodies"), ("Tops", "T-shirts")]
    r3l = q(c, EX3_LEFT)
    assert sorted(r3l, key=str) == sorted(r3 + [("Accessories", None)], key=str)
    assert ("Tops", "Graphic tees") not in r3l and all(r[0] != "T-shirts" for r in r3l)
    print("[OK] 연습 3: 내부 조인 3행", sorted(r3), "/ LEFT JOIN은 (Accessories, NULL)이 더해져 4행")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
