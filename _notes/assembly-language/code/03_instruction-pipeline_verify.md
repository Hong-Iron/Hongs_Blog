---
layout: "note"
title: "03_instruction-pipeline_verify.py"
display_title: "03_instruction-pipeline_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "03"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/instruction-pipeline/"
parent_title: "파이프라인과 슈퍼스칼라"
description: "어셈블리어 · 파이프라인과 슈퍼스칼라 검증 코드"
permalink: "/studies/assembly-language/code/03_instruction-pipeline_verify/"
---
{% raw %}
[파이프라인과 슈퍼스칼라](/Hongs_Blog/studies/assembly-language/instruction-pipeline/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""파이프라인과 슈퍼스칼라 검증.

문서: 03.파이프라인과 슈퍼스칼라
출처: 어셈블리어 3주차 3-3 p.2~5 (사이클 표 네 장)
주장 (k = 단계 수, n = 명령어 수):
  1. 파이프라인 없음: n * k 사이클. 슬라이드 p.2: k = 6, n = 2 → 12.
  2. 파이프라인, 모든 단계 1사이클: k + (n - 1). p.3: k = 6, n = 2 → 7.
  3. 파이프라인, 한 단계(S4)가 2사이클: k + (2n - 1). p.4: k = 6, n = 3 → 11.
  4. 슈퍼스칼라, 2사이클짜리 S4를 두 줄(u, v)로: k + n. p.5: k = 6, n = 4 → 10.
  5. 슬라이드 표의 S4·S5·S6 칸이 흉내 결과와 같다.
흉내 규칙: 명령어는 순서대로 들어간다. 다음 단계에 빈 자리가 생길 때까지 지금 단계에 머문다.
"""


def simulate(n, durations, capacity, pipelined=True):
    """각 명령어가 각 단계에 있는 사이클 집합을 돌려준다. occ[i][s] = [사이클...]"""
    k = len(durations)
    occ = [[[] for _ in range(k)] for _ in range(n)]
    busy_until = [[0] * capacity[s] for s in range(k)]   # 단계 s의 각 줄이 비는 시각(그 사이클까지 사용)
    prev_end = 0
    for i in range(n):
        t = (prev_end if not pipelined else 0)           # 이 명령어가 앞 단계를 떠난 시각
        for s in range(k):
            # 순서를 지킨다: 앞 명령어가 이 단계에 들어온 뒤에만 들어올 수 있다
            earliest = t + 1
            if i > 0 and pipelined:
                earliest = max(earliest, occ[i - 1][s][0] + 1)
            lane = min(range(capacity[s]), key=lambda c: busy_until[s][c])
            start = max(earliest, busy_until[s][lane] + 1)
            end = start + durations[s] - 1
            occ[i][s] = list(range(start, end + 1))
            busy_until[s][lane] = end
            t = end
        prev_end = t
    return occ


def total(occ):
    return occ[-1][-1][-1]


def main():
    k = 6
    one = [1] * k
    cap1 = [1] * k

    occ = simulate(2, one, cap1, pipelined=False)
    assert total(occ) == 12
    assert [occ[0][s][0] for s in range(k)] == [1, 2, 3, 4, 5, 6]
    assert [occ[1][s][0] for s in range(k)] == [7, 8, 9, 10, 11, 12]
    print("[OK] p.2 파이프라인 없음: 12 = n*k")

    occ = simulate(2, one, cap1)
    assert total(occ) == 7
    assert [occ[1][s][0] for s in range(k)] == [2, 3, 4, 5, 6, 7]
    print("[OK] p.3 파이프라인: 7 = k + (n-1)")

    slow = [1, 1, 1, 2, 1, 1]
    occ = simulate(3, slow, cap1)
    assert total(occ) == 11
    assert [occ[i][3] for i in range(3)] == [[4, 5], [6, 7], [8, 9]]     # S4 칸
    assert [occ[i][4][-1] for i in range(3)] == [6, 8, 10]               # S5
    assert [occ[i][5][-1] for i in range(3)] == [7, 9, 11]               # S6
    print("[OK] p.4 S4가 2사이클: 11 = k + (2n-1), S4·S5·S6 칸 일치")

    cap2 = [1, 1, 1, 2, 1, 1]
    occ = simulate(4, slow, cap2)
    assert total(occ) == 10
    assert [occ[i][3] for i in range(4)] == [[4, 5], [5, 6], [6, 7], [7, 8]]
    assert [occ[i][4][-1] for i in range(4)] == [6, 7, 8, 9]
    assert [occ[i][5][-1] for i in range(4)] == [7, 8, 9, 10]
    print("[OK] p.5 슈퍼스칼라: 10 = k + n, S4(u, v)·S5·S6 칸 일치")

    for kk in range(4, 9):
        for n in range(1, 30):
            d1, c1 = [1] * kk, [1] * kk
            assert total(simulate(n, d1, c1, pipelined=False)) == n * kk
            assert total(simulate(n, d1, c1)) == kk + (n - 1)
            d2 = d1[:]
            d2[3] = 2
            assert total(simulate(n, d2, c1)) == kk + (2 * n - 1)
            c2 = c1[:]
            c2[3] = 2
            assert total(simulate(n, d2, c2)) == kk + n
    print("[OK] k = 4..8, n = 1..29에서 네 식 모두 흉내 결과와 같다")

    # 문서와 카드의 수
    assert 6 * 100 == 600 and 6 + 99 == 105 and 6 + 199 == 205 and 6 + 100 == 106
    assert total(simulate(5, slow, cap1)) == 15 and total(simulate(5, slow, cap2)) == 11
    assert total(simulate(5, one, cap1)) == 10 and 5 * 6 == 30
    print("[OK] n = 100: 600, 105, 205, 106 / 카드 n = 5: 30, 10, 15, 11")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
