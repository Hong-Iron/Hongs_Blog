---
layout: "note"
title: "Go-Back-N과 Selective Repeat 비교"
display_title: "Go-Back-N과 Selective Repeat 비교"
kind: "concept"
kind_label: "비교"
num: "59"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-20"
status: "verified"
aliases: ["Go-Back-N vs Selective Repeat", "GBN과 SR 비교", "오류 처리 정책 비교"]
description: "둘 다 여러 프레임을 띄워 두고 각자 타이머로 지키는 슬라이딩 윈도우의 오류 처리 방법이다. 가르는 것은 받는 쪽의 답장이 무엇을 말하느냐다. \"여기까지 빠짐없이 받았다\"만 말하면 보내는 쪽은 그 뒤를 모두 다시 보내야 하고(Go-Back-N), \"이 번호를 받았다\"를 하나하나 말…"
prev_url: "/studies/computer-communication/selective-repeat/"
prev_title: "Selective Repeat"
next_url: "/studies/computer-communication/sliding-window-algorithm/"
next_title: "슬라이딩 윈도우 세부 알고리즘"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "59_gbn-sr-compared_plot.py", "u": "/studies/computer-communication/code/59_gbn-sr-compared_plot/", "r": "그림 생성"}]
permalink: "/studies/computer-communication/gbn-sr-compared/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

둘 다 여러 프레임을 띄워 두고 각자 타이머로 지키는 슬라이딩 윈도우의 오류 처리 방법이다. 가르는 것은 받는 쪽의 답장이 무엇을 말하느냐다. "여기까지 빠짐없이 받았다"만 말하면 보내는 쪽은 그 뒤를 모두 다시 보내야 하고(Go-Back-N), "이 번호를 받았다"를 하나하나 말하면 오류 난 것만 다시 보낼 수 있다(Selective Repeat). 단순함을 얻느냐, 선을 아끼느냐의 선택이다.

</div>


## 어느 쪽일까

<details markdown="1"><summary markdown="span">1. 받는 쪽 장치의 메모리가 아주 작아 프레임을 따로 쌓아 둘 수 없다. 오류는 드물고 선은 짧다.</summary>


**Go-Back-N.** 받는 쪽이 순서가 어긋난 프레임을 버리고 누적 ACK만 보내도 된다. 받는 쪽 버퍼가 필요 없다. Selective Repeat은 어긋난 프레임을 반드시 저장해야 해서 이 장치에서는 쓸 수 없다.

</details>

<details markdown="1"><summary markdown="span">2. 정지궤도 위성 링크로, 왕복이 약 0.5초라 창에 프레임이 수십 개 떠 있다. 가끔 오류가 난다.</summary>


**Selective Repeat.** 프레임 하나가 망가질 때마다 Go-Back-N은 그 뒤에 떠 있던 수십 개를 다시 보낸다. Selective Repeat은 망가진 하나만 다시 보내므로 선의 낭비가 훨씬 작다.

</details>

<details markdown="1"><summary markdown="span">3. 받는 쪽이 순서가 어긋난 프레임을 저장해 두고, 누적 ACK만 보낸다. 이것은 어느 쪽인가?</summary>


**Go-Back-N.** 받는 쪽이 저장한다고 Selective Repeat이 되지 않는다. 누적 ACK로는 어긋난 프레임을 받았다는 사실이 전해지지 않아, 보내는 쪽은 오류 난 프레임 뒤의 것도 다시 보낸다. 저장은 Go-Back-N에서 성능을 높이는 선택 사항일 뿐이다.

</details>

<details markdown="1"><summary markdown="span">4. 받는 쪽이 프레임마다 "n번을 받았다"는 ACK를 보내고, 보내는 쪽은 그 ACK가 온 프레임의 타이머만 푼다.</summary>


**Selective Repeat.** 개별 ACK와 프레임별 확인이 Selective Repeat의 조건이다. 받는 쪽이 어긋난 프레임을 저장하지 않으면 그 ACK가 거짓이 되니, 저장도 함께 해야 한다.

</details>

## 결정적 차이

