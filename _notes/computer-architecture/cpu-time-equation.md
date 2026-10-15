---
layout: "note"
title: "CPU 시간 식"
display_title: "CPU 시간 식 (CPU Time Equation)"
kind: "concept"
kind_label: "기법"
num: "03"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["CPU Time Equation", "CPU Performance Equation", "성능 방정식", "Iron Law of Performance", "명령어 수", "Instruction Count", "CPI", "Cycles Per Instruction", "명령어당 사이클 수", "클록 주기", "Clock Cycle Time", "Clock Period", "클록 속도", "Clock Rate", "평균 CPI", "MIPS 값", "Million Instructions Per Second"]
description: "프로그램이 프로세서를 쓴 시간은 세 수를 곱한 값이다. 실행한 명령이 몇 개인지, 명령 하나에 박자가 평균 몇 번 드는지, 박자 한 번이 몇 초인지다. 공장으로 치면 만든 물건 수, 물건 하나에 드는 공정 수, 공정 한 번에 걸리는 시간이다. 셋으로 쪼개 두면 어디를 고쳐야 빨라지…"
prev_url: "/studies/computer-architecture/cpu-performance/"
prev_title: "성능과 실행 시간"
next_url: "/studies/computer-architecture/amdahls-law/"
next_title: "암달의 법칙"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/cpu-time-equation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프로그램이 프로세서를 쓴 시간은 세 수를 곱한 값이다. 실행한 명령이 몇 개인지, 명령 하나에 박자가 평균 몇 번 드는지, 박자 한 번이 몇 초인지다. 공장으로 치면 만든 물건 수, 물건 하나에 드는 공정 수, 공정 한 번에 걸리는 시간이다. 셋으로 쪼개 두면 어디를 고쳐야 빨라지는지 따질 수 있다. 다만 셋은 서로 얽혀 있어서 하나를 줄이면 다른 하나가 늘기 쉽다. 그래서 박자가 빠르다는 것만으로, 또는 명령 수가 적다는 것만으로 빠른 컴퓨터라고 말할 수 없다.

</div>


## 예시로 보기

"A는 3 GHz, B는 2 GHz니까 A가 빠르다"는 말은 맞을 때도 있고 틀릴 때도 있다. 같은 일을 하는 데 박자가 몇 번 필요한지를 빼놓았기 때문이다.

프로세서 안의 회로는 일정한 박자에 맞춰 움직인다. 이 박자를 클록이라 하고, 박자 한 번을 사이클이라 한다. 2.5 GHz라는 말은 1초에 25억 번 박자가 온다는 뜻이다. 박자 한 번의 길이는 $$1 \div (2.5 \times 10^9) = 0.4$$나노초, 곧 400피코초다(1피코초는 1조분의 1초).

어떤 프로그램이 이 프로세서에서 명령 20억 개를 실행했고, 명령 하나에 평균 1.5사이클이 들었다.

| 무엇 | 값 |
|---|---|
| 실행한 명령 | 20억 개 |
| 명령 하나에 든 사이클(평균) | 1.5 |
| 쓴 사이클 | $$20\text{억} \times 1.5 = 30\text{억}$$ |
| 사이클 하나의 길이 | 400피코초 |
| 프로세서를 쓴 시간 | $$30\text{억} \times 400\text{피코초} = 1.2$$초 |

세 수 가운데 어느 하나라도 절반이 되면 시간도 절반이 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 예제 1~3, MIPS 값의 예, 오해 항목의 수치, 카드 C2~C5를 분수로 정확히 계산, 무작위 1,000회에서 두 식(주기로 곱하기, 주파수로 나누기)이 같음 — [03_cpu-time-equation_verify.py](/Hongs_Blog/studies/computer-architecture/code/03_cpu-time-equation_verify/)</div>

</div>


## 정의

프로그램 하나의 CPU 시간은, 그 프로그램이 실행한 명령어 수에 명령어 하나가 쓰는 평균 사이클 수를 곱하고, 다시 사이클 하나의 길이를 곱한 값이다[^1].

$$\text{CPU 시간} = \text{명령어 수} \times \text{CPI} \times \text{클록 주기} = \frac{\text{명령어 수} \times \text{CPI}}{\text{클록 속도}}$$


기호로 쓰면 $$T = IC \times CPI \times T_c = \dfrac{IC \times CPI}{f}$$다.

