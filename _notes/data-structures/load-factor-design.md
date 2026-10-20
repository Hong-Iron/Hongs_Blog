---
layout: "note"
title: "적재율로 해시 테이블 크기 정하기"
display_title: "적재율로 해시 테이블 크기 정하기 (Hash Table Design)"
kind: "concept"
kind_label: "기법"
num: "52"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Hash Table Design", "Loading Density", "Load Factor", "적재율", "적재 밀도", "재해싱", "Rehashing", "동적 크기 조정", "Dynamic Resizing"]
description: "주차장이 찰수록 빈자리를 찾아 도는 시간이 길어지는 것처럼, 해시 테이블도 찰수록 느려진다. 그래서 \"한 번 찾는 데 몇 번까지 봐도 되는가\"를 먼저 정하고, 그 조건을 지키려면 표를 얼마나 비워 두어야 하는지 거꾸로 계산해 칸 수를 정한다. 들어올 자료의 수를 미리 알면 처음부터…"
prev_url: "/studies/data-structures/probing-vs-chaining/"
prev_title: "선형 탐사와 체이닝 비교"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "52_load-factor-design_verify.py", "u": "/studies/data-structures/code/52_load-factor-design_verify/", "r": "검증"}]
permalink: "/studies/data-structures/load-factor-design/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

주차장이 찰수록 빈자리를 찾아 도는 시간이 길어지는 것처럼, 해시 테이블도 찰수록 느려진다. 그래서 "한 번 찾는 데 몇 번까지 봐도 되는가"를 먼저 정하고, 그 조건을 지키려면 표를 얼마나 비워 두어야 하는지 거꾸로 계산해 칸 수를 정한다. 들어올 자료의 수를 미리 알면 처음부터 그 크기로 잡고, 모르면 정한 선을 넘을 때마다 표를 두 배쯤으로 늘려 모두 다시 넣는다.

</div>


## 예시로 보기

[선형 탐사](/Hongs_Blog/studies/data-structures/linear-probing/)에서 버킷의 90%가 차면 없는 키 하나를 찾는 데 평균 50개쯤의 버킷을 본다. 절반만 차면 2.5개다. 버킷을 많이 잡으면 빠르지만 메모리가 든다. 얼마나 잡아야 "충분히 빠른가"를 계산으로 정할 수 있다.

이런 문제를 보자. 선형 탐사 표에서

- 있는 키를 찾을 때 비교가 평균 10번을 넘지 않아야 하고,
- 없는 키를 찾을 때 비교가 평균 13번을 넘지 않아야 한다.

쌍이 많아야 1,000개라면 버킷은 몇 개여야 하는가?

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 조건을 분수로 정확히 풀어 $$\frac{18}{19}$$과 $$\frac45$$, 일반 꼴, 1,250 이상의 버킷 수 후보, 버킷 1,259개에 키 1,000개를 넣은 모의실험(100번), 두 배로 늘려 다시 넣기의 횟수($$n$$ = 100 ~ 100,000), 카드의 답 — [52_load-factor-design_verify.py](/Hongs_Blog/studies/data-structures/code/52_load-factor-design_verify/)</div>

</div>


## 정의

쓰는 것은 적재율 $$\alpha$$와 두 식이다. $$\alpha$$는 쌍의 수를 버킷 수 $$b$$로 나눈 값이고, $$S_n$$은 있는 키를, $$U_n$$은 없는 키를 찾을 때 보는 버킷 수의 기댓값이다.

$$\alpha = \frac{\text{쌍의 수}}{b}, \qquad S_n \approx \frac12\left(1 + \frac{1}{1 - \alpha}\right), \qquad U_n \approx \frac12\left(1 + \frac{1}{(1 - \alpha)^2}\right)$$


순서는 세 걸음이다.

1. 성능 조건을 받아, 조건마다 허용되는 가장 큰 적재율을 구한다.
2. 그 가운데 가장 작은 값을 적재율의 한계로 삼는다. 모든 조건을 지켜야 하기 때문이다.
3. 한계 적재율과 쌍의 수로 버킷 수를 정한다.

### 걸음 1과 2: 적재율의 한계

**있는 키 10번 이하.** $$\frac12\left(1 + \frac{1}{1 - \alpha}\right) \le 10$$을 푼다.

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">푸는 과정</summary>

