---
layout: "note"
title: "52_io-buffering_verify.py"
display_title: "52_io-buffering_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "52"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/io-buffering/"
parent_title: "입출력 버퍼링"
description: "운영체제 · 입출력 버퍼링 검증 코드"
permalink: "/studies/operating-systems/code/52_io-buffering_verify/"
---
{% raw %}
[입출력 버퍼링](/Hongs_Blog/studies/operating-systems/io-buffering/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""입출력 버퍼링의 블록당 시간 (Stallings 11.4절).
T: 장치에서 블록 하나를 읽는 시간, C: 프로세스가 블록 하나를 계산하는 시간, M: 버퍼에서 사용자 공간으로 옮기는 시간.
버퍼 없음: T + C, 단일 버퍼: max(C, T) + M, 이중 버퍼: max(C, T) (M은 무시할 만큼 작다고 둠)."""


def per_block(T, C, M=0.0):
    return {"none": T + C, "single": max(C, T) + M, "double": max(C, T)}


def simulate(kind, T, C, M, n=1000):
    """블록 n개를 처리하는 데 걸리는 시간을 단계별로 흉내 낸다 (정상 상태 확인용)."""
    if kind == "none":
        return n * (T + C)
    if kind == "single":
        # 읽기(T) -> 옮기기(M) -> [계산(C) 동안 다음 읽기(T)] 반복
        return T + M + (n - 1) * (max(C, T) + M) + C
    # double: 한 버퍼를 계산하는 동안 다른 버퍼를 채운다
    return T + (n - 1) * max(C, T) + C


if __name__ == "__main__":
    for T, C, M in [(10, 4, 1), (5, 8, 1), (6, 6, 0.5)]:
        p = per_block(T, C, M)
        for k in ("none", "single", "double"):
            avg = simulate(k, T, C, M) / 1000
            exp = p[k] if k != "double" else max(C, T)
            assert abs(avg - exp) < 0.05 * exp, (T, C, M, k, avg, exp)
    # 카드: T = 10, C = 4, M = 1 -> 14, 11, 10
    assert per_block(10, 4, 1) == {"none": 14, "single": 11, "double": 10}
    assert per_block(5, 8, 1) == {"none": 13, "single": 9, "double": 8}   # 카드 C1
    # 이중 버퍼에서 C > T면 프로세스가, T > C면 장치가 병목
    assert per_block(5, 8)["double"] == 8 and per_block(10, 4)["double"] == 10
    print("ALL CHECKS PASSED")
```
{% endraw %}
