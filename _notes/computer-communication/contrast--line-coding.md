---
layout: "note"
title: "인코딩 방식 비교"
display_title: "인코딩 방식 비교"
kind: "concept"
kind_label: "비교"
num: "43"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["NRZ vs NRZI vs Manchester vs 4B/5B", "선 부호화 비교", "Line Coding Comparison"]
description: "네 방식은 모두 0과 1을 높고 낮은 신호로 바꾼다. 서로 다른 것은 \"어떤 비트열에서 신호가 평평해지는가\"와 \"그 대가로 효율을 얼마나 내주는가\"다. 고르는 질문은 둘이다. 보낼 데이터에 같은 값이 길게 이어지는가? 선이 신호를 얼마나 빨리 바꿀 수 있는가?"
prev_url: "/studies/computer-communication/4b5b/"
prev_title: "4B/5B"
next_url: "/studies/computer-communication/byte-framing/"
next_title: "바이트 중심 프레이밍"
math: false
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/contrast--line-coding/"
---
{% raw %}
네 방식은 모두 0과 1을 높고 낮은 신호로 바꾼다. 서로 다른 것은 "어떤 비트열에서 신호가 평평해지는가"와 "그 대가로 효율을 얼마나 내주는가"다. 고르는 질문은 둘이다. 보낼 데이터에 같은 값이 길게 이어지는가? 선이 신호를 얼마나 빨리 바꿀 수 있는가?

## 어느 쪽일까

상황마다 [NRZ](/Hongs_Blog/studies/computer-communication/nrz-clock-recovery/), [NRZI, 맨체스터](/Hongs_Blog/studies/computer-communication/nrzi-manchester/), [4B/5B + NRZI](/Hongs_Blog/studies/computer-communication/4b5b/) 중 무엇이 맞는지 고르고, 다른 것이 왜 아닌지 쓴다.

<details markdown="1"><summary markdown="span"><b>C1</b> (a) 보낼 데이터가 거의 1로만 이루어져 있다(빈 칸을 1로 채운 메모리 덤프). NRZ와 NRZI 중 무엇이 낫나? (b) 데이터가 거의 0으로만 이루어져 있다면?</summary>


**답:** (a) NRZI. 1마다 신호가 뒤집혀 박자 단서가 계속 생긴다. NRZ는 1이 이어지면 높은 채로 평평하다. (b) 둘 다 실패한다. 0이 이어지면 NRZ도 NRZI도 평평하다. 맨체스터나 4B/5B + NRZI를 써야 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> (c) 어떤 비트열이든 박자를 놓치면 안 되고, 회로는 단순해야 하며, 선은 데이터 속도의 두 배로 신호를 바꿀 여유가 있다. (d) 선이 신호를 바꾸는 속도가 비싸서 낭비를 줄이고 싶다. 맨체스터와 4B/5B + NRZI 중 각각 무엇을 고르나?</summary>


**답:** (c) 맨체스터. 비트마다 한가운데서 반드시 바뀌어 어떤 비트열에서도 박자를 잃지 않고, 표를 찾을 필요도 없다. 효율 50%는 선의 여유로 감당한다. (d) 4B/5B + NRZI. 효율이 80%라 같은 신호 속도로 맨체스터의 1.6배를 싣는다. 0이 3개까지 이어질 수는 있지만, 신호가 바뀌지 않는 구간은 4비트 폭을 넘지 않아 받는 쪽이 버틴다.<br>
**흔한 오답:** (c)에서 4B/5B를 고르는 것. 효율은 높지만 박자 단서가 최대 4비트 폭 동안 없고, 표가 필요해 회로가 더 복잡하다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 다음 신호(반 칸 단위, 처음 낮음)는 NRZ, NRZI, 맨체스터 중 무엇으로 그린 것인가? 비트열도 쓰라(칸 하나에 반 칸 두 개). `‾_ _‾ _‾ ‾_`</summary>


**답:** 맨체스터. 네 칸 모두 한가운데서 바뀐다. NRZ라면 칸 안에서 바뀌지 않는다. NRZI라면 한가운데서 바뀌는 칸은 모두 1이어야 하는데, 그러면 신호가 칸 경계에서는 바뀌지 않아야 한다. 그런데 2·3번째 칸 사이(`_‾ _‾`)에서 높음 → 낮음으로 경계에서 바뀌므로 NRZI가 아니다. 맨체스터로 읽으면 내려감, 올라감, 올라감, 내려감이니 `1001`이다.

</details>

## 결정적 차이

| 기준 | NRZ | NRZI | 맨체스터 | 4B/5B + NRZI |
|---|---|---|---|---|
| 1을 나타내는 법 | 높음 | 한가운데서 뒤집기 | 내려감 | 표로 5비트를 고른 뒤 NRZI |
| 신호가 평평해지는 비트열 | 1이 이어질 때, 0이 이어질 때 | 0이 이어질 때 | 없음 | 0은 3개까지만 이어짐 |
| 신호가 바뀌지 않는 최대 길이 | 끝없음 | 끝없음 | 1비트 폭 | 4비트 폭 (0 세 개와 양옆 반 칸씩) |
| 효율 | 100% | 100% | 50% | 80% |
| 받는 쪽이 보는 것 | 높이 | 칸 안의 변화 여부 | 변화의 방향 | 변화 여부 → 표로 4비트 |
| 출처 | 슬라이드 35[^1] | 슬라이드 38[^2] | 슬라이드 38·39[^2] | 슬라이드 40[^3] |

선택을 바꾸는 것은 "평평해지는 비트열"과 "효율" 두 줄이다. 데이터에 무엇이 이어질지 모르면 NRZ와 NRZI는 빠진다. 남은 둘 중에서는 선의 여유가 고른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 방식의 평평한 구간과 효율 — [41_nrzi-manchester_impl.py](/Hongs_Blog/studies/computer-communication/code/41_nrzi-manchester_impl/), [42_4b5b_verify.py](/Hongs_Blog/studies/computer-communication/code/42_4b5b_verify/)</div>

</div>


## 둘 다 아닐 때

<details markdown="1"><summary markdown="span"><b>C4</b> 네 방식 모두 맞지 않는 상황 두 가지와 그때의 선택지를 쓰라.</summary>


**답:** ① 공기 중으로 보내는 무선 링크. 높고 낮은 두 값의 신호는 멀리 퍼지지 않으므로, 반송파의 진폭·주파수·위상을 바꾸는 [진폭·주파수·위상 변조](/Hongs_Blog/studies/computer-communication/digital-modulation/)를 쓴다. ② 칩 사이처럼 짧은 연결에서 선을 하나 더 쓸 수 있을 때. 클럭을 별도의 선으로 함께 보내면 데이터는 NRZ 그대로 보내도 된다[^s1].

</details>

[^1]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 35 "Non-Return to Zero(NRZ)"
[^2]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 38 "NRZI and Manchester", 슬라이드 39 "Mid-transition의 의미"
[^3]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 40 "4B/5B"
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 상황 문제(C1~C4), "신호가 바뀌지 않는 최대 길이"와 "받는 쪽이 보는 것" 줄, 무선과 별도 클럭 선의 경우는 원본에 없다. 각 방식의 규칙에서 나오며 구현·검증 코드로 확인했다. 슬라이드 33은 무선에서 쓰는 변조(Data ⇒ A-Signal)와 주로 유선에서 쓰는 인코딩(Data ⇒ D-Signal)을 나눈다.
{% endraw %}
