---
layout: "note"
title: "20_sequences-sigma_verify.py"
display_title: "20_sequences-sigma_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "20"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
parent_url: "/studies/college-math/sequences-sigma/"
parent_title: "수열과 합의 기호"
description: "대학수학 · 수열과 합의 기호 검증 코드"
permalink: "/studies/college-math/code/20_sequences-sigma_verify/"
---
{% raw %}
[수열과 합의 기호](/Hongs_Blog/studies/college-math/sequences-sigma/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""수열과 합의 기호 검증.

문서: 20.수열과 합의 기호 (예시, 정의, 증명, 예제, 카드 C1~C3)
주장 1: Σ_{k=1}^{n} k = n(n+1)/2, Σ k² = n(n+1)(2n+1)/6 (n <= 2,000 전수).
주장 2: 등차수열 합 = 항 수 × (첫 항 + 끝 항)/2, 항 수는 n - m + 1.
주장 3: Σ_{k=3}^{10} (2k + 1) = 112.
주장 4: for i in range(n): for j in range(i): 의 안쪽 실행 횟수는 n(n-1)/2.
        for i in range(n): for j in range(i, n): 은 n(n+1)/2.
주장 5: (k+1)³ - k³ = 3k² + 3k + 1을 더하면 망원합으로 Σk²가 나온다.
"""


def main():
    for n in range(0, 2001):
        assert sum(range(1, n + 1)) == n * (n + 1) // 2
        assert sum(k * k for k in range(1, n + 1)) == n * (n + 1) * (2 * n + 1) // 6
    print("[OK] 주장 1: n <= 2,000 전수")

    for a1 in range(-5, 6):
        for d in range(-3, 4):
            for n in range(1, 30):
                terms = [a1 + (k - 1) * d for k in range(1, n + 1)]
                assert 2 * sum(terms) == n * (terms[0] + terms[-1])
    assert len(range(3, 11)) == 10 - 3 + 1
    print("[OK] 주장 2")

    assert sum(2 * k + 1 for k in range(3, 11)) == 112
    print("[OK] 주장 3·카드 C1: 112")

    for n in range(0, 200):
        c1 = sum(1 for i in range(n) for j in range(i))
        c2 = sum(1 for i in range(n) for j in range(i, n))
        assert c1 == n * (n - 1) // 2 and c2 == n * (n + 1) // 2
    print("[OK] 주장 4·카드 C2: 이중 반복문 횟수")

    for n in range(1, 500):
        telescoped = (n + 1) ** 3 - 1
        assert telescoped == sum((k + 1) ** 3 - k ** 3 for k in range(1, n + 1))
        assert telescoped == 3 * sum(k * k for k in range(1, n + 1)) + 3 * n * (n + 1) // 2 + n
    print("[OK] 주장 5: 망원합")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
