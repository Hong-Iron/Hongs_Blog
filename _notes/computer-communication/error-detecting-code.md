---
layout: "note"
title: "오류 검출 코드"
display_title: "오류 검출 코드 (Error Detecting Code)"
kind: "concept"
kind_label: "정의"
num: "47"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Error Detecting Code", "EDC", "오류 검출", "Error Detection", "패리티", "Parity", "검출율", "Detection Rate", "미검출 오류", "Undetected Error"]
description: "전송 중에 비트가 뒤집혔는지 받는 쪽이 알려면, 보내는 쪽이 데이터로 계산한 짧은 값을 함께 보내야 한다. 받는 쪽은 받은 데이터로 같은 계산을 다시 해 보고, 따라온 값과 다르면 오류라고 본다. 이 덧붙인 값이 오류 검출 코드다. 짧고 빨리 계산되면서 오류를 많이 잡아야 한다. …"
prev_url: "/studies/computer-communication/framing-compared/"
prev_title: "프레이밍 방식 비교"
next_url: "/studies/computer-communication/two-dimensional-parity/"
next_title: "2차원 패리티"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/error-detecting-code/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

전송 중에 비트가 뒤집혔는지 받는 쪽이 알려면, 보내는 쪽이 데이터로 계산한 짧은 값을 함께 보내야 한다. 받는 쪽은 받은 데이터로 같은 계산을 다시 해 보고, 따라온 값과 다르면 오류라고 본다. 이 덧붙인 값이 오류 검출 코드다. 짧고 빨리 계산되면서 오류를 많이 잡아야 한다. 하지만 어떤 코드도 모든 오류를 잡지는 못한다. 데이터와 코드가 함께 바뀌어 다시 맞아떨어지면 놓친다.

</div>


## 예시로 보기

데이터만 보내면 받는 쪽은 그 데이터가 맞는지 판단할 근거가 없다[^1]. 그래서 덧붙일 정보가 필요하다.

가장 단순한 코드는 패리티 비트 하나다. 1의 개수가 짝수가 되도록 비트 하나를 붙인다(짝수 패리티). `1011001`은 1이 4개라 0을 붙여 `10110010`을 보낸다[^2][^s1].

| 뒤집힌 비트 수 | 1의 개수 | 받는 쪽 판단 |
|---|---|---|
| 1 | 홀수 | 오류 검출 |
| 2 | 짝수 | 놓침 |
| 3 | 홀수 | 오류 검출 |

홀수 개 오류는 늘 잡고, 짝수 개 오류는 늘 놓친다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 패리티의 1~4비트 오류 전수, 10진 CRC 비유(3311, 2211), 카드 C2 — [47_error-detection_verify.py](/Hongs_Blog/studies/computer-communication/code/47_error-detection_verify/)</div>

</div>


## 정의

**오류 검출 코드(EDC)**는 데이터 안에 오류가 있는지 없는지를 알아내려고 덧붙이는 데이터다[^3].

- **만들기(보내는 쪽):** $$\mathrm{EDC} \leftarrow f(\mathrm{data})$$
- **점검(받는 쪽):** 받은 $$\mathrm{data}'$$, $$\mathrm{EDC}'$$로 $$\mathrm{EDC}' = f(\mathrm{data}')$$인지 본다.

좋은 코드의 조건은 셋이다[^3].

- **공간:** $$\mathrm{EDC} \ll \mathrm{data}$$. 오류가 없으면 덧붙인 만큼 그대로 손해다.
- **시간:** $$f$$의 계산이 빨라야 한다.
- **효율:** 오류 검출율이 높아야 한다.

EDC는 오류를 완벽하게 잡을 수 없다. 오류를 놓치면(미검출 오류) 시스템이 틀린 데이터를 맞다고 믿어 무결성을 잃는다. 그래서 검출율이 매우 높은 코드를 쓰고, 여러 계층에서 중복해서 검사한다[^4].

## 활용

- 2계층은 CRC, 3·4계층(IP, TCP)은 [인터넷 체크섬](/Hongs_Blog/studies/computer-communication/internet-checksum/)으로 다시 검사한다. 한 계층에서 놓친 오류를 다른 계층에서 잡는 "중복 검사"의 예다[^5][^s1].
- 흔한 실수: "패리티가 맞으면 오류가 없다"고 읽는 것. 정확히는 "홀수 개 비트 오류는 없다"는 뜻이다.

## 연결

- 선수: [바이트 중심 프레이밍](/Hongs_Blog/studies/computer-communication/byte-framing/)(프레임의 CRC 칸), [나눗셈과 합동](/Hongs_Blog/studies/discrete-math/modular-arithmetic/)(나머지로 확인하기)
- 구체적인 코드: [2차원 패리티](/Hongs_Blog/studies/computer-communication/two-dimensional-parity/), [인터넷 체크섬](/Hongs_Blog/studies/computer-communication/internet-checksum/), [CRC](/Hongs_Blog/studies/computer-communication/crc/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 오류 검출 코드를 만드는 쪽과 점검하는 쪽이 각각 하는 일, 좋은 코드의 세 조건을 쓰라.</summary>


**답:** 보내는 쪽은 $$\mathrm{EDC} = f(\mathrm{data})$$를 계산해 붙인다. 받는 쪽은 받은 데이터로 $$f$$를 다시 계산해 받은 EDC와 같은지 본다. 조건은 짧을 것(공간), 빨리 계산될 것(시간), 검출율이 높을 것(효율).

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 10진수로 "젯수 7로 나누어떨어지게 끝자리 하나를 붙이는" 코드를 쓴다. 데이터 52 뒤에 붙일 자리는?</summary>


**답:** 520~529 중 7의 배수는 525다. 5를 붙여 525를 보낸다. (슬라이드 p.52의 "331에 1을 붙여 3311"과 같은 생각이다.)

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 짝수 패리티로 보낸 `10110010`에서 오류가 났는데도 받는 쪽이 알아채지 못하는 예를 들라.</summary>


**답:** 첫 두 비트가 뒤집힌 `01110010`. 1의 개수가 여전히 4개(짝수)라 패리티가 맞는다. 짝수 개 비트 오류는 패리티 하나로 잡을 수 없다.

</details>

[^1]: 4-1학기/컴퓨터 통신/2.필기노트/06.6주차.md, 65~69행
[^2]: 같은 필기, 73~77행
[^3]: 4-1학기/컴퓨터 통신/1.수업자료/04.2장-1.pptx, 슬라이드 47 "오류 검출 코드" (4-1학기/pasted_images/Pasted image 20261008205422.png)
[^4]: 같은 자료, 슬라이드 48 "오류 검출율" (4-1학기/pasted_images/Pasted image 20261008211339.png)
[^5]: 4-1학기/컴퓨터 통신/2.필기노트/06.6주차.md, 89행
[^s1]: 에이전트 보충. 패리티 예와 표, 계층별 중복 검사의 예, 흔한 실수, 카드 C2·C3은 원본에 없다. 검증 코드로 확인했다.
{% endraw %}
