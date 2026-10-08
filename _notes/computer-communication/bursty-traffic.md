---
layout: "note"
title: "버스티 트래픽"
display_title: "버스티 트래픽 (Bursty Traffic)"
kind: "concept"
kind_label: "정의"
num: "07"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-06"
status: "verified"
aliases: ["Bursty Traffic", "버스트", "burst", "BURSTY", "최대 대 평균 비", "peak-to-average ratio"]
description: "웹 페이지를 열 때만 잠깐 데이터가 몰리고 글을 읽는 동안은 거의 오가지 않는 것처럼, 짧게 몰려 나왔다가 오래 쉬는 트래픽이다. 컴퓨터 통신 트래픽의 특징이다. 가장 많이 보낼 때가 평소보다 훨씬 크다. 그래서 가장 많이 보낼 때에 맞춰 용량을 미리 잡아 두면 대부분의 시간에 비…"
prev_url: "/studies/computer-communication/circuit-switching/"
prev_title: "회선 스위칭"
next_url: "/studies/computer-communication/packet-switching/"
next_title: "패킷 스위칭"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/bursty-traffic/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

웹 페이지를 열 때만 잠깐 데이터가 몰리고 글을 읽는 동안은 거의 오가지 않는 것처럼, 짧게 몰려 나왔다가 오래 쉬는 트래픽이다. 컴퓨터 통신 트래픽의 특징이다. 가장 많이 보낼 때가 평소보다 훨씬 크다. 그래서 가장 많이 보낼 때에 맞춰 용량을 미리 잡아 두면 대부분의 시간에 비어서 낭비된다.

</div>


## 예시로 보기

웹 서핑에서 링크를 클릭하면 1초 동안 데이터가 몰려 온다. 그다음 19초 동안 글을 읽으며 거의 아무것도 받지 않는다. 반면 옛 전화 통화는 말하는 동안 일정한 전송률로 계속 흐른다[^s1].

```
전송률
 │ █                   █                   █        ← 버스티: 가끔 높게, 대부분 0
 └──────────────────────────────────────────────→ 시간
 │ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄   ← 일정한 트래픽 (옛 전화)
 └──────────────────────────────────────────────→ 시간
```

막대 높이(보낼 때의 전송률)를 $$a$$, 막대가 있는 시간의 비율을 $$p$$라고 쓴다. 이 예에서는 20초 중 1초만 보내므로 $$p = 1/20$$이다. 어떤 앱이 보내는지는 따지지 않고, 시간에 따라 얼마나 보내는지만 본다. 이 예에서 가장 많이 보낼 때는 평균의 20배다.

## 정확히 말하면

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

어떤 기간 동안 트래픽을 지켜본다. 가장 많이 보낼 때의 전송률이 **최대 전송률**, 그 기간에 보낸 양을 기간 길이로 나눈 값이 **평균 전송률**이다. 최대 전송률 ÷ 평균 전송률을 **최대 대 평균 비**라 하고, 이 값이 클수록 버스티하다.

**기호로 쓰면.** 기간 $$[0, T]$$ 동안 시각 $$t$$의 전송률을 $$r(t) \ge 0$$이라 하자. 최대 전송률은 $$r_{\max} = \max_t r(t)$$, 평균 전송률은 $$\bar r = \frac{1}{T}\int_0^T r(t)\,dt$$(적분은 보낸 총량, $$T$$로 나누면 평균)다. 최대 대 평균 비는 $$r_{\max} / \bar r$$다.

**활동/휴식 모델:** 활동 중에는 전송률 $$a$$, 쉬는 중에는 0이고, 시간의 비율 $$p$$($$0 < p \le 1$$)만큼 활동한다. 그러면 평균 전송률은 $$\bar r = p\,a$$이고 최대 대 평균 비는 $$1/p$$다. 이 트래픽에 $$a$$만큼을 고정 할당하면 할당량 중 실제로 쓰는 비율(사용률)은 $$p$$다[^s1].

