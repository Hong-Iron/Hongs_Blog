---
layout: "note"
title: "34_wireless-links_verify.py"
display_title: "34_wireless-links_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "34"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
parent_url: "/studies/computer-communication/wireless-links/"
parent_title: "무선 링크"
description: "컴퓨터 통신 · 무선 링크 검증 코드"
permalink: "/studies/computer-communication/code/34_wireless-links_verify/"
---
{% raw %}
[무선 링크](/Hongs_Blog/studies/computer-communication/wireless-links/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""무선 링크의 수치 검증.

문서: 34.무선 링크 (다중 경로 예, 고정 무선 가입자망 예, 카드 C2)
주장 1: 반사파가 직접파보다 d 미터 더 돌아오면 d / 3.0e8 초 늦는다.
        이 늦음이 비트 폭(1 / 전송률)과 비슷하거나 크면 앞 비트가 뒤 비트에 겹친다.
주장 2: 72도 섹터 5개, 섹터당 30 Mbit/s -> 기지국당 150 Mbit/s, 반경 8 km 면적 약 201 km^2.
"""
import math
from fractions import Fraction as F

C = 300_000_000


def main():
    delay_us = F(300 * 10**6, C)  # 300 m 더 돌아옴
    assert delay_us == 1
    for rate_mbps, width_us in [(F(1, 10), 10), (1, 1), (10, F(1, 10))]:
        assert F(1, rate_mbps) == width_us
    # 늦음 1 us: 0.1 Mbps에서는 비트 폭의 10%, 1 Mbps에서 100%, 10 Mbps에서 10비트에 걸침
    assert delay_us / 10 == F(1, 10)
    assert delay_us / 1 == 1
    assert delay_us / F(1, 10) == 10
    print("[OK] 다중 경로: 300 m 더 돌면 1 us 늦음 -> 0.1 Mbps 10%, 1 Mbps 1비트, 10 Mbps 10비트에 겹침")

    assert 360 // 72 == 5 and 5 * 30 == 150
    assert round(math.pi * 8**2) == 201
    print("[OK] 섹터 5개 x 30 Mbit/s = 150 Mbit/s, 면적 약 201 km^2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