| 기호 | 읽는 법과 뜻 | 단위 |
|---|---|---|
| $$T$$ | CPU 시간. 프로세서가 이 프로그램을 위해 일한 시간([성능과 실행 시간](/Hongs_Blog/studies/computer-architecture/cpu-performance/)) | 초 |
| $$IC$$ | 명령어 수(instruction count). 프로그램이 끝날 때까지 실제로 실행한 기계어 명령의 수. 반복문 안의 명령은 돈 횟수만큼 센다 | 개 |
| $$CPI$$ | 명령어당 사이클 수(cycles per instruction). 명령 하나가 쓰는 사이클 수의 평균 | 사이클/개 |
| $$T_c$$ | 클록 주기. 사이클 하나의 길이 | 초/사이클 |
| $$f$$ | 클록 속도. 1초에 오는 사이클 수. $$f = 1 / T_c$$ | 사이클/초 (Hz) |

**평균 CPI.** 명령마다 드는 사이클 수가 다르면, 종류별로 "사이클 수 × 그 종류의 개수"를 다 더해 전체 사이클 수를 얻고, 전체 명령어 수로 나눈다[^2].

$$\text{전체 사이클 수} = \sum_{i=1}^{k} CPI_i \times IC_i, \qquad CPI = \frac{\sum_{i=1}^{k} CPI_i \times IC_i}{IC} = \sum_{i=1}^{k} CPI_i \times \frac{IC_i}{IC}$$


$$k$$는 명령 종류의 수, $$CPI_i$$는 $$i$$번째 종류의 명령 하나가 쓰는 사이클 수, $$IC_i$$는 그 종류의 명령이 실행된 횟수다. $$\frac{IC_i}{IC}$$는 그 종류가 전체에서 차지하는 비율이다. 그래서 평균 CPI는 프로세서만으로 정해지지 않고, 프로그램이 어떤 명령을 얼마나 섞어 쓰는지에 따라 달라진다.

## 유도

식은 두 걸음으로 나온다. 시간을 사이클로 세고, 사이클을 명령으로 센다.

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">유도 과정</summary>

1. 프로세서는 사이클 단위로만 일한다. 그래서 CPU 시간은 쓴 사이클 수에 사이클 하나의 길이를 곱한 값이다: $$T = \text{사이클 수} \times T_c$$. — 클록의 정의
2. 주기와 속도는 서로 역수다($$T_c = 1/f$$). 그래서 $$T = \text{사이클 수} / f$$로도 쓴다. — 주기와 주파수의 관계
3. 쓴 사이클을 명령별로 나눠 센다. 명령 하나하나가 쓴 사이클을 다 더하면 전체 사이클 수다. — 모든 사이클은 어느 명령 하나의 것이다
4. 그 합을 명령어 수로 나눈 값을 $$CPI$$라 부르기로 한다. 그러면 $$\text{사이클 수} = IC \times CPI$$다. — 평균의 정의
5. 4를 1에 넣으면 $$T = IC \times CPI \times T_c$$다. 단위도 맞는다: 개 × (사이클/개) × (초/사이클) = 초. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 3단계의 "모든 사이클은 어느 명령 하나의 것이다"는 무엇을 가정하는가?</summary>

프로세서가 이 프로그램을 돌리는 동안 쓴 사이클만 센다는 것이다. 다른 프로그램에 내준 시간이나 입출력을 기다린 시간은 CPU 시간에 들지 않으므로 식 밖에 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 4단계에서 CPI는 재서 얻는 값인가, 정해서 얻는 값인가?</summary>

정한 값이다. "전체 사이클 수 ÷ 명령어 수"를 CPI라고 이름 붙였을 뿐이라서, $$\text{사이클 수} = IC \times CPI$$는 늘 맞는다. 식이 쓸모 있는 까닭은 세 수를 서로 다른 사람이 정하기 때문이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 5단계의 단위 계산은 어떤 실수를 잡아 주는가?</summary>

주기 대신 속도를 곱하는 실수다. 개 × (사이클/개) × (사이클/초)는 초가 되지 않는다. 속도가 주어졌으면 나눠야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 유도의 핵심 아이디어는?</summary>

재기 어려운 양(시간)을 세기 쉬운 양들의 곱으로 바꾼 것이다. 가운데에 사이클이라는 단위를 끼워, 한쪽은 프로그램 쪽 수(명령어 수)로, 다른 쪽은 회로 쪽 수(주기)로 이었다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

