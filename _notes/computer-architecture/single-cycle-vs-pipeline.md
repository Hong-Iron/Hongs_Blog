---
layout: "note"
title: "단일 사이클과 파이프라인 비교"
display_title: "단일 사이클과 파이프라인 비교"
kind: "concept"
kind_label: "비교"
num: "33"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Single-Cycle vs Pipelined", "단일 사이클 대 파이프라인", "다중 사이클", "Multicycle", "다중 사이클 구현", "Multicycle Implementation"]
description: "둘 다 같은 명령어를 같은 부품으로 실행하고 같은 결과를 낸다. 가르는 질문은 \"한 사이클에 명령어 하나를 통째로 끝내는가, 한 단계만 끝내는가\"다. 그 답이 클록 주기, 명령어당 사이클 수, 회로가 얼마나 복잡한지를 함께 정한다."
prev_url: "/studies/computer-architecture/processor-exceptions/"
prev_title: "예외 처리"
next_url: "/studies/computer-architecture/superscalar-out-of-order/"
next_title: "슈퍼스칼라와 비순차 실행"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-architecture/single-cycle-vs-pipeline/"
---
{% raw %}
둘 다 같은 명령어를 같은 부품으로 실행하고 같은 결과를 낸다. 가르는 질문은 "한 사이클에 명령어 하나를 통째로 끝내는가, 한 단계만 끝내는가"다. 그 답이 클록 주기, 명령어당 사이클 수, 회로가 얼마나 복잡한지를 함께 정한다.

수치는 [단일 사이클의 클록 주기](/Hongs_Blog/studies/computer-architecture/single-cycle-timing/)에서 직접 정한 부품 시간(250, 150, 200, 250, 100 ps)을 쓴다[^s1].

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 명령어 하나가 끝나는 데 드는 시간이 더 짧은 쪽은? (b) 명령어 1,000개가 끝나는 데 드는 시간이 더 짧은 쪽은? 본문의 부품 시간으로 답하라.</summary>

**답:** (a) 단일 사이클. 950 ps 대 $$5 \times 250 = 1250$$ ps. (b) 파이프라인. 950,000 ps 대 $$(1000 + 4) \times 250 = 251000$$ ps.<br>
**이유:** 파이프라인은 명령어 하나를 빨리 끝내는 것이 아니라 명령어 사이의 간격을 줄인다. 다른 쪽이 아닌 이유: 단일 사이클은 명령어 하나가 회로 전체를 950 ps 동안 차지해서 다음 명령어가 그동안 시작도 못 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) 뒤 명령어가 앞 명령어의 결과를 쓸 때 아무 회로도 더 필요하지 않은 쪽은? (d) 분기 명령이 갈 때 사이클을 잃는 쪽은?</summary>

**답:** (c) 단일 사이클. 앞 명령어가 레지스터에 쓰기를 마친 뒤에야 다음 명령어가 시작한다. (d) 파이프라인. 분기가 정해지기 전에 가져온 명령어를 버려야 한다.<br>
**이유:** 해저드는 여러 명령어가 겹쳐 흐를 때만 생긴다. 단일 사이클에는 겹침이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** (e) 부품 다섯 가운데 하나만 유독 느릴 때 더 크게 손해 보는 쪽은? 데이터 메모리가 250 ps에서 600 ps로 느려졌다고 하고 두 설계의 클록 주기를 구하라.</summary>

**답:** 파이프라인이 비율로는 더 크게 손해 본다. 단일 사이클은 950 → 1,300 ps(1.37배), 파이프라인은 250 → 600 ps(2.4배)다.<br>
**이유:** 단일 사이클의 주기는 합이라 느린 부품이 "보태지고", 파이프라인의 주기는 최댓값이라 느린 부품이 주기를 "혼자 정한다". 그래서 파이프라인은 단계의 시간을 고르게 맞추는 것이 중요하다.

</details>


## 결정적 차이

| | 단일 사이클 | 5단계 파이프라인 |
|---|---|---|
| 한 사이클에 하는 일 | 명령어 하나를 처음부터 끝까지 | 명령어마다 한 단계씩, 다섯 명령어를 동시에 |
| 클록 주기 | 가장 긴 명령어가 지나는 부품 시간의 합 (950 ps) | 가장 긴 단계 하나의 시간 (250 ps) |
| 명령어당 사이클 수(CPI) | 정확히 1 | 1 + 쉬거나 버리는 사이클 |
| 명령어 하나가 끝나는 시간 | 950 ps | 1,250 ps |
| 명령어 사이의 간격 | 950 ps | 250 ps (해저드가 없을 때) |
| 더 드는 회로 | 없다 | 파이프라인 레지스터, 전방 전달, 해저드 검출, 버리기 |
| 해저드 | 없다 | 데이터 해저드, 제어 해저드 |
| 결과 | 같다 | 같다 |

