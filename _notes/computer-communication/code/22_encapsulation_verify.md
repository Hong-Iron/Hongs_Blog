---
layout: "note"
title: "22_encapsulation_verify.py"
display_title: "22_encapsulation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "22"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/encapsulation/"
parent_title: "캡슐화"
description: "컴퓨터 통신 · 캡슐화 검증 코드"
permalink: "/studies/computer-communication/code/22_encapsulation_verify/"
---
{% raw %}
[캡슐화](/Hongs_Blog/studies/computer-communication/encapsulation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""캡슐화의 헤더 오버헤드 비율 검증.

문서: 22.캡슐화 (정의의 길이 식, 카드 C1·C2)
정의: 층마다 헤더 h_l을 앞에 붙인다. 선에 실리는 길이 = M + sum(|h_l|).
주장: 헤더 크기가 고정이면 데이터가 작을수록 헤더 비율이 크다.
"""
from fractions import Fraction as F


def encapsulate(data, headers):
    """headers: 위층부터 아래층 순서의 헤더 이름. 반환: 아래층이 만든 메시지(리스트)."""
    msg = [data]
    for h in headers:
        msg = [h] + msg
    return msg


def decapsulate(msg, name):
    assert msg[0] == name
    return msg[1:]


def overhead(data_bytes, header_bytes):
    total = data_bytes + sum(header_bytes)
    return F(sum(header_bytes), total)


def main():
    # 카드 C1: RRP -> HHP
    wire = encapsulate("Data", ["RRP", "HHP"])
    assert wire == ["HHP", "RRP", "Data"]
    to_rrp = decapsulate(wire, "HHP")
    assert to_rrp == ["RRP", "Data"]
    assert decapsulate(to_rrp, "RRP") == ["Data"]
    print("[OK] 카드 C1: 망 [HHP|RRP|Data] -> RRP에 [RRP|Data] -> 응용에 [Data]")

    # 카드 C2: 세 층 20바이트씩
    a = overhead(40, [20, 20, 20])
    b = overhead(1_460, [20, 20, 20])
    assert a == F(3, 5)
    assert round(float(b) * 100, 1) == 3.9
    print(f"[OK] 카드 C2: 40바이트 -> {float(a):.0%}, 1,460바이트 -> {float(b):.1%}")

    # 주장: 데이터가 커질수록 비율이 줄어든다 (단조 감소)
    ratios = [overhead(d, [20, 20, 20]) for d in range(1, 3000)]
    assert all(x > y for x, y in zip(ratios, ratios[1:]))
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
