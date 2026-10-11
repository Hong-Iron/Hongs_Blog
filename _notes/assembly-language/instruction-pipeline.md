---
layout: "note"
title: "파이프라인과 슈퍼스칼라"
display_title: "파이프라인과 슈퍼스칼라 (Pipeline and Superscalar)"
kind: "concept"
kind_label: "모델"
num: "03"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Multi-Stage Pipeline", "다단계 파이프라인", "파이프라이닝", "Pipelining", "Pipelined Execution", "슈퍼스칼라", "Superscalar", "낭비되는 사이클", "Wasted Cycles"]
description: "빨래방에서 한 사람의 빨래가 세탁, 건조, 개기를 모두 끝낼 때까지 다음 사람이 기다리면 기계 대부분이 놀게 된다. 세탁기가 비는 대로 다음 사람이 빨래를 넣으면 같은 시간에 훨씬 많은 빨래가 끝난다. 프로세서도 명령어 하나를 여러 걸음으로 나눠, 앞 명령어가 다음 걸음으로 넘어가…"
prev_url: "/studies/assembly-language/virtual-machine-levels/"
prev_title: "가상 기계 계층"
next_url: "/studies/assembly-language/x86-registers/"
next_title: "x86 레지스터"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/instruction-pipeline/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

빨래방에서 한 사람의 빨래가 세탁, 건조, 개기를 모두 끝낼 때까지 다음 사람이 기다리면 기계 대부분이 놀게 된다. 세탁기가 비는 대로 다음 사람이 빨래를 넣으면 같은 시간에 훨씬 많은 빨래가 끝난다. 프로세서도 명령어 하나를 여러 걸음으로 나눠, 앞 명령어가 다음 걸음으로 넘어가면 곧바로 뒤 명령어를 받는다. 다만 어느 한 걸음이 남들보다 오래 걸리면 그 앞에서 줄이 밀린다. 그 걸음에 기계를 두 대 놓아 밀림을 푸는 것이 슈퍼스칼라다.

</div>


## 예시로 보기

명령어 하나를 처리하는 일은 가져오기, 뜻 알아내기, 실행하기 같은 여러 걸음으로 나뉜다. 슬라이드의 프로세서는 걸음이 여섯이고 S1~S6이라 부른다. 한 걸음에 시계 한 번(1사이클)이 든다.

**나누지 않고 하나씩.** 명령어 I-1이 S1부터 S6까지 다 지나간 뒤에야 I-2가 S1에 들어간다[^1].

```
사이클   S1   S2   S3   S4   S5   S6
  1      I-1
  2           I-1
  3                I-1
  4                     I-1
  5                          I-1
  6                               I-1
  7      I-2
  ...
 12                               I-2
```

명령어 2개에 12사이클이 든다. 표의 칸 72개 가운데 12개만 차 있다. 사이클마다 걸음 여섯 중 다섯이 논다.

**파이프라인.** I-1이 S2로 넘어가면 비어 있는 S1에 곧바로 I-2를 넣는다[^2].

```
사이클   S1   S2   S3   S4   S5   S6
  1      I-1
  2      I-2  I-1
  3           I-2  I-1
  4                I-2  I-1
  5                     I-2  I-1
  6                          I-2  I-1
  7                               I-2
```

12사이클이 7사이클로 줄었다. I-1이 끝나는 데 6사이클이 들고, 그 뒤로는 사이클마다 명령어가 하나씩 끝난다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드 표 네 장의 사이클 수(12, 7, 11, 10)와 S4·S5·S6 칸, 걸음 수 4~8과 명령어 수 1~29에서 네 식이 흉내 결과와 같음, 카드의 값 — [03_instruction-pipeline_verify.py](/Hongs_Blog/studies/assembly-language/code/03_instruction-pipeline_verify/)</div>

</div>


## 사이클 수

걸음 수를 $$k$$, 명령어 수를 $$n$$이라 한다. 슬라이드는 걸음을 state(또는 stage)라 부른다.

| 방식 | 드는 사이클 수 | 슬라이드의 표 |
|---|---|---|
| 하나씩 (파이프라인 없음) | $$n \times k$$[^s1] | $$k = 6$$, $$n = 2$$ → 12[^1] |
| 파이프라인, 모든 걸음이 1사이클 | $$k + (n - 1)$$ | $$k = 6$$, $$n = 2$$ → 7[^2] |
| 파이프라인, 한 걸음이 2사이클 | $$k + (2n - 1)$$ | $$k = 6$$, $$n = 3$$ → 11[^3] |
| 슈퍼스칼라, 2사이클짜리 걸음을 두 줄로 | $$k + n$$ | $$k = 6$$, $$n = 4$$ → 10[^4] |

둘째 식은 "첫 명령어가 $$k$$사이클, 나머지 $$n - 1$$개가 1사이클씩"이라고 읽는다.

명령어가 100개면 차이가 뚜렷하다. 하나씩 하면 600사이클, 파이프라인이면 105사이클이다. 여섯 배 가까이 빠르다.

### 한 걸음이 오래 걸리면

