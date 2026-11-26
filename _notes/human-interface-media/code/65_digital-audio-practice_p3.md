---
layout: "note"
title: "65_digital-audio-practice_p3.py"
display_title: "65_digital-audio-practice_p3.py"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "65"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/digital-audio-practice/"
parent_title: "디지털 오디오 계산 연습"
description: "휴먼 인터페이스 미디어 · 디지털 오디오 계산 연습 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/65_digital-audio-practice_p3/"
---
{% raw %}
[디지털 오디오 계산 연습](/Hongs_Blog/studies/human-interface-media/digital-audio-practice/) 문서의 문제 3 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 디지털 오디오 계산 연습 p3: 칸 폭 Δ와 비트 수 nb
# 실행: python3 -I 65_digital-audio-practice_p3.py
import math


def bits_needed(v_min, v_max, max_step):
    """칸 폭이 max_step 이하가 되는 가장 작은 비트 수."""
    L_min = (v_max - v_min) / max_step
    return math.ceil(math.log2(L_min))


if __name__ == "__main__":
    # 범위 -2 ~ 2 V, 칸 폭 0.02 V 이하: 칸 200개 이상 -> 2^8 = 256 -> 8비트
    assert (2 - (-2)) / 0.02 == 200
    nb = bits_needed(-2, 2, 0.02)
    assert nb == 8 and 2 ** 7 < 200 <= 2 ** 8
    delta = 4 / 2 ** nb
    assert delta == 0.015625                      # 15.6 mV
    assert delta / 2 == 0.0078125                 # 최대 오차 7.8 mV
    # 변형: 같은 범위를 10비트로 -> 3.9 mV, 최대 오차 1.95 mV
    assert abs(4 / 2 ** 10 - 0.00390625) < 1e-15 and abs(4 / 2 ** 10 / 2 * 1000 - 1.953) < 0.001
    print("ALL CHECKS PASSED")
```
{% endraw %}
