---
layout: "note"
title: "32_wired-links_verify.py"
display_title: "32_wired-links_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "32"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/wired-links/"
parent_title: "유선 링크"
description: "컴퓨터 통신 · 유선 링크 검증 코드"
permalink: "/studies/computer-communication/code/32_wired-links_verify/"
---
{% raw %}
[유선 링크](/Hongs_Blog/studies/computer-communication/wired-links/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""유선 링크의 수치 검증.

문서: 32.유선 링크 (원본 오류 의심 상자, 카드 C3, 광케이블)
주장 1: STS-n의 속도는 STS-1(51.840 Mbps)의 n배다. 슬라이드의 STS-3 155.250 Mbps는 155.520의 오기로 보인다.
주장 2: 굴절률 = 진공에서의 속도 / 매체에서의 속도. 광케이블 2.0e8 m/s -> 1.5.
주장 3: 코어의 굴절률이 클래딩보다 크면 임계각 arcsin(n_clad / n_core)보다 비스듬히 닿은 빛은 모두 되돌아온다(전반사).
"""
import math
from fractions import Fraction as F

SLIDE = {  # 슬라이드 표, Mbps
    1: F("51.840"), 3: F("155.250"), 12: F("622.080"), 24: F("1244.160"), 48: F("2488.320"),
}


def main():
    base = SLIDE[1]
    for n, v in SLIDE.items():
        if n == 3:
            assert v != n * base
            assert n * base == F("155.520")
        else:
            assert v == n * base, (n, v)
    print("[OK] STS-1/12/24/48은 51.84 x n과 일치, STS-3만 155.250 != 155.520")

    # 굴절률
    assert F(300_000_000, 200_000_000) == F(3, 2)
    assert round(300_000_000 / 230_000_000, 2) == 1.30
    print("[OK] 굴절률: 광케이블 1.5, 구리 케이블 속도 기준 약 1.30")

    # 전반사: 예시 코어 1.50, 클래딩 1.48
    theta_c = math.degrees(math.asin(1.48 / 1.50))
    assert 80.5 < theta_c < 80.7
    # 코어가 클래딩보다 작으면 임계각이 없다 (asin 인자 > 1)
    assert 1.50 / 1.48 > 1
    print(f"[OK] 임계각 {theta_c:.1f}도 (코어 1.50, 클래딩 1.48)")

    # 100 m UTP의 전파 지연 (케이블 2.3e8 m/s)
    assert round(100 / 230_000_000 * 1e6, 2) == 0.43
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
