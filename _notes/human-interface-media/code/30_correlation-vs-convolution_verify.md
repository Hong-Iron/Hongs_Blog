---
layout: "note"
title: "30_correlation-vs-convolution_verify.py"
display_title: "30_correlation-vs-convolution_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "30"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/correlation-vs-convolution/"
parent_title: "교차 상관과 합성곱 비교"
description: "휴먼 인터페이스 미디어 · 교차 상관과 합성곱 비교 검증 코드"
permalink: "/studies/human-interface-media/code/30_correlation-vs-convolution_verify/"
---
{% raw %}
[교차 상관과 합성곱 비교](/Hongs_Blog/studies/human-interface-media/correlation-vs-convolution/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""교차 상관과 합성곱 비교 검증.

문서: 30.교차 상관과 합성곱 비교 (어느 쪽일까, 결정적 차이)
주장 (실수 수열, 인덱스 0부터):
  1. 합성곱 (f * g)[n] = Σ_m f[m] g[n - m]은 순서를 바꿔도 같다.
  2. 교차 상관 (f ⋆ g)[n] = Σ_k f[k] g[n + k]는 순서를 바꾸면 좌우로 뒤집힌다.
  3. 교차 상관은 f를 뒤집은 뒤 합성곱한 것과 같다: (f ⋆ g)[n] = (f_rev * g)[n + len(f) - 1].
  4. f가 좌우 대칭이면(예: [1, 2, 1]) 교차 상관과 합성곱이 같은 모양이다.
  5. 비대칭 f = [1, 2, 3]이면 둘이 다르다.
  6. 임펄스 [1]과 합성곱하면 그대로, 한 칸 늦은 임펄스 [0, 1]과 합성곱하면 한 칸 밀린다.
"""


def conv(f, g):
    out = [0] * (len(f) + len(g) - 1)
    for i, a in enumerate(f):
        for j, b in enumerate(g):
            out[i + j] += a * b
    return out


def xcorr(f, g):
    return {n: sum(f[k] * g[n + k] for k in range(len(f)) if 0 <= n + k < len(g))
            for n in range(-(len(f) - 1), len(g))}


def main() -> None:
    f, g = [1, 2, 3], [4, 0, -1, 2]
    assert conv(f, g) == conv(g, f)
    fg, gf = xcorr(f, g), xcorr(g, f)
    assert all(gf[-n] == v for n, v in fg.items())
    rev = conv(f[::-1], g)
    assert all(fg[n] == rev[n + len(f) - 1] for n in fg)
    sym = [1, 2, 1]
    c = conv(sym, g)
    x = xcorr(sym, g)
    assert [x[n] for n in sorted(x)] == c
    xc = xcorr(f, g)
    assert [xc[n] for n in sorted(xc)] != conv(f, g)
    assert conv([1], g) == g and conv([0, 1], g) == [0] + g
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
