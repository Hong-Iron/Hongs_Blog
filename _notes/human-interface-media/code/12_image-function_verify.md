---
layout: "note"
title: "12_image-function_verify.py"
display_title: "12_image-function_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "신호와 미디어"
parent_url: "/studies/human-interface-media/image-function/"
parent_title: "이미지 함수"
description: "휴먼 인터페이스 미디어 · 이미지 함수 검증 코드"
permalink: "/studies/human-interface-media/code/12_image-function_verify/"
---
{% raw %}
[이미지 함수](/Hongs_Blog/studies/human-interface-media/image-function/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""이미지 함수 검증.

문서: 12.이미지 함수 (예시로 보기, 정의, 자주 하는 오해, 카드 C2·C3)
주장:
  1. 세 채널 값을 숫자로 더하면(스칼라 합) 색 정보가 사라진다.
     (255,0,0), (0,255,0), (0,0,255), (85,85,85)는 합이 모두 255다.
     채널 영상을 벡터로 더하면 원래 픽셀이 그대로 돌아온다.
  2. 밝기 100인 영역과 20인 영역이 세로 경계로 만나는 영상에서, 전진 차분으로 구한 기울기는
     경계에서만 크기 80이고 나머지는 0이다. x 방향 성분만 있고 y 방향 성분은 0이다.
  3. 공간 주파수 u = 500 cycle/m인 사인 줄무늬는 1 cm 안에 주기가 5번 들어 있다.
"""
import math


def add_vec(*pixels):
    return tuple(sum(c) for c in zip(*pixels))


def main() -> None:
    pixels = [(255, 0, 0), (0, 255, 0), (0, 0, 255), (85, 85, 85)]
    assert {sum(p) for p in pixels} == {255}
    print("[OK] 서로 다른 네 색의 스칼라 합이 모두 255")
    for p in pixels:
        r_img, g_img, b_img = (p[0], 0, 0), (0, p[1], 0), (0, 0, p[2])
        assert add_vec(r_img, g_img, b_img) == p
    print("[OK] 채널 영상의 벡터 합은 원래 픽셀")

    W, H = 6, 4
    img = [[100 if x < 3 else 20 for x in range(W)] for _ in range(H)]
    gx = [[img[y][x + 1] - img[y][x] for x in range(W - 1)] for y in range(H)]
    gy = [[img[y + 1][x] - img[y][x] for x in range(W)] for y in range(H - 1)]
    for y in range(H):
        for x in range(W - 1):
            assert gx[y][x] == (-80 if x == 2 else 0)
    assert all(v == 0 for row in gy for v in row)
    print("[OK] 계단 경계: dI/dx = -80은 x=2~3 사이에만, dI/dy = 0, |grad I| = 80")

    u = 500.0
    n = 100_000
    xs = [i * 0.01 / n for i in range(n + 1)]
    vals = [math.sin(2 * math.pi * u * x + 0.1) for x in xs]
    upward = sum(1 for a, b in zip(vals, vals[1:]) if a < 0 <= b)
    assert upward == 5, upward
    print("[OK] 500 cycle/m 줄무늬: 1 cm 안에 주기 5번")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