양쪽에 2를 곱하면 $$1 + \frac{1}{1 - \alpha} \le 20$$, 1을 빼면 $$\frac{1}{1 - \alpha} \le 19$$다. $$1 - \alpha$$는 양수이므로 뒤집으면 부등호가 바뀌어 $$1 - \alpha \ge \frac{1}{19}$$, 곧 $$\alpha \le \frac{18}{19}$$이다.

</details>


**없는 키 13번 이하.** $$\frac12\left(1 + \frac{1}{(1 - \alpha)^2}\right) \le 13$$을 푼다.

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">푸는 과정</summary>

양쪽에 2를 곱하고 1을 빼면 $$\frac{1}{(1 - \alpha)^2} \le 25$$다. 뒤집으면 $$(1 - \alpha)^2 \ge \frac{1}{25}$$이고, $$1 - \alpha$$가 양수이므로 $$1 - \alpha \ge \frac15$$, 곧 $$\alpha \le \frac45$$다.

</details>


둘 다 지키려면 $$\alpha \le \min\left\{\frac{18}{19}, \frac45\right\} = \frac45$$다. $$\frac{18}{19} \approx 0.947$$이고 $$\frac45 = 0.8$$이라 없는 키 쪽 조건이 더 빡빡하다. $$\alpha = \frac45$$일 때 있는 키는 평균 3번이면 찾는다.

조건의 수만 바꾸면 같은 계산이다[^s1].

$$S_n \le s \iff \alpha \le 1 - \frac{1}{2s - 1}, \qquad U_n \le u \iff \alpha \le 1 - \frac{1}{\sqrt{2u - 1}}$$


$$s = 10$$을 넣으면 $$1 - \frac{1}{19} = \frac{18}{19}$$, $$u = 13$$을 넣으면 $$1 - \frac{1}{\sqrt{25}} = \frac45$$로 위와 같다.

### 걸음 3: 버킷 수

**쌍의 수를 미리 알 때(표 크기 고정).** 쌍이 많아야 1,000개이고 $$\alpha \le \frac45$$여야 하므로

$$\frac{1000}{b} \le \frac45 \quad\Longrightarrow\quad b \ge \frac54 \times 1000 = 1250$$


이다. 여기서 끝이 아니다. $$b$$는 나누는 수이기도 하므로 소수로, 아니면 20보다 작은 소인수가 없는 홀수로 고른다([나눗셈 해시 함수](/Hongs_Blog/studies/data-structures/hash-function-division/)). 1,250은 짝수라 안 된다. 1,250 이상에서 가장 작은 소수는 1,259다. 소수가 아닌 수로는 $$1{,}271 = 31 \times 41$$이 조건에 맞는다[^s1].

**쌍의 수를 모를 때(크기를 바꿔 가기).** 적재율이 한계(이 예에서는 $$\frac45$$)를 넘을 때마다, 지금의 약 두 배 크기인 표를 새로 만들어 모든 쌍을 다시 넣는다. 버킷 수가 바뀌면 홈 버킷도 바뀌므로 그냥 복사해서는 안 되고 하나씩 다시 넣어야 한다. 이 일을 재해싱(rehashing)이라 부른다.

다시 넣기는 가끔 한꺼번에 일어나지만, 두 배씩 늘리면 그 횟수를 모두 더해도 넣은 쌍의 수에 비례한다. [배열 두 배 늘리기](/Hongs_Blog/studies/data-structures/array-doubling/)와 같은 계산이다. 버킷 5개에서 시작해 $$2b + 1$$로 늘려 가며(홀수를 지키려고 1을 더한다) 키 1,000개를 넣으면 표를 8번 늘리고(5 → 11 → 23 → … → 1,535) 다시 넣기는 모두 1,222번이다. 키 하나에 평균 1.2번꼴이다[^s1].

## 예제

**버킷 1,259개로 실제로 재 보기.** 무작위 키 1,000개를 넣으면 $$\alpha = \frac{1000}{1259} \approx 0.794$$다. 식의 값은 $$S_n \approx 2.93$$, $$U_n \approx 12.3$$이고, 100번 실험한 평균은 있는 키 2.83번, 없는 키 11.49번이었다. 두 조건(10번, 13번)을 모두 지킨다(실험으로 확인한 값이다)[^s1].

