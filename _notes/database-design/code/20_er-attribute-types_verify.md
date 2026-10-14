---
layout: "note"
title: "20_er-attribute-types_verify.py"
display_title: "20_er-attribute-types_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "20"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/er-attribute-types/"
parent_title: "속성의 종류"
description: "데이터베이스 설계 · 속성의 종류 검증 코드"
sitemap: false
permalink: "/studies/database-design/code/20_er-attribute-types_verify/"
---
{% raw %}
[속성의 종류](/Hongs_Blog/studies/database-design/er-attribute-types/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""속성의 종류 검증.

문서: 20.속성의 종류 (예시로 보기, 정의, 카드 C1·C3)
출처: 데이터베이스 설계 4주차 슬라이드 4-2 p.8~10, p.12, p.14 (5주차 p.4에 같은 내용),
      COMPANY 상태 6-2 p.21 (직원의 생일과 부서 번호)
주장:
  1. Address 계층(p.9)에서 더 못 쪼개는 속성은 6개다: Number, Street, Apartment_number, City, State, Zip.
  2. 글 표기에서 괄호는 복합 속성, 중괄호는 다치 속성이다.
     CAR(p.12): 복합 1개(Registration), 다치 1개(Color), 더 못 쪼개는 속성 7개.
     EMPLOYEE 처음 설계(p.14): Works_on은 복합이면서 다치다.
  3. CAR 세 대의 Color 값은 2개, 1개, 2개다(p.12). 다치 속성은 값이 여럿일 수 있다.
  4. 나이는 생일에서 계산된다. 같은 생일이라도 날짜가 지나면 값이 바뀐다(유도 속성으로 두는 까닭).
  5. 부서의 직원 수(Number_of_employees)는 소속을 세면 나온다: 5번 4명, 4번 3명, 1번 1명.
"""
from datetime import date


def parse(text):
    """'A(B, C), D, {E}' 꼴을 [(이름, 다치인가, 성분 목록)]으로 바꾼다. 성분 목록이 비면 단순 속성."""
    pos = 0

    def skip():
        nonlocal pos
        while pos < len(text) and text[pos] in " ,":
            pos += 1

    def attr():
        nonlocal pos
        skip()
        multi = text[pos] == "{"
        if multi:
            pos += 1
        start = pos
        while pos < len(text) and (text[pos].isalnum() or text[pos] == "_"):
            pos += 1
        name = text[start:pos]
        parts = []
        if pos < len(text) and text[pos] == "(":
            pos += 1
            parts = attrs(")")
            pos += 1
        if multi:
            assert text[pos] == "}"
            pos += 1
        return (name, multi, parts)

    def attrs(closer):
        out = []
        skip()
        while pos < len(text) and text[pos] != closer:
            out.append(attr())
            skip()
        return out

    return attrs("\0")


def leaves(tree):
    """더 못 쪼개는(단순) 속성 이름들."""
    out = []
    for name, _, parts in tree:
        out += leaves(parts) if parts else [name]
    return out


def composites(tree):
    out = []
    for name, _, parts in tree:
        if parts:
            out += [name] + composites(parts)
    return out


def multivalued(tree):
    out = []
    for name, multi, parts in tree:
        out += ([name] if multi else []) + multivalued(parts)
    return out


def age(birth, today):
    return today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))


def main():
    address = parse("Address(Street_address(Number, Street, Apartment_number), City, State, Zip)")
    assert leaves(address) == ["Number", "Street", "Apartment_number", "City", "State", "Zip"]
    assert composites(address) == ["Address", "Street_address"]
    print("[OK] p.9: Address 계층의 단순 속성 6개, 복합 속성 2개(Address, Street_address)")

    car = parse("Registration(Number, State), Vehicle_id, Make, Model, Year, {Color}")
    assert composites(car) == ["Registration"] and multivalued(car) == ["Color"]
    assert len(leaves(car)) == 7
    print("[OK] p.12: CAR의 복합 1개, 다치 1개, 단순 속성 7개")

    emp = parse("Name(Fname, Minit, Lname), Ssn, Sex, Address, Salary, Birth_date, "
                "Department, Supervisor, {Works_on(Project, Hours)}")
    assert composites(emp) == ["Name", "Works_on"] and multivalued(emp) == ["Works_on"]
    print("[OK] p.14: Works_on은 복합이면서 다치다")

    # p.12의 CAR 세 대의 Color
    colors = [{"red", "black"}, {"blue"}, {"white", "blue"}]
    assert [len(c) for c in colors] == [2, 1, 2]
    print("[OK] p.12: Color 값의 수 2, 1, 2")

    # p.8의 e1: Address = 2311 Kirby, Houston, Texas 77001 을 성분으로 나눠 다시 붙인다
    e1 = {"Number": "2311", "Street": "Kirby", "Apartment_number": None,
          "City": "Houston", "State": "Texas", "Zip": "77001"}
    street_address = " ".join(v for v in (e1["Number"], e1["Street"], e1["Apartment_number"]) if v)
    assert f'{street_address}, {e1["City"]}, {e1["State"]} {e1["Zip"]}' == "2311 Kirby, Houston, Texas 77001"
    print("[OK] p.8: 성분을 붙이면 원래 주소가 된다")

    # 유도 속성: 나이. John Smith의 생일 1965-01-09 (6-2 p.21)
    birth = date(1965, 1, 9)
    assert age(birth, date(2024, 10, 4)) == 59 and age(birth, date(2025, 1, 9)) == 60
    assert age(birth, date(2025, 1, 8)) == 59
    print("[OK] 생일 1965-01-09: 2024-10-04에 59세, 2025-01-09에 60세")

    # 유도 속성: 부서의 직원 수. 직원 8명의 부서 번호 (6-2 p.21)
    dno = [5, 5, 4, 4, 5, 5, 4, 1]
    count = {d: dno.count(d) for d in sorted(set(dno), reverse=True)}
    assert count == {5: 4, 4: 3, 1: 1}
    print("[OK] 6-2 p.21: 부서별 직원 수 5번 4명, 4번 3명, 1번 1명")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
