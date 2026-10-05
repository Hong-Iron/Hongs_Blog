---
layout: "note"
title: "섭식장애 사례 연습"
display_title: "섭식장애 사례 연습"
kind: "practice"
kind_label: "연습"
num: "096"
course: "이상 심리학"
course_slug: "abnormal-psychology"
course_url: "/studies/abnormal-psychology/"
track: "4-1학기"
updated: "2026-09-27"
status: "verified"
description: "사용 개념: 신경성 식욕부진증, 신경성 폭식증, 폭식장애, 세 섭식장애 비교, 섭식장애의 초진단적 모델, 회피적·제한적 음식섭취 장애"
prev_url: "/studies/abnormal-psychology/somatic-practice/"
prev_title: "신체증상 관련 장애 사례 연습"
next_url: "/studies/abnormal-psychology/sleep-practice/"
next_title: "수면-각성장애 사례 연습"
math: false
mermaid: false
code_count: 0
permalink: "/studies/abnormal-psychology/eating-practice/"
---
{% raw %}
사용 개념: [신경성 식욕부진증](/Hongs_Blog/studies/abnormal-psychology/anorexia-nervosa/), [신경성 폭식증](/Hongs_Blog/studies/abnormal-psychology/bulimia-nervosa/), [폭식장애](/Hongs_Blog/studies/abnormal-psychology/binge-eating-disorder/), [세 섭식장애 비교](/Hongs_Blog/studies/abnormal-psychology/eating-disorders-contrast/), [섭식장애의 초진단적 모델](/Hongs_Blog/studies/abnormal-psychology/transdiagnostic-eating-model/), [회피적·제한적 음식섭취 장애](/Hongs_Blog/studies/abnormal-psychology/arfid/)

모든 사례는 가상이다[^s1]. 먹는 문제가 적힌 사례는 다섯 하위목표로 푼다. 세 섭식장애 비교의 결정 나무(저체중 → 폭식 → 보상행동)를 순서대로 밟고, 마지막에 먹는 이유를 확인한다.

1. *체중:* BMI를 구하고 뚜렷한 저체중인지 본다. BMI = 몸무게(kg) ÷ 키(m)².
2. *폭식:* 조절력을 잃은 폭식이 있는가, 얼마나 자주 얼마나 오래.
3. *보상행동:* 구토, 설사제·이뇨제, 금식, 과도한 운동이 있는가.
4. *동기:* 먹지 않거나 먹는 이유가 체중·체형 걱정인가, 다른 것(감각, 두려움, 부정 정서)인가.
5. *결론과 치료:* 진단(하위 유형, 심각도), 그리고 맞는 치료.

## 문제 1 · 완전한 풀이

열일곱 살 FV는 키 158cm, 몸무게 42kg이다. 반년 전 55kg에서 줄기 시작했다. 하루 800kcal 이하로 먹고 매일 줄넘기를 2천 번 한다. 폭식하거나 토한 적은 없다. "3kg만 더 빼면 된다"고 말하고, 체중계 숫자가 늘면 하루 종일 기분이 나쁘다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *체중:* 42 ÷ 1.58² ≈ 16.82. 뚜렷한 저체중이다.
2. *폭식:* 없다.
3. *보상행동:* 폭식이 없으므로 보상행동이라 부르지 않는다. 극단적 제한과 과도한 운동은 체중 증가를 막는 행동(기준 B)이다.
4. *동기:* 체중이 기분과 자기 평가를 좌우한다. 저체중인데도 더 빼려 한다.
5. *결론과 치료:* 신경성 식욕부진증 제한형, 중등도(BMI 16 이상 17 미만). 영양 상태에 따라 입원을 검토하고, 체중을 늘리는 행동을 강화하는 인지행동치료와 식사일기, 가족치료를 함께 한다.

</details>


검증: 결정 나무의 첫 질문(저체중)을 먼저 답했는지, BMI 구간을 경계까지 정확히 적용했는지 본다. BMI 계산은 [089_anorexia-nervosa_verify.py](/Hongs_Blog/studies/abnormal-psychology/code/089_anorexia-nervosa_verify/)로 확인했다.

## 문제 2 · 마지막 하위목표만 빈칸

