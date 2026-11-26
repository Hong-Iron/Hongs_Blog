---
layout: "note"
title: "65_digital-audio-practice_p5.py"
display_title: "65_digital-audio-practice_p5.py"
kind: "code"
kind_label: "코드 · 문제 5 풀이"
num: "65"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/digital-audio-practice/"
parent_title: "디지털 오디오 계산 연습"
description: "휴먼 인터페이스 미디어 · 디지털 오디오 계산 연습 문제 5 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/65_digital-audio-practice_p5/"
---
{% raw %}
[디지털 오디오 계산 연습](/Hongs_Blog/studies/human-interface-media/digital-audio-practice/) 문서의 문제 5 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 디지털 오디오 계산 연습 p5: 나이퀴스트 표본화율
# 실행: python3 -I 65_digital-audio-practice_p5.py


def nyquist_rate(f_max):
    """가장 높은 주파수의 두 배. 표본화율은 이보다 커야 한다."""
    return 2 * f_max


def alias(f, fs):
    """표본화율 fs에서 주파수 f가 0 ~ fs/2 안으로 접혀 보이는 주파수."""
    f = f % fs
    return min(f, fs - f)


if __name__ == "__main__":
    # 가청 상한 20 kHz -> 40 kHz보다 커야 한다. CD 44.1 kHz는 22.05 kHz까지 담아 2.05 kHz 여유
    assert nyquist_rate(20_000) == 40_000 and 44_100 > 40_000
    assert 44_100 / 2 - 20_000 == 2_050
    # 전화: 음성 대역 위 끝을 4 kHz로 잡으면 8 kHz
    assert nyquist_rate(4_000) == 8_000
    # 변형: 16 kHz 표본화 -> 8 kHz까지. 10 kHz 성분은 6 kHz로 접혀 들린다
    assert 16_000 / 2 == 8_000 and alias(10_000, 16_000) == 6_000
    print("ALL CHECKS PASSED")
```
{% endraw %}