**조건이 바뀌면.** 있는 키 6번 이하, 없는 키 5번 이하라면 $$\alpha \le 1 - \frac{1}{11} = \frac{10}{11}$$과 $$\alpha \le 1 - \frac{1}{\sqrt9} = \frac23$$에서 $$\alpha \le \frac23$$이다. 쌍이 600개면 $$b \ge 600 \times \frac32 = 900$$이고, 900 이상의 가장 작은 소수는 907이다[^s1].

## 활용

- 적용 조건: 넘침을 선형 탐사로 다루는 표. 위 두 식이 선형 탐사의 것이기 때문이다. 체이닝이면 [체이닝](/Hongs_Blog/studies/data-structures/hash-chaining/)의 식으로 같은 걸음을 밟는다.
- 알아보는 신호: "비교가 평균 몇 번을 넘지 않게", "쌍이 많아야 몇 개", "버킷 수를 정하라".
- 선형 탐사에서는 보통 $$\alpha \le 0.75$$로 두기를 권한다. 그때 $$S_n = 2.5$$, $$U_n = 8.5$$다.
- 흔한 실수: 조건이 둘일 때 큰 쪽($$\frac{18}{19}$$)을 고르는 것. 작은 쪽을 골라야 둘 다 지킨다. 그리고 $$b \ge 1250$$에서 멈추고 1,250을 그대로 쓰는 것.

## 연결

- 선수: [선형 탐사](/Hongs_Blog/studies/data-structures/linear-probing/)($$S_n$$, $$U_n$$의 뜻), [나눗셈 해시 함수](/Hongs_Blog/studies/data-structures/hash-function-division/)(버킷 수를 소수로), [배열 두 배 늘리기](/Hongs_Blog/studies/data-structures/array-doubling/)
- 두 배씩 늘릴 때 다시 넣는 횟수의 합: [등비급수](/Hongs_Blog/studies/college-math/geometric-series/)
- 파이썬 딕셔너리도 칸이 차면 늘려서 다시 넣는다: [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 선형 탐사 표에서 있는 키는 평균 6번 이하, 없는 키는 평균 5번 이하로 찾고 싶다. 적재율의 한계를 구하라.</summary>

**답:** $$\alpha \le \frac23$$.<br>
**이유:** 있는 키: $$\frac{1}{1 - \alpha} \le 11$$에서 $$\alpha \le \frac{10}{11}$$. 없는 키: $$\frac{1}{(1 - \alpha)^2} \le 9$$에서 $$1 - \alpha \ge \frac13$$, $$\alpha \le \frac23$$. 둘 가운데 작은 $$\frac23$$이 한계다. 흔한 오답은 큰 쪽인 $$\frac{10}{11}$$을 고르는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** C1의 표에 쌍이 많아야 600개 들어온다. 버킷 수를 정하라.</summary>

**답:** $$b \ge 900$$이고, 그 이상의 가장 작은 소수인 907을 고른다.<br>
**이유:** $$\frac{600}{b} \le \frac23$$에서 $$b \ge 900$$. 900은 2, 3, 5의 배수라 나누는 수로 알맞지 않다. 901은 $$17 \times 53$$, 903은 $$3 \times 7 \times 43$$, 905는 $$5 \times 181$$이고 907이 소수다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 적재율을 0.75에서 0.9로 올리면 메모리는 얼마나 아끼고, 없는 키를 찾는 수고는 얼마나 느는가? 이 맞바꿈에서 무엇을 읽을 수 있는가?</summary>

**답:** 쌍 1,000개에 필요한 버킷이 약 1,334개에서 1,112개로 6분의 1쯤 준다. 없는 키를 찾는 수고 $$U_n$$은 8.5에서 50.5로 약 6배가 된다.<br>
**이유:** $$U_n$$의 분모가 $$(1 - \alpha)^2$$이라, 빈 버킷의 비율이 0.25에서 0.1로 2.5분의 1이 되면 $$\frac{1}{(1 - \alpha)^2}$$는 16에서 100으로 6.25배가 된다. 표가 거의 찼을 때는 버킷을 조금 아끼는 값이 아주 비싸다. 그래서 적재율의 한계를 먼저 정하고 크기를 맞춘다.

</details>


[^s1]: 수치는 위 검증 코드로 확인했다.
{% endraw %}
