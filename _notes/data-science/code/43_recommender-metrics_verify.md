---
layout: "note"
title: "43_recommender-metrics_verify.py"
display_title: "43_recommender-metrics_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "43"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/recommender-metrics/"
parent_title: "추천 평가 지표"
description: "데이터 과학 · 추천 평가 지표 검증 코드"
permalink: "/studies/data-science/code/43_recommender-metrics_verify/"
---
{% raw %}
[추천 평가 지표](/Hongs_Blog/studies/data-science/recommender-metrics/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""추천 평가 지표 검증.

문서: 43.추천 평가 지표 (예시, 정의, 카드)
출처: 데이터 과학 11회 슬라이드 11-2 p.11~20
주장:
  1. r = [5,4,3,2,1], r^ = [4,5,2,1,5]: MSE 4, MAE 1.6, RMSE 2.
  2. 추천 목록 [A,B,C,D,E], 관련 항목 {B,D,F,G}: P@5 = 0.4, R@5 = 0.5, F1@5 = 4/9, HR@5 = 1.
  3. 관련 항목 {B,D}: MR = (2+4)/2 = 3, RR = 1/2, DCG@5 = 1/log2 3 + 1/log2 5 ≈ 1.062, IDCG@5 ≈ 1.631, nDCG ≈ 0.651.
  4. MRR은 [A,B,C,D,E]와 [A,B,C,E,F] (관련 B만)에서 같다(0.5). nDCG는 다르다.
  5. 카드 C2: 목록 [X,Y,Z,W], 관련 {Z} -> P@4 0.25, R@4 1, RR 1/3, nDCG = (1/log2 4)/(1/log2 2) = 0.5.
"""
import math


def mse(r, p): return sum((a - b) ** 2 for a, b in zip(r, p)) / len(r)
def mae(r, p): return sum(abs(a - b) for a, b in zip(r, p)) / len(r)
def prec(rec, rel, k): return len(set(rec[:k]) & rel) / k
def recall(rec, rel, k): return len(set(rec[:k]) & rel) / len(rel)
def hr(rec, rel, k): return int(bool(set(rec[:k]) & rel))
def ranks(rec, rel): return [i + 1 for i, x in enumerate(rec) if x in rel]
def mr(rec, rel): rs = ranks(rec, rel); return sum(rs) / len(rs)
def rr(rec, rel): rs = ranks(rec, rel); return 1 / rs[0] if rs else 0.0
def dcg(rec, rel, k): return sum((2 ** (x in rel) - 1) / math.log2(i + 2) for i, x in enumerate(rec[:k]))
def ndcg(rec, rel, k):
    idcg = sum(1 / math.log2(i + 2) for i in range(min(len(rel), k)))
    return dcg(rec, rel, k) / idcg


def main():
    r = [5, 4, 3, 2, 1]; p = [4, 5, 2, 1, 5]
    assert mse(r, p) == 4 and mae(r, p) == 1.6 and math.sqrt(mse(r, p)) == 2
    print("[OK] p.11~12: MSE 4, MAE 1.6, RMSE 2")
    rec = list("ABCDE"); rel = set("BDFG")
    P, R = prec(rec, rel, 5), recall(rec, rel, 5)
    assert (P, R, hr(rec, rel, 5)) == (0.4, 0.5, 1) and abs(2 * P * R / (P + R) - 4 / 9) < 1e-12
    print("[OK] p.13~15: P@5 0.4, R@5 0.5, F1@5 4/9, HR@5 1")
    rel2 = set("BD")
    assert mr(rec, rel2) == 3 and rr(rec, rel2) == 0.5
    d, n = dcg(rec, rel2, 5), ndcg(rec, rel2, 5)
    assert round(d, 3) == 1.062 and round(1 + 1 / math.log2(3), 3) == 1.631 and round(n, 3) == 0.651
    print(f"[OK] p.16~18: MR 3, RR 0.5, DCG {d:.3f}, nDCG {n:.3f}")
    other = list("ABCEF")
    assert rr(rec, rel2) == rr(other, set("B")) and ndcg(rec, rel2, 5) != ndcg(other, set("B"), 5)
    print(f"[OK] p.17: RR은 같고(0.5) nDCG는 다르다 ({ndcg(rec, rel2, 5):.3f} 대 {ndcg(other, set('B'), 5):.3f})")
    c = list("XYZW"); cr = {"Z"}
    assert (prec(c, cr, 4), recall(c, cr, 4), rr(c, cr)) == (0.25, 1.0, 1 / 3) and abs(ndcg(c, cr, 4) - 0.5) < 1e-12
    print("[OK] 카드 C2: P@4 0.25, R@4 1, RR 1/3, nDCG 0.5")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
