---
layout: "note"
title: "암달의 법칙"
display_title: "암달의 법칙 (Amdahl's Law)"
kind: "concept"
kind_label: "정리"
num: "04"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Amdahl's Law", "암달", "속도 향상", "Speedup", "자주 생기는 경우를 빠르게", "Make the Common Case Fast"]
description: "일의 한 부분만 빨라지면, 전체가 빨라지는 정도는 그 부분이 원래 차지하던 시간만큼으로 묶인다. 집에서 학교까지 버스 30분에 걷기 10분이 걸린다면, 버스가 아무리 빨라져도 40분이 10분 밑으로 내려가지 않는다. 그래서 가장 오래 걸리는 부분부터 고쳐야 하고, 조금만 걸리는 부…"
prev_url: "/studies/computer-architecture/cpu-time-equation/"
prev_title: "CPU 시간 식"
next_url: "/studies/computer-architecture/combinational-logic/"
next_title: "논리 게이트와 조합 회로"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/amdahls-law/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

일의 한 부분만 빨라지면, 전체가 빨라지는 정도는 그 부분이 원래 차지하던 시간만큼으로 묶인다. 집에서 학교까지 버스 30분에 걷기 10분이 걸린다면, 버스가 아무리 빨라져도 40분이 10분 밑으로 내려가지 않는다. 그래서 가장 오래 걸리는 부분부터 고쳐야 하고, 조금만 걸리는 부분을 백 배 빠르게 해도 얻는 것이 거의 없다. 이 계산은 빨라지지 않는 나머지 부분의 시간이 그대로일 때만 맞다.

</div>


## 예시로 보기

"압축을 3배 빠르게 했다"는 말과 "프로그램이 3배 빨라졌다"는 말은 다르다. 둘 사이를 잇는 계산이 필요하다.

어떤 프로그램이 120초 걸리고, 그 가운데 90초가 압축이다. 나머지 30초는 파일을 읽고 쓰는 시간이라 손댈 수 없다.

| 압축을 몇 배 빠르게 | 압축 시간 | 나머지 | 전체 | 전체가 빨라진 배수 |
|---|---|---|---|---|
| 그대로 | 90초 | 30초 | 120초 | 1 |
| 3배 | 30초 | 30초 | 60초 | 2 |
| 9배 | 10초 | 30초 | 40초 | 3 |
| 90배 | 1초 | 30초 | 31초 | 약 3.87 |
| 끝없이 | 0초 | 30초 | 30초 | 4 |

압축을 아무리 빠르게 해도 전체는 4배를 넘지 못한다. 손댈 수 없는 30초가 바닥에 남기 때문이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 무작위 2,000회에서 시간으로 센 식과 비율로 센 식이 같고 한계를 넘지 않음, 예제와 카드 C2~C4 — [04_amdahls-law_verify.py](/Hongs_Blog/studies/computer-architecture/code/04_amdahls-law_verify/)</div>

</div>


## 정의

고친 뒤의 실행 시간은, 고친 부분이 쓰던 시간을 빨라진 배수로 나눈 값에 고치지 않은 부분의 시간을 더한 값이다[^1].

$$\text{고친 뒤 시간} = \frac{\text{고친 부분이 쓰던 시간}}{\text{빨라진 배수}} + \text{고치지 않은 부분의 시간}$$


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">암달의 법칙</div>

원래 실행 시간 가운데 비율 $$p$$를 차지하던 부분을 $$s$$배 빠르게 하고 나머지는 그대로 두면, 전체가 빨라지는 배수 $$S$$는

$$S = \frac{1}{(1 - p) + \dfrac{p}{s}}$$

이다. $$s$$를 아무리 키워도 $$S < \dfrac{1}{1 - p}$$이다.

</div>


- $$p$$(피): 고치는 부분이 원래 시간에서 차지하던 비율. $$0 \le p \le 1$$. 위 예에서 $$\frac{90}{120} = 0.75$$.
- $$s$$(에스): 그 부분만 놓고 볼 때 빨라지는 배수. $$s \ge 1$$.
- $$S$$(큰 에스): 전체가 빨라지는 배수. 원래 시간을 고친 뒤 시간으로 나눈 값([상대 성능](/Hongs_Blog/studies/computer-architecture/cpu-performance/)).

