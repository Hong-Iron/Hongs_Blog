---
layout: "note"
title: "배열과 연결 리스트 비교"
display_title: "배열과 연결 리스트 비교"
kind: "concept"
kind_label: "비교"
num: "16"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Array vs Linked List", "배열 대 연결 리스트", "순차 표현과 연결 표현", "Sequential vs Linked Representation"]
description: "둘 다 원소를 한 줄로 세워 담는다. 가르는 질문은 \"다음 원소가 어디 있는지를 계산하는가, 적어 두는가\"다. 배열은 붙어 있는 칸에 차례로 두어서 k번 원소의 주소를 계산으로 얻는다. 연결 리스트는 아무 데나 두고 원소마다 다음 원소의 주소를 적어 둔다. 이 한 가지가 읽기, 끼…"
prev_url: "/studies/data-structures/singly-linked-list/"
prev_title: "단순 연결 리스트"
next_url: "/studies/data-structures/linked-list-variants/"
next_title: "연결 리스트의 변형"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/array-vs-linked-list/"
---
{% raw %}
둘 다 원소를 한 줄로 세워 담는다. 가르는 질문은 "다음 원소가 어디 있는지를 **계산하는가, 적어 두는가**"다. 배열은 붙어 있는 칸에 차례로 두어서 k번 원소의 주소를 계산으로 얻는다. 연결 리스트는 아무 데나 두고 원소마다 다음 원소의 주소를 적어 둔다[^1]. 이 한 가지가 읽기, 끼우기, 크기, 메모리를 모두 정한다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (가) 학생 1,000명의 점수를 번호 순으로 담아 두고 "k번 학생의 점수"를 자주 읽는다. 넣고 빼는 일은 거의 없다. (나) 긴 줄의 가운데 한 자리를 손가락으로 짚은 채, 그 자리 바로 뒤에 끼우고 빼는 일을 수없이 되풀이한다. 각각 어느 쪽인가?</summary>

**답:** (가)는 배열이다. k번 칸의 주소는 "시작 주소 + k × 칸 크기"라 한 번에 읽는다. 연결 리스트면 읽을 때마다 링크를 k번 따라간다. (나)는 연결 리스트다. 짚은 노드의 링크 한두 개만 고치면 끝난다. 배열이면 그 뒤의 원소를 모두 한 칸씩 밀거나 당긴다.<br>
**이유:** 1,000개를 0번부터 999번까지 한 번씩 읽으면 배열은 주소 계산 1,000번, 연결 리스트는 링크 499,500번이다. 가운데에 하나 끼우면 배열은 원소 500개를 옮기고 연결 리스트는 링크 2개를 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (다) 깊이가 많아야 50인 스택. (라) 원소가 몇 개 들어올지 전혀 모르는 큐. 각각 어느 쪽으로 만들겠는가?</summary>

**답:** (다)는 배열이다([배열로 만든 스택](/Hongs_Blog/studies/data-structures/array-stack/)). 칸 수를 미리 알고, 원소마다 링크를 둘 필요가 없다. (라)는 연결 리스트가 편하다([연결 리스트로 만든 큐](/Hongs_Blog/studies/data-structures/linked-queue/)). 칸 수를 정하지 않고 들어올 때마다 노드를 하나씩 얻는다.<br>
**이유:** 배열로 만든 스택과 큐는 정해진 개수까지만 담는다. 연결 리스트로 만들면 크기를 처음에 정할 필요가 없다[^2]. 배열도 가득 찰 때마다 두 배로 늘리면 (라)를 감당한다([배열 두 배 늘리기](/Hongs_Blog/studies/data-structures/array-doubling/)).

</details>


## 결정적 차이

원소가 $$n$$개일 때다[^s1].

| | 배열 | 연결 리스트 |
|---|---|---|
| 메모리에서의 자리 | 붙어 있는 칸. 칸의 순서가 곧 목록의 순서다[^3] | 흩어진 노드. 링크가 순서를 정한다[^3] |
| k번 원소 읽기 | $$O(1)$$. 주소를 계산한다 | $$O(k)$$. 링크를 k번 따라간다[^4] |
| 자리를 아는 곳에 끼우기·지우기 | $$O(n)$$. 뒤의 원소를 모두 민다 | $$O(1)$$. 링크 한두 개를 고친다[^4] |
| 크기 | 칸 수를 먼저 정한다. 넘으면 못 넣거나 더 큰 배열로 옮긴다 | 정하지 않는다. 넣을 때마다 노드 하나를 얻는다[^2] |
| 덤으로 쓰는 메모리 | 아직 안 쓴 빈칸 | 원소마다 링크 한 칸 |

