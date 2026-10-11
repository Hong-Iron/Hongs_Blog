---
layout: "note"
title: "51_error-detection-compared_verify.py"
display_title: "51_error-detection-compared_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "51"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/error-detection-compared/"
parent_title: "오류 검출 방식 비교"
description: "컴퓨터 통신 · 오류 검출 방식 비교 검증 코드"
permalink: "/studies/computer-communication/code/51_error-detection-compared_verify/"
---
{% raw %}
[오류 검출 방식 비교](/Hongs_Blog/studies/computer-communication/error-detection-compared/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""오류 검출 방식 비교 문서의 주장 검증: 같은 오류 패턴을 패리티, 2차원 패리티, 체크섬, CRC-16에 넣어 본다."""
import random


def bits_of(data):
    return [(b >> (7 - i)) & 1 for b in data for i in range(8)]


def parity_ok(data, p):
    return sum(bits_of(data)) % 2 == p


def two_d(data):
    rows = [sum((b >> i) & 1 for i in range(8)) % 2 for b in data]
    col = 0
    for b in data:
        col ^= b
    return rows, col


def checksum(data):
    words = [(data[i] << 8) | (data[i + 1] if i + 1 < len(data) else 0) for i in range(0, len(data), 2)]
    s = 0
    for w in words:
        s += w; s = (s & 0xFFFF) + (s >> 16)
    return ~s & 0xFFFF


def crc16(data, poly=0x8005):
    """CRC-16 (x^16 + x^15 + x^2 + 1), 슬라이드 p.55의 다항식."""
    r = 0
    for b in data:
        r ^= b << 8
        for _ in range(8):
            r = ((r << 1) ^ poly) & 0xFFFF if r & 0x8000 else (r << 1) & 0xFFFF
    return r


def flip(data, positions):
    d = list(data)
    for p in positions:
        d[p // 8] ^= 1 << (7 - p % 8)
    return d


def main():
    random.seed(51)
    n = 32; trials = 4000
    miss = {"parity": 0, "2d": 0, "checksum": 0, "crc16": 0}
    for k in (2, 4):
        for _ in range(trials):
            data = [random.randrange(256) for _ in range(n)]
            pos = random.sample(range(8 * n), k)
            bad = flip(data, pos)
            if sum(bits_of(bad)) % 2 == sum(bits_of(data)) % 2: miss["parity"] += 1
            if two_d(bad) == two_d(data): miss["2d"] += 1
            if checksum(bad) == checksum(data): miss["checksum"] += 1
            if crc16(bad) == crc16(data): miss["crc16"] += 1
    print("놓친 수 (2·4비트 오류 각 4000번):", miss)
    assert miss["parity"] == 2 * trials                  # 짝수 개 오류는 한 번도 못 찾는다
    assert miss == {"parity": 8000, "2d": 0, "checksum": 132, "crc16": 0}
    # 버스트 오류(연속 16비트 안): CRC-16은 모두 검출
    for _ in range(3000):
        data = [random.randrange(256) for _ in range(n)]
        L = random.randint(1, 16); s = random.randint(0, 8 * n - L)
        pos = [s] + [s + i for i in range(1, L - 1) if random.random() < 0.5] + ([s + L - 1] if L > 1 else [])
        assert crc16(flip(data, pos)) != crc16(data)
    # 체크섬이 놓치는 짝: 같은 열 자리의 두 비트가 0→1, 1→0으로 서로 상쇄
    data = [0x00, 0x01, 0x00, 0x00]                       # 워드 0x0001, 0x0000
    bad = [0x00, 0x00, 0x00, 0x01]                         # 워드 0x0000, 0x0001
    assert checksum(bad) == checksum(data) and crc16(bad) != crc16(data)
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