작은 수로 한 번 더 넣어 본다. $$p = 0.75$$, $$s = 3$$이면 $$S = \frac{1}{0.25 + 0.25} = 2$$다. 표의 둘째 줄과 같다. 한계는 $$\frac{1}{1 - 0.75} = 4$$다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. 원래 시간을 $$T$$라 하면 고치는 부분은 $$pT$$, 나머지는 $$(1 - p)T$$다. — $$p$$의 정의
2. 고친 뒤 시간은 $$T' = \frac{pT}{s} + (1 - p)T$$다. — 고친 부분만 $$s$$로 나누고 나머지는 그대로라는 가정
3. $$S = \frac{T}{T'} = \frac{T}{T\left(\frac{p}{s} + 1 - p\right)} = \frac{1}{(1 - p) + \frac{p}{s}}$$. — $$T$$로 약분
4. $$p > 0$$이고 $$s$$가 유한하면 $$\frac{p}{s} > 0$$이므로 분모가 $$1 - p$$보다 크다. 그래서 $$S < \frac{1}{1 - p}$$이다. $$p = 0$$이면 $$S = 1$$이라 역시 한계 안이다. ∎

</details>


## 예제

**거꾸로 풀기.** 위 프로그램을 3배 빠르게 하려면 압축을 몇 배 빠르게 해야 하는가?

1. *목표 시간:* $$120 \div 3 = 40$$초.
2. *식 세우기:* $$40 = \frac{90}{s} + 30$$.
3. *풀기:* $$\frac{90}{s} = 10$$이므로 $$s = 9$$.

4배를 목표로 하면 $$30 = \frac{90}{s} + 30$$, 곧 $$\frac{90}{s} = 0$$이 되어 맞는 $$s$$가 없다.

**작은 부분을 많이 대 큰 부분을 조금.**

- 시간의 10%인 부분을 100배 빠르게: $$\frac{1}{0.9 + 0.001} \approx 1.11$$배.
- 시간의 80%인 부분을 1.5배 빠르게: $$\frac{1}{0.2 + 0.533} \approx 1.36$$배.

100배라는 수가 커 보여도 큰 부분을 조금 고친 쪽이 이긴다.

**가정이 깨지는 경우.** 나머지 부분이 그대로라는 가정을 빼면 식이 틀린다. 계산을 여러 코어에 나누면 코어끼리 자료를 주고받는 시간이 새로 생겨 나머지가 늘 수 있다. 그때는 전체가 식의 값보다 덜 빨라진다. 반대로 식이 쓰는 $$p$$는 고치기 전 시간에서 잰 비율이다. 고친 뒤에 다시 잰 비율을 넣으면 답이 틀린다. 위 예에서 3배로 고친 뒤 압축은 60초 가운데 30초라 50%가 된다.

## 활용

- **자주 생기는 경우를 빠르게.** 고칠 곳을 고를 때는 시간을 가장 많이 쓰는 곳부터 본다. 그러려면 먼저 어디에 시간을 쓰는지 재야 한다[^2].
- **코어 수 늘리기.** 프로그램의 95%를 코어에 나눠 줄 수 있어도 8코어에서 약 5.93배, 64코어에서 약 15.4배이고, 코어가 끝없이 많아도 20배가 한계다. 나눌 수 없는 5%가 바닥에 남는다. [멀티코어와 병렬 처리](/Hongs_Blog/studies/computer-architecture/multicore-parallelism/)에서 다시 쓴다.
- 이 이름은 1967년에 이 논리로 병렬 컴퓨터의 한계를 이야기한 진 암달(Gene Amdahl)에게서 왔다[^3].
- **흔한 실수.** "부분이 $$s$$배 빨라졌으니 전체도 $$s$$배"라고 쓰는 것. 전체가 $$s$$배가 되는 것은 $$p = 1$$일 때뿐이다.

## 연결

- 선수: [성능과 실행 시간](/Hongs_Blog/studies/computer-architecture/cpu-performance/)
- 명령 한 종류의 사이클 수만 줄였을 때 평균이 얼마나 줄어드는지도 같은 계산이다: [CPU 시간 식](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/)의 예제 2

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 암달의 법칙을 식으로 쓰고, $$p$$와 $$s$$가 무엇인지, 어떤 가정에서 맞는지 말하라.</summary>

**답:** $$S = \dfrac{1}{(1 - p) + p/s}$$. $$p$$는 고치는 부분이 원래 시간에서 차지하던 비율, $$s$$는 그 부분이 빨라지는 배수다. 고치지 않은 부분의 시간이 그대로일 때 맞다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 시간의 60%를 차지하는 부분을 3배 빠르게 하면 전체는 몇 배 빨라지는가?</summary>

**답:** $$\dfrac{1}{0.4 + 0.2} = \dfrac{1}{0.6} \approx 1.67$$배.<br>
**흔한 오답:** $$0.6 \times 3 = 1.8$$배. 배수에 비율을 곱하면 안 되고, 시간을 다시 더해야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** C2의 프로그램은 그 부분을 아무리 빠르게 해도 전체가 2.5배를 넘지 못한다. 왜 그런가?</summary>

**답:** 고치지 않는 40%가 그대로 남아서다. 그 부분이 0초가 되어도 전체 시간은 원래의 0.4배이고, $$1 \div 0.4 = 2.5$$다.<br>
**이유:** 식의 분모 $$(1 - p) + p/s$$에서 $$s$$가 줄일 수 있는 것은 둘째 항뿐이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 시간의 50%인 부분을 2배, 30%인 다른 부분을 3배 빠르게 하고 나머지 20%는 그대로 둔다. 전체는 몇 배 빨라지는가?</summary>

**답:** 고친 뒤 시간은 $$\frac{0.5}{2} + \frac{0.3}{3} + 0.2 = 0.55$$배. $$1 \div 0.55 \approx 1.82$$배.<br>
**이유:** 겹치지 않는 부분이 여럿이면 부분마다 자기 배수로 나눈 시간을 다 더한다. 식의 모양은 같다.

</details>


[^1]: KFUPM ICS 233 "Performance" 슬라이드 20 "Amdahl's Law" (고친 뒤 시간 = 원래 시간 × (f/s + (1 − f)), Speedup = 1/(f/s + (1 − f))), https://faculty.kfupm.edu.sa/COE/aimane/coe301/07-Performance.pdf. 슬라이드의 $$f$$를 이 문서는 $$p$$로 쓴다. 위키백과 "Amdahl's law"도 같은 식을 $$p$$, $$s$$로 적고 $$s \to \infty$$일 때의 한계 $$1/(1 - p)$$를 적는다, https://en.wikipedia.org/wiki/Amdahl%27s_law. 예시와 예제의 수치는 직접 만들었다.
[^2]: Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 1장 "Computer Abstractions and Technology" (암달의 법칙과 "자주 생기는 경우를 빠르게"). 책을 직접 열지 못해 장까지만 적는다.
[^3]: 위키백과 "Amdahl's law"가 적은 서지: Gene M. Amdahl, "Validity of the single processor approach to achieving large scale computing capabilities", AFIPS Spring Joint Computer Conference, 1967, pp. 483–485. 논문 자체는 열어 보지 못했다.
{% endraw %}
