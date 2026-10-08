---
layout: "note"
title: "01_point-to-point-link_verify.py"
display_title: "01_point-to-point-link_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/point-to-point-link/"
parent_title: "점대점 링크"
description: "컴퓨터 통신 · 점대점 링크 검증 코드"
permalink: "/studies/computer-communication/code/01_point-to-point-link_verify/"
---
{% raw %}
[점대점 링크](/Hongs_Blog/studies/computer-communication/point-to-point-link/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""점대점 완전 연결(full mesh)의 링크 수·포트 수 검증.

문서: 01.점대점 링크 (카드 C2), 02.다중 접근 링크 (카드 C3), 03.스위칭 네트워크 (카드 C2)
주장 1: 노드 n개를 모든 쌍끼리 점대점으로 이으면 링크는 n(n-1)/2개다.
주장 2: 이때 노드마다 포트(인터페이스)가 n-1개 필요하다.
주장 3: n >= 2이면 n^2/4 <= n(n-1)/2 <= n^2/2 이다 (즉 n^2에 비례해 늘어난다).
방법: n = 0..20에서 노드 쌍을 직접 나열해 센 값과 공식을 비교한다.
"""
from itertools import combinations


def count_links_bruteforce(n: int) -> int:
    return sum(1 for _ in combinations(range(n), 2))


def count_links_formula(n: int) -> int:
    return n * (n - 1) // 2


def port_counts(n: int) -> list[int]:
    ports = [0] * n
    for u, v in combinations(range(n), 2):
        ports[u] += 1
        ports[v] += 1
    return ports


def main() -> None:
    for n in range(0, 21):
        links = count_links_bruteforce(n)
        assert links == count_links_formula(n), n
        ports = port_counts(n)
        assert all(p == n - 1 for p in ports), n
        assert sum(ports) == 2 * links, n  # 링크마다 끝점이 2개
        if n >= 2:
            assert n * n <= 4 * links <= 2 * n * n, n  # n^2/4 <= m <= n^2/2
    print("[OK] n = 0..20: 직접 센 값 = n(n-1)/2, 포트 = n-1, n^2/4 <= m <= n^2/2")

    for n in (0, 1, 2, 4, 5, 8, 10, 100):
        print(f"  n={n:>3}: 링크 {count_links_formula(n):>5}, 노드당 포트 {max(n - 1, 0)}")

    # 01.점대점 링크 예시: 방 4개 -> 선 끝 12개 -> 선 6개, 방 100개 -> 4,950개
    assert sum(port_counts(4)) == 12 and count_links_formula(4) == 6
    assert count_links_formula(100) == 4950
    # 카드 point-to-point-link#C2: n = 8
    assert count_links_formula(8) == 28 and port_counts(8)[0] == 7
    # 카드 multiple-access-link#C3: n = 10 완전 연결 vs 버스
    assert count_links_formula(10) == 45
    # 카드 switched-network#C2: 호스트 6개를 스위치 2개에 3개씩 붙이고 스위치끼리 1개로 연결
    switched_links = 6 + 1
    assert (switched_links, count_links_formula(6)) == (7, 15)
    print(f"  스위치 2개 구성 링크 {switched_links} vs 완전 연결 {count_links_formula(6)}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
