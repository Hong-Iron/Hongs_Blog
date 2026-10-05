---
layout: "note"
title: "36_satellite-systems_verify.py"
display_title: "36_satellite-systems_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "36"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
parent_url: "/studies/computer-communication/satellite-systems/"
parent_title: "위성통신"
description: "컴퓨터 통신 · 위성통신 검증 코드"
permalink: "/studies/computer-communication/code/36_satellite-systems_verify/"
---
{% raw %}
[위성통신](/Hongs_Blog/studies/computer-communication/satellite-systems/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""위성통신의 전파 지연 검증.

문서: 36.위성통신 (예시 표, 카드 C1)
가정: 신호 속도 3.0e8 m/s (진공). 위성은 지상국 바로 위에 있다고 보고 거리 = 고도.
      실제로는 비스듬히 보므로 거리가 더 길다 (하한 계산).
"""
from fractions import Fraction as F

C = 300_000_000


def one_hop_ms(alt_km):
    return F(alt_km * 1000 * 1000, C)


def main():
    geo = one_hop_ms(35_786)
    assert round(float(geo), 1) == 119.3
    assert round(float(2 * geo), 1) == 238.6   # 지상 -> 위성 -> 지상
    assert round(float(4 * geo), 1) == 477.1   # 질문과 답의 왕복
    meo = one_hop_ms(20_000)
    assert round(float(2 * meo), 1) == 133.3
    leo = one_hop_ms(550)
    assert round(float(leo), 2) == 1.83 and round(float(2 * leo), 2) == 3.67
    assert round(float(4 * leo), 1) == 7.3
    # 36,000 km로 어림하면 편도 120 ms
    assert one_hop_ms(36_000) == 120
    print(f"[OK] GEO 편도 {float(geo):.1f} ms, 지상-위성-지상 {float(2 * geo):.1f} ms, 왕복 {float(4 * geo):.1f} ms; "
          f"MEO 20,000 km {float(2 * meo):.1f} ms; LEO 550 km {float(2 * leo):.2f} ms")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
