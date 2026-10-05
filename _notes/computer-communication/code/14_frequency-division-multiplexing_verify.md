---
layout: "note"
title: "14_frequency-division-multiplexing_verify.py"
display_title: "14_frequency-division-multiplexing_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "14"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
parent_url: "/studies/computer-communication/frequency-division-multiplexing/"
parent_title: "주파수 분할 다중화"
description: "컴퓨터 통신 · 주파수 분할 다중화 검증 코드"
permalink: "/studies/computer-communication/code/14_frequency-division-multiplexing_verify/"
---
{% raw %}
[주파수 분할 다중화](/Hongs_Blog/studies/computer-communication/frequency-division-multiplexing/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""주파수 분할 다중화(FDM)의 채널 배치 계산 검증.

문서: 14.주파수 분할 다중화 (예시, 예제, 활용)
슬라이드 스펙트럼: 반송파 64, 68, 72 kHz, 채널 3개가 60~64, 64~68, 68~72 kHz를 차지한다.
"""
from fractions import Fraction as F


def main() -> None:
    carriers = [64, 68, 72]
    width = 4  # kHz
    channels = [(c - width, c) for c in carriers]  # 반송파 바로 아래 4 kHz
    assert channels == [(60, 64), (64, 68), (68, 72)]
    assert all(a[1] == b[0] for a, b in zip(channels, channels[1:]))  # 서로 겹치지 않고 붙어 있음
    assert (72 - 60) // width == 3 and (108 - 60) // width == 12
    print("[OK] 채널", channels, "/ 60~108 kHz는 12채널")

    voice = F(3_400 - 300, 4_000)
    assert voice == F(31, 40)
    print(f"[OK] 음성 대역 300~3,400 Hz / 채널 4 kHz = {float(voice):.1%}, 나머지 {float(1 - voice):.1%}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
