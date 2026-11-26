---
layout: "note"
title: "65_digital-audio-practice_p2.py"
display_title: "65_digital-audio-practice_p2.py"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "65"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/digital-audio-practice/"
parent_title: "디지털 오디오 계산 연습"
description: "휴먼 인터페이스 미디어 · 디지털 오디오 계산 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/65_digital-audio-practice_p2/"
---
{% raw %}
[디지털 오디오 계산 연습](/Hongs_Blog/studies/human-interface-media/digital-audio-practice/) 문서의 문제 2 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 디지털 오디오 계산 연습 p2: 저장 용량. 1 MB = 10^6 바이트로 센다
# 실행: python3 -I 65_digital-audio-practice_p2.py


def megabytes(rate_bps, seconds):
    return rate_bps * seconds / 8 / 1e6


if __name__ == "__main__":
    cd = 2 * 44_100 * 16
    # CD 1분: 10.584 MB
    assert abs(megabytes(cd, 60) - 10.584) < 1e-9
    # 74분: 783.2 MB
    assert abs(megabytes(cd, 74 * 60) - 783.216) < 1e-6
    # 700 MB에 CD 오디오 몇 분: 약 66.1분
    assert abs(700 / megabytes(cd, 60) - 66.14) < 0.01
    # 변형: 128 kb/s MP3 1분 0.96 MB, 1 GB(1000 MB)에 약 1041.7분 = 약 17.4시간
    assert abs(megabytes(128_000, 60) - 0.96) < 1e-12
    minutes = 1000 / megabytes(128_000, 60)
    assert abs(minutes - 1041.67) < 0.01 and abs(minutes / 60 - 17.36) < 0.01
    print("ALL CHECKS PASSED")
```
{% endraw %}