메모리를 한 번 읽는 평균 시간을 "빨리 찾을 때의 시간 + 못 찾는 비율 × 못 찾았을 때 더 드는 시간"으로 쪼개는 [캐시 성능과 평균 접근 시간](/Hongs_Blog/studies/computer-architecture/cache-performance-amat/)이 같은 방식이다.

</details>


## 예제

**예제 1 · 두 구현 견주기.** 같은 명령어 집합을 쓰는 두 프로세서가 있다. A는 주기 200피코초에 CPI 2.5, B는 주기 350피코초에 CPI 1.2다. 어느 쪽이 얼마나 빠른가?

1. *같은 것 찾기:* 명령어 집합이 같으므로 같은 프로그램의 명령어 수 $$IC$$가 같다.
2. *명령 하나에 드는 시간:* A는 $$2.5 \times 200 = 500$$피코초, B는 $$1.2 \times 350 = 420$$피코초.
3. *나누기:* $$\frac{500 \times IC}{420 \times IC} = \frac{25}{21} \approx 1.19$$. B가 약 1.19배 빠르다.

A의 박자가 훨씬 빠르지만(5 GHz 대 약 2.86 GHz) 명령 하나에 박자를 두 배 넘게 써서 진다.

**예제 2 · 명령이 섞인 비율에서 평균 CPI.**

| 종류 | 비율 | 사이클 수 | 비율 × 사이클 수 |
|---|---|---|---|
| 산술·논리 | 45% | 1 | 0.45 |
| 메모리에서 읽기 | 25% | 3 | 0.75 |
| 메모리에 쓰기 | 10% | 2 | 0.20 |
| 분기 | 20% | 2 | 0.40 |
| 합 | 100% | | 1.80 |

1. *평균 CPI:* 마지막 열을 더해 1.8.
2. *어디에 시간을 쓰나:* 읽기는 명령의 4분의 1이지만 사이클로는 $$0.75 \div 1.8 \approx 42\%$$를 쓴다.
3. *고쳐 보기:* 읽기를 2사이클로 줄이면 평균 CPI는 $$1.8 - 0.25 = 1.55$$가 되고, 프로그램은 $$1.8 \div 1.55 \approx 1.16$$배 빨라진다.

**예제 3 · 명령이 적은 코드가 늘 빠른가.** 컴파일러가 같은 일을 하는 두 가지 코드를 만들 수 있다. 명령 종류 가, 나, 다는 각각 1, 2, 4사이클이 든다.

| | 가 | 나 | 다 | 명령어 수 | 사이클 수 | 평균 CPI |
|---|---|---|---|---|---|---|
| 코드 1 | 3 | 2 | 1 | 6 | $$3 + 4 + 4 = 11$$ | $$\frac{11}{6} \approx 1.83$$ |
| 코드 2 | 6 | 1 | 0 | 7 | $$6 + 2 + 0 = 8$$ | $$\frac{8}{7} \approx 1.14$$ |

코드 2가 명령은 하나 더 많지만 사이클은 3개 적다. 같은 프로세서에서는 주기가 같으므로 코드 2가 빠르다. 명령어 수만 세면 답이 뒤집힌다.

## 활용

**쓸 수 있는 때.** 프로세서가 그 프로그램을 돌리는 데 쓴 시간에만 맞는다. 디스크나 네트워크를 기다린 시간은 식 밖에 있다. 두 컴퓨터를 견줄 때 명령어 수를 지워도 되는 것은 명령어 집합과 프로그램(기계어)이 같을 때뿐이다.

**문제에서 알아보는 신호.** "클록 속도가 몇 GHz", "CPI가 얼마", "명령의 몇 %가 무엇"이 나오면 이 식이다. 주어진 것이 주기인지 속도인지부터 확인한다.

**누가 어느 수를 바꾸는가.** 세 수는 컴퓨터의 서로 다른 층에서 정해진다[^3].

| 정하는 것 | 명령어 수 | CPI | 클록 주기 |
|---|---|---|---|
| 알고리즘 | 바꾼다 | 바꿀 수 있다 | |
| 프로그래밍 언어 | 바꾼다 | 바꾼다 | |
| 컴파일러 | 바꾼다 | 바꾼다 | |
| 명령어 집합 | 바꾼다 | 바꾼다 | 바꾼다 |
| 프로세서의 구현(회로를 짜는 방식) | | 바꾼다 | 바꾼다 |
| 반도체 공정 | | | 바꾼다 |