표의 틀은 교재의 비교를 따랐다[^1]. 선택을 가르는 줄은 "클록 주기"와 "명령어당 사이클 수"다. [CPU 시간 식](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/)에 넣으면 한눈에 보인다.

$$\text{CPU 시간} = \text{명령어 수} \times \text{CPI} \times \text{클록 주기}$$


- 단일 사이클: $$n \times 1 \times 950$$ ps
- 파이프라인: $$n \times (1 + \text{명령어당 잃는 사이클}) \times 250$$ ps

파이프라인은 CPI를 조금 내주고 클록 주기를 크게 줄인다. 명령어 하나마다 평균 0.2사이클을 잃는다고 해도 명령어당 $$1.2 \times 250 = 300$$ ps여서 단일 사이클보다 $$950 \div 300 \approx 3.17$$배 빠르다. 파이프라인이 지려면 명령어당 2.8사이클 넘게 잃어야 한다($$3.8 \times 250 = 950$$).

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표와 카드의 수치, 300 ps와 3.17배, 아래 다중 사이클의 4.05와 1,012.5 ps — [26_single-cycle-timing_verify.py](/Hongs_Blog/studies/computer-architecture/code/26_single-cycle-timing_verify/). 두 설계가 같은 결과를 낸다는 것은 무작위 프로그램 4,000개로 확인 — [27_mips-pipeline_impl.py](/Hongs_Blog/studies/computer-architecture/code/27_mips-pipeline_impl/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 명령어를 다섯 단계로 자르되 겹쳐 흘리지 않고, 명령어 하나가 필요한 단계만 지난 뒤 다음 명령어를 시작하는 설계가 있다(다중 사이클). `lw` 5사이클, `sw`와 R형 4사이클, `beq`와 `j` 3사이클이 든다. 본문의 부품 시간(주기 250 ps)과 명령어 비율(`lw` 25%, `sw` 10%, R형 45%, `beq` 15%, `j` 5%)로 명령어당 평균 시간을 구하고, 단일 사이클·파이프라인과 견주라.</summary>

**답:** 평균 CPI는 $$0.25 \times 5 + 0.10 \times 4 + 0.45 \times 4 + 0.15 \times 3 + 0.05 \times 3 = 4.05$$. 명령어당 $$4.05 \times 250 = 1012.5$$ ps다. 단일 사이클(950 ps)보다도 느리고 파이프라인(250 ps)과는 견줄 수 없다.<br>
**이유:** 다중 사이클은 짧은 명령어가 일찍 끝나는 이득을 얻지만, 단계가 고르지 않으면 짧은 단계도 250 ps를 채우느라 그 이득을 까먹는다. 이 설계의 진짜 이점은 부품을 여러 사이클에 나눠 쓸 수 있어서 ALU 하나, 메모리 하나로 만들 수 있다는 것과, 곱셈처럼 아주 긴 명령어가 다른 명령어를 느리게 하지 않는다는 것이다[^2].

</details>


- **더 빠르게 가려면.** 한 사이클에 명령어를 둘 이상 시작하는 설계로 넘어간다. → [슈퍼스칼라와 비순차 실행](/Hongs_Blog/studies/computer-architecture/superscalar-out-of-order/)
- **단일 사이클이 쓰이는 곳.** 교재는 원리를 보이는 데 쓰고, 실제 프로세서는 이렇게 만들지 않는다고 설명한다[^1].

[^1]: Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 4장 "The Processor". 교재 출판사 강의 슬라이드 "Chapter 4 — The Processor" (Cooper Union 게시본), 슬라이드 2~4, 17 (Pipeline Performance, Pipeline Speedup, Pipeline Summary: 처리량을 늘려 빨라진다, 명령어 하나의 시간은 같다, 해저드가 따른다), https://ee.cooper.edu/~curro/comparch/pipeline/chapter4_pipelining_END_FA11.pdf
[^2]: Princeton COS/ELE 375 (Fall 2015, David August), Lecture 8 "Control", 슬라이드 30~40, 52~53 (Other Problems, Multicycle Approach: 명령어는 3~5단계, 부품을 다시 쓴다, 유형별 사이클 수 표, Single/Multi-Cycle Summary), https://www.cs.princeton.edu/courses/archive/fall15/cos375/lectures/08-Control.pdf. `j`의 3사이클은 같은 강의 슬라이드 48의 단계 요약 표에서 읽었다.
[^s1]: 부품 시간, 명령어 비율, "명령어당 0.2사이클"과 그것으로 계산한 수치는 교재의 값이 아니라 직접 정한 것이다.
{% endraw %}
