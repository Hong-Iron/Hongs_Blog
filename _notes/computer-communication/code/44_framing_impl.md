---
layout: "note"
title: "44_framing_impl.py"
display_title: "44_framing_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "44"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/byte-framing/"
parent_title: "바이트 중심 프레이밍"
description: "컴퓨터 통신 · 바이트 중심 프레이밍 구현 코드"
permalink: "/studies/computer-communication/code/44_framing_impl/"
---
{% raw %}
[바이트 중심 프레이밍](/Hongs_Blog/studies/computer-communication/byte-framing/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""프레이밍(바이트 중심) 구현과 검증: BISYNC 보초 방법과 DDCMP 바이트 수 방법. 바이트는 정수 0~255."""
SYN, SOH, STX, ETX, DLE = 0x16, 0x01, 0x02, 0x03, 0x10


def bisync_body(data):
    """슬라이드 방식: 본문의 ETX·DLE 앞에 DLE를 붙이고, 끝은 맨 ETX 하나."""
    out = []
    for b in data:
        if b in (ETX, DLE):
            out.append(DLE)
        out.append(b)
    return out + [ETX]


def bisync_read(stream):
    """DLE 다음 바이트는 글자 그대로, 앞에 DLE가 없는 ETX에서 끝."""
    out, i = [], 0
    while True:
        b = stream[i]
        if b == DLE:
            out.append(stream[i + 1]); i += 2
        elif b == ETX:
            return out, i + 1
        else:
            out.append(b); i += 1


def transparent_body(data):
    """투명 모드(필기의 방식): 본문의 DLE만 두 번 쓰고, 끝은 DLE ETX."""
    out = []
    for b in data:
        out += [DLE, DLE] if b == DLE else [b]
    return out + [DLE, ETX]


def transparent_read(stream):
    out, i = [], 0
    while True:
        b = stream[i]
        if b == DLE:
            if stream[i + 1] == ETX:
                return out, i + 2
            out.append(DLE); i += 2                 # DLE DLE → DLE 하나
        else:
            out.append(b); i += 1


def ddcmp_frame(body):
    return [SYN, SYN, 0x81, len(body)] + list(body)


def ddcmp_read(stream):
    n = stream[3]
    return stream[4:4 + n]


def main():
    data = [0x41, ETX, 0x42, DLE, ETX, 0x43]               # 본문에 ETX와 DLE가 우연히 들어 있다
    f = bisync_body(data)
    assert f == [0x41, DLE, ETX, 0x42, DLE, DLE, DLE, ETX, 0x43, ETX]
    back, used = bisync_read(f + [0x99, 0x99])            # 뒤에 CRC 등이 와도 끝을 정확히 찾는다
    assert back == data and used == len(f)
    # 채우기 없이 ETX에서 끝을 찾으면 본문이 잘린다
    naive = data + [ETX]
    assert naive[:naive.index(ETX)] == [0x41]
    # 카드 C2: 본문 [DLE, ETX] → DLE DLE DLE ETX ETX (5바이트)
    assert bisync_body([DLE, ETX]) == [DLE, DLE, DLE, ETX, ETX]
    # 투명 모드: 본문 ETX는 그대로, DLE만 두 번. 끝은 DLE ETX
    tf = transparent_body(data)
    assert tf == [0x41, ETX, 0x42, DLE, DLE, ETX, 0x43, DLE, ETX]
    assert transparent_read(tf + [0x99])[0] == data
    import random
    random.seed(44)
    for _ in range(2000):
        d = [random.choice([ETX, DLE, 0x41, 0x42]) for _ in range(random.randint(0, 20))]
        assert bisync_read(bisync_body(d) + [0x77])[0] == d and transparent_read(transparent_body(d) + [0x77])[0] == d
    # 바이트 수 방법: 본문에 무엇이 있든 길이로 자른다
    fr = ddcmp_frame(data)
    assert ddcmp_read(fr) == data
    # 길이 칸이 깨지면 엉뚱한 곳에서 자른다 → CRC가 맞지 않아 오류로 드러난다
    bad = list(fr); bad[3] = 4
    assert ddcmp_read(bad) != data
    # 최악의 오버헤드: 본문이 모두 ETX·DLE이면 BISYNC는 두 배
    assert len(bisync_body([DLE] * 10)) == 21
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
