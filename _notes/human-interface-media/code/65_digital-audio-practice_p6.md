---
layout: "note"
title: "65_digital-audio-practice_p6.py"
display_title: "65_digital-audio-practice_p6.py"
kind: "code"
kind_label: "코드 · 문제 6 풀이"
num: "65"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/digital-audio-practice/"
parent_title: "디지털 오디오 계산 연습"
description: "휴먼 인터페이스 미디어 · 디지털 오디오 계산 연습 문제 6 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/65_digital-audio-practice_p6/"
---
{% raw %}
[디지털 오디오 계산 연습](/Hongs_Blog/studies/human-interface-media/digital-audio-practice/) 문서의 문제 6 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 디지털 오디오 계산 연습 p6: 압축비 = 원래 비트율 / 압축 후 비트율
# 실행: python3 -I 65_digital-audio-practice_p6.py

if __name__ == "__main__":
    cd = 2 * 44_100 * 16
    assert cd == 1_411_200
    assert abs(cd / 128_000 - 11.025) < 1e-12     # 약 11 : 1
    assert abs(cd / 320_000 - 4.41) < 1e-12       # 4.41 : 1
    assert cd / 10 == 141_120                     # 10 : 1이 되는 비트율 141.12 kb/s
    # 줄어든 비율: 128 kb/s는 원래의 약 9.1%
    assert abs(128_000 / cd * 100 - 9.07) < 0.01
    # 변형: 64 kb/s 전화 음성을 8 kb/s로 -> 8 : 1
    assert 64_000 / 8_000 == 8
    print("ALL CHECKS PASSED")
```
{% endraw %}
