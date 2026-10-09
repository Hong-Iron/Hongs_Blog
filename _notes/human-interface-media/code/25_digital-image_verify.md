---
layout: "note"
title: "25_digital-image_verify.py"
display_title: "25_digital-image_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "25"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/digital-image/"
parent_title: "디지털 이미지"
description: "휴먼 인터페이스 미디어 · 디지털 이미지 검증 코드"
permalink: "/studies/human-interface-media/code/25_digital-image_verify/"
---
{% raw %}
[디지털 이미지](/Hongs_Blog/studies/human-interface-media/digital-image/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""디지털 이미지 검증.

문서: 25.디지털 이미지 (예시로 보기, 정의, 원본 오류 의심, 카드 C2·C3)
주장:
  1. b비트로 나타낼 수 있는 밝기 단계는 2^b개다: 1비트 2, 2비트 4, 4비트 16, 8비트 256.
     24비트 트루컬러는 2^24 = 16,777,216가지 색(약 1,670만)이다.
  2. HDTV 1920 x 1080, 픽셀당 3바이트:
     - 한 장 6,220,800바이트. 2진 단위로 5.93 MiB(슬라이드의 "6 Mbytes").
     - 49,766,400비트 = 47.46 Mibit(슬라이드의 "47.5 Mbits").
     - 초당 60장이면 373,248,000바이트/초. 비트로 2,985,984,000 = 2.78 Gibit/s, 약 3.0 Gbps(10진).
     - 슬라이드의 2.81 Gbps는 6 MB x 60 = 360 MB, x 8 / 1024로 반올림한 값을 이어 쓴 결과다.
  3. 실제 HDTV 전송률 13~19 Mbps와 비교하면 약 157배~230배를 줄여 보낸다.
  4. "0012"는 숫자 2가 들어 있어 2진 4비트 부호가 아니다.
"""


def main() -> None:
    assert [2 ** b for b in (1, 2, 4, 8)] == [2, 4, 16, 256]
    assert 2 ** 24 == 16_777_216
    w, h, bpp = 1920, 1080, 3
    frame = w * h * bpp
    assert frame == 6_220_800
    assert round(frame / 2 ** 20, 2) == 5.93
    bits = frame * 8
    assert bits == 49_766_400
    assert round(bits / 2 ** 20, 2) == 47.46
    per_sec = frame * 60
    assert per_sec == 373_248_000
    bps = per_sec * 8
    assert bps == 2_985_984_000
    assert round(bps / 2 ** 30, 2) == 2.78
    assert round(6 * 60 * 8 / 1024, 2) == 2.81       # 슬라이드 계산: 6 MB x 60 x 8 / 1024
    assert round(bps / 19e6) == 157 and round(bps / 13e6) == 230
    assert round(per_sec * 60 / 1e9, 1) == 22.4                      # 1분 그대로: 약 22 GB
    assert (13e6 * 60 / 8 / 1e6, 19e6 * 60 / 8 / 1e6) == (97.5, 142.5)  # 1분 압축: 약 100~140 MB
    c2 = 1280 * 720 * 24 * 30                                          # 카드 C2
    assert c2 == 663_552_000 and round(c2 / 10e6) == 66
    code = "0012"
    assert not set(code) <= {"0", "1"}
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
