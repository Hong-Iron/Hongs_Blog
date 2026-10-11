---
layout: "note"
title: "45_bit-stuffing_impl.py"
display_title: "45_bit-stuffing_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "45"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/bit-stuffing/"
parent_title: "비트 채우기"
description: "컴퓨터 통신 · 비트 채우기 구현 코드"
permalink: "/studies/computer-communication/code/45_bit-stuffing_impl/"
---
{% raw %}
[비트 채우기](/Hongs_Blog/studies/computer-communication/bit-stuffing/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""HDLC 비트 채우기 구현과 검증. 비트는 '0'/'1' 문자열."""
import random

FLAG = "01111110"


def stuff(bits):
    out, run = [], 0
    for b in bits:
        out.append(b)
        run = run + 1 if b == "1" else 0
        if run == 5:
            out.append("0"); run = 0
    return "".join(out)


def frame(bits):
    return FLAG + stuff(bits) + FLAG


def read(stream):
    """첫 깃발 뒤부터 다음 깃발까지 읽어 원래 비트를 돌려준다."""
    assert stream.startswith(FLAG)
    body = stream[len(FLAG):]
    out, run, i = [], 0, 0
    while True:
        b = body[i]
        out.append(b); run = run + 1 if b == "1" else 0
        if run == 5:
            if body[i + 1] == "0":
                i += 2; run = 0; continue
            if body[i + 1:i + 3] == "10":
                return "".join(out)[:-6]            # 깃발 앞의 '0'과 '11111'을 떼어 낸다
            raise ValueError("오류")
        i += 1


def main():
    msg = "0111111111110"                            # 1이 11개 이어진다
    s = stuff(msg)
    assert s == "011111011111010"                    # 1 다섯 개마다 0
    assert read(frame(msg)) == msg
    assert FLAG not in s                              # 채운 본문 안에는 깃발 모양이 없다
    # 카드 C2: 01111110을 보낼 때
    assert stuff("01111110") == "011111010"
    random.seed(45)
    for _ in range(2000):
        m = "".join(random.choice("01") for _ in range(random.randint(0, 60)))
        st = stuff(m)
        assert FLAG not in st and "111111" not in st
        assert read(frame(m) + "1010") == m
    # 1이 연속 7개 이상 오면 오류
    try:
        read(FLAG + "0111111100" + FLAG); raise RuntimeError
    except ValueError:
        pass
    # 최악의 오버헤드: 1만 n개면 n/5개 추가
    assert len(stuff("1" * 100)) == 120
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
