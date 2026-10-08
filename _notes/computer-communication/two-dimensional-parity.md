---
layout: "note"
title: "2차원 패리티"
display_title: "2차원 패리티 (Two-Dimensional Parity)"
kind: "concept"
kind_label: "알고리즘"
num: "48"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Two-Dimensional Parity", "2D Parity", "가로 패리티", "세로 패리티", "VRC", "Vertical Redundancy Check", "LRC", "Longitudinal Redundancy Check", "패리티 바이트", "Parity Byte"]
description: "데이터를 바이트마다 한 줄씩 쌓아 표로 만든 뒤, 각 줄 끝(가로)과 각 칸의 아래(세로)에 패리티 비트를 붙인다. 비트 하나가 뒤집히면 그 비트가 있는 줄과 칸의 패리티가 함께 틀리므로, 교차점에서 어느 비트인지 정확히 알고 고칠 수도 있다. 2·3비트 오류도 모두 잡는다. 하지…"
prev_url: "/studies/computer-communication/error-detecting-code/"
prev_title: "오류 검출 코드"
next_url: "/studies/computer-communication/internet-checksum/"
next_title: "인터넷 체크섬"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/two-dimensional-parity/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

데이터를 바이트마다 한 줄씩 쌓아 표로 만든 뒤, 각 줄 끝(가로)과 각 칸의 아래(세로)에 패리티 비트를 붙인다. 비트 하나가 뒤집히면 그 비트가 있는 줄과 칸의 패리티가 함께 틀리므로, 교차점에서 어느 비트인지 정확히 알고 고칠 수도 있다. 2·3비트 오류도 모두 잡는다. 하지만 직사각형 네 꼭짓점이 함께 뒤집히는 4비트 오류처럼 줄과 칸마다 짝수 개씩 바뀌면 놓친다.

</div>


## 예시로 보기

슬라이드의 7비트 데이터 6바이트에 짝수 패리티를 붙인다[^1].

```
데이터      가로 패리티
1011110     1
1101001     0
0101001     1
1011111     0
0110100     1
0001110     1
-------
1111011     0      ← 세로 패리티 바이트 (맨 끝 0은 가로 패리티들의 패리티)
```

첫 줄 `1011110`은 1이 5개라 1을 붙여 짝수로 만든다. 세로 첫 칸은 1, 1, 0, 1, 0, 0으로 1이 3개라 1이다[^s1].

셋째 줄 여섯째 비트가 뒤집히면, 셋째 줄의 가로 패리티와 여섯째 칸의 세로 패리티가 함께 틀린다. 두 선이 만나는 비트를 다시 뒤집으면 원래대로 돌아온다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드의 패리티 비트와 패리티 바이트, 1비트 오류 56곳 모두 위치 찾기와 고치기, 2·3비트 오류 전수 검출, 직사각형 4비트 오류는 놓침, 카드 C2 — [48_two-dimensional-parity_impl.py](/Hongs_Blog/studies/computer-communication/code/48_two-dimensional-parity_impl/)</div>

</div>


## 정의

데이터를 $$m$$바이트(각 $$n$$비트)의 표로 놓는다.

- **가로 패리티(VRC):** 바이트마다 1의 개수가 짝수가 되게 비트 하나를 붙인다. 1의 개수가 홀수면 1, 짝수면 0이다[^2].
- **세로 패리티(LRC):** 같은 자리(칸)의 비트들마다 같은 방식으로 비트 하나를 붙여 패리티 바이트를 만든다[^1][^3].

덧붙는 비트는 $$m + n + 1$$개다.

**검출과 수정.** 2차원 패리티는 1·2·3비트 오류를 모두 검출하고, 1비트 오류는 위치를 알아 고칠 수 있다(오류 수정 코드)[^3][^4]. 이것은 재전송 없이 받는 쪽이 고치는 [순방향 오류 수정](/Hongs_Blog/studies/computer-communication/error-recovery-fec/)의 예다.

## 활용

- 복잡도: 표를 한 번 훑어 $$O(mn)$$이다.
- 옛 터미널 통신과 테이프 저장에서 VRC/LRC로 쓰였다. 지금의 링크는 같은 비용으로 훨씬 강한 CRC를 쓴다[^s1].
- 흔한 실수: "2차원이니 2비트 오류도 고친다"고 생각하는 것. 2비트 오류는 틀린 줄·칸이 둘씩 나와 어느 교차점인지 하나로 정할 수 없어 검출만 한다.

## 연결

- 선수: [오류 검출 코드](/Hongs_Blog/studies/computer-communication/error-detecting-code/)(1차원 패리티)
- 오류를 고치는 쓰임: [오류 복구와 FEC](/Hongs_Blog/studies/computer-communication/error-recovery-fec/)
- 다른 코드와 비교: [오류 검출 방식 비교](/Hongs_Blog/studies/computer-communication/error-detection-compared/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 2차원 패리티가 반드시 검출하는 오류와 고칠 수 있는 오류를 쓰라.</summary>


**답:** 1·2·3비트 오류는 모두 검출한다. 고칠 수 있는 것은 1비트 오류다(틀린 줄과 칸의 교차점).

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 받은 표를 점검했더니 가로 패리티는 셋째 줄(번호 2), 세로 패리티는 여섯째 칸(번호 5)만 틀렸다. 어떻게 고치나?</summary>


**답:** 셋째 줄 여섯째 칸의 비트 하나가 뒤집힌 것이다. 그 비트를 다시 뒤집는다. 그러면 모든 줄과 칸의 패리티가 맞는다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 2차원 패리티가 놓치는 4비트 오류를 들라.</summary>


**답:** 직사각형의 네 꼭짓점, 예를 들어 (줄 0, 칸 0), (줄 0, 칸 3), (줄 2, 칸 0), (줄 2, 칸 3)이 함께 뒤집히는 오류. 줄 0, 줄 2, 칸 0, 칸 3에서 각각 두 비트씩 바뀌어 모든 패리티가 그대로다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> "틀린 줄 번호와 틀린 칸 번호의 교차점 비트를 뒤집는다"는 수정 절차가 하는 일을 한 문장으로 쓰라.</summary>


**답:** 비트 하나가 뒤집히면 그 비트가 속한 줄과 칸의 패리티만 틀리므로, 두 정보를 겹쳐 오류 위치를 찾아 원래 값으로 되돌린다.

</details>

[^1]: 4-1학기/컴퓨터 통신/1.수업자료/04.2장-1.pptx, 슬라이드 49 "2차원 패리티" (4-1학기/pasted_images/Pasted image 20261008211643.png)
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/06.6주차.md, 73~80행
[^3]: 4-1학기/컴퓨터 통신/1.수업자료/04.2장-1.pptx, 슬라이드 60 "오류 수정 코드" (Vertical/Longitudinal Redundancy Check)
[^4]: 4-1학기/컴퓨터 통신/2.필기노트/06.6주차.md, 82행, 139~141행
[^s1]: 에이전트 보충. 패리티 계산의 설명, 1비트 오류 예, 2·3비트 검출과 직사각형 오류, 덧붙는 비트 수, 쓰임, 흔한 실수, 카드 C2·C3은 원본에 없다. 구현 코드로 모든 경우를 확인했다.
{% endraw %}
