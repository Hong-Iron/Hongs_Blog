---
layout: "note"
title: "Selective Repeat"
display_title: "Selective Repeat"
kind: "concept"
kind_label: "알고리즘"
num: "58"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-20"
status: "verified"
aliases: ["Selective Repeat", "Selective-Repeat", "SR", "선택적 재전송", "개별 ACK", "Individual ACK", "선택적 ACK", "Selective ACK"]
description: "연달아 보낸 프레임 중 오류가 난 프레임만 골라 다시 보낸다. 그러려면 받는 쪽은 순서가 어긋나게 먼저 온 프레임을 반드시 저장해 두고, 프레임마다 \"이 번호는 받았다\"는 답장을 따로 보내야 한다. 다시 보내는 양이 가장 적은 대신, 받는 쪽의 저장 공간과 답장 관리가 복잡하다."
prev_url: "/studies/computer-communication/go-back-n/"
prev_title: "Go-Back-N"
next_url: "/studies/computer-communication/gbn-sr-compared/"
next_title: "Go-Back-N과 Selective Repeat 비교"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "58_selective-repeat_impl.py", "u": "/studies/computer-communication/code/58_selective-repeat_impl/", "r": "구현"}, {"t": "58_selective-repeat_plot.py", "u": "/studies/computer-communication/code/58_selective-repeat_plot/", "r": "그림 생성"}]
permalink: "/studies/computer-communication/selective-repeat/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

연달아 보낸 프레임 중 오류가 난 프레임만 골라 다시 보낸다. 그러려면 받는 쪽은 순서가 어긋나게 먼저 온 프레임을 반드시 저장해 두고, 프레임마다 "이 번호는 받았다"는 답장을 따로 보내야 한다. 다시 보내는 양이 가장 적은 대신, 받는 쪽의 저장 공간과 답장 관리가 복잡하다.

</div>


## 예시로 보기

[Go-Back-N](/Hongs_Blog/studies/computer-communication/go-back-n/)에서는 F2 하나가 사라졌을 뿐인데 이미 도착한 F3~F5까지 다시 보냈다. 받는 쪽이 F3~F5를 저장해 두어도 마찬가지였다. 누적 ACK로는 "F3~F5를 받았다"는 소식을 보낼 수 없기 때문이다. 오류가 난 프레임만 다시 보내려면 받는 쪽이 정확히 무엇을 받았는지 보내는 쪽에 알려야 한다.

같은 상황을 Selective Repeat으로 보낸다. 창 크기 4로 F0~F5를 보내는데 F2가 처음 보낼 때 사라진다. 싣는 시간 1 ms, 전파 시간 3 ms, 타임아웃 9 ms다. 여기서 ACK $$n$$은 "$$n$$번을 받았다"는 **개별 ACK**다[^s1].

| 시각(ms) | 보내는 쪽 | 받는 쪽 |
|---|---|---|
| 0~3 | F0, F1, F2, F3을 보냄(창이 다 참). F2는 사라짐 | |
| 4 | | F0 받음 → 올림, ACK 0 |
| 5 | | F1 받음 → 올림, ACK 1 |
| 7 | ACK 0 → 창이 열려 F4 보냄 | F3 받음 → F2가 비어 있어 저장, ACK 3 |
| 8 | ACK 1 → F5 보냄 | |
| 10 | ACK 3 → F3이 갔다고 적어 둠(창은 F2에서 막혀 그대로) | |
| 11 | F2의 타이머 끝 → F2만 다시 보냄 | F4 받음 → 저장, ACK 4 |
| 12 | | F5 받음 → 저장, ACK 5 |
| 14, 15 | ACK 4, ACK 5 → 적어 둠 | |
| 15 | | F2 받음 → F2, F3, F4, F5를 한꺼번에 올림, ACK 2 |
| 18 | ACK 2 → 모두 확인 | |

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/58_selective-repeat_fig1.svg" alt="그림" width="600" height="625" loading="lazy">

