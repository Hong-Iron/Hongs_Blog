---
layout: "note"
title: "40_nrz-clock-recovery_verify.py"
display_title: "40_nrz-clock-recovery_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "40"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/nrz-clock-recovery/"
parent_title: "NRZ와 클럭 복구"
description: "컴퓨터 통신 · NRZ와 클럭 복구 검증 코드"
permalink: "/studies/computer-communication/code/40_nrz-clock-recovery_verify/"
---
{% raw %}
[NRZ와 클럭 복구](/Hongs_Blog/studies/computer-communication/nrz-clock-recovery/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""NRZ 수신과 클럭 어긋남 검증.

문서: 40.NRZ와 클럭 복구 (예시, 원본 오류 의심, 카드 C3·C4)
출처: 2장-1 슬라이드 35~37
모형:
  - 보내는 쪽은 비트 하나를 폭 1 동안 보낸다 (NRZ: 1 높음, 0 낮음).
  - 받는 쪽은 자기 클럭으로 비트 폭을 w라 믿고, 칸 k의 한가운데 (k + 1/2)·w + phase 에서 높이를 읽는다.
  - w = 1, phase = 0이면 같은 클럭이다. w < 1이면 받는 쪽 클럭이 빠르다.
주장:
  1. 같은 클럭이면 보낸 비트가 그대로 읽힌다.
  2. 받는 쪽 클럭이 빠르면(w < 1) 읽는 위치가 점점 앞당겨져, 같은 비트를 두 번 읽는 일이 생긴다.
     이때 읽은 열은 '보낸 열의 앞부분에서 몇 비트를 한 번 더 넣은 것'이다. 비트를 건너뛰지는 않는다.
     (w < 1이면 다음 읽기 위치가 1보다 적게 움직이므로 보낸 비트 번호가 0 또는 1만 는다.)
  3. 같은 높이가 오래 이어질수록(0이나 1이 길게 이어질수록) 받는 쪽은 어긋남을 알아챌 단서가 없다:
     높이가 바뀌는 순간마다 받는 쪽이 칸 경계를 다시 맞추면 어긋남이 쌓이지 않는다.
  4. 슬라이드 36의 '빠른 클럭' 수신열 0010111110100010은 1이 4개에서 5개로 늘고,
     0이 4개에서 3개로 줄었다. 클럭이 일정하게 빠르면(w < 1) 비트가 줄 수 없으므로
     이 열은 어떤 일정한 w < 1, phase로도 나오지 않는다. (뜻 '비트 오류'는 맞다.)
"""
from fractions import Fraction as F

SENT = "0010111101000010"
SLIDE_FAST = "0010111110100010"


def receive(sent, w, phase=F(0), n=None):
    n = len(sent) if n is None else n
    out = []
    for k in range(n):
        t = (k + F(1, 2)) * w + phase
        i = int(t)                # 보낸 비트 번호 (t가 [i, i+1)에 있음)
        if i >= len(sent) or t < 0:
            break
        out.append(sent[i])
    return "".join(out)


def receive_with_resync(sent, w):
    """높이가 바뀌는 순간마다 칸 경계를 그 순간에 다시 맞추는 수신자."""
    edges = [i for i in range(1, len(sent)) if sent[i] != sent[i - 1]]
    out = []
    start = F(0)
    for stop in edges + [len(sent)]:
        k = 0
        while True:
            t = start + (k + F(1, 2)) * w
            if t >= stop:
                break
            out.append(sent[int(t)])
            k += 1
        start = F(stop)
    return "".join(out)


def runs(s):
    r, prev = [], None
    for c in s:
        if c == prev:
            r[-1][1] += 1
        else:
            r.append([c, 1])
            prev = c
    return [tuple(x) for x in r]


def main():
    assert receive(SENT, F(1)) == SENT
    print("[OK] 같은 클럭: 그대로", SENT)

    w = F(15, 16)
    fast = receive(SENT, w)
    print("     w = 15/16으로 16번 읽기:", fast)
    assert fast == "0010111110100001"   # 카드 C4: 9번째 읽기에서 8번째 비트(1)를 한 번 더 읽는다
    idx = [int((k + F(1, 2)) * w) for k in range(16)]
    assert idx == [0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12, 13, 14]
    # 주장 2: 빠른 클럭은 비트를 건너뛰지 않는다 (보낸 번호가 0 또는 1씩 는다)
    for num in range(1, 100):
        w = F(num, 100)
        for ph in (F(0), F(1, 10), F(1, 4)):
            idx = [int((k + F(1, 2)) * w + ph) for k in range(16)]
            assert all(b - a in (0, 1) for a, b in zip(idx, idx[1:]))
    print("[OK] w < 1이면 읽는 비트 번호는 0 또는 1씩만 는다 (w = 0.01~0.99, 세 가지 phase)")

    # 주장 4: 슬라이드 수신열의 덩어리 길이 비교
    print("     보낸 열 덩어리 ", runs(SENT))
    print("     슬라이드 수신열", runs(SLIDE_FAST))
    assert runs(SENT)[3] == ("1", 4) and runs(SLIDE_FAST)[3] == ("1", 5)
    assert runs(SENT)[6] == ("0", 4) and runs(SLIDE_FAST)[6] == ("0", 3)
    found = [(n, d, p) for d in range(2, 61) for n in range(1, d)
             for p in range(0, 20)
             if receive(SENT, F(n, d), F(p, 40)) == SLIDE_FAST]
    assert not found
    print("[OK] 슬라이드 수신열은 일정하게 빠른 클럭(w = n/d < 1, d <= 60, phase 0~0.475)으로 나오지 않는다")

    # 주장 3: 다시 맞추기를 하면 w가 조금 틀려도 맞게 읽는다 (덩어리가 짧을 때)
    for w in (F(9, 10), F(19, 20), F(21, 20), F(11, 10)):
        assert receive_with_resync(SENT, w) == SENT
    assert receive_with_resync("1" + "0" * 20 + "1", F(9, 10)) != "1" + "0" * 20 + "1"
    print("[OK] 높이가 바뀔 때마다 다시 맞추면 w = 0.9~1.1에서 슬라이드 열을 그대로 읽는다")
    print("     같은 높이가 20비트 이어지면 w = 0.9에서 틀린다 (단서가 없는 구간이 길다)")

    # 카드 C3: 받는 쪽 클럭이 1% 빠르면 몇 비트 뒤에 처음 같은 비트를 두 번 읽나
    w = F(99, 100)
    idx = [int((k + F(1, 2)) * w) for k in range(200)]
    first_dup = next(k for k in range(1, 200) if idx[k] == idx[k - 1])
    assert first_dup == 50
    # 일반식: 시계가 eps만큼 빠르면 k > 1/(2 eps) - 1/2 인 첫 k에서 처음 같은 비트를 다시 읽는다
    for d in (10, 20, 50, 100, 1000):
        w = 1 - F(1, d)
        idx = [int((k + F(1, 2)) * w) for k in range(3 * d)]
        k0 = next(k for k in range(1, 3 * d) if idx[k] == idx[k - 1])
        assert k0 == min(k for k in range(1, 3 * d) if (k + F(1, 2)) * F(1, d) > F(1, 2))
        assert abs(k0 - d / 2) <= 1
    # 오해 예: 시계 오차 백만분의 1(1 ppm)이면 약 50만 비트 뒤, 1 Gbps에서 0.5 ms 만에 첫 오류
    k_ppm = F(1, 2) * 10**6 - F(1, 2)          # 1/(2 eps) - 1/2
    assert int(k_ppm) + 1 == 500_000
    assert F(500_000, 10**9) == F(1, 2000)       # 0.5 ms
    print("[OK] 1 ppm 차이: 약 500,000번째 비트에서 처음 틀림, 1 Gbps면 0.5 ms")
    print("[OK] 카드 C3: 1% 빠르면 51번째 읽기(k = 50)에서 처음 같은 비트를 다시 읽는다. eps = 1/d면 약 d/2번째")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
