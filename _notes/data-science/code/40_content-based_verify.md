---
layout: "note"
title: "40_content-based_verify.py"
display_title: "40_content-based_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "40"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/content-based-recommendation/"
parent_title: "내용 기반 추천"
description: "데이터 과학 · 내용 기반 추천 검증 코드"
permalink: "/studies/data-science/code/40_content-based_verify/"
---
{% raw %}
[내용 기반 추천](/Hongs_Blog/studies/data-science/content-based-recommendation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""내용 기반 추천(TF-IDF, 사용자 프로필, 코사인 효용) 검증.

문서: 40.내용 기반 추천 (예시, 정의, 카드)
출처: 데이터 과학 11회 슬라이드 11-1 p.13~19
TF_ij = f_ij / max_z f_zj,  IDF_i = log(N / n_i),  w_ij = TF_ij * IDF_i  (로그는 밑 2)
사용자 프로필 = 읽은 글 벡터의 평균, 효용 u(c, s) = cos(사용자 프로필, 글 프로필)
주장:
  1. 글 4개 × 단어 4개 예에서 TF-IDF 값과 효용의 순서(생명정보학 글이 위).
  2. 모든 글에 나오는 단어는 IDF = 0이라 가중치 0(구별에 쓸모없다).
  3. 새 글은 평점이 없어도 프로필만 있으면 효용을 계산할 수 있다(새 아이템에 강함).
  4. 카드 C2: 단어가 글 8개 중 2개에 나오면 IDF = log2 4 = 2, 그 글에서 최대 빈도가 4이고 이 단어가 2번이면 TF 0.5, 가중치 1.
"""
import math

WORDS = ["genome", "sequencing", "network", "the"]
DOCS = {  # 단어별 등장 횟수
    "p1": [5, 3, 0, 9],   # 생명정보학
    "p2": [4, 4, 1, 8],   # 생명정보학
    "p3": [0, 0, 6, 7],   # 네트워크
    "p4": [0, 1, 5, 9],   # 네트워크
}


def tfidf(docs):
    N = len(docs)
    n = [sum(1 for f in docs.values() if f[i] > 0) for i in range(len(WORDS))]
    idf = [math.log2(N / k) for k in n]
    out = {}
    for d, f in docs.items():
        m = max(f)
        out[d] = [f[i] / m * idf[i] for i in range(len(WORDS))]
    return out, idf


def cos(a, b):
    na = math.sqrt(sum(x * x for x in a)); nb = math.sqrt(sum(x * x for x in b))
    return sum(x * y for x, y in zip(a, b)) / (na * nb) if na and nb else 0.0


def main():
    w, idf = tfidf(DOCS)
    assert idf[3] == 0 and all(w[d][3] == 0 for d in w)
    print("[OK] 모든 글에 나오는 'the'는 IDF 0, 가중치 0")
    assert round(idf[0], 3) == 1.0 and round(idf[2], 3) == round(math.log2(4 / 3), 3)
    print("     IDF:", [round(x, 3) for x in idf])
    print("     p1 가중치:", [round(x, 3) for x in w["p1"]])
    user = [sum(w[d][i] for d in ("p1",)) for i in range(4)]       # 사용자는 p1을 읽었다
    cands = {d: cos(user, w[d]) for d in ("p2", "p3", "p4")}
    print("     효용:", {d: round(v, 3) for d, v in cands.items()})
    assert max(cands, key=cands.get) == "p2" and cands["p3"] < cands["p2"]
    print("[OK] 생명정보학 글 p2의 효용이 가장 높다")
    new = [3, 2, 0, 5]
    m = max(new); wn = [new[i] / m * idf[i] for i in range(4)]
    assert cos(user, wn) > 0.9
    print(f"[OK] 평점 없는 새 글도 효용 {cos(user, wn):.3f} 계산 가능")
    assert math.log2(8 / 2) == 2 and 2 / 4 * 2 == 1
    print("[OK] 카드 C2: IDF 2, TF 0.5, 가중치 1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
