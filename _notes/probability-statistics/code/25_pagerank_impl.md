---
layout: "note"
title: "25_pagerank_impl.py"
display_title: "25_pagerank_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "25"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/pagerank/"
parent_title: "PageRank"
description: "확률과 통계 · PageRank 구현 코드"
permalink: "/studies/probability-statistics/code/25_pagerank_impl/"
---
{% raw %}
[PageRank](/Hongs_Blog/studies/probability-statistics/pagerank/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""PageRank 구현과 자체 테스트.

문서: 25.PageRank
pagerank(links, n, d=0.85, tol=1e-10, max_iter=1000) -> (r, iterations)
    links: {페이지: [링크한 페이지들]}, 페이지 번호는 0..n-1(0-based).
    나가는 링크가 없는 페이지(댕글링)는 모든 페이지로 고르게 링크한 것으로 본다.
    한 반복은 링크 수 m에 대해 O(n + m)이다. 조밀한 구글 행렬을 만들지 않는다.
"""


def pagerank(links, n, d=0.85, tol=1e-10, max_iter=1000):
    r = [1.0 / n] * n
    for it in range(1, max_iter + 1):
        dangling = sum(r[i] for i in range(n) if not links.get(i))
        new = [(1 - d) / n + d * dangling / n] * n
        for i, outs in links.items():
            if outs:
                share = d * r[i] / len(outs)
                for j in outs:
                    new[j] += share
        diff = sum(abs(a - b) for a, b in zip(new, r))
        r = new
        if diff < tol:
            return r, it
    return r, max_iter


if __name__ == "__main__":
    links = {0: [1, 2], 1: [2], 2: [0], 3: [2]}
    r, it = pagerank(links, 4)
    assert abs(sum(r) - 1) < 1e-12
    assert [round(x, 4) for x in r] == [0.3725, 0.1958, 0.3941, 0.0375]
    # 대칭 그래프(사이클)는 모두 같은 점수
    r, _ = pagerank({i: [(i + 1) % 5] for i in range(5)}, 5)
    assert all(abs(x - 0.2) < 1e-9 for x in r)
    # 댕글링 페이지가 있어도 합이 1
    r, _ = pagerank({0: [1], 1: [], 2: [0, 1]}, 3)
    assert abs(sum(r) - 1) < 1e-12 and min(r) > 0
    print("impl tests passed")
```
{% endraw %}
