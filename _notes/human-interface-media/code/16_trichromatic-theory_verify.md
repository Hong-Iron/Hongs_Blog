---
layout: "note"
title: "16_trichromatic-theory_verify.py"
display_title: "16_trichromatic-theory_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "16"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/trichromatic-theory/"
parent_title: "삼색 이론"
description: "휴먼 인터페이스 미디어 · 삼색 이론 검증 코드"
permalink: "/studies/human-interface-media/code/16_trichromatic-theory_verify/"
---
{% raw %}
[삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""삼색 이론 검증.

문서: 16.삼색 이론 (예시로 보기, 정의, 보장하지 않는 것, 카드 C2·C3·C4)
추상체 모형 (설명용 가정): 민감도를 봉우리 1인 가우스 곡선으로 둔다.
  봉우리는 슬라이드 값 S 445 nm, M 535 nm, L 575 nm. 폭(표준편차)은 S 30 nm, M·L 45 nm로 가정한다.
  세기 i인 단색광 lambda에 대한 추상체 k의 반응 = i * sigma_k(lambda). 여러 빛이 섞이면 반응을 더한다.
주장:
  1. 단일 변수 원리: 추상체 한 종류만으로는 파장과 세기를 구별할 수 없다.
     500 nm 빛을 약 1.35배 세게 비추면 535 nm 빛과 M 반응이 같다.
  2. 원색 둘(530 nm, 620 nm)로는 580 nm 빛의 M·L 반응을 정확히 맞춰도 S 반응이 조금 어긋난다(약 0.007).
     세 반응을 모두 맞추려면 원색이 셋 필요하다.
  3. 원색 셋(450, 530, 620 nm)으로 480~510 nm의 청록 단색광을 맞추려면 빨강의 양이 음수가 된다.
     실제로 섞을 수 없다는 뜻이다. 이 모형에서 400~700 nm를 5 nm 간격으로 보면 대부분의 단색광이
     어느 한 원색을 음수로 요구한다.
  4. 추상체가 S·L 둘뿐이면(M이 없는 제2색맹), 535 nm 초록 빛을 450 nm와 620 nm의 양수 혼합으로
     똑같이 맞출 수 있다. 세 추상체를 가진 사람에게는 M 반응이 약 1.0 대 0.19로 크게 달라 구별된다.
"""
import math

PEAK = {"S": 445.0, "M": 535.0, "L": 575.0}
WIDTH = {"S": 30.0, "M": 45.0, "L": 45.0}


def sens(cone: str, lam: float) -> float:
    return math.exp(-((lam - PEAK[cone]) ** 2) / (2 * WIDTH[cone] ** 2))


def response(spectrum: dict[float, float], cones: str = "SML") -> tuple[float, ...]:
    return tuple(sum(i * sens(k, lam) for lam, i in spectrum.items()) for k in cones)


def solve(m: list[list[float]], b: list[float]) -> list[float]:
    """가우스 소거법으로 m x = b를 푼다 (정방 행렬)."""
    n = len(b)
    a = [row[:] + [b[i]] for i, row in enumerate(m)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(a[r][c]))
        a[c], a[p] = a[p], a[c]
        for r in range(n):
            if r != c:
                f = a[r][c] / a[c][c]
                a[r] = [x - f * y for x, y in zip(a[r], a[c])]
    return [a[i][n] / a[i][i] for i in range(n)]


def main() -> None:
    # 주장 1
    k = sens("M", 535) / sens("M", 500)
    assert abs(response({500: k}, "M")[0] - response({535: 1.0}, "M")[0]) < 1e-12
    assert abs(k - 1.353) < 0.001
    print(f"[OK] 단일 변수: 500 nm x {k:.3f} 와 535 nm x 1 의 M 반응이 같다")

    # 주장 2
    target = response({580: 1.0})
    a, b = solve([[sens("M", 530), sens("M", 620)], [sens("L", 530), sens("L", 620)]], [target[1], target[2]])
    mix = response({530: a, 620: b})
    assert a > 0 and b > 0
    assert abs(mix[1] - target[1]) < 1e-12 and abs(mix[2] - target[2]) < 1e-12
    gap = mix[0] - target[0]
    assert 0.005 < gap < 0.01
    print(f"[OK] 530 x {a:.3f} + 620 x {b:.3f}: M·L 일치, S 차이 {gap:.4f}")

    # 주장 3
    prim = [450.0, 530.0, 620.0]
    mat = [[sens(c, p) for p in prim] for c in "SML"]
    for lam in (480, 490, 500, 510):
        w = solve(mat, list(response({lam: 1.0})))
        assert w[2] < -0.2, (lam, w)
        print(f"[OK] {lam} nm = 450 x {w[0]:.3f} + 530 x {w[1]:.3f} + 620 x {w[2]:.3f} (빨강 음수)")
    grid = range(400, 701, 5)
    neg = sum(1 for lam in grid if min(solve(mat, list(response({lam: 1.0})))) < -1e-9)
    assert neg > len(grid) // 2
    print(f"[OK] 400~700 nm 5 nm 간격 {len(grid)}개 중 {neg}개가 음수 원색을 요구")

    # 주장 4
    tgt = response({535: 1.0}, "SL")
    w = solve([[sens("S", 450), sens("S", 620)], [sens("L", 450), sens("L", 620)]], list(tgt))
    assert min(w) > 0
    mix2 = response({450: w[0], 620: w[1]}, "SL")
    assert all(abs(x - y) < 1e-12 for x, y in zip(mix2, tgt))
    m_target = response({535: 1.0}, "M")[0]
    m_mix = response({450: w[0], 620: w[1]}, "M")[0]
    assert abs(m_target - 1.0) < 1e-12 and 0.15 < m_mix < 0.25
    print(f"[OK] S·L만: 535 nm = 450 x {w[0]:.4f} + 620 x {w[1]:.3f}. M 반응은 {m_target:.2f} 대 {m_mix:.2f}")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
