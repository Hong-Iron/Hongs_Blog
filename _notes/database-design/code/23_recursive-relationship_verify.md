---
layout: "note"
title: "23_recursive-relationship_verify.py"
display_title: "23_recursive-relationship_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "23"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/recursive-relationship/"
parent_title: "역할 이름과 재귀 관계"
description: "데이터베이스 설계 · 역할 이름과 재귀 관계 검증 코드"
permalink: "/studies/database-design/code/23_recursive-relationship_verify/"
---
{% raw %}
[역할 이름과 재귀 관계](/Hongs_Blog/studies/database-design/recursive-relationship/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""역할 이름과 재귀 관계 검증.

문서: 23.역할 이름과 재귀 관계 (예시로 보기, 카드 C1·C3)
출처: 데이터베이스 설계 4주차 슬라이드 4-2 p.22 (5주차 p.10에 같은 그림),
      COMPANY ER 5주차 p.34, COMPANY 상태 6-2 p.21
주장:
  1. SUPERVISION 그림(p.22)의 인스턴스 6개를 (상사, 부하)로 읽으면
     r1 = (e5, e1), r2 = (e1, e2), r3 = (e1, e3), r4 = (e5, e4), r5 = (e4, e6), r6 = (e4, e7)이다.
  2. 부하 역할로는 누구나 많아야 한 번 나온다(상사는 많아야 한 명). 상사 역할로는 여러 번 나올 수 있다.
     그래서 상사 쪽이 1, 부하 쪽이 N인 1:N이다.
  3. e5는 부하로 나오지 않고(상사가 없다), e2, e3, e6, e7은 상사로 나오지 않는다. 양쪽 다 부분 참여다.
  4. 역할을 바꾼 (e1, e5)는 그림에 없다. 순서가 뜻을 정한다.
  5. COMPANY 상태(6-2 p.21)에서 Super_ssn이 NULL이 아닌 직원은 7명이라 SUPERVISION 인스턴스는 7개이고,
     모양이 그림과 같다(맨 위 한 명, 그 아래 둘, 그 아래 다섯).
"""
from collections import Counter

# 4-2 p.22: 선에 적힌 1은 상사 역할, 2는 부하 역할. (상사, 부하)
SUPERVISION = {
    "r1": ("e5", "e1"), "r2": ("e1", "e2"), "r3": ("e1", "e3"),
    "r4": ("e5", "e4"), "r5": ("e4", "e6"), "r6": ("e4", "e7"),
}
EMPLOYEE = [f"e{i}" for i in range(1, 8)]

# 6-2 p.21: (Lname, Ssn, Super_ssn)
EMP = [("Smith", "123456789", "333445555"), ("Wong", "333445555", "888665555"),
       ("Zelaya", "999887777", "987654321"), ("Wallace", "987654321", "888665555"),
       ("Narayan", "666884444", "333445555"), ("English", "453453453", "333445555"),
       ("Jabbar", "987987987", "987654321"), ("Borg", "888665555", None)]


def subordinates(pairs, boss):
    return sorted(s for b, s in pairs if b == boss)


def boss_of(pairs, emp):
    found = [b for b, s in pairs if s == emp]
    assert len(found) <= 1
    return found[0] if found else None


def main():
    pairs = set(SUPERVISION.values())
    assert len(pairs) == 6
    as_boss = Counter(b for b, _ in pairs)
    as_sub = Counter(s for _, s in pairs)
    assert max(as_sub.values()) == 1 and max(as_boss.values()) == 2
    print("[OK] 부하 역할로는 많아야 한 번, 상사 역할로는 두 번까지 나온다 -> 1:N")

    assert subordinates(pairs, "e1") == ["e2", "e3"]
    assert subordinates(pairs, "e4") == ["e6", "e7"]
    assert subordinates(pairs, "e5") == ["e1", "e4"]
    assert boss_of(pairs, "e4") == "e5" and boss_of(pairs, "e1") == "e5" and boss_of(pairs, "e5") is None
    print("[OK] e1의 부하 e2, e3 / e4의 부하 e6, e7 / e5의 부하 e1, e4 / e5는 상사가 없다")

    not_boss = sorted(e for e in EMPLOYEE if e not in as_boss)
    not_sub = sorted(e for e in EMPLOYEE if e not in as_sub)
    assert not_boss == ["e2", "e3", "e6", "e7"] and not_sub == ["e5"]
    print("[OK] 상사로 안 나오는 직원 4명, 부하로 안 나오는 직원 1명 -> 양쪽 다 부분 참여")

    assert ("e5", "e1") in pairs and ("e1", "e5") not in pairs
    print("[OK] (e5, e1)은 있고 역할을 바꾼 (e1, e5)는 없다")

    # e2에서 위로 올라가는 길: e2 -> e1 -> e5
    chain, cur = ["e2"], "e2"
    while boss_of(pairs, cur):
        cur = boss_of(pairs, cur)
        chain.append(cur)
    assert chain == ["e2", "e1", "e5"]
    print("[OK] e2의 상사의 상사는 e5")

    # COMPANY 상태
    ssn_to_name = {ssn: name for name, ssn, _ in EMP}
    state = {(ssn_to_name[sup], name) for name, _, sup in EMP if sup is not None}
    assert len(state) == 7
    assert subordinates(state, "Borg") == ["Wallace", "Wong"]
    assert subordinates(state, "Wong") == ["English", "Narayan", "Smith"]
    assert subordinates(state, "Wallace") == ["Jabbar", "Zelaya"]
    assert boss_of(state, "Borg") is None
    print("[OK] 6-2 p.21: 인스턴스 7개, Borg 아래 Wong·Wallace, 그 아래 다섯 명")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
