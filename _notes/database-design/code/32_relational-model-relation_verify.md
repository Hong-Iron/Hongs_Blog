---
layout: "note"
title: "32_relational-model-relation_verify.py"
display_title: "32_relational-model-relation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "32"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/relational-model-relation/"
parent_title: "릴레이션과 도메인·속성·튜플"
description: "데이터베이스 설계 · 릴레이션과 도메인·속성·튜플 검증 코드"
permalink: "/studies/database-design/code/32_relational-model-relation_verify/"
---
{% raw %}
[릴레이션과 도메인·속성·튜플](/Hongs_Blog/studies/database-design/relational-model-relation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""릴레이션과 도메인·속성·튜플 검증.

문서: 32.릴레이션과 도메인·속성·튜플 (예시, 정의, 카드 C2·C3)
출처: 데이터베이스 설계 6-2 슬라이드 p.6~11 (STUDENT 표, 도메인, r(R) ⊆ dom(A1) × … × dom(An))
실행: python3 32_relational-model-relation_verify.py   (표준 라이브러리만 쓴다)
주장:
  1. STUDENT 릴레이션(p.6)은 속성 7개(차수 7), 튜플 5개다.
  2. 모든 값은 자기 속성의 도메인에 들어 있거나 NULL이다 (p.8의 도메인 설명을 검사 함수로 옮김).
  3. 상태 r(R)은 도메인들의 곱집합의 부분집합이다. 작은 도메인으로 곱집합의 크기와 가능한 상태 수를 센다.
     dom(A) = {a, b}, dom(B) = {1, 2, 3}이면 가능한 튜플 6개, 가능한 상태 2^6 = 64개 (카드 C3).
  4. 상태는 집합이다. 같은 튜플을 또 넣어도, 순서를 바꿔도 같은 상태다.
  5. COMPANY 여섯 릴레이션의 차수는 10, 4, 2, 4, 3, 5다 (6-2 p.20, 카드 C2).
"""
import itertools
import re

NULL = None

STUDENT_ATTRS = ("Name", "Ssn", "Home_phone", "Address", "Office_phone", "Age", "Gpa")
STUDENT = [
    ("Benjamin Bayer", "305-61-2435", "(817)373-1616", "2918 Bluebonnet Lane", NULL, 19, 3.21),
    ("Chung-cha Kim", "381-62-1245", "(817)375-4409", "125 Kirby Road", NULL, 18, 2.89),
    ("Dick Davidson", "422-11-2320", NULL, "3452 Elgin Road", "(817)749-1253", 25, 3.53),
    ("Rohan Panchal", "489-22-1100", "(817)376-9821", "265 Lark Lane", "(817)749-6492", 28, 3.93),
    ("Barbara Benson", "533-69-1238", "(817)839-8461", "7384 Fontana Lane", NULL, 19, 3.25),
]

# p.8의 도메인 설명을 "이 값이 도메인에 드는가"를 답하는 함수로 옮긴 것
DOM = {
    "Name": lambda v: isinstance(v, str) and len(v) > 0,                        # Names: 사람 이름인 문자열
    "Ssn": lambda v: re.fullmatch(r"\d{3}-\d{2}-\d{4}", v) is not None,          # Social_security_numbers: 아홉 자리
    "Home_phone": lambda v: re.fullmatch(r"\(\d{3}\)\d{3}-\d{4}", v) is not None,  # Usa_phone_numbers: (ddd)ddd-dddd
    "Address": lambda v: isinstance(v, str) and len(v) > 0,
    "Office_phone": lambda v: re.fullmatch(r"\(\d{3}\)\d{3}-\d{4}", v) is not None,
    "Age": lambda v: isinstance(v, int) and 0 < v < 150,
    "Gpa": lambda v: isinstance(v, float) and 0 <= v <= 4,                       # Grade_point_averages: 0과 4 사이 실수
}

COMPANY_SCHEMA = {
    "EMPLOYEE": ("Fname", "Minit", "Lname", "Ssn", "Bdate", "Address", "Sex", "Salary", "Super_ssn", "Dno"),
    "DEPARTMENT": ("Dname", "Dnumber", "Mgr_ssn", "Mgr_start_date"),
    "DEPT_LOCATIONS": ("Dnumber", "Dlocation"),
    "PROJECT": ("Pname", "Pnumber", "Plocation", "Dnum"),
    "WORKS_ON": ("Essn", "Pno", "Hours"),
    "DEPENDENT": ("Essn", "Dependent_name", "Sex", "Bdate", "Relationship"),
}


def main():
    # 1. 차수와 튜플 수
    assert len(STUDENT_ATTRS) == 7 and len(STUDENT) == 5
    assert all(len(t) == 7 for t in STUDENT)
    print("[OK] STUDENT: 차수 7, 튜플 5개")

    # 2. 모든 값이 도메인 안이거나 NULL
    nulls = 0
    for t in STUDENT:
        for a, v in zip(STUDENT_ATTRS, t):
            if v is NULL:
                nulls += 1
            else:
                assert DOM[a](v), (a, v)
    assert nulls == 4                      # Home_phone 1개, Office_phone 3개
    assert not DOM["Home_phone"]("817-373-1616") and not DOM["Gpa"](4.5)
    print("[OK] 값 35개 가운데 31개는 도메인 안, 4개는 NULL. 꼴이 다른 전화번호와 4.5는 도메인 밖")

    # 3. 곱집합과 상태
    dom_a, dom_b = {"a", "b"}, {1, 2, 3}
    product = set(itertools.product(dom_a, dom_b))
    assert len(product) == 6
    state = {("a", 1), ("b", 3)}
    assert state <= product                               # 상태는 곱집합의 부분집합
    assert not {("a", 4)} <= product                      # 도메인 밖 값이 든 튜플은 못 들어간다
    n_states = sum(1 for k in range(len(product) + 1) for _ in itertools.combinations(product, k))
    assert n_states == 2 ** 6 == 64
    print("[OK] dom(A) × dom(B): 튜플 6개, 가능한 상태 64개")

    # 4. 상태는 집합
    r = set(STUDENT)
    assert len(r | {STUDENT[0]}) == 5                     # 같은 튜플을 또 넣어도 5개
    assert set(reversed(STUDENT)) == r                    # 순서를 바꿔도 같은 집합
    print("[OK] 같은 튜플을 또 넣거나 순서를 바꿔도 같은 상태")

    # 5. COMPANY의 차수
    degrees = [len(v) for v in COMPANY_SCHEMA.values()]
    assert degrees == [10, 4, 2, 4, 3, 5] and sum(degrees) == 28
    print("[OK] COMPANY 여섯 릴레이션의 차수:", degrees)
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
