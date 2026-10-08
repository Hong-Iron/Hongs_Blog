---
layout: "note"
title: "06_circuit-switching_verify.py"
display_title: "06_circuit-switching_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "06"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/circuit-switching/"
parent_title: "회선 스위칭"
description: "컴퓨터 통신 · 회선 스위칭 검증 코드"
permalink: "/studies/computer-communication/code/06_circuit-switching_verify/"
---
{% raw %}
[회선 스위칭](/Hongs_Blog/studies/computer-communication/circuit-switching/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""회선 스위칭에서 파일 전송 시간 계산 검증.

문서: 06.회선 스위칭 (예제, 카드 C3)
가정: 링크가 TDM으로 칸 k개로 나뉘고 회선 하나가 칸 하나를 쓴다. 전파 지연은 무시한다.
  회선 전송률 = 링크 전송률 / k
  총 시간 = 회선 설정 시간 + 파일 크기 / 회선 전송률
"""
from fractions import Fraction as F


def transfer_time(bits: int, link_rate: int, slots: int, setup: F):
    rate = F(link_rate, slots)
    return rate, setup + F(bits) / rate


def main() -> None:
    # 예제 (Kurose & Ross 1.3절의 예제와 같은 수치)
    rate, total = transfer_time(640_000, 1_536_000, 24, F(1, 2))
    assert rate == 64_000 and total == F(21, 2)
    print(f"예제: 회선 {rate} bps, 총 {float(total)} s")

    # 쉬는 시간의 낭비: 1 Mbps 링크를 100 kbps 회선으로 나누면 10명, 10%만 보내면 90%가 빔
    assert 1_000_000 // 100_000 == 10
    print("반례: 1 Mbps / 100 kbps = 10명, 활동 10%면 예약 용량의 90%가 빈다")

    # 카드 circuit-switching#C3
    rate, total = transfer_time(800_000, 3_072_000, 48, F(1, 4))
    assert rate == 64_000 and total == F(51, 4)
    # 흔한 오답: 링크 전체 전송률로 나눈 값
    wrong = F(1, 4) + F(800_000, 3_072_000)
    assert round(float(wrong), 2) == 0.51
    print(f"카드 C3: 회선 {rate} bps, 총 {float(total)} s (오답 {float(wrong):.2f} s)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