그림은 위 표를 시간표로 그린 것이다. Go-Back-N 그림과 달리 11 ms 뒤로 다시 보내는 띠가 F2 하나뿐이다. 받는 쪽은 F3, F4, F5를 받을 때마다 저장하고 ACK 3, 4, 5를 보낸다. 보내는 쪽은 이 ACK들로 F3~F5가 갔다는 것을 알아서 그 타이머를 푼다. 그래서 F3~F5는 다시 보내지 않는다. 받는 쪽은 15 ms에 F2가 오자 비어 있던 자리가 메워져 F2~F5를 한꺼번에 위층으로 올린다[^s2].

보내는 쪽이 ACK 3을 받은 10 ms에 창이 열리지 않는 것을 보자. 창은 아직 확인 안 된 가장 앞 번호(F2)부터 센다. F2가 확인될 때까지 창의 앞머리는 F2에 묶여 있다. 창은 18 ms에 ACK 2가 와서야 앞으로 간다[^s1].

## 정의

**입력:** 보낼 프레임들, 창 크기 $$N$$. **출력:** 받는 쪽 위층에 순서대로 한 번씩 올라간 프레임들.

Selective Repeat에는 두 조건이 반드시 필요하다.

1. 받는 쪽은 순서가 어긋난 프레임을 받는다. 그래서 그것을 저장할 버퍼가 꼭 있어야 한다.
2. 받는 쪽의 정확한 수신 상황을 보내는 쪽에 알려야 한다. 프레임마다 "~은 잘 받았다"는 개별 ACK(선택적 ACK)가 꼭 있어야 한다.

- **보내는 쪽.** 프레임마다 사본과 타이머를 둔다. ACK $$n$$이 오면 $$n$$번의 타이머와 사본만 푼다. 타이머가 끝난 프레임만 다시 보낸다. 창은 아직 확인 안 된 가장 앞 번호부터 $$N$$칸이다.
- **받는 쪽.** 창 안의 프레임이 오면 저장하고 그 번호의 ACK를 보낸다. 기다리던 번호부터 빈틈없이 이어진 만큼 위층으로 올린다. 이미 올린 번호가 다시 오면 버리고 그 번호의 ACK를 다시 보낸다. 보내는 쪽이 앞선 ACK를 못 받아 다시 보냈을 수 있기 때문이다[^s3].

수신 쪽이 순서가 어긋난 프레임을 저장한다고 Selective Repeat인 것은 아니다. [Go-Back-N](/Hongs_Blog/studies/computer-communication/go-back-n/)에서도 받는 쪽이 저장할 수 있다. 다른 점은 보내는 쪽이 무엇을 아느냐다. 개별 ACK가 와야 보내는 쪽이 오류 난 프레임만 골라 다시 보낼 수 있다.

### 같은 상황에서 ACK가 실어 나르는 것

위 예를 받는 쪽이 저장하는 Go-Back-N과 나란히 놓으면 차이가 ACK에 있다[^s4].

| | 받는 쪽이 보낸 ACK | 보내는 쪽이 다시 보낸 프레임 |
|---|---|---|
| Go-Back-N(받는 쪽이 저장) | ACK 1, ACK 2, 그 뒤 F2가 와서야 ACK 6 | F2, F3, F4, F5 |
| Selective Repeat | ACK 0, 1, 3, 4, 5, 2 | F2 |

Go-Back-N의 받는 쪽도 F3~F5를 저장했지만, 누적 ACK는 "F2 앞까지"만 말할 수 있어 F3~F5를 받은 사실이 전해지지 않았다. Selective Repeat의 ACK 3, 4, 5가 바로 그 사실을 전한다. 그래서 (ACK $$n$$)의 뜻이 오류 복구 약속의 핵심이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 예의 사건 시각과 다시 보낸 프레임(F2 하나), 받는 쪽이 저장한 프레임 수 최대 3, 저장하는 Go-Back-N과의 ACK 비교, 개별 ACK가 사라져도 복구됨 — [58_selective-repeat_impl.py](/Hongs_Blog/studies/computer-communication/code/58_selective-repeat_impl/). 무작위 손실 3,000가지에서 순서대로 한 번씩 올림(실험으로 확인) — 같은 코드.</div>