명령어 집합이 세 칸에 다 걸려 있다. 명령 하나가 많은 일을 하게 만들면 명령어 수는 줄지만 CPI나 주기가 늘기 쉽다. 이 맞바꿈이 [RISC와 CISC 비교](/Hongs_Blog/studies/computer-architecture/risc-vs-cisc/)의 핵심이다.

**이 과목에서 다시 나오는 자리.**

- 한 사이클에 명령 하나를 끝내는 프로세서는 CPI가 1이지만 가장 느린 명령에 맞춰 주기가 길어진다: [단일 사이클의 클록 주기](/Hongs_Blog/studies/computer-architecture/single-cycle-timing/)
- 명령을 여러 단계로 나누면 주기가 짧아지고, 그 대가로 잃는 사이클이 CPI에 더해진다: [단일 사이클과 파이프라인 비교](/Hongs_Blog/studies/computer-architecture/single-cycle-vs-pipeline/)
- 메모리에서 자료를 늦게 찾으면 그만큼 사이클이 더 들어 CPI가 오른다: [캐시 성능과 평균 접근 시간](/Hongs_Blog/studies/computer-architecture/cache-performance-amat/)

**흔한 실수: 1초에 실행한 명령 수로 견주기.** 1초에 명령을 몇 백만 개 실행하는지를 MIPS 값(million instructions per second)이라 한다. 프로세서 이름 MIPS와는 다른 말이다. 명령어 수를 "CPU 시간 × 100만"으로 나눈 값이고, 식을 넣어 정리하면 클록 속도를 "CPI × 100만"으로 나눈 값이다.

$$\text{MIPS 값} = \frac{IC}{T \times 10^6} = \frac{f}{CPI \times 10^6}$$


이 값이 큰 쪽이 늘 빠르지는 않다. 4 GHz 프로세서에서 컴파일러 1은 명령 50억 개에 CPI 1.2인 코드를, 컴파일러 2는 명령 80억 개에 CPI 1.0인 코드를 만든다.

| | 사이클 수 | CPU 시간 | MIPS 값 |
|---|---|---|---|
| 컴파일러 1 | 60억 | 1.5초 | 약 3,333 |
| 컴파일러 2 | 80억 | 2.0초 | 4,000 |

컴파일러 2의 코드가 MIPS 값은 더 크지만 더 늦게 끝난다. 쉬운 명령을 많이 실행했을 뿐이다. 명령어 수가 다른 두 코드나 명령어 집합이 다른 두 컴퓨터는 이 값으로 견줄 수 없다.

- 연습: [CPU 시간 계산 예제 사다리](/Hongs_Blog/studies/computer-architecture/cpu-time-ladder/)

## 연결

