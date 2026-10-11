---
layout: "note"
title: "26_relationship-attributes_verify.py"
display_title: "26_relationship-attributes_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "26"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/relationship-attributes/"
parent_title: "관계 타입의 속성"
description: "데이터베이스 설계 · 관계 타입의 속성 검증 코드"
permalink: "/studies/database-design/code/26_relationship-attributes_verify/"
---
{% raw %}
[관계 타입의 속성](/Hongs_Blog/studies/database-design/relationship-attributes/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""관계 타입의 속성 검증.

문서: 26.관계 타입의 속성 (예시로 보기, 옮길 수 있는 곳, 카드 C2·C3)
출처: 데이터베이스 설계 5주차 슬라이드 p.18~20, p.25, p.29 (6주차 6-1 p.6), COMPANY 상태 6-2 p.21
주장:
  1. M:N인 WORKS_ON의 Hours는 직원만으로도, 프로젝트만으로도 정해지지 않는다.
     Smith(123456789)는 1번에 32.5, 2번에 7.5시간이고, 1번 프로젝트에는 32.5(Smith)와 20.0(English)이 있다.
     (직원, 프로젝트) 짝으로는 하나로 정해진다. 그래서 Hours는 어느 개체로도 옮길 수 없다.
  2. 1:1인 MANAGES의 시작 날짜는 부서로도, 관리자(직원)로도 하나로 정해진다. 어느 쪽으로든 옮길 수 있다.
  3. 1:N인 WORKS_FOR에 시작 날짜를 붙이면(문서의 예, 보충) 직원(N쪽)으로는 하나로 정해지고
     부서(1쪽)로는 정해지지 않는다. N쪽으로만 옮길 수 있다.
"""

# 6-2 p.21의 WORKS_ON (Essn, Pno, Hours)
WORKS_ON = [("123456789", 1, 32.5), ("123456789", 2, 7.5), ("666884444", 3, 40.0), ("453453453", 1, 20.0),
            ("453453453", 2, 20.0), ("333445555", 2, 10.0), ("333445555", 3, 10.0), ("333445555", 10, 10.0),
            ("333445555", 20, 10.0), ("999887777", 30, 30.0), ("999887777", 10, 10.0), ("987987987", 10, 35.0),
            ("987987987", 30, 5.0), ("987654321", 30, 20.0), ("987654321", 20, 15.0), ("888665555", 20, None)]
# 6-2 p.21의 DEPARTMENT에서 (Mgr_ssn, Dnumber, Mgr_start_date)
MANAGES = [("333445555", 5, "1988-05-22"), ("987654321", 4, "1995-01-01"), ("888665555", 1, "1981-06-19")]
# 1:N 예(보충): (직원, 부서, 그 부서에서 일하기 시작한 날). 날짜는 지어낸 값이다.
WORKS_FOR = [("e1", "d1", "2020-03-02"), ("e3", "d1", "2021-09-01"), ("e6", "d1", "2023-01-10"),
             ("e2", "d2", "2019-07-15"), ("e4", "d2", "2022-02-01")]


def determined_by(rows, key_cols, value_col):
    """key_cols의 값이 같으면 value_col의 값도 늘 같은가(값이 하나로 정해지는가)."""
    seen = {}
    for r in rows:
        k = tuple(r[c] for c in key_cols)
        if seen.setdefault(k, r[value_col]) != r[value_col]:
            return False
    return True


def main():
    assert not determined_by(WORKS_ON, [0], 2) and not determined_by(WORKS_ON, [1], 2)
    assert determined_by(WORKS_ON, [0, 1], 2)
    smith = sorted(h for e, p, h in WORKS_ON if e == "123456789")
    p1 = sorted(h for e, p, h in WORKS_ON if p == 1)
    assert smith == [7.5, 32.5] and p1 == [20.0, 32.5]
    print("[OK] Hours: 직원만으로도 프로젝트만으로도 안 정해지고, (직원, 프로젝트) 짝으로 정해진다")

    assert determined_by(MANAGES, [0], 2) and determined_by(MANAGES, [1], 2)
    print("[OK] MANAGES(1:1)의 시작 날짜: 부서로도 관리자로도 하나로 정해진다")

    assert determined_by(WORKS_FOR, [0], 2) and not determined_by(WORKS_FOR, [1], 2)
    print("[OK] WORKS_FOR(1:N)의 시작 날짜: 직원(N쪽)으로는 정해지고 부서(1쪽)로는 안 정해진다")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