실행 걸음 S4가 2사이클을 쓴다고 하자. S4에는 한 번에 한 명령어만 들어가므로, 뒤 명령어는 S4가 빌 때까지 앞에서 기다린다[^3].

| 명령어 | S4에 있는 사이클 | S5 | S6 (끝나는 사이클) |
|---|---|---|---|
| I-1 | 4, 5 | 6 | 7 |
| I-2 | 6, 7 | 8 | 9 |
| I-3 | 8, 9 | 10 | 11 |

명령어가 2사이클에 하나씩만 끝난다. S5와 S6은 한 사이클 걸러 한 번씩 논다. 그래서 $$k + (2n - 1)$$이다. 100개면 205사이클로, 느린 걸음 하나 때문에 거의 두 배가 든다.

### 슈퍼스칼라

느린 걸음 S4를 두 줄(u와 v)로 놓는다. 명령어가 번갈아 두 줄로 들어간다[^4].

| 명령어 | S4에 있는 사이클 (줄) | S5 | S6 (끝나는 사이클) |
|---|---|---|---|
| I-1 | 4, 5 (u) | 6 | 7 |
| I-2 | 5, 6 (v) | 7 | 8 |
| I-3 | 6, 7 (u) | 8 | 9 |
| I-4 | 7, 8 (v) | 9 | 10 |

S4 한 줄은 여전히 2사이클을 쓰지만, 두 줄이 한 사이클씩 엇갈려 일하므로 다시 사이클마다 명령어가 하나씩 끝난다. $$k + n$$은 둘째 식보다 1 큰 값이다. 첫 명령어가 S4에서 한 사이클을 더 쓰는 몫이다. 100개면 106사이클이다.

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">네 식이 나오는 과정</summary>

1. **하나씩.** 명령어 하나가 $$k$$사이클을 혼자 쓴다. $$n$$개면 $$n \times k$$.
2. **파이프라인.** 첫 명령어는 $$k$$번째 사이클에 끝난다. 뒤 명령어는 앞 명령어보다 한 사이클 늦게 들어가 한 사이클 늦게 끝난다. 마지막 명령어는 $$k + (n - 1)$$번째 사이클에 끝난다.
3. **한 걸음이 2사이클.** 첫 명령어는 $$k + 1$$번째 사이클에 끝난다. 느린 걸음은 2사이클에 명령어 하나만 내보내므로, 뒤 명령어는 2사이클씩 늦게 끝난다. 마지막은 $$(k + 1) + 2(n - 1) = k + (2n - 1)$$.
4. **느린 걸음을 두 줄로.** 첫 명령어는 여전히 $$k + 1$$번째 사이클에 끝난다. 두 줄이 엇갈려 사이클마다 하나씩 내보내므로 뒤 명령어는 1사이클씩 늦게 끝난다. 마지막은 $$(k + 1) + (n - 1) = k + n$$[^s1].

</details>


빨래방 비유는 "명령어들이 서로 상관없이 흘러간다"는 데까지만 맞다. 실제 명령어는 앞 명령어의 결과를 기다려야 할 때가 있고, 그러면 줄이 더 밀린다. 슬라이드의 표와 식은 그런 기다림이 없다고 놓은 것이다[^s1].

## 활용

- 요즘 프로세서가 같은 시계 속도에서도 명령어를 많이 처리하는 까닭이 이 두 방법이다.
- 흔한 실수: 파이프라인이 명령어 하나를 빨리 끝낸다고 생각하는 것. 명령어 하나는 여전히 $$k$$사이클이 든다. 줄어드는 것은 여러 명령어를 모두 끝내는 데 드는 시간이다.

## 연결

- 걸음으로 나누기 전의 기본 고리(가져오기 → 실행하기): [명령어 사이클](/Hongs_Blog/studies/operating-systems/instruction-cycle/)
- 걸음 사이에서 값을 들고 있는 저장 칸: [x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/)

## 과목별 관점

**컴퓨터 구조 (2-1학기).** 이 문서의 걸음 수 $$k$$가 5인 경우를 실제 회로로 만든다. MIPS 프로세서의 다섯 걸음은 가져오기(IF), 해독(ID), 실행(EX), 메모리(MEM), 되쓰기(WB)이고, 걸음마다 명령어 메모리, 레지스터 파일, ALU, 데이터 메모리, 다시 레지스터 파일을 쓴다[^k1]. 둘째 식 $$k + (n - 1)$$에 $$k = 5$$를 넣으면 $$n + 4$$사이클이다: [5단계 파이프라인](/Hongs_Blog/studies/computer-architecture/mips-pipeline/).

