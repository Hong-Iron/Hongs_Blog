---
layout: "note"
title: "29_cross-correlation_impl.py"
display_title: "29_cross-correlation_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "29"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/cross-correlation/"
parent_title: "교차 상관"
description: "휴먼 인터페이스 미디어 · 교차 상관 구현 코드"
permalink: "/studies/human-interface-media/code/29_cross-correlation_impl/"
---
{% raw %}
[교차 상관](/Hongs_Blog/studies/human-interface-media/cross-correlation/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""교차 상관 구현과 패턴 찾기.

문서: 29.교차 상관 (예시로 보기, 정의, 스스로 설명해 보기, 자주 하는 오해, 카드 C2~C4)
인덱스는 0부터. 실수 신호만 다룬다(켤레는 생략).

교차 상관 (f ⋆ g)[n] = Σ_k f[k] g[n + k]: 틀 f를 g 위에서 n칸 옮겨 놓고, 겹친 칸끼리 곱해 더한다.
정규화 교차 상관(NCC)은 겹친 구간마다 두 조각의 평균을 빼고 표준편차로 나눈 상관계수다.

주장:
  1. 신호 s = [0,0,1,3,2,0,0,9,9,9,0,0]에서 틀 t = [1,3,2]를 찾는다.
     그냥 교차 상관은 밝은 구간(9,9,9)과 딱 겹치는 위치 7에서 54로 가장 크다. 진짜 자리 2에서는 14다.
     NCC는 진짜 자리 2에서 1로 가장 크다.
  2. 자기 상관 (f ⋆ f)[n]은 n = 0에서 가장 크다.
  3. 교차 상관은 순서를 바꾸면 결과가 좌우로 뒤집힌다: (f ⋆ g)[n] = (g ⋆ f)[-n].
"""
import math


def xcorr(f, g):
    """(f ⋆ g)[n]을 n = -(len(f)-1) … len(g)-1에 대해 사전으로 돌려준다."""
    out = {}
    for n in range(-(len(f) - 1), len(g)):
        out[n] = sum(f[k] * g[n + k] for k in range(len(f)) if 0 <= n + k < len(g))
    return out


def ncc_scan(t, s):
    """틀 t가 s 안에 완전히 들어가는 위치 n = 0 … len(s)-len(t)마다 상관계수."""
    m = len(t)
    mt = sum(t) / m
    st = math.sqrt(sum((a - mt) ** 2 for a in t))
    out = {}
    for n in range(len(s) - m + 1):
        w = s[n:n + m]
        mw = sum(w) / m
        sw = math.sqrt(sum((a - mw) ** 2 for a in w))
        out[n] = 0.0 if sw == 0 else sum((a - mt) * (b - mw) for a, b in zip(t, w)) / (st * sw)
    return out


def main() -> None:
    s = [0, 0, 1, 3, 2, 0, 0, 9, 9, 9, 0, 0]
    t = [1, 3, 2]
    raw = xcorr(t, s)
    full = {n: v for n, v in raw.items() if 0 <= n <= len(s) - len(t)}
    best_raw = max(full, key=full.get)
    assert best_raw == 7 and full[7] == 54 and full[2] == 14
    assert full[6] == 45 and full[8] == 36
    nc = ncc_scan(t, s)
    best = max(nc, key=nc.get)
    assert best == 2 and abs(nc[2] - 1) < 1e-12
    assert nc[0] == 0 and round(nc[3], 2) == -0.33 and round(nc[6], 2) == 0.87 and nc[7] == 0
    # 2. 자기 상관
    f = [1, 3, 2, 0, -1]
    ac = xcorr(f, f)
    assert max(ac, key=ac.get) == 0 and ac[0] == sum(v * v for v in f)
    # 3. 순서 바꾸기
    g = [2, -1, 0, 4]
    fg, gf = xcorr(f, g), xcorr(g, f)
    for n, v in fg.items():
        assert gf.get(-n, 0) == v
    assert fg != {n: gf.get(n, 0) for n in fg}
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