스물두 살 GP는 키 165cm, 몸무게 60kg이다. 1년째 일주일에 두세 번, 혼자 있을 때 빵과 과자를 한꺼번에 먹고 멈추지 못한다. 먹고 나면 설사제를 한 번에 열 알씩 먹는다. "살찌면 끝"이라는 생각이 머리에서 떠나지 않는다.

1. *체중:* 60 ÷ 1.65² ≈ 22.0. 정상 범위다.
2. *폭식:* 조절력을 잃은 폭식이 주 2~3회, 1년.
3. *보상행동:* 설사제 남용.
4. *동기:* 체형·체중이 자기 평가를 좌우한다.
5. *결론과 치료:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="5"}
5. 신경성 폭식증. 폭식-보상 고리를 끊는 인지행동치료(보상행동 억제, 음식·체중에 대한 신념 재구성), 노출 및 반응방지(정해진 음식을 먹은 뒤 설사제를 쓰지 않고 불안이 가라앉는 것을 경험), 공존하는 우울 확인. 설사제 남용에 따른 전해질 이상을 의료적으로 점검한다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

마흔 살 GQ는 키 170cm, 몸무게 95kg이다. 이혼 뒤 1년째, 밤마다 배가 고프지 않아도 냉장고 음식을 빠르게 먹어 치운다. 먹고 나면 역겹고 우울하지만 토하거나 굶지는 않는다. 체중보다는 "먹는 걸 멈출 수 없다는 게 괴롭다"고 한다.

1. *체중:* ______
2. *폭식:* 조절력 상실, 빨리 먹음, 배고프지 않아도 먹음, 먹고 나서 혐오감과 우울. 1년.
3. *보상행동:* ______
4. *동기:* 이혼 뒤의 부정 정서가 폭식을 부른다(정서적 섭식). 체중이 자기 평가의 중심은 아니다.
5. *결론과 치료:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. 95 ÷ 1.70² ≈ 32.9. 비만 범위다.
3. 없다.
5. 폭식장애. 식사일지로 폭식 단서(밤, 혼자 있음, 우울)를 찾고 부정 정서에 대한 다른 대처를 익히는 인지행동치료, 이혼 뒤의 대인관계 문제를 다루는 대인관계 심리치료, 필요하면 항우울제와 체중 관리.

</details>


## 문제 4 · 독립 문제

스무 살 FX는 키 162cm, 몸무게 39kg이다. 2년 전 심한 식중독을 겪은 뒤로 먹고 나서 토할까 봐 무서워 하루에 두유 몇 팩과 크래커만 먹는다. 폭식이나 구토는 없다. "살이 너무 빠져서 걱정이에요. 살찌는 건 오히려 바라요"라고 말한다. 진단을 내리고, 신경성 식욕부진증이 아닌 이유를 쓰라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *체중:* 39 ÷ 1.62² ≈ 14.86. 매우 심한 저체중이다.
2. *폭식:* 없다.
3. *보상행동:* 없다.
4. *동기:* 체중 증가에 대한 두려움이나 체형 왜곡이 없다. 식중독 뒤 먹은 뒤의 나쁜 결과(구토)에 대한 두려움 때문에 제한한다.
5. *결론과 치료:* 회피적·제한적 음식섭취 장애. 저체중이지만 신경성 식욕부진증의 기준 B(체중 증가에 대한 두려움)와 C(체형 경험의 왜곡)가 없다. 의료적 영양 회복과 함께, 두려운 음식과 먹는 상황에 단계적으로 노출하는 치료를 한다.

</details>


## 변형 문제

문제 4의 FX가 치료 중에 "사실 식중독은 핑계였고, 살찌는 게 무서웠다"고 털어놓았다면 진단과 심각도는 어떻게 바뀌는가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

체중 증가에 대한 두려움이 동기라면 신경성 식욕부진증 제한형이다. BMI가 14.86으로 15 미만이므로 심각도는 극도다. 생명의 위험이 크므로 입원 치료를 먼저 검토한다.

</details>


[^s1]: 에이전트 보충. 모든 사례와 풀이는 08.급식 및 섭식장애, 수면-각성장애.pdf의 장애별 설명(p.5~6, 14, 16, 25~26, 29~30, 34~35, 44~46)을 적용한 가상 사례다. 문제 2(GP)와 3(GQ)의 BMI는 22.04와 32.87이다.
{% endraw %}