창 크기 4로 F0~F5를 보내는데 F2가 처음 보낼 때 사라지는 같은 상황을 두 방식으로 보냈다(싣는 시간 1 ms, 전파 시간 3 ms, 타임아웃 9 ms)[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/59_gbn-sr-compared_fig1.svg" alt="그림" width="659" height="575" loading="lazy">

왼쪽이 Go-Back-N(받는 쪽이 저장, ACK는 안 보냄, 각자 타이머), 오른쪽이 Selective Repeat이다. 11 ms 뒤로 다시 보낸 띠의 수를 세어 보면 왼쪽은 네 개(F2, F3, F4, F5), 오른쪽은 하나(F2)다. 왼쪽에서 F3~F5를 다시 보내는 동안 받는 쪽은 이미 그것을 저장해 두고 있었다.

두 방식 모두 18 ms에 끝났다. 끝나는 시각을 정한 것은 F2의 타이머(11 ms)와 다시 보낸 F2가 닿는 시각이다. Go-Back-N에서도 받는 쪽이 저장해 두었기 때문에, 다시 온 F2 하나로 F2~F5가 한꺼번에 올라갔다. 차이는 선을 쓴 양이다. 프레임을 10번 실은 것과 7번 실은 것이다[^s1].

| | Go-Back-N | Selective Repeat |
|---|---|---|
| ACK $$n$$의 뜻 | 누적: "$$n-1$$까지 빠짐없이 받았고 다음은 $$n$$" | 개별: "$$n$$번을 받았다" |
| 보내는 쪽이 아는 것 | 빠짐없이 받은 데까지만 | 받은 번호 하나하나 |
| 다시 보내는 것 | 오류 난 프레임부터 그 뒤에 보낸 것까지 | 오류 난(확인 안 된) 프레임만 |
| 받는 쪽 버퍼 | 선택(저장하면 빨리 끝남) | 필수(어긋난 프레임을 반드시 저장) |
| 보내는 쪽 버퍼 | 필수(재전송용) | 필수(재전송용) |
| 위 예에서 실은 프레임 | 10번(다시 4번) | 7번(다시 1번) |
| ACK 하나가 사라지면 | 다음 누적 ACK가 메움 | 그 프레임이 타임아웃으로 다시 감 |
| 구현 | 단순(받는 쪽은 NFE 하나로 판단) | 복잡(번호마다 받았는지 기억, 순서 맞춰 올림) |

보내는 쪽 버퍼는 두 방식 모두 필수다. 받는 쪽 버퍼는 Selective Repeat에서만 필수이고, Go-Back-N에서는 성능을 높이는 선택이다. 예전에는 Go-Back-N을 많이 썼지만, 대역폭이 높은 오늘날은 Selective Repeat을 더 쓴다. 선 위에 떠 있는 프레임이 많을수록 Go-Back-N이 다시 보내는 양이 커지기 때문이다.

ACK가 사라진 경우는 반대로 Go-Back-N이 유리하다. 누적 ACK 3이 사라져도 뒤이어 ACK 4가 오면 "3까지 받았다"가 함께 전해진다. 개별 ACK 3이 사라지면 그 소식을 대신 전할 ACK가 없어서, F3의 타이머가 끝나 F3이 다시 간다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 그림의 두 시간표, 실은 프레임 10번과 7번, 두 방식 모두 18 ms, 두 방식의 ACK 순서 — [59_gbn-sr-compared_plot.py](/Hongs_Blog/studies/computer-communication/code/59_gbn-sr-compared_plot/). 개별 ACK가 사라지면 그 프레임을 다시 보내고 누적 ACK가 사라지면 다음 ACK가 메움, 카드 C1(Go-Back-N은 F1~F4, Selective Repeat은 F1만) — [58_selective-repeat_impl.py](/Hongs_Blog/studies/computer-communication/code/58_selective-repeat_impl/)</div>

</div>


## 둘 다 아닐 때

- **선이 짧고 오류가 드물다.** 창을 1로 둔 [정지 대기](/Hongs_Blog/studies/computer-communication/arq-sequence-number/)로 충분하다. [정지 대기 사용률](/Hongs_Blog/studies/computer-communication/stop-and-wait-utilization/)이 이미 높으면(예: 1 Gbps, 100 m에서 92%) 창을 키워 얻는 것이 적다. 정지 대기는 Go-Back-N의 창 크기 1인 경우이기도 하다.
- **다시 보낼 시간이 없다.** 전화처럼 실시간이면 늦게 다시 받은 데이터는 쓸모가 없다. 받는 쪽이 스스로 고치는 [FEC](/Hongs_Blog/studies/computer-communication/error-recovery-fec/)를 쓴다.
- **오류 복구, 여러 프레임 전송, 순서 유지를 한 번에 다 하기 버겁다.** 선 하나를 여러 논리 채널로 나눠 각 채널은 정지 대기로 운영하는 방법도 있다(동시 논리 채널). 이것은 다음에 다룬다.

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 창 크기 5로 F0~F4를 보냈는데 F1만 망가졌다. 받는 쪽이 F2~F4를 저장했다. Go-Back-N과 Selective Repeat에서 다시 보내는 프레임은 각각? 그 차이를 만드는 것은?</summary>


**답:** Go-Back-N은 F1~F4, Selective Repeat은 F1만.<br>
**이유:** 저장은 둘 다 했다. 차이는 ACK다. 누적 ACK는 "F1 앞까지"만 말해서 F2~F4가 도착한 사실이 보내는 쪽에 가지 않는다. 개별 ACK는 F2, F3, F4를 각각 받았다고 알린다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> Selective Repeat에서는 받는 쪽 버퍼가 필수인데 Go-Back-N에서는 선택인 이유는?</summary>


**답:** Selective Repeat의 보내는 쪽은 개별 ACK를 받은 프레임을 다시 보내지 않는다. 받는 쪽이 그 프레임을 버렸다면 영영 오지 않는다. Go-Back-N의 보내는 쪽은 오류 난 프레임 뒤를 어차피 다시 보내므로, 받는 쪽이 버려도 다시 받을 수 있다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> ACK가 자주 사라지고 프레임은 거의 안 망가지는 링크라면 어느 방식의 약점이 더 드러나는가?</summary>


**답:** Selective Repeat. 개별 ACK가 사라지면 그 프레임이 타임아웃으로 다시 간다. Go-Back-N은 뒤이은 누적 ACK 하나가 앞서 사라진 ACK들의 소식까지 전해서 다시 보낼 일이 적다.

</details>

[^s1]: [59_gbn-sr-compared_plot.py](/Hongs_Blog/studies/computer-communication/code/59_gbn-sr-compared_plot/)의 사건 시뮬레이터로 계산하고 그렸다.
{% endraw %}