이 문서가 "없다고 놓은 기다림"이 그 과목의 중심 주제다. 뒤 명령어가 앞 명령어의 결과를 읽어야 할 때는 계산이 끝난 값을 지름길로 당겨 쓰고([데이터 해저드와 전방 전달](/Hongs_Blog/studies/computer-architecture/data-hazard-forwarding/)), 그래도 안 되면 한 사이클을 쉰다([적재-사용 해저드와 스톨](/Hongs_Blog/studies/computer-architecture/load-use-stall/)). 분기 명령 뒤에 미리 가져온 명령어가 틀렸으면 버린다([제어 해저드와 분기 예측](/Hongs_Blog/studies/computer-architecture/control-hazard-branch-prediction/)). 그래서 실제 사이클 수는 $$n + 4$$에 쉰 사이클과 버린 명령어 수를 더한 값이다[^ks1]. 여러 줄로 놓는 생각을 더 밀고 나간 설계는 [슈퍼스칼라와 비순차 실행](/Hongs_Blog/studies/computer-architecture/superscalar-out-of-order/)에 있다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 걸음이 6개인 프로세서로 명령어 5개를 처리한다. (가) 하나씩 (나) 파이프라인 (다) 파이프라인인데 S4가 2사이클 (라) S4를 두 줄로 놓은 슈퍼스칼라에서 각각 몇 사이클이 드는가?</summary>

**답:** (가) $$5 \times 6 = 30$$ (나) $$6 + 4 = 10$$ (다) $$6 + 9 = 15$$ (라) $$6 + 5 = 11$$.<br>
**이유:** (나)에서 첫 명령어가 6사이클, 나머지 넷이 1사이클씩이다. (다)는 나머지 넷이 2사이클씩이고 첫 명령어도 한 사이클을 더 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 파이프라인에서 명령어 하나가 끝나는 데 드는 사이클 수는 줄지 않는다. 그런데 왜 전체는 빨라지는가?</summary>

**답:** 명령어 하나는 여전히 걸음 $$k$$개를 다 지나야 한다. 달라지는 것은 한 사이클에 여러 걸음이 함께 일한다는 점이다. 첫 명령어가 끝난 뒤로는 사이클마다 명령어가 하나씩 끝나므로, $$n$$개에 $$n \times k$$가 아니라 $$k + (n - 1)$$사이클이 든다.<br>
**흔한 오답:** "걸음 하나가 빨라져서". 걸음 하나의 시간은 그대로다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$k = 6$$이고 S4만 2사이클인 파이프라인(줄은 하나)에 I-1, I-2, I-3을 넣는다. I-3은 몇 번째 사이클에 S4에 들어가고 몇 번째 사이클에 끝나는가?</summary>

**답:** 8번째 사이클에 S4에 들어가 8, 9사이클을 쓰고, 10번째에 S5, 11번째에 S6을 지나 끝난다.<br>
**이유:** I-1이 S4를 4, 5사이클에, I-2가 6, 7사이클에 쓴다. I-3은 S4가 비는 8사이클까지 앞에서 기다린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 걸음이 5개인 MIPS 파이프라인으로 명령어 100개를 처리한다. 기다림이 전혀 없을 때의 사이클 수는? 도중에 한 사이클씩 쉬는 일이 10번, 분기 때문에 명령어 하나를 버리는 일이 6번 있었다면?</summary>

**답:** 104사이클과 120사이클.<br>
**이유:** $$k + (n - 1) = 5 + 99 = 104$$. 쉬는 사이클과 버린 명령어는 하나에 한 사이클씩 더 든다. $$104 + 10 + 6 = 120$$[^ks1].

</details>


[^1]: 어셈블리어 3회 강의 자료 「wk03-chapt_02-3-3」, p.2 (Multi-Stage Pipeline: Example of a non-pipelined processor. Many wasted cycles. 12사이클 표)
[^2]: 어셈블리어 3회 강의 자료 「wk03-chapt_02-3-3」, p.3 (Pipelined Execution: k + (n – 1), 7사이클 표)
[^3]: 어셈블리어 3회 강의 자료 「wk03-chapt_02-3-3」, p.4 (Wasted Cycles (pipelined): k + (2n – 1), S4에 exe 표시, 11사이클 표)
[^4]: 어셈블리어 3회 강의 자료 「wk03-chapt_02-3-3」, p.5 (Superscalar: Stage S4 has left and right pipelines (u and v), k + n, 10사이클 표)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 빨래방 비유와 그 한계, $$n \times k$$ 식, 명령어 100개의 값, 네 식이 나오는 과정, 카드는 슬라이드에 없다. 슬라이드에는 표 네 장과 식 세 개가 있다. $$n \times k$$는 p.2의 표(12 = 2 × 6)에서 읽었다. 흉내 프로그램으로 표의 칸과 식을 확인했다.
[^k1]: 교재 출판사 강의 슬라이드 "Chapter 4 — The Processor" (Cooper Union 게시본), 슬라이드 1 (MIPS Pipeline: 다섯 단계), https://ee.cooper.edu/~curro/comparch/pipeline/chapter4_pipelining_END_FA11.pdf. Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 4장 "The Processor"
[^ks1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> "$$n + 4$$에 쉰 사이클과 버린 명령어 수를 더한다"와 카드 C4의 수치는 슬라이드에 없다. 5단계 파이프라인 흉내기([27_mips-pipeline_impl.py](/Hongs_Blog/studies/computer-architecture/code/27_mips-pipeline_impl/))의 예제들에서 이 셈이 맞는 것을 확인했다.
{% endraw %}
