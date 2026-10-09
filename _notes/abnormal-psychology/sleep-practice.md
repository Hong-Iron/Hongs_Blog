---
layout: "note"
title: "수면-각성장애 사례 연습"
display_title: "수면-각성장애 사례 연습"
kind: "practice"
kind_label: "연습"
num: "105"
course: "이상 심리학"
course_slug: "abnormal-psychology"
course_url: "/studies/abnormal-psychology/"
track: "심리학"
updated: "2026-09-27"
status: "verified"
description: "사용 개념: 수면-각성장애, 불면장애, 불면증 인지행동치료, 과다수면장애, 기면증, 일주기 리듬 수면-각성장애, 사건수면"
prev_url: "/studies/abnormal-psychology/eating-practice/"
prev_title: "섭식장애 사례 연습"
next_url: "/studies/abnormal-psychology/sex-related-practice/"
next_title: "성 관련 장애 사례 연습"
math: false
mermaid: false
code_count: 0
permalink: "/studies/abnormal-psychology/sleep-practice/"
---
{% raw %}
사용 개념: [수면-각성장애](/Hongs_Blog/studies/abnormal-psychology/sleep-wake-disorders/), [불면장애](/Hongs_Blog/studies/abnormal-psychology/insomnia-disorder/), [불면증 인지행동치료](/Hongs_Blog/studies/abnormal-psychology/cbt-i/), [과다수면장애](/Hongs_Blog/studies/abnormal-psychology/hypersomnolence-disorder/), [기면증](/Hongs_Blog/studies/abnormal-psychology/narcolepsy/), [일주기 리듬 수면-각성장애](/Hongs_Blog/studies/abnormal-psychology/circadian-rhythm-sleep/), [사건수면](/Hongs_Blog/studies/abnormal-psychology/parasomnias/)

모든 사례는 가상이다[^s1]. 잠 문제가 적힌 사례는 다섯 하위목표로 푼다. 수면장애는 "밤에 무엇이 잘못되어 낮에 어떤 대가를 치르는가"로 갈린다.

1. *주된 호소:* 못 자는가, 충분히 자도 졸린가, 시간대가 어긋났는가, 자는 동안 이상 행동이 있는가.
2. *잘 기회와 시간대:* 잘 기회가 충분한가, 제 시간표대로 자게 두면 괜찮은가.
3. *빈도와 기간:* 주 몇 회, 몇 달.
4. *배제:* 호흡 문제, 약물·카페인, 다른 장애(우울), 정상 변이(장면가, 노화).
5. *결론과 치료:* 진단, 그리고 맞는 치료.

## 문제 1 · 완전한 풀이

회사원 GV는 밤 10시 30분에 눕고 아침 7시에 일어난다. 수면일지를 보면 잠들기까지 평균 60분이 걸리고, 밤중에 두 번 깨어 모두 45분쯤 깨어 있다. 넉 달째 주 5일 이상 이렇다. 낮에는 집중이 안 되어 회의에서 실수한다. 코골이나 호흡 정지는 없고, 우울한 기분도 없다고 한다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *주된 호소:* 잠들기와 수면 유지가 어렵다.
2. *잘 기회와 시간대:* 침대에 8시간 30분(510분) 있어 잘 기회는 충분하다.
3. *빈도와 기간:* 주 5일 이상, 4개월. 주 3일 이상·3개월 이상을 채운다.
4. *배제:* 호흡 문제와 우울이 없다고 확인했다.
5. *결론과 치료:* 불면장애(수면 시작과 수면 유지). CBT-I를 먼저 쓴다. 실제 수면은 510 − 60 − 45 = 405분, 수면 효율은 405 ÷ 510 ≈ 79.4%다. 수면제한으로 침대 시간을 405분으로 줄여, 기상 7시를 고정하고 0시 15분에 눕게 한다. 20분쯤 잠이 안 오면 침대에서 나오는 자극통제를 함께 한다.

</details>


검증: 수면 효율을 구할 때 잠들기까지의 시간과 중간에 깬 시간을 모두 뺐는지 본다. 계산은 [100_cbt-i_verify.py](/Hongs_Blog/studies/abnormal-psychology/code/100_cbt-i_verify/)로 확인했다.

## 문제 2 · 마지막 하위목표만 빈칸

대학원생 HL은 밤에 7~8시간을 자는데, 하루에도 몇 번씩 실험 도중이나 대화 중에 갑자기 잠들어 10분쯤 자고 깬다. 친구가 농담을 하면 크게 웃다가 무릎에 힘이 빠져 주저앉는다. 1년째이고 거의 매일이다. 잠들 무렵 방에 누가 있는 것 같은 환각을 자주 본다.

