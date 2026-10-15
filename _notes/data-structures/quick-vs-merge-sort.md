---
layout: "note"
title: "퀵 정렬과 병합 정렬 비교"
display_title: "퀵 정렬과 병합 정렬 비교"
kind: "concept"
kind_label: "비교"
num: "44"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Quick Sort vs Merge Sort", "퀵 정렬 대 병합 정렬"]
description: "둘 다 \"나누고, 조각을 따로 정렬하고, 이어 붙인다\". 가르는 질문은 \"무엇을 기준으로 나누는가\"다. 퀵 정렬은 값(피벗)으로 나누고 병합 정렬은 자리(가운데)로 나눈다. 그 답이 일이 몰리는 곳, 가장 나쁠 때의 빠르기, 덤 공간을 함께 정한다."
prev_url: "/studies/data-structures/merge-sort/"
prev_title: "병합 정렬"
next_url: "/studies/data-structures/external-merge-sort/"
next_title: "외부 병합 정렬"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/quick-vs-merge-sort/"
---
{% raw %}
둘 다 "나누고, 조각을 따로 정렬하고, 이어 붙인다". 가르는 질문은 "**무엇을 기준으로 나누는가**"다. 퀵 정렬은 값(피벗)으로 나누고 병합 정렬은 자리(가운데)로 나눈다. 그 답이 일이 몰리는 곳, 가장 나쁠 때의 빠르기, 덤 공간을 함께 정한다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (가) 메모리에 다 들어가는 정수 100만 개를 되도록 빨리, 덤 메모리 없이 정렬한다. 입력은 무작위에 가깝다. (나) 어떤 입력이 들어와도 정해진 시간 안에 끝나야 하는 프로그램에서 기록을 정렬한다. 메모리는 넉넉하다. 어느 쪽인가?</summary>

**답:** (가) 퀵 정렬. 평균 실행 시간이 가장 좋고 같은 배열 안에서 맞바꾸기만 한다. (나) 병합 정렬. 가장 나쁜 경우에도 $$O(n \log n)$$이다.<br>
**이유:** (가)에 병합 정렬을 쓰면 100만 칸짜리 덤 배열이 필요하다. (나)에 퀵 정렬을 쓰면 드물게라도 $$O(n^2)$$ 입력을 만날 수 있어 "어떤 입력이 와도"라는 조건을 지키지 못한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (다) 거의 정렬된 채로 들어오는 자료를 맨 왼쪽 피벗 퀵 정렬로 정렬하고 있다. 자료가 1,000개에서 2,000개로 늘자 시간이 네 배가 되었다. 무슨 일이고, 병합 정렬로 바꾸면 어떻게 되는가? (라) 메모리에 다 들어가지 않는 파일을 정렬한다. 어느 쪽인가?</summary>

**답:** (다) 피벗이 번번이 가장 작은 값이라 조각이 0개와 나머지로 갈리는 가장 나쁜 경우다. 병합 정렬로 바꾸면 두 배 남짓으로만 는다. (라) 병합 정렬(외부 병합 정렬).<br>
**이유:** 정렬된 입력에서 세면 퀵 정렬의 비교는 501,498번에서 2,002,998번으로 네 배, 병합 정렬은 5,044번에서 11,088번으로 2.2배다. (라)에서 병합은 두 줄을 앞에서부터 차례로만 읽으므로 디스크 파일에 알맞다. 퀵 정렬의 분할은 배열의 양 끝을 오가며 맞바꾼다.

</details>


## 결정적 차이

| | 퀵 정렬 | 병합 정렬 |
|---|---|---|
| 나누는 기준 | 값. 피벗보다 작은 쪽과 큰 쪽 | 자리. 앞 절반과 뒤 절반 |
| 일이 몰리는 곳 | 나누기 전(분할). 이어 붙이기는 할 일이 없다 | 나눈 뒤(병합). 나누기는 할 일이 없다 |
| 점화식 | $$t(n) = t(\lvert\text{left}\rvert) + t(\lvert\text{right}\rvert) + dn$$ | $$t(n) = t(\lceil n/2 \rceil) + t(\lfloor n/2 \rfloor) + dn$$ |
| 가장 나쁠 때 | $$O(n^2)$$. 조각이 번번이 한쪽으로 몰릴 때 | $$O(n \log n)$$ |
| 평균 | $$O(n \log n)$$ | $$O(n \log n)$$ |
| 한 줄 평 | 평균 실행 시간이 가장 좋다 | 가장 나쁜 경우의 실행 시간이 가장 좋다 |
| 덤 공간 | 재귀 스택. 나쁘면 $$O(n)$$, 손보면 $$O(\log n)$$ | 덤 배열 $$O(n)$$ |
| 같은 값의 처음 순서 | 뒤집힐 수 있다 | 지켜진다 |
| 디스크의 자료 | 알맞지 않다 | 알맞다(외부 병합 정렬) |

