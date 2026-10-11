---
layout: "note"
title: "01_data-metadata_verify.py"
display_title: "01_data-metadata_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "확률과 데이터"
parent_url: "/studies/data-and-information/data-metadata/"
parent_title: "데이터와 메타데이터"
description: "자료와 정보 · 데이터와 메타데이터 검증 코드"
permalink: "/studies/data-and-information/code/01_data-metadata_verify/"
---
{% raw %}
[데이터와 메타데이터](/Hongs_Blog/studies/data-and-information/data-metadata/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""데이터와 메타데이터 문서의 값 확인.

문서: 01.데이터와 메타데이터
출처: 자료와 정보 2회 슬라이드 p.3, 3회 슬라이드(강의03-부호) p.2
주장:
  1. 슬라이드의 16비트 다섯 줄을 부호 없는 정수로 읽으면 67, 80, 38, 75, 82다.
  2. 같은 16비트 1010110000000000을 수로 읽으면 44032, 유니코드 문자 번호로 읽으면 '가'다.
  3. 같은 8비트 01000011을 수로 읽으면 67, ASCII 문자로 읽으면 'C'다.
  4. 카드 C3: 0100 1011 -> 75, 'K'.
실행: python3 01_data-metadata_verify.py
"""

if __name__ == "__main__":
    rows = ["0000 0000 0100 0011", "0000 0000 0101 0000", "0000 0000 0010 0110",
            "0000 0000 0100 1011", "0000 0000 0101 0010"]
    vals = [int(r.replace(" ", ""), 2) for r in rows]
    assert vals == [67, 80, 38, 75, 82], vals
    b = "1010110000000000"
    assert int(b, 2) == 44032 and chr(int(b, 2)) == "가"
    assert int("01000011", 2) == 67 and chr(67) == "C"
    assert int("01001011", 2) == 75 and chr(75) == "K"
    print("ALL CHECKS PASSED")
```
{% endraw %}