1. *주된 호소:* 참을 수 없는 졸음으로 갑자기 잠든다(수면발작).
2. *잘 기회와 시간대:* 밤에 충분히 잔다.
3. *빈도와 기간:* 거의 매일, 1년.
4. *배제:* 웃을 때의 근육 긴장 소실(탈력발작)은 과다수면장애에는 없는 증상이다.
5. *결론과 치료:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="5"}
5. 기면증(수면발작 + 탈력발작). 모다피닐 같은 각성 유지 약으로 낮 졸음을 조절하고, 항우울제로 탈력발작과 REM 관련 증상(입면시 환각)을 조절한다. 낮에 15~20분씩 규칙적인 낮잠, 규칙적인 수면-각성 주기, 카페인 제한. 운전 같은 위험한 활동에 주의한다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

대학생 HM은 학기 중에 밤 12시에 누우면 새벽 4시까지 잠이 오지 않고, 아침 9시 수업에 늘 늦거나 졸며 듣는다. 방학 때 새벽 4시에 자서 낮 12시에 일어나면 개운하고 낮에 졸리지도 않는다. 고등학교 때부터 이랬다.

1. *주된 호소:* ______
2. *잘 기회와 시간대:* 제 시간표(새벽 4시~낮 12시)대로 자면 잠의 양과 질이 정상이다.
3. *빈도와 기간:* 몇 년째, 학기 중 거의 매일.
4. *배제:* ______
5. *결론과 치료:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. 사회 시간표(수업)에 맞춰 원하는 시각에 잠들고 일어나지 못한다. 밤의 불면과 낮의 졸림은 그 결과다.
4. 불면장애와 과다수면장애가 아니다. 제 시간표대로 자면 잠들기, 수면 유지, 낮의 각성이 모두 정상이기 때문이다.
5. 일주기 리듬 수면-각성장애, 지연 수면 위상형(올빼미형). 일반 수면제는 도움이 크지 않다. 아침에 밝은 빛을 쬐는 광치료와 저녁 멜라토닌으로 몸속 시계를 앞당기고, 취침 시각을 서서히 당긴다.

</details>


## 문제 4 · 독립 문제

예순여덟 살 HN의 아내는 남편이 1년 전부터 새벽녘에 잠꼬대로 소리치며 주먹을 휘두르다 침대에서 떨어진 적도 있다고 말한다. 깨우면 HN은 곧바로 또렷해져 "누가 쫓아와서 싸웠다"고 꿈을 이야기한다. 어릴 때는 이런 일이 없었다. 진단과, 비슷해 보이는 장애가 아닌 이유, 치료를 쓰라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *주된 호소:* 자는 동안 소리치고 주먹을 휘두르는 복잡한 행동.
2. *잘 기회와 시간대:* 밤 후반부(새벽녘), 곧 REM 수면이 긴 때다.
3. *빈도와 기간:* 1년째 반복.
4. *배제:* NREM 수면 각성장애(수면보행증, 야경증)가 아니다. 그 장애는 밤 전반부의 깊은 잠에서 일어나고, 깨우기 어려우며 삽화를 기억하지 못한다. HN은 즉시 깨고 꿈을 기억한다.
5. *결론과 치료:* REM 수면 행동장애. 꿈을 행동으로 옮긴다. 소아기 이후 새로 생겼으므로 수면다원검사로 평가한다. 침대 주변의 위험한 물건을 치우고 바닥에 매트를 까는 등 안전한 환경을 만들고, 클로나제팜으로 치료한다.

</details>


## 변형 문제

문제 1의 GV가 수면제한을 한 주 한 뒤, 침대 405분 가운데 평균 370분을 잤다. 다음 주의 취침 시각을 정하라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

수면 효율은 370 ÷ 405 ≈ 91.4%로 85% 이상이다. 침대 시간을 15분 늘려 420분으로 하고, 기상 7시를 고정하면 자정(0시)에 눕는다. 효율이 85% 미만이었다면 침대 시간을 그대로 두었을 것이다.

</details>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 모든 사례와 풀이는 08.급식 및 섭식장애, 수면-각성장애.pdf의 장애별 설명(p.55, 57~58, 61~62, 64, 67~70, 74~78)을 적용한 가상 사례다. 수면제한의 15분 조정 규칙은 불면증 인지행동치료 문서의 보충 설명을 따랐다.
{% endraw %}