선택을 가르는 줄은 둘째와 셋째다. 몇 번째인지로 자주 읽으면 배열, 짚고 있는 자리에서 자주 끼우고 빼면 연결 리스트다.

"크기를 정하지 않는다"에는 끝이 있다. `malloc`이 더 줄 메모리가 없어 NULL을 돌려주면 거기서 멈춘다. 덤 메모리도 작지 않다. 원소가 `char` 하나일 때 배열은 원소마다 1바이트를 쓰는데, 노드는 링크 8바이트와 자리를 맞추는 빈칸까지 16바이트를 쓴다(64비트 컴퓨터에서 잰 값)[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 원소 1,000개로 센 횟수다. 맨 앞에 1,000번 끼우기는 배열이 원소를 499,500번 옮기고 연결 리스트는 링크만 2,000번 쓴다. 0 ~ 999번을 한 번씩 읽기는 배열이 주소 계산 1,000번, 연결 리스트가 링크 499,500번이다. 가운데에 하나 끼우기는 500번 대 2번이다. `char` 1,000개의 메모리는 1,000바이트 대 16,000바이트다 — [16_array-vs-linked-list_impl.c](/Hongs_Blog/studies/data-structures/code/16_array-vs-linked-list_impl/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "k번째 원소 읽기"도 잦고 "가운데에 끼우기·지우기"도 잦다. 배열과 연결 리스트 가운데 어느 쪽도 맞지 않는 까닭을 쓰고, 다른 길을 하나 들어라.</summary>

**답:** 배열은 읽기가 $$O(1)$$이지만 끼울 때마다 $$O(n)$$이고, 연결 리스트는 끼우기가 $$O(1)$$이지만 자리를 찾을 때마다 $$O(k)$$다. 어느 쪽을 골라도 잦은 일 하나가 원소 수에 비례해 느리다. 줄을 트리로 세워 노드마다 "왼쪽에 몇 개가 있나"를 적어 두면 두 일을 모두 트리의 높이에 비례하는 시간에 한다: [색인 이진 탐색 트리](/Hongs_Blog/studies/data-structures/indexed-bst/).<br>
**이유:** 한 줄로 세운 구조는 "계산으로 건너뛰기"와 "링크만 고치기" 가운데 하나만 준다. 순서 대신 열쇠 값으로 찾는 일이 대부분이라면 줄 세우기를 그만두고 [해시 테이블](/Hongs_Blog/studies/data-structures/hash-table-terms/)을 쓰는 길도 있다[^s1].

</details>


[^1]: 자료구조 2회 강의 자료 「DS_Week2_2024」, p.4 (배열과 레코드는 원소의 주소를 산술로 계산하고, 연결 자료구조는 구조 안에 원소의 주소를 저장한다)
[^2]: 자료구조 5회 강의 자료 「DS_Week5_Lecture_2024」, p.27, p.32 (배열로 만든 스택과 큐는 정해진 개수까지만 된다. 연결 리스트로 만들면 개수 제한이 없고 크기를 처음에 정할 필요가 없다)
[^3]: 같은 자료, p.4~5 (L = (a, b, c, d, e)의 배열 배치와 연결 배치)
[^4]: 같은 자료, p.3 (어느 자리에서든 끼우기와 지우기가 효율적이다. 단점은 원소에 가는 시간이 노드 수에 비례하는 것이다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 표의 시간 칸에 적은 $$O$$ 표기와 횟수, 덤 메모리 줄, `malloc`이 NULL을 돌려줄 때의 이야기, 노드 크기 16바이트, 카드 C1~C3의 상황은 슬라이드에 없다. 횟수와 크기는 구현 코드로 세고 쟀다. 색인 이진 탐색 트리와 해시 테이블은 이 과목 9주차와 15주차 슬라이드의 내용이다.
{% endraw %}
