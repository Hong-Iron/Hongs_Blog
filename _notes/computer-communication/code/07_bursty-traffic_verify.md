---
layout: "note"
title: "07_bursty-traffic_verify.py"
display_title: "07_bursty-traffic_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/bursty-traffic/"
parent_title: "버스티 트래픽"
description: "컴퓨터 통신 · 버스티 트래픽 검증 코드"
permalink: "/studies/computer-communication/code/07_bursty-traffic_verify/"
---
{% raw %}
[버스티 트래픽](/Hongs_Blog/studies/computer-communication/bursty-traffic/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""버스티 트래픽의 활동/휴식 모델 검증.

문서: 07.버스티 트래픽 (정의, 예시, 카드 C2)
모델: 활동 중 전송률 a, 휴식 중 0, 시간 비율 p만큼 활동.
주장: 평균 = p*a, 최대 대 평균 비 = 1/p, a를 고정 할당했을 때 사용률 = p.
방법: (1) 1초 단위 시간표를 만들어 직접 평균을 낸다 (2) 카드 수치를 대입한다.
"""
from fractions import Fraction as F


def stats(trace):
    """trace: 초마다의 전송률 목록. 반환 (최대, 평균, 최대/평균, 최대를 고정 할당했을 때 사용률)."""
    peak = max(trace)
    avg = F(sum(trace), len(trace))
    return peak, avg, F(peak) / avg, avg / peak


def on_off_trace(a: int, on: int, off: int, periods: int):
    return ([a] * on + [0] * off) * periods


def main() -> None:
    # 예시: 1초 몰리고 19초 쉼 (p = 1/20)
    peak, avg, ratio, util = stats(on_off_trace(1_000_000, 1, 19, 50))
    assert ratio == 20 and util == F(1, 20)
    print(f"[OK] 예시: 최대/평균 {ratio}, 사용률 {float(util):.0%}")

    # 주장: 여러 (on, off)에서 비 = 1/p, 사용률 = p
    for on in range(1, 6):
        for off in range(0, 20):
            p = F(on, on + off)
            _, avg, ratio, util = stats(on_off_trace(300, on, off, 3))
            assert avg == p * 300 and ratio == 1 / p and util == p
    print("[OK] on 1..5, off 0..19: 평균 = p*a, 최대/평균 = 1/p, 사용률 = p")

    # 카드 bursty-traffic#C2: a = 2 Mbps, p = 5%
    a, p = 2_000_000, F(5, 100)
    assert p * a == 100_000 and 1 / p == 20
    print(f"[OK] 카드 C2: 평균 {p * a} bps, 최대/평균 {1 / p}, 사용률 {float(p):.0%}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
