---
layout: "note"
title: "47_error-detection_verify.py"
display_title: "47_error-detection_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "47"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/error-detecting-code/"
parent_title: "오류 검출 코드"
description: "컴퓨터 통신 · 오류 검출 코드 검증 코드"
permalink: "/studies/computer-communication/code/47_error-detection_verify/"
---
{% raw %}
[오류 검출 코드](/Hongs_Blog/studies/computer-communication/error-detecting-code/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""오류 검출 코드 문서의 주장 검증: 홀짝 패리티, 10진 CRC 비유."""
import itertools


def parity(bits):
    return sum(bits) % 2                       # 짝수 패리티: 1의 개수를 짝수로 맞추는 비트


def main():
    data = [1, 0, 1, 1, 0, 0, 1]
    p = parity(data); sent = data + [p]
    assert p == 0 and sum(sent) % 2 == 0
    # 1비트, 3비트 오류는 검출, 2비트 오류는 놓친다
    for k, detected in ((1, True), (2, False), (3, True), (4, False)):
        for pos in itertools.combinations(range(8), k):
            r = list(sent)
            for i in pos:
                r[i] ^= 1
            assert (sum(r) % 2 != 0) == detected
    # 슬라이드 p.52의 10진 비유: 젯수 11, 데이터 331 → 3311
    x = next(d for d in range(10) if (3310 + d) % 11 == 0)
    assert x == 1 and 3311 % 11 == 0
    assert 3310 % 11 != 0 and 2311 % 11 != 0           # 검출
    assert 2211 % 11 == 0                               # 놓침
    # 젯수 10이면 마지막 자리만 본다: 앞자리 오류는 모두 놓친다
    assert all((d * 1000 + 310) % 10 == 0 for d in range(10))
    # 카드 C2: 젯수 7, 데이터 52 → 52x가 7로 나누어떨어지는 x
    assert [d for d in range(10) if (520 + d) % 7 == 0] == [5]
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
