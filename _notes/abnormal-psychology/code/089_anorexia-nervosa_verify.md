---
layout: "note"
title: "089_anorexia-nervosa_verify.py"
display_title: "089_anorexia-nervosa_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "089"
course: "이상 심리학"
course_slug: "abnormal-psychology"
course_url: "/studies/abnormal-psychology/"
track: "4-1학기"
parent_url: "/studies/abnormal-psychology/anorexia-nervosa/"
parent_title: "신경성 식욕부진증"
description: "이상 심리학 · 신경성 식욕부진증 검증 코드"
permalink: "/studies/abnormal-psychology/code/089_anorexia-nervosa_verify/"
---
{% raw %}
[신경성 식욕부진증](/Hongs_Blog/studies/abnormal-psychology/anorexia-nervosa/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""신경성 식욕부진증 문서의 BMI 계산과 심각도 분류를 검증한다.

BMI = 몸무게(kg) / 키(m)^2
DSM-5-TR 성인 심각도: 경도 BMI >= 17, 중등도 16 <= BMI < 17,
고도 15 <= BMI < 16, 극도 BMI < 15.
"""


def bmi(weight_kg: float, height_m: float) -> float:
    return weight_kg / height_m ** 2


def severity(b: float) -> str:
    if b >= 17:
        return "경도"
    if b >= 16:
        return "중등도"
    if b >= 15:
        return "고도"
    return "극도"


if __name__ == "__main__":
    # 문서와 연습 문제에 나오는 사례: (이름, 키 m, 몸무게 kg, 기대 BMI 소수 둘째 자리, 기대 심각도)
    cases = [
        ("FP", 1.60, 38, 14.84, "극도"),   # 088 예시, 089 예시
        ("FU", 1.65, 45, 16.53, "중등도"),  # 089 C2
        ("FV", 1.58, 42, 16.82, "중등도"),  # 연습 문제 1
        ("FW", 1.70, 50, 17.30, "경도"),    # 089 C2
        ("FX", 1.62, 39, 14.86, "극도"),    # 연습 문제 4
        ("FY", 1.58, 38, 15.22, "고도"),    # 089 C4
    ]
    for name, h, w, want_b, want_s in cases:
        b = bmi(w, h)
        assert round(b, 2) == want_b, (name, b)
        assert severity(b) == want_s, (name, b, severity(b))
        print(f"{name}: BMI {b:.2f} -> {severity(b)}")

    # 신경성 폭식증 예시(FZ): 정상 체중 범위(18.5 이상 25 미만)
    fz = bmi(55, 1.63)
    assert round(fz, 2) == 20.70 and 18.5 <= fz < 25, fz
    print(f"FZ: BMI {fz:.2f} -> 정상 범위")

    # 섭식장애 사례 연습 문제 2(GP, 정상)와 3(GQ, 비만 30 이상)
    gp, gq = bmi(60, 1.65), bmi(95, 1.70)
    assert round(gp, 2) == 22.04 and 18.5 <= gp < 25, gp
    assert round(gq, 2) == 32.87 and gq >= 30, gq
    print(f"GP: BMI {gp:.2f}, GQ: BMI {gq:.2f}")

    # 경계값: 17.0은 경도, 16.99는 중등도, 15.0은 고도, 14.99는 극도
    assert severity(17.0) == "경도"
    assert severity(16.99) == "중등도"
    assert severity(16.0) == "중등도"
    assert severity(15.99) == "고도"
    assert severity(15.0) == "고도"
    assert severity(14.99) == "극도"
    print("경계값 6개 통과")
    print("ALL CHECKS PASSED")
```
{% endraw %}
