---
layout: "note"
title: "13_time-division-multiplexing_verify.py"
display_title: "13_time-division-multiplexing_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "13"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
parent_url: "/studies/computer-communication/time-division-multiplexing/"
parent_title: "시분할 다중화"
description: "컴퓨터 통신 · 시분할 다중화 검증 코드"
permalink: "/studies/computer-communication/code/13_time-division-multiplexing_verify/"
---
{% raw %}
[시분할 다중화](/Hongs_Blog/studies/computer-communication/time-division-multiplexing/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""동기식 시분할 다중화(TDM)의 칸 주인과 전송률 검증.

문서: 13.시분할 다중화 (정의, 예제, 활용, 카드 C2)
정의: 칸 번호 j(0부터), 입력 N개(1부터). 칸 j의 주인 = (j mod N) + 1.
"""
from fractions import Fraction as F


def tdm_owner(j: int, n_inputs: int) -> int:
    return j % n_inputs + 1


def main() -> None:
    assert [tdm_owner(j, 6) for j in range(12)] == [1, 2, 3, 4, 5, 6] * 2  # 슬라이드 그림 순서
    assert [tdm_owner(j, 4) for j in range(8)] == [1, 2, 3, 4] * 2  # 예시 표 (사용자 4명)
    print("[OK] 슬라이드 순서 1~6 반복, 사용자 4명 표")

    # 예제: N = 6, 칸 17의 주인, 입력 3의 처음 세 칸
    assert tdm_owner(17, 6) == 6
    assert [j for j in range(20) if tdm_owner(j, 6) == 3][:3] == [2, 8, 14]
    # 카드 time-division-multiplexing#C2: N = 5
    assert tdm_owner(23, 5) == 4 and 23 % 5 == 3  # 흔한 오답 3
    assert [j for j in range(20) if tdm_owner(j, 5) == 2][:3] == [1, 6, 11]
    print("[OK] 예제 칸 17(N=6) -> 6, 입력 3 -> 2, 8, 14 / 카드 C2 칸 23(N=5) -> 4, 입력 2 -> 1, 6, 11")

    # 활용: T1, E1 (칸 하나 = 8비트, 초당 8,000 프레임)
    assert 24 * 8 * 8_000 == 1_536_000 and (24 * 8 + 1) * 8_000 == 1_544_000  # T1: 프레이밍 비트 1개
    assert 32 * 8 * 8_000 == 2_048_000  # E1
    assert F(1_536_000, 24) == 64_000
    print("[OK] T1 = 24칸 x 64 kbps + 프레이밍 8 kbps = 1.544 Mbps, E1 = 32칸 x 64 kbps = 2.048 Mbps")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
