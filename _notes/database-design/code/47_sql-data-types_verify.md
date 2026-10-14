---
layout: "note"
title: "47_sql-data-types_verify.py"
display_title: "47_sql-data-types_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "47"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/sql-data-types/"
parent_title: "SQL 자료형"
description: "데이터베이스 설계 · SQL 자료형 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/47_sql-data-types_verify/"
---
{% raw %}
[SQL 자료형](/Hongs_Blog/studies/database-design/sql-data-types/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 47.SQL 자료형 검증 (표준 라이브러리 sqlite3만 쓴다. 실행: python3 47_sql-data-types_verify.py)
# 확인하는 것: SQLite는 자료형의 이름만 받고 길이나 꼴을 검사하지 않는다.
#   VARCHAR(3)에 8글자, INT에 글자, DATE에 없는 날짜, BOOLEAN에 2가 그대로 들어간다.
# 자료형이 값을 실제로 막는 모습(길이 초과, 자릿수 초과, 없는 날짜 거부)은 PostgreSQL에서 확인했다
# (47_sql-data-types_verify.sql). 이 파일은 "SQLite로는 그 검사를 볼 수 없다"는 것만 보인다.
import sqlite3


def rows(c, sql, args=()):
    return c.execute(sql, args).fetchall()


if __name__ == "__main__":
    c = sqlite3.connect(':memory:', isolation_level=None)
    # 슬라이드 10 p.13~14의 자료형 이름을 모두 받는다. 없는 이름(WHATEVER)도 받는다.
    c.execute("""CREATE TABLE T (v VARCHAR(3), ch CHAR(9), n INT, f FLOAT, d DECIMAL(3,1), b BOOLEAN,
                                 bt BIT(4), vb VARBIT(4), dt DATE, tm TIME, ts TIMESTAMP, w WHATEVER)""")
    assert len(rows(c, 'PRAGMA table_info(T)')) == 12

    c.execute("INSERT INTO T (v) VALUES ('12345678')")                 # VARCHAR(3)에 8글자
    assert rows(c, "SELECT v, LENGTH(v) FROM T WHERE v IS NOT NULL") == [('12345678', 8)]

    c.execute("INSERT INTO T (ch) VALUES ('123')")                     # CHAR(9)인데 빈칸을 채우지 않는다
    assert rows(c, "SELECT ch, LENGTH(ch) FROM T WHERE ch IS NOT NULL") == [('123', 3)]

    c.execute("INSERT INTO T (n) VALUES ('abc')")                      # INT에 글자
    assert rows(c, "SELECT n, TYPEOF(n) FROM T WHERE n IS NOT NULL") == [('abc', 'text')]

    c.execute("INSERT INTO T (d) VALUES (7.55), (100.0), (12345.678)")  # DECIMAL(3,1)인데 반올림도 안 하고 큰 수도 받는다
    assert rows(c, "SELECT d FROM T WHERE d IS NOT NULL") == [(7.55,), (100.0,), (12345.678,)]

    c.execute("INSERT INTO T (dt) VALUES ('2024-02-30')")              # 없는 날짜
    assert rows(c, "SELECT dt, TYPEOF(dt) FROM T WHERE dt IS NOT NULL") == [('2024-02-30', 'text')]

    c.execute("INSERT INTO T (b) VALUES (TRUE), (FALSE), (2)")         # TRUE, FALSE는 1, 0이고 2도 들어간다
    assert rows(c, "SELECT b FROM T WHERE b IS NOT NULL") == [(1,), (0,), (2,)]

    # 슬라이드의 예: TIMESTAMP '2024-11-07 13:15:47.648302'는 10 + 1 + 8 + 1 + 6 = 26자리
    stamp = '2024-11-07 13:15:47.648302'
    date, time = stamp.split(' ')
    assert len(date) == 10 and len(time.split('.')[0]) == 8 and len(time.split('.')[1]) == 6 and len(stamp) == 26

    print('ALL CHECKS PASSED')
```
{% endraw %}