</div>


## 활용

- 다시 보내는 양이 가장 적어서 창이 크고 왕복이 긴 링크에 알맞다. 예전에는 Go-Back-N을 많이 썼지만, 대역폭이 높은 오늘날은 Selective Repeat을 더 쓴다. 인터넷 TCP도 누적 ACK에 더해, 어느 조각을 받았는지 알리는 선택적 ACK(SACK) 옵션을 쓴다.
- 대가: 받는 쪽은 창 크기만큼 저장 공간이 꼭 필요하고, 받은 번호를 하나하나 기억하고 순서를 맞춰 올려야 한다. 보내는 쪽도 프레임마다 확인 여부를 따로 적어 둔다.
- 순서 번호를 0~7처럼 돌려 쓰면, Selective Repeat은 받는 쪽 창이 넓어서 옛 프레임과 새 프레임을 헷갈리기 쉽다. 그래서 창 크기에 번호 개수와 관련된 제한이 붙는다. 이 제한은 순서 번호 공간에서 따로 다룬다.
- 흔한 실수: 개별 ACK 3을 "3까지 다 받았다"로 읽는 것. 받는 쪽이 저장만 하면 Selective Repeat이라고 보는 것.

## 연결

- 선수: [슬라이딩 윈도우](/Hongs_Blog/studies/computer-communication/sliding-window/), [Go-Back-N](/Hongs_Blog/studies/computer-communication/go-back-n/)
- 대조: [Go-Back-N과 Selective Repeat 비교](/Hongs_Blog/studies/computer-communication/gbn-sr-compared/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 창 크기 4, F0~F3을 보냈는데 F1만 사라졌다(나머지와 ACK는 무사). Selective Repeat에서 받는 쪽이 보내는 ACK들과, 보내는 쪽이 다시 보내는 프레임은?</summary>


**답:** 받는 쪽은 ACK 0, ACK 2, ACK 3을 보내고(F2, F3은 저장), 보내는 쪽은 F1만 다시 보낸다. 다시 온 F1을 받으면 F1~F3을 한꺼번에 올리고 ACK 1을 보낸다.<br>
**흔한 오답:** F1, F2, F3을 다시 보낸다. 그것은 Go-Back-N이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> Selective Repeat이 하는 일을 한 문장으로 쓰라.</summary>


**답:** 받는 쪽이 프레임마다 받았다고 알리고 어긋난 프레임을 저장해 두면, 보내는 쪽은 확인이 오지 않은 프레임만 골라 다시 보낸다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 받는 쪽이 순서가 어긋난 프레임을 저장하는데도 Selective Repeat이 아닌 경우가 있다. 왜 그런가?</summary>


**답:** 받는 쪽이 누적 ACK만 보내면, 보내는 쪽은 어긋난 프레임이 도착했는지 알 수 없다. 그래서 오류 난 프레임 뒤의 것도 타이머가 끝나면 다시 보낸다(Go-Back-N). 오류 난 것만 다시 보내려면 개별 ACK로 수신 상황이 전해져야 한다.

</details>

[^s1]: 싣는 시간 1 ms, 전파 시간 3 ms, 타임아웃 9 ms를 정해 [58_selective-repeat_plot.py](/Hongs_Blog/studies/computer-communication/code/58_selective-repeat_plot/)의 사건 시뮬레이터로 계산했다. 창의 앞머리가 F2에 묶여 있다는 설명은 덧붙였다.
[^s2]: 같은 코드가 시뮬레이터의 사건 순서대로 그렸다.
[^s3]: ACK 3이 사라지는 경우에 F3을 다시 보내고 받는 쪽이 ACK 3을 다시 보내 복구되는 것을 [58_selective-repeat_impl.py](/Hongs_Blog/studies/computer-communication/code/58_selective-repeat_impl/)로 확인했다.
[^s4]: [58_selective-repeat_impl.py](/Hongs_Blog/studies/computer-communication/code/58_selective-repeat_impl/)로 계산했다.
{% endraw %}
