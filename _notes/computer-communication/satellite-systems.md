---
layout: "note"
title: "위성통신"
display_title: "위성통신 (Satellite System)"
kind: "concept"
kind_label: "모델"
num: "36"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-09-29"
status: "verified"
aliases: ["Satellite System", "위성", "satellite", "정지궤도", "GEO", "중궤도", "MEO", "저궤도", "LEO", "VSAT", "GPS", "이리듐", "Iridium", "스타링크", "Starlink"]
description: "위성통신은 하늘에 띄운 중계기로 먼 곳을 잇는다. 높이 띄울수록 위성 하나가 넓은 지역을 덮지만, 신호가 오가는 거리가 길어 늦고, 지상에서 올려 보내는 신호도 세야 한다. 그래서 방송처럼 한 방향이면 높은 정지궤도를 쓰고, 휴대 기기와 주고받으려면 낮은 저궤도 위성을 여러 대 띄운다."
prev_url: "/studies/computer-communication/cellular-networks/"
prev_title: "이동통신"
next_url: "/studies/computer-communication/digital-transmission/"
next_title: "디지털 전송"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/satellite-systems/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

위성통신은 하늘에 띄운 중계기로 먼 곳을 잇는다. 높이 띄울수록 위성 하나가 넓은 지역을 덮지만, 신호가 오가는 거리가 길어 늦고, 지상에서 올려 보내는 신호도 세야 한다. 그래서 방송처럼 한 방향이면 높은 정지궤도를 쓰고, 휴대 기기와 주고받으려면 낮은 저궤도 위성을 여러 대 띄운다.

</div>


## 예시로 보기

신호가 빛의 속도($$3.0 \times 10^8$$ m/s)로 위성까지 곧장 오간다고 하면, 고도만으로 전파 지연의 하한을 구할 수 있다[^s1].

| 궤도 | 고도 (슬라이드) | 지상 → 위성 → 지상 | 질문과 답의 왕복 |
|---|---|---|---|
| 정지궤도 (GEO) | 약 36,000 km (그림: 35,786 km) | 약 239 ms | 약 477 ms |
| 중궤도 (MEO) | 10,000~20,000 km | 20,000 km이면 약 133 ms | |
| 저궤도 (LEO, 스타링크) | 540~570 km | 550 km이면 약 3.7 ms | 약 7.3 ms |

정지궤도로 영상 통화를 하면 말하고 답을 듣기까지 0.5초 가까이 걸린다. 저궤도는 지상 광케이블과 비슷한 수준이다. 이 차이는 [소요시간](/Hongs_Blog/studies/computer-communication/latency/)의 전파 지연이고, 대역폭을 늘려도 줄지 않는다. 위성을 지상국 바로 위에 있다고 보았으므로 실제 거리는 이보다 길다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표의 전파 지연 — [36_satellite-systems_verify.py](/Hongs_Blog/studies/computer-communication/code/36_satellite-systems_verify/)</div>

</div>


## 정의

| 궤도 | 고도 | 쓰임[^1] |
|---|---|---|
| 정지궤도 | 약 36,000 km | 방송·전화. 데이터는 VSAT |
| 중궤도 | 10,000~20,000 km | 단방향. GPS (위성 31개) |
| 저궤도 | 스타링크 540~570 km | 전화: 이리듐(Iridium). 인터넷: 스타링크, 양방향, 4,000여 대 운용 |

저궤도일수록 한 위성이 덮는 범위가 좁아지지만 속도(지연)는 빨라진다[^2].

궤도가 높으면 위성이 보내는 신호는 위성의 출력을 키워 해결할 수 있다. 그러나 지상의 노드가 위성으로 보내는 신호도 세야 통신이 된다. 휴대 기기는 강한 신호를 내기에 알맞지 않다[^2]. 작은 접시 안테나로도 받기는 할 수 있지만, 높은 궤도로 보내려면 큰 접시 안테나가 필요하다. 그래서 휴대 기기의 양방향 통신에는 저궤도 위성을 쓴다[^2][^s2].

## 연결

- 선수: [무선 링크](/Hongs_Blog/studies/computer-communication/wireless-links/), [소요시간](/Hongs_Blog/studies/computer-communication/latency/)(전파 지연)
- 긴 전파 지연과 큰 대역폭이 만나면 파이프가 커진다: [대역폭-지연 곱](/Hongs_Blog/studies/computer-communication/bandwidth-delay-product/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 정지궤도 위성(고도 약 36,000 km)을 거쳐 서울에서 보낸 질문에 상대가 곧바로 같은 위성으로 답한다. 신호 속도 $$3.0 \times 10^8$$ m/s, 위성은 두 지상국 바로 위에 있다고 볼 때, 답이 돌아오기까지 걸리는 전파 지연의 하한은?</summary>


**답:** 한 번 오르거나 내리는 데 $$3.6 \times 10^7 / (3 \times 10^8) = 0.12$$초다. 질문(오르고 내림)과 답(오르고 내림)이 모두 네 번이므로 $$4 \times 0.12 = 0.48$$초, 약 480 ms다.<br>
**흔한 오답:** 120 ms나 240 ms. 위성까지 한 번, 또는 한 방향만 센 것이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 휴대 기기로 주고받는 위성 인터넷에 저궤도 위성을 여러 대 쓰는 이유를 두 가지 쓰라. 대신 치르는 비용은?</summary>


**답:** ① 가까워서 전파 지연이 작다. ② 가까워서 휴대 기기의 약한 신호로도 위성까지 보낼 수 있다(양방향). 대신 위성 하나가 덮는 범위가 좁아서 수천 대를 띄워야 한다(스타링크 4,000여 대).

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 정지궤도, 중궤도, 저궤도의 고도와 대표 쓰임을 슬라이드대로 쓰라.</summary>


**답:** 정지궤도: 약 36,000 km, 방송·전화, 데이터는 VSAT. 중궤도: 10,000~20,000 km, 단방향, GPS. 저궤도: 전화는 이리듐, 인터넷은 스타링크(540~570 km, 양방향, 4,000여 대).

</details>

[^1]: 수업 슬라이드 캡처 — 슬라이드 "위성통신(Satellite system)" (2장. 데이터 링크 네트워크: 점대점 링크::무선 링크)
[^2]: 컴퓨터 통신 4회 필기 「4주차」, 95~101행
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 전파 지연 표는 원본에 없다. 슬라이드의 고도와 신호 속도 $$3.0 \times 10^8$$ m/s(소요시간 문서)에서 나온 계산이다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 필기 04.4주차.md 100행은 "작은 접시 안테나는 수신에 용이하고, 큰 접시 안테나는 송신에 용이하다"고 적는다. 안테나는 클수록 받기와 보내기 모두에 유리하므로, 이 문장은 "받기에는 작은 안테나로 충분하고, 보내려면 큰 안테나가 필요하다"는 뜻으로 읽힌다 [확인필요].
{% endraw %}
