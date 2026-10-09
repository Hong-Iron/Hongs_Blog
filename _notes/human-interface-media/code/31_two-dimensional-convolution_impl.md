---
layout: "note"
title: "31_two-dimensional-convolution_impl.py"
display_title: "31_two-dimensional-convolution_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "31"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/two-dimensional-convolution/"
parent_title: "2차원 합성곱"
description: "휴먼 인터페이스 미디어 · 2차원 합성곱 구현 코드"
permalink: "/studies/human-interface-media/code/31_two-dimensional-convolution_impl/"
---
{% raw %}
[2차원 합성곱](/Hongs_Blog/studies/human-interface-media/two-dimensional-convolution/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""2차원 합성곱 구현과 검증.

문서: 31.2차원 합성곱 (예시로 보기, 정의, 실행 추적, 활용, 카드)
인덱스: 영상은 [행][열], 0부터. 커널은 가운데가 (0, 0)이 되도록 홀수 크기만 쓴다.
G[i, j] = Σ_u Σ_v H[u, v] F[i - u, j - v]  (영상 밖은 0으로 본다)

주장:
  1. 3x3 평균 커널(모두 1/9)과 가중 평균 커널([1 2 1; 2 4 2; 1 2 1]/16)은 합이 1이라 고른 영상은 그대로 둔다.
     가중 평균 커널은 [1 2 1]/4 두 개의 바깥곱이라 가로·세로로 나눠 계산해도 같다(분리 가능).
  2. 미분 커널 [-1 1]은 밝기가 고른 곳에서 0, 세로 경계에서만 값이 나온다.
  3. 한 점짜리 임펄스 δ(i - 2, j - 3)와 합성곱하면 영상이 아래로 2, 오른쪽으로 3 옮겨 간다.
  4. 다섯 점에 1/5씩 둔 커널은 다섯 장을 옮겨 평균 낸 것과 같다.
  5. 합성곱은 순서를 바꿔도 같다(F * H = H * F).
  6. 슬라이드 22쪽 예: f는 m, n ∈ {-1, 0, 1}에서 1인 3x3, h는 (m, n) = (1, 0), (0, -1), (0, 0)에서 1.
     g(-1, -2) = 1, g(2, 1) = 1, 값 3이 4칸, 2가 4칸, 1이 7칸(모두 15칸).
  7. 슬라이드 21쪽 예: f = h = 단위 정사각형이면 g(x, y) = tri(x) tri(y),
     (1) 0<x≤1, 0<y≤1에서 xy, (2) 0<x≤1, 1<y≤2에서 x(2-y), (3) 1<x≤2, 0<y≤1에서 (2-x)y, (4) (2-x)(2-y).
  8. 상자 평균의 크기가 클수록 촘촘한 줄무늬가 지워진다. 주기 4픽셀 줄무늬에 폭 3 상자를 쓰면 진폭 1/3,
     폭 5면 1/5로 줄고 부호가 뒤집힌다(밝은 줄과 어두운 줄이 바뀐다). 폭 4(주기의 배수)면 0이 된다.
"""
import math


def conv2(F, H):
    """전체 합성곱. F는 r x c, H는 p x q. 결과는 (r+p-1) x (c+q-1)."""
    r, c, p, q = len(F), len(F[0]), len(H), len(H[0])
    G = [[0.0] * (c + q - 1) for _ in range(r + p - 1)]
    for i in range(r):
        for j in range(c):
            for u in range(p):
                for v in range(q):
                    G[i + u][j + v] += F[i][j] * H[u][v]
    return G


def conv2_same(F, H):
    """결과를 F와 같은 크기로 자른다(커널 가운데 기준)."""
    p, q = len(H), len(H[0])
    G = conv2(F, H)
    return [row[q // 2: q // 2 + len(F[0])] for row in G[p // 2: p // 2 + len(F)]]


def close(A, B, eps=1e-9):
    return all(abs(a - b) < eps for ra, rb in zip(A, B) for a, b in zip(ra, rb))


def main() -> None:
    # 1. 평균 커널
    box = [[1 / 9] * 3 for _ in range(3)]
    w = [[1, 2, 1], [2, 4, 2], [1, 2, 1]]
    wk = [[v / 16 for v in row] for row in w]
    assert abs(sum(map(sum, box)) - 1) < 1e-12 and sum(map(sum, w)) == 16
    flat = [[7.0] * 6 for _ in range(6)]
    inner = lambda M: [row[1:-1] for row in M[1:-1]]
    assert close(inner(conv2_same(flat, box)), inner(flat)) and close(inner(conv2_same(flat, wk)), inner(flat))
    a = [1 / 4, 2 / 4, 1 / 4]
    assert close([[x * y for y in a] for x in a], wk)
    img = [[(3 * i + j * j) % 7 for j in range(6)] for i in range(5)]
    two_pass = conv2(conv2(img, [a]), [[x] for x in a])
    assert close(two_pass, conv2(img, wk))
    F35 = [[3, 4, 5, 6, 0], [6, 0, 4, 2, 0], [1, 2, 3, 4, 5]]          # 문서의 3x5 예
    assert abs(conv2_same(F35, box)[1][1] - 28 / 9) < 1e-12
    corr = [[-F[j] + F[j + 1] for j in range(5)] for F in [[10, 10, 10, 50, 50, 50]]]
    assert corr[0][2] == 40                                         # 돌리지 않으면 +40
    # 2. 미분 커널
    step = [[10, 10, 10, 50, 50, 50] for _ in range(3)]
    d = conv2(step, [[-1, 1]])
    nz = {j for row in d for j, v in enumerate(row) if v != 0}
    assert nz == {0, 3, 6}            # 왼쪽 끝(0에서 시작), 경계(3), 오른쪽 끝(밖은 0)
    assert all(row[3] == -40 for row in d)
    # 3. 임펄스로 옮기기
    imp = [[0] * 4 for _ in range(3)]
    imp[2][3] = 1
    g = conv2([[5, 6], [7, 8]], imp)
    assert g[2][3] == 5 and g[3][4] == 8 and sum(map(sum, g)) == 26
    # 4. 다섯 임펄스 평균
    K = [[0.0] * 3 for _ in range(3)]
    for (u, v) in [(0, 0), (0, 2), (1, 1), (2, 0), (2, 2)]:
        K[u][v] = 1 / 5
    copies = []
    for (u, v) in [(0, 0), (0, 2), (1, 1), (2, 0), (2, 2)]:
        D = [[0] * 3 for _ in range(3)]
        D[u][v] = 1
        copies.append(conv2(img, D))
    avg = [[sum(c[i][j] for c in copies) / 5 for j in range(len(copies[0][0]))] for i in range(len(copies[0]))]
    assert close(conv2(img, K), avg)
    # 5. 교환
    assert close(conv2(img, w), conv2(w, img))
    # 6. 슬라이드 22쪽
    f = {(m, n): 1 for m in (-1, 0, 1) for n in (-1, 0, 1)}
    h = {(1, 0): 1, (0, -1): 1, (0, 0): 1}
    gg = {}
    for (m1, n1), v1 in f.items():
        for (m2, n2), v2 in h.items():
            gg[(m1 + m2, n1 + n2)] = gg.get((m1 + m2, n1 + n2), 0) + v1 * v2
    assert gg[(-1, -2)] == 1 and gg[(2, 1)] == 1
    cnt = {k: sum(1 for v in gg.values() if v == k) for k in (1, 2, 3)}
    assert cnt == {1: 7, 2: 4, 3: 4} and len(gg) == 15
    assert gg[(1, -1)] == 3 and gg[(1, 1)] == 2 and gg[(-1, -1)] == 2 and gg[(-1, 1)] == 1
    # 7. 슬라이드 21쪽: 수치 적분으로 g(x, y) 확인
    N = 400
    def g_num(x, y):
        s = 0
        for i in range(N):
            al = (i + 0.5) / N
            for j in range(N):
                be = (j + 0.5) / N
                if 0 <= x - al <= 1 and 0 <= y - be <= 1:
                    s += 1
        return s / N ** 2
    tri = lambda t: t if t <= 1 else 2 - t
    for (x, y) in [(0.5, 0.5), (0.6, 1.5), (1.3, 0.4), (1.5, 1.7)]:
        assert abs(g_num(x, y) - tri(x) * tri(y)) < 0.01
    assert abs(tri(0.6) * tri(1.5) - 0.6 * (2 - 1.5)) < 1e-12
    # 8. 상자 크기와 줄무늬
    def gain(u, width):
        return math.sin(math.pi * u * width) / (width * math.sin(math.pi * u))
    assert abs(gain(0.25, 3) - 1 / 3) < 1e-12
    assert abs(gain(0.25, 5) + 1 / 5) < 1e-12
    assert abs(gain(0.25, 4)) < 1e-12
    stripes = [math.cos(2 * math.pi * 0.25 * n) for n in range(40)]
    sm = [sum(stripes[n + k] for k in (-1, 0, 1)) / 3 for n in range(1, 39)]
    assert abs(max(sm) - 1 / 3) < 1e-9
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