</div>


왜 그런지 따져 보면, 시간의 $$p$$만큼은 $$a$$로 보내고 나머지는 0이므로 평균은 $$p\,a$$다. 최대는 $$a$$이므로 비는 $$a / (p\,a) = 1/p$$다. 고정 할당량 $$a$$ 중 평균적으로 쓰는 양이 $$p\,a$$이므로 사용률은 $$p$$다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 활동 1~5초, 휴식 0~19초의 모든 조합에서 1초 단위 시간표로 직접 계산한 평균, 비, 사용률이 $$p\,a$$, $$1/p$$, $$p$$와 같음 (실험으로 확인) — [07_bursty-traffic_verify.py](/Hongs_Blog/studies/computer-communication/code/07_bursty-traffic_verify/)</div>

</div>


## 예제

- 버스티한 것: 웹 브라우징, 메신저, 이메일 전송[^s1]
- 아닌 것: 옛 디지털 전화 음성(64 kbps로 일정), 일정한 전송률로 계속 보내는 감시 카메라 스트림[^s1]
- 끝 경우: $$p = 1$$이면 늘 보내므로 비는 1이고 버스티하지 않다.

## 활용

- 컴퓨터 통신 트래픽이 버스티하다는 것이 1주차 논리의 출발점이다[^1]. 이 성질 때문에 [회선 스위칭](/Hongs_Blog/studies/computer-communication/circuit-switching/)에서 [패킷 스위칭](/Hongs_Blog/studies/computer-communication/packet-switching/)으로, [시분할 다중화](/Hongs_Blog/studies/computer-communication/time-division-multiplexing/)에서 [통계적 다중화](/Hongs_Blog/studies/computer-communication/statistical-multiplexing/)로 넘어간다[^2].
- $$p$$가 작을수록 고정 할당의 사용률이 낮아지고, 통계적 다중화의 이득이 커진다.

## 연결

- 선수: [전송 속도와 대역폭](/Hongs_Blog/studies/computer-communication/rate-and-bandwidth/)
- 이 개념이 설명하는 것: 회선 스위칭과 시분할 다중화의 낭비, 패킷 스위칭과 통계적 다중화의 필요성

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 버스티 트래픽을 정의하고, 옛 전화 통화 트래픽과 어떻게 다른지 쓰라.</summary>


**답:** 짧게 몰려 나오고 오래 쉬는 트래픽으로, 최대 전송률이 평균보다 훨씬 크다. 옛 전화 통화는 통화 내내 일정한 전송률로 흐른다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 어떤 앱은 활동할 때 2 Mbps로 보내고, 시간의 5%만 활동한다. 평균 전송률, 최대 대 평균 비, 2 Mbps를 고정 할당했을 때의 사용률은?</summary>


**답:** 평균 $$0.05 \times 2 = 0.1$$ Mbps $$= 100$$ kbps. 최대 대 평균 비 $$2 / 0.1 = 20$$. 사용률 5%.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 트래픽이 버스티할수록 고정 할당(회선 스위칭, 시분할 다중화)이 불리해지는 이유를 최대와 평균으로 설명하라.</summary>


**답:** 고정 할당은 사용자가 보낼 수 있는 최대 전송률만큼을 늘 잡아 둔다. 실제로 쓰는 양은 평균이다. 버스티할수록 평균 ÷ 최대가 작아져서, 잡아 둔 용량 대부분이 비어 낭비된다.

</details>

[^1]: 4-1학기/컴퓨터 통신/2.필기노트/01.1주차.md, 33~36행
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/01.1주차.md, 55행, 69행
[^s1]: 에이전트 보충. 원본은 "컴퓨터 통신 트래픽의 특징은 BURSTY하다"고만 쓰고 정의하지 않는다. 최대 대 평균 비, 활동/휴식 모델, 예와 수치(1초 활동·19초 휴식)는 설명용 가상 수치다.
{% endraw %}
