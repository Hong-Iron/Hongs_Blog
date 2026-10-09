---
layout: "note"
title: "31_convolution-practice_p5.py"
display_title: "31_convolution-practice_p5.py"
kind: "code"
kind_label: "코드 · 문제 5 풀이"
num: "31"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/convolution-practice/"
parent_title: "합성곱 연습"
description: "휴먼 인터페이스 미디어 · 합성곱 연습 문제 5 풀이 코드"
permalink: "/studies/human-interface-media/code/31_convolution-practice_p5/"
---
{% raw %}
[합성곱 연습](/Hongs_Blog/studies/human-interface-media/convolution-practice/) 문서의 문제 5 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""합성곱 연습 p5: 불연속 합성곱의 길이 (강의 6 p.16).

f[n]이 n = 0~3에서, h[n]이 n = 0~5에서만 0이 아니면 (f * h)[n]은 n = 0~8에서만 0이 아닐 수 있다.
길이 4와 6의 합성곱은 길이 4 + 6 - 1 = 9.
n < 0이면 뒤집은 h[n - m]이 f와 겹치지 않고(경우 a), n > 8이어도 겹치지 않는다(경우 c).
"""


def conv(f, g):
    out = [0] * (len(f) + len(g) - 1)
    for i, a in enumerate(f):
        for j, b in enumerate(g):
            out[i + j] += a * b
    return out


def main() -> None:
    f = [1, 1, 1, 1]
    h = [6, 5, 4, 3, 2, 1]
    y = conv(f, h)
    assert len(y) == 9 and all(v > 0 for v in y)
    assert y == [6, 11, 15, 18, 14, 10, 6, 3, 1]
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
