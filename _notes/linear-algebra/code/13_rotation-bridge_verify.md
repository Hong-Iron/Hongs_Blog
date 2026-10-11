---
layout: "note"
title: "13_rotation-bridge_verify.py"
display_title: "13_rotation-bridge_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "13"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/rotation-bridge/"
parent_title: "덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬"
description: "선형대수학 · 덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬 검증 코드"
permalink: "/studies/linear-algebra/code/13_rotation-bridge_verify/"
---
{% raw %}
[덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬](/Hongs_Blog/studies/linear-algebra/rotation-bridge/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬 검증.

문서: 13.덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬 (비교 표, 대응 관계, 어디까지 같은가, 얻는 것, 전이 문제, 카드 C1~C3)
주장 1: 덧셈정리와 R_β R_α = R_{α+β}, e^{iα}e^{iβ} = e^{i(α+β)} (무작위 각 1000개).
주장 2: a + bi <-> [[a,-b],[b,a]]: 곱이 대응, 행렬식 = |z|², 켤레 <-> 전치, i <-> R90, R90² = -I.
주장 3: 드무아브르 (cos α + i sin α)^n = cos nα + i sin nα, R_α^n = R_{nα}, 배각 공식.
주장 4: 반사·전단은 [[a,-b],[b,a]] 꼴이 아니다. 2D 회전·복소수 곱은 교환된다.
주장 5: 3D — Rx(90°)Rz(90°) ≠ Rz(90°)Rx(90°), e1의 두 결과 (0,0,1)과 (0,1,0).
주장 6: 전이 문제 — 3 sin(ωt) + 4 sin(ωt + 90°) = 5 sin(ωt + 53.13°) (여러 t에서).
주장 7: 카드 C1 — (1+2i)(3-i) = 5+5i, 행렬 곱 [[5,-5],[5,5]].
주장 8: 구현 — d * exp(i t)가 행렬 회전과 같다.
"""
import cmath
import math
import random


def R(t):
    return [[math.cos(t), -math.sin(t)], [math.sin(t), math.cos(t)]]


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def M(z):
    return [[z.real, -z.imag], [z.imag, z.real]]


def close(A, B, tol=1e-9):
    return all(abs(a - b) < tol for ra, rb in zip(A, B) for a, b in zip(ra, rb))


def main():
    rng = random.Random(13)
    for _ in range(1000):
        a, b = rng.uniform(-10, 10), rng.uniform(-10, 10)
        assert abs(math.cos(a + b) - (math.cos(a) * math.cos(b) - math.sin(a) * math.sin(b))) < 1e-12
        assert abs(math.sin(a + b) - (math.sin(a) * math.cos(b) + math.cos(a) * math.sin(b))) < 1e-12
        assert close(mm(R(b), R(a)), R(a + b))
        assert abs(cmath.exp(1j * a) * cmath.exp(1j * b) - cmath.exp(1j * (a + b))) < 1e-12
    print("[OK] 주장 1·카드 C2: 덧셈정리 세 가지")

    for _ in range(500):
        z = complex(rng.uniform(-5, 5), rng.uniform(-5, 5))
        w = complex(rng.uniform(-5, 5), rng.uniform(-5, 5))
        assert close(mm(M(z), M(w)), M(z * w))
        det = z.real * z.real + z.imag * z.imag
        assert abs(det - abs(z) ** 2) < 1e-9
        Mt = [list(r) for r in zip(*M(z))]
        assert close(Mt, M(z.conjugate()))
    R90 = [[0, -1], [1, 0]]
    assert M(1j) == [[0, -1], [1, 0]] == R90 and mm(R90, R90) == [[-1, 0], [0, -1]]
    print("[OK] 주장 2: 복소수 <-> 행렬")

    for _ in range(300):
        a, n = rng.uniform(-3, 3), rng.randint(0, 12)
        assert abs(complex(math.cos(a), math.sin(a)) ** n - complex(math.cos(n * a), math.sin(n * a))) < 1e-9
        P = [[1.0, 0.0], [0.0, 1.0]]
        for _ in range(n):
            P = mm(P, R(a))
        assert close(P, R(n * a), 1e-9)
        z2 = complex(math.cos(a), math.sin(a)) ** 2
        assert abs(z2.real - (math.cos(a) ** 2 - math.sin(a) ** 2)) < 1e-12 and abs(z2.imag - 2 * math.sin(a) * math.cos(a)) < 1e-12
    print("[OK] 주장 3: 드무아브르와 배각")

    is_cx = lambda A: A[0][0] == A[1][1] and A[0][1] == -A[1][0]
    assert not is_cx([[1, 0], [0, -1]]) and not is_cx([[1, 1], [0, 1]])
    for _ in range(200):
        a, b = rng.uniform(-5, 5), rng.uniform(-5, 5)
        assert close(mm(R(a), R(b)), mm(R(b), R(a)))
    print("[OK] 주장 4: 복소수가 되는 행렬, 2D 교환")

    Rx = [[1, 0, 0], [0, 0, -1], [0, 1, 0]]
    Rz = [[0, -1, 0], [1, 0, 0], [0, 0, 1]]
    assert mm(Rx, Rz) != mm(Rz, Rx)
    e1 = [[1], [0], [0]]
    assert [r[0] for r in mm(Rx, mm(Rz, e1))] == [0, 0, 1]
    assert [r[0] for r in mm(Rz, mm(Rx, e1))] == [0, 1, 0]
    print("[OK] 주장 5·카드 C3: 3D 비교환")

    z = 3 + 4j
    A, phi = abs(z), math.degrees(cmath.phase(z))
    assert abs(A - 5) < 1e-12 and abs(phi - 53.13) < 0.01
    w = 2.0
    for _ in range(200):
        t = rng.uniform(0, 10)
        lhs = 3 * math.sin(w * t) + 4 * math.sin(w * t + math.pi / 2)
        assert abs(lhs - 5 * math.sin(w * t + math.radians(phi))) < 1e-9
    print("[OK] 주장 6: 전이 문제")

    assert (1 + 2j) * (3 - 1j) == 5 + 5j
    assert mm([[1, -2], [2, 1]], [[3, 1], [-1, 3]]) == [[5, -5], [5, 5]]
    print("[OK] 주장 7·카드 C1")

    for _ in range(200):
        d = complex(rng.uniform(-3, 3), rng.uniform(-3, 3))
        t = rng.uniform(-4, 4)
        r = d * cmath.exp(1j * t)
        v = mm(R(t), [[d.real], [d.imag]])
        assert abs(r.real - v[0][0]) < 1e-9 and abs(r.imag - v[1][0]) < 1e-9
    print("[OK] 주장 8: 복소수로 회전 구현")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
