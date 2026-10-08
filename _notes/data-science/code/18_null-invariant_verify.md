---
layout: "note"
title: "18_null-invariant_verify.py"
display_title: "18_null-invariant_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "18"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/null-invariant-measures/"
parent_title: "널 불변 측정"
description: "데이터 과학 · 널 불변 측정 검증 코드"
permalink: "/studies/data-science/code/18_null-invariant_verify/"
---
{% raw %}
[널 불변 측정](/Hongs_Blog/studies/data-science/null-invariant-measures/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""널 불변 측정 검증.

문서: 18.널 불변 측정 (예시, 정의, 카드)
출처: 데이터 과학 3회 슬라이드 3-2 p.15~19
표의 열: BC(둘 다), ¬BC(C만), B¬C(B만), ¬B¬C(둘 다 없음, 널 거래).
주장:
  1. 우유(B)·커피(C) 예: lift(B, C) = 8.44, 카이제곱 = 670, 기대 빈도 11.85, lift(B, ¬C) = 0.92.
  2. D1~D6의 카이제곱, lift, Kulc, IR이 슬라이드 표와 같다.
  3. D1과 D2는 널 거래 수만 다르다(100,000 vs 100). Kulc 0.91, IR 0은 같고 lift와 카이제곱은 크게 다르다.
  4. 널 거래를 아무리 늘려도 Kulc와 IR은 그대로다.
"""


def measures(bc, nbc, bnc, nbnc):
    n = bc + nbc + bnc + nbnc
    sb, sc = bc + bnc, bc + nbc
    lift = (bc / n) / ((sb / n) * (sc / n))
    t = [[bc, nbc], [bnc, nbnc]]
    rows = [sum(r) for r in t]; cols = [sum(c) for c in zip(*t)]
    chi = sum((t[i][j] - rows[i] * cols[j] / n) ** 2 / (rows[i] * cols[j] / n) for i in range(2) for j in range(2))
    kulc = 0.5 * (bc / sb + bc / sc)
    ir = abs(sb - sc) / (sb + sc - bc)
    return chi, lift, kulc, ir


TABLE = {
    "D1": ((10000, 1000, 1000, 100000), (90557, 9.26, 0.91, 0)),
    "D2": ((10000, 1000, 1000, 100), (0, 1, 0.91, 0)),
    "D3": ((100, 1000, 1000, 100000), (670, 8.44, 0.09, 0)),
    "D4": ((1000, 1000, 1000, 100000), (24740, 25.75, 0.5, 0)),
    "D5": ((1000, 100, 10000, 100000), (8173, 9.18, 0.5, 0.89)),
    "D6": ((1000, 10, 100000, 100000), (965, 1.97, 0.5, 0.99)),
}


def main():
    n = 102100
    assert round((100 / n) / ((1100 / n) ** 2), 2) == 8.44
    assert round(1100 * 1100 / n, 2) == 11.85
    assert round((1000 / n) / ((1100 / n) * (101000 / n)), 2) == 0.92
    chi, lift, _, _ = measures(100, 1000, 1000, 100000)
    assert round(chi) == 670
    print("[OK] p.15: lift 8.44, 기대 11.85, 카이제곱 670, lift(B, ¬C) 0.92")

    for name, (counts, (c, l, k, i)) in TABLE.items():
        chi, lift, kulc, ir = measures(*counts)
        assert abs(chi - c) <= max(1, 0.001 * c), (name, chi)
        assert round(lift, 2) == l or abs(lift - l) < 0.01, (name, lift)
        assert round(kulc, 2) == k and round(ir, 2) == i, (name, kulc, ir)
        print(f"     {name}: 카이제곱 {chi:,.0f}, lift {lift:.2f}, Kulc {kulc:.2f}, IR {ir:.2f}")
    print("[OK] p.16~19 표 D1~D6")

    for extra in (0, 10 ** 3, 10 ** 6, 10 ** 9):
        _, lift, kulc, ir = measures(100, 1000, 1000, extra)
        assert round(kulc, 4) == 0.0909 and ir == 0
    print("[OK] 널 거래를 0~10^9로 늘려도 Kulc 0.0909, IR 0 그대로")

    # 카드 C2: BC 500, ¬BC 500, B¬C 500, 널 거래 x에 따라 lift
    lifts = [measures(500, 500, 500, x)[1] for x in (0, 500, 100000)]
    assert round(lifts[1], 3) == 1.0 and lifts[0] < 1 < lifts[2]
    assert round(measures(500, 500, 500, 0)[2], 2) == 0.5
    print(f"[OK] 카드 C2: 널 거래 0, 500, 100000 -> lift {', '.join(f'{v:.2f}' for v in lifts)}, Kulc 0.5")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
