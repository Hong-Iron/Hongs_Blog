---
layout: "note"
title: "33_luminous-efficiency_verify.py"
display_title: "33_luminous-efficiency_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "33"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/luminous-efficiency/"
parent_title: "비시감 효율 곡선"
description: "휴먼 인터페이스 미디어 · 비시감 효율 곡선 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/33_luminous-efficiency_verify/"
---
{% raw %}
[비시감 효율 곡선](/Hongs_Blog/studies/human-interface-media/luminous-efficiency/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""비시감 효율 곡선 검증.

문서: 33.비시감 효율 곡선 (예시로 보기, 정의, 활용, 카드 C2·C3)
실행: python3 -I 33_luminous-efficiency_verify.py  (표준 라이브러리만 쓴다)

표 값: CIE 1924 명소시 V(lambda)와 CIE 1951 암소시 V'(lambda)를 10 nm 간격으로 옮겨 적었다(555 nm는 V만).
주장:
  1. V는 555 nm에서 1로 가장 크다. V'는 10 nm 표에서 510 nm(0.997)가 가장 크고, 500 nm는 0.982다.
     표준이 정한 V'의 봉우리 507 nm는 두 점 사이에 있다.
  2. 빛 1 W의 광속(lm) = 683 x V(lambda). 555 nm는 683 lm, 650 nm는 약 73 lm, 450 nm는 약 26 lm.
  3. 같은 와트의 450 nm(파랑)와 650 nm(빨강): 밝을 때는 빨강이 약 2.8배 밝고,
     어두울 때(간상체만)는 파랑이 약 670배 밝다(푸르킨예 현상).
  4. 400~700 nm에 고르게 퍼진 흰빛 1 W는 약 240 lm이다. 555 nm 단색광의 약 3분의 1이다.
  5. 반값 폭: V가 0.5를 넘는 구간은 약 510~610 nm, V'는 약 455~550 nm다(10 nm 표를 직선으로 이어 계산).
  6. 카드 C2: 100 lm을 내려면 555 nm 빛은 약 0.146 W, 650 nm 빛은 약 1.37 W가 필요하다.
"""

V = {380: 0.000039, 390: 0.00012, 400: 0.000396, 410: 0.00121, 420: 0.004, 430: 0.0116,
     440: 0.023, 450: 0.038, 460: 0.06, 470: 0.09098, 480: 0.13902, 490: 0.20802,
     500: 0.323, 510: 0.503, 520: 0.71, 530: 0.862, 540: 0.954, 550: 0.99495, 555: 1.0,
     560: 0.995, 570: 0.952, 580: 0.87, 590: 0.757, 600: 0.631, 610: 0.503, 620: 0.381,
     630: 0.265, 640: 0.175, 650: 0.107, 660: 0.061, 670: 0.032, 680: 0.017, 690: 0.00821,
     700: 0.004102}
VS = {380: 0.000589, 390: 0.002209, 400: 0.00929, 410: 0.03484, 420: 0.0966, 430: 0.1998,
      440: 0.3281, 450: 0.455, 460: 0.567, 470: 0.676, 480: 0.793, 490: 0.904, 500: 0.982,
      510: 0.997, 520: 0.935, 530: 0.811, 540: 0.65, 550: 0.481, 560: 0.3288, 570: 0.2076,
      580: 0.1212, 590: 0.0655, 600: 0.03315, 610: 0.01593, 620: 0.00737, 630: 0.003335,
      640: 0.001497, 650: 0.000677, 660: 0.0003129, 670: 0.000148, 680: 0.0000715,
      690: 0.00003533, 700: 0.0000178}
KM = 683.0      # lm/W, 명소시 최대 시감 효능
KM_S = 1700.0   # lm/W, 암소시 최대 시감 효능 (표준값 약 1699)


def half_band(table: dict[int, float]) -> tuple[float, float]:
    """값이 0.5를 넘는 구간의 양 끝을 직선 보간으로 찾는다."""
    pts = sorted(table.items())
    ends = []
    for (l0, v0), (l1, v1) in zip(pts, pts[1:]):
        if (v0 - 0.5) * (v1 - 0.5) < 0:
            ends.append(l0 + (0.5 - v0) * (l1 - l0) / (v1 - v0))
    assert len(ends) == 2, ends
    return ends[0], ends[1]


def main() -> None:
    # 주장 1
    assert max(V, key=V.get) == 555 and V[555] == 1.0
    assert max(VS, key=VS.get) == 510 and VS[510] == 0.997 and VS[500] == 0.982

    # 주장 2
    lm = {lam: KM * V[lam] for lam in (555, 650, 450, 510)}
    assert lm[555] == 683.0
    assert abs(lm[650] - 73.1) < 0.1 and abs(lm[450] - 26.0) < 0.1 and abs(lm[510] - 343.5) < 0.1

    # 주장 3
    day = V[650] / V[450]
    night = VS[450] / VS[650]
    assert abs(day - 2.82) < 0.01, day
    assert abs(night - 672) < 1, night

    # 주장 4: 1 W를 400~700 nm에 고르게(1/300 W/nm) 퍼뜨린 흰빛. 10 nm 간격 사다리꼴 적분
    lams = list(range(400, 701, 10))
    integral = sum((V[a] + V[b]) / 2 * 10 for a, b in zip(lams, lams[1:]))   # nm 단위
    white_lm = KM * integral / 300
    assert 235 < white_lm < 250, white_lm

    # 주장 5
    lo, hi = half_band({k: v for k, v in V.items() if k % 10 == 0})
    slo, shi = half_band(VS)
    assert 509 < lo < 511 and 609 < hi < 611, (lo, hi)
    assert 450 < slo < 460 and 545 < shi < 552, (slo, shi)

    # 주장 6 (카드 C2)
    w555 = 100 / (KM * V[555])
    w650 = 100 / (KM * V[650])
    assert abs(w555 - 0.1464) < 1e-4 and abs(w650 - 1.368) < 1e-3, (w555, w650)

    print(f"1 W의 광속: 555 nm {lm[555]:.0f} lm, 510 nm {lm[510]:.1f}, 650 nm {lm[650]:.1f}, 450 nm {lm[450]:.1f}")
    print(f"650/450 밝을 때 {day:.2f}배, 450/650 어두울 때 {night:.0f}배")
    print(f"고른 흰빛 1 W = {white_lm:.0f} lm, 반값 구간 V {lo:.0f}~{hi:.0f} nm, V' {slo:.0f}~{shi:.0f} nm")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
