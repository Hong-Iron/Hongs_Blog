---
layout: "note"
title: "08_array-doubling_verify.py"
display_title: "08_array-doubling_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/array-doubling/"
parent_title: "배열 두 배 늘리기"
description: "자료구조 · 배열 두 배 늘리기 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/08_array-doubling_verify/"
---
{% raw %}
[배열 두 배 늘리기](/Hongs_Blog/studies/data-structures/array-doubling/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""배열 두 배 늘리기: 옮겨 담는 횟수를 세어 문서의 식과 맞춘다.

문서: 08.배열 두 배 늘리기 (복잡도, 2^k 논증, 한 칸씩 늘리기와 비교, 카드)
실행: python3 08_array-doubling_verify.py

세는 것: 용량을 늘리는 순간 이미 들어 있던 원소의 수(= 새 자리로 옮겨 담는 수).
배열을 실제로 만들지 않고 횟수만 센다. 실제 realloc으로 돌린 것은 08_array-doubling_impl.c에 있다.

확인하는 주장
  1. 용량 1에서 시작해 두 배씩 늘리면, n번 넣는 동안 옮긴 수는 (n 이상인 가장 작은 2의 거듭제곱) - 1이고 2n보다 작다.
  2. 문서의 세 걸음 논증: 마지막 용량이 2^k이면 넣은 횟수는 2^(k-1) + 1 이상이고,
     늘릴 때마다 새 용량만큼 일한다고 넉넉히 잡아도 2 + 4 + ... + 2^k = 2^(k+1) - 2 < 4n이다.
  3. 넣기 한 번의 비용을 "넣기 1 + 옮긴 수"로 치면 n번의 합은 3n보다 작다.
  4. 한 칸씩 늘리면 옮긴 수는 n(n-1)/2다. 정해진 칸 수 c씩 늘려도 n^2에 비례한다.
  5. 가끔은 한 번이 비싸다: 2^j + 1번째 넣기는 2^j개를 옮긴다.
"""


def simulate(n, start=1, grow=lambda c: 2 * c):
    """n번 넣는다. 돌려주는 것: (마지막 용량, 옮긴 수의 합, 넣기마다 옮긴 수의 목록)"""
    capacity, size, moved, per_push = start, 0, 0, []
    for _ in range(n):
        now = 0
        if size == capacity:
            now = size
            capacity = grow(capacity)
        size += 1
        moved += now
        per_push.append(now)
    return capacity, moved, per_push


def main():
    N = 100_000

    # --- 주장 1, 2, 3: n = 1..100,000을 한 번에 훑는다 ---
    capacity, size, moved = 1, 0, 0
    worst_ratio = 0.0
    for n in range(1, N + 1):
        if size == capacity:
            moved += size
            capacity *= 2
        size += 1
        power = 1 << (n - 1).bit_length()          # n 이상인 가장 작은 2의 거듭제곱
        assert capacity == power
        assert moved == power - 1 < 2 * n
        assert n + moved < 3 * n
        k = power.bit_length() - 1                 # 용량 = 2^k
        if n >= 2:
            assert n >= 2 ** (k - 1) + 1
        generous = sum(2 ** i for i in range(1, k + 1))
        assert generous == 2 ** (k + 1) - 2
        assert generous < 4 * n
        worst_ratio = max(worst_ratio, moved / n)
    assert (capacity, moved) == (131072, 131071)
    assert worst_ratio < 2
    print(f"[OK] 두 배씩: n = 1..{N:,}에서 옮긴 수 = (n 이상인 가장 작은 2의 거듭제곱) - 1 < 2n")
    print(f"     n = {N:,}이면 용량 {capacity:,}, 옮긴 수 {moved:,}. 옮긴 수 / n의 최댓값 {worst_ratio:.5f} (2보다 작다)")

    # --- 문서의 예시 표 (9번) ---
    cap, mv, per = simulate(9)
    assert (cap, mv) == (16, 15) and per == [0, 1, 2, 0, 4, 0, 0, 0, 8]
    assert [1 + x for x in per] == [1, 2, 3, 1, 5, 1, 1, 1, 9] and 9 + mv == 24 < 27
    print("[OK] 예시 표: 9번 넣기마다 옮긴 수 0 1 2 0 4 0 0 0 8, 합 15")

    # --- 주장 5: 비싼 한 번 ---
    for j in range(0, 17):
        _, _, per = simulate(2 ** j + 1)
        assert per[-1] == 2 ** j
    print("[OK] 2^j + 1번째 넣기는 2^j개를 옮긴다 (j = 0..16). 예: 65,537번째는 65,536개")

    # --- 주장 4: 한 칸씩, 열 칸씩 ---
    capacity, size, moved = 1, 0, 0
    for n in range(1, N + 1):
        if size == capacity:
            moved += size
            capacity += 1
        size += 1
        assert moved == n * (n - 1) // 2
    assert moved == 4_999_950_000
    print(f"[OK] 한 칸씩: 옮긴 수 = n(n-1)/2. n = {N:,}이면 {moved:,} (두 배씩의 {moved // 131071:,}배)")

    for c in (10, 100):
        cap, mv, _ = simulate(N, start=c, grow=lambda x, c=c: x + c)
        m = N // c - 1                              # c, 2c, ..., m*c개가 든 순간에 늘린다 (N은 c의 배수)
        assert mv == c * m * (m + 1) // 2
        assert mv > N * N // (2 * c) - N
    cap, mv10, _ = simulate(N, start=10, grow=lambda x: x + 10)
    assert mv10 == 499_950_000
    print(f"[OK] 열 칸씩: n = {N:,}이면 옮긴 수 {mv10:,}. 칸 수를 정해 놓고 늘리면 n^2에 비례한다")

    # --- n을 두 배로 늘렸을 때 ---
    def moved_double(n):
        return simulate(n)[1]

    def moved_plus_one(n):
        return n * (n - 1) // 2

    assert moved_double(2048) / moved_double(1024) < 2.01
    assert abs(moved_plus_one(2048) / moved_plus_one(1024) - 4) < 0.01
    print("[OK] n을 1,024에서 2,048로: 두 배씩은 옮긴 수 약 2배, 한 칸씩은 약 4배")

    # --- 카드 ---
    cap, mv, per = simulate(6)
    assert (cap, mv, per) == (8, 7, [0, 1, 2, 0, 4, 0])
    assert simulate(2000)[:2] == (2048, 2047) and moved_plus_one(2000) == 1_999_000
    assert simulate(2000, start=10, grow=lambda x: x + 10)[1] == 199_000
    cap, mv, _ = simulate(1000)
    assert (cap, mv) == (1024, 1023) and moved_plus_one(1000) == 499_500
    cap, mv, _ = simulate(100, start=10)
    assert (cap, mv) == (160, 150)
    print("[OK] 카드: 6번이면 용량 8·옮긴 수 7, 1,000번이면 1,023 대 499,500")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
