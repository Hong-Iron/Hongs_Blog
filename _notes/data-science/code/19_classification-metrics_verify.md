---
layout: "note"
title: "19_classification-metrics_verify.py"
display_title: "19_classification-metrics_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "19"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/classification-metrics/"
parent_title: "분류 평가 지표"
description: "데이터 과학 · 분류 평가 지표 검증 코드"
permalink: "/studies/data-science/code/19_classification-metrics_verify/"
---
{% raw %}
[분류 평가 지표](/Hongs_Blog/studies/data-science/classification-metrics/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""분류 평가 지표 검증.

문서: 19.분류 평가 지표 (예시, 정의, 카드)
출처: 데이터 과학 6회 슬라이드 6-2 p.4 (6-1 복습)
주장:
  1. 환자 1,000명 중 양성 10명. 모두 음성이라 답하는 모델은 정확도 99%지만 재현율 0.
  2. 혼동 행렬 TP 8, FN 2, FP 40, TN 950: 정확도 95.8%, 정밀도 16.7%, 재현율 80%, F1 27.6%.
  3. F1은 정밀도와 재현율의 조화평균이라 둘 중 작은 쪽에 끌린다 (산술평균 이하).
  4. 카드 C2: TP 30, FP 10, FN 20, TN 940 -> 정밀도 75%, 재현율 60%, F1 66.7%.
"""


def metrics(tp, fn, fp, tn):
    acc = (tp + tn) / (tp + tn + fp + fn)
    prec = tp / (tp + fp) if tp + fp else 0.0
    rec = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * prec * rec / (prec + rec) if prec + rec else 0.0
    return acc, prec, rec, f1


def main():
    acc, prec, rec, f1 = metrics(0, 10, 0, 990)
    assert acc == 0.99 and rec == 0 and f1 == 0
    print("[OK] 모두 음성: 정확도 99%, 재현율 0, F1 0")
    acc, prec, rec, f1 = metrics(8, 2, 40, 950)
    assert (round(acc, 3), round(prec, 3), rec, round(f1, 3)) == (0.958, 0.167, 0.8, 0.276)
    assert f1 <= (prec + rec) / 2 and f1 >= min(prec, rec)
    print(f"[OK] TP 8 FN 2 FP 40 TN 950: 정확도 {acc:.3f}, 정밀도 {prec:.3f}, 재현율 {rec}, F1 {f1:.3f}")
    import itertools
    for p, r in itertools.product([i / 20 for i in range(1, 21)], repeat=2):
        h = 2 * p * r / (p + r)
        assert min(p, r) - 1e-12 <= h <= (p + r) / 2 + 1e-12
    print("[OK] 조화평균은 작은 값 이상, 산술평균 이하 (0.05 간격 400쌍)")
    acc, prec, rec, f1 = metrics(30, 20, 10, 940)
    assert (prec, rec, round(f1, 3)) == (0.75, 0.6, 0.667)
    print("[OK] 카드 C2: 정밀도 75%, 재현율 60%, F1 66.7%")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