- 선수: [성능과 실행 시간](/Hongs_Blog/studies/computer-architecture/cpu-performance/)
- 일부만 고쳤을 때 전체가 얼마나 빨라지나: [암달의 법칙](/Hongs_Blog/studies/computer-architecture/amdahls-law/)
- 클록 주기가 회로에서 어떻게 정해지나: [클록과 순차 회로](/Hongs_Blog/studies/computer-architecture/clocked-sequential-logic/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"클록 속도가 높은 프로세서가 빠른 프로세서다"</div>

틀렸다. 클록 속도는 세 수 가운데 하나일 뿐이다. 그럴듯해 보이는 까닭은 GHz가 상자에 적혀 있는 유일한 숫자이고, 같은 설계에서 속도만 올린 제품끼리는 실제로 그 순서대로 빠르기 때문이다. 하지만 설계가 다르면 명령 하나에 드는 사이클 수가 다르다. 같은 명령어 집합의 두 프로세서가 3 GHz에 CPI 2.4, 2 GHz에 CPI 1.2라면 명령 하나에 드는 시간은 $$2.4 \div 3 = 0.8$$나노초와 $$1.2 \div 2 = 0.6$$나노초다. 2 GHz 쪽이 $$\frac{0.8}{0.6} \approx 1.33$$배 빠르다. 확인하는 법: 클록 속도를 볼 때마다 CPI를 같이 물어 "CPI ÷ 클록 속도"를 견준다. 명령어 집합까지 다르면 명령어 수도 같이 곱해야 한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** CPU 시간 식을 쓰고 세 수가 각각 무엇인지 단위와 함께 말하라.</summary>

**답:** CPU 시간 = 명령어 수 × CPI × 클록 주기 = 명령어 수 × CPI ÷ 클록 속도. 명령어 수는 실제로 실행한 명령의 개수, CPI는 명령 하나가 쓰는 평균 사이클 수(사이클/개), 클록 주기는 사이클 하나의 길이(초/사이클)다.<br>
**이유:** 단위를 곱하면 개 × 사이클/개 × 초/사이클 = 초가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 명령 15억 개를 실행하는 프로그램이 CPI 2, 클록 주기 250피코초인 프로세서에서 쓰는 CPU 시간은?</summary>

**답:** $$1.5 \times 10^9 \times 2 \times 250 \times 10^{-12} = 0.75$$초.<br>
**흔한 오답:** 250을 속도로 보고 나누는 것. 피코초는 길이의 단위이므로 곱한다. 속도로 바꾸면 4 GHz이고, $$3 \times 10^9 \div (4 \times 10^9) = 0.75$$초로 같은 답이 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 회로를 더 잘게 나눠 클록을 3 GHz에서 4 GHz로 올렸더니 CPI가 1.5에서 2.1로 늘었다. 프로그램은 빨라졌는가? 왜 그런 일이 생기는가?</summary>

**답:** 느려졌다. 명령 하나에 드는 시간이 $$1.5 \div 3 = 0.5$$나노초에서 $$2.1 \div 4 = 0.525$$나노초로 5% 늘었다.<br>
**이유:** 세 수는 따로 움직이지 않는다. 사이클 하나에 하는 일을 줄여 주기를 짧게 만들면, 같은 명령을 끝내는 데 사이클이 더 든다. 주기가 줄어든 비율보다 CPI가 늘어난 비율이 크면 손해다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 어떤 프로그램이 2 GHz 프로세서에서 10초 걸린다. 새 프로세서는 같은 프로그램에 사이클이 1.5배 든다. 6초에 끝내려면 새 프로세서의 클록 속도는 얼마여야 하는가?</summary>

**답:** 지금 사이클 수는 $$10 \times 2 \times 10^9 = 200$$억. 새 프로세서에서는 300억. $$300\text{억} \div 6\text{초} = 5 \times 10^9$$, 곧 5 GHz.<br>
**이유:** 시간 = 사이클 수 ÷ 클록 속도이므로 클록 속도 = 사이클 수 ÷ 시간이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 새 컴파일러를 쓰면 같은 프로그램의 명령어 수가 0.8배로 줄고 평균 CPI는 1.1배로 는다. 프로세서는 그대로다. 프로그램은 몇 배 빨라지는가? "명령이 20% 줄었으니 1.25배"는 왜 틀린가?</summary>

**답:** 시간이 $$0.8 \times 1.1 = 0.88$$배가 되므로 $$1 \div 0.88 \approx 1.14$$배 빨라진다.<br>
**이유:** 1.25배는 CPI가 그대로일 때의 답이다. 컴파일러가 명령 수를 줄이면서 사이클이 많이 드는 명령을 더 골랐다면 CPI가 오른다. 명령어 수와 CPI를 둘 다 곱해야 한다. 프로세서가 그대로이므로 클록 주기는 같다.

</details>


[^1]: Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 1장 "Computer Abstractions and Technology". 같은 장의 강의 슬라이드를 쓴 University of Crete HY225, 슬라이드 31 "CPU Time", 슬라이드 33 "Instruction Count and CPI", https://www.csd.uoc.gr/~hy225/22a/10a_cpi.pdf. 책을 직접 열지 못해 책은 장까지만 적는다.
[^2]: 같은 슬라이드 묶음, 슬라이드 35 "CPI in More Detail" (종류별 CPI와 개수로 전체 사이클 수와 가중 평균 CPI를 구하는 식).
[^3]: 같은 슬라이드 묶음, 슬라이드 37 "Performance Summary" (알고리즘은 명령어 수와 경우에 따라 CPI, 언어와 컴파일러는 명령어 수와 CPI, 명령어 집합은 셋 모두). 구현과 공정의 줄은 KFUPM ICS 233 "Performance" 슬라이드 11 "Factors Impacting Performance"의 표, https://faculty.kfupm.edu.sa/COE/aimane/coe301/07-Performance.pdf
{% endraw %}