선택을 가르는 줄은 "가장 나쁠 때"와 "덤 공간"이다. 두 점화식은 한 층에서 하는 일($$dn$$)이 같고, 층의 수만 다르다. 병합 정렬은 늘 반씩 줄어 층이 $$\lg n$$개쯤이고, 퀵 정렬은 운이 나쁘면 한 개씩만 줄어 층이 $$n$$개가 된다.

같은 입력 1,000개에서 실제로 세면 이렇다[^s1].

| 입력 | | 퀵 정렬(맨 왼쪽 피벗) | 병합 정렬 |
|---|---|---|---|
| 무작위(200번 평균) | 비교 | 12,145 | 8,708 |
| | 배열에 값을 써넣은 횟수 | 4,778 | 19,952 |
| 이미 정렬됨 | 비교 | 501,498 | 5,044 |
| | 재귀 깊이 | 999 | 10 |

무작위 입력에서 비교 횟수는 병합 정렬이 오히려 적다. 퀵 정렬이 앞서는 것은 값을 옮겨 적는 횟수다. 병합 정렬은 층마다 모든 값을 덤 배열에 옮겼다가 되옮기지만, 퀵 정렬은 자리가 틀린 값만 맞바꾼다. 표의 한 줄 평에서 말하는 "평균 실행 시간"은 이런 것까지 합친 시간이다. 이 표는 횟수를 센 것이고 시간을 잰 것은 아니다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 같은 입력에서 두 정렬의 비교 횟수, 써넣은 횟수, 재귀 깊이를 세었다(무작위 1,000개 200번, 정렬된 1,000개와 2,000개, 역순 1,000개). 병합 정렬의 비교는 모든 경우에 $$n\lceil \lg n \rceil = 10{,}000$$ 이하. 실험으로 확인한 값이고 증명이 아니다 — [44_quick-vs-merge-sort_verify.py](/Hongs_Blog/studies/data-structures/code/44_quick-vs-merge-sort_verify/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 퀵 정렬도 병합 정렬도 알맞지 않은 상황 두 가지와 그때의 선택지를 쓰라.</summary>

**답:** ① 자료가 열몇 개뿐이거나 거의 정렬되어 있을 때 → [삽입 정렬](/Hongs_Blog/studies/data-structures/insertion-sort/). ② 덤 배열을 둘 수 없는데 가장 나쁜 경우에도 $$O(n \log n)$$이어야 할 때 → 힙 정렬([우선순위 큐 정렬과 힙 정렬](/Hongs_Blog/studies/data-structures/heap-sort/)).<br>
**이유:** ① 작은 조각에서는 나누고 재귀로 부르는 수고가 더 크다. 그래서 퀵 정렬도 조각이 15개쯤 이하가 되면 삽입 정렬로 넘기곤 한다. 거의 정렬된 자료에서 삽입 정렬의 비교는 $$n$$에 가깝다. ② 퀵 정렬은 가장 나쁠 때 $$O(n^2)$$이고 병합 정렬은 덤 배열이 필요하다. 힙 정렬은 같은 배열 안에서 $$O(n \log n)$$에 끝난다[^s1].

</details>


[^s1]: 같은 값의 순서는 코드로 확인했다. 병합 정렬은 무작위 2,000개에서 처음 순서를 지켰고([43_merge-sort_verify.py](/Hongs_Blog/studies/data-structures/code/43_merge-sort_verify/)), 퀵 정렬은 [1a, 1b]를 [1b, 1a]로 뒤집는다(피벗과 small을 맞바꿀 때, 위 검증 코드). 힙 정렬이 제자리에서 $$O(n \log n)$$이라는 것은 Cormen 외, *Introduction to Algorithms* 3판 6.4절에 있다.
{% endraw %}
