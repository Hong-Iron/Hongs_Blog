---
layout: "note"
title: "인터넷 체크섬"
display_title: "인터넷 체크섬 (Internet Checksum)"
kind: "concept"
kind_label: "알고리즘"
num: "49"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Internet Checksum", "체크섬", "Checksum", "1의 보수 합", "One's Complement Sum", "자리올림 되돌리기", "End-around Carry"]
description: "메시지를 16비트 숫자들로 잘라 모두 더하고, 그 합을 뒤집은(1의 보수) 값을 붙여 보낸다. 받는 쪽이 받은 숫자와 체크섬을 함께 더하면, 오류가 없을 때 모든 비트가 1인 값이 나온다. 덧셈만 하므로 소프트웨어로도 빠르다. 대신 더하는 순서가 바뀌거나, 한 숫자가 늘고 다른 숫…"
prev_url: "/studies/computer-communication/two-dimensional-parity/"
prev_title: "2차원 패리티"
next_url: "/studies/computer-communication/crc/"
next_title: "CRC"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/internet-checksum/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

메시지를 16비트 숫자들로 잘라 모두 더하고, 그 합을 뒤집은(1의 보수) 값을 붙여 보낸다. 받는 쪽이 받은 숫자와 체크섬을 함께 더하면, 오류가 없을 때 모든 비트가 1인 값이 나온다. 덧셈만 하므로 소프트웨어로도 빠르다. 대신 더하는 순서가 바뀌거나, 한 숫자가 늘고 다른 숫자가 같은 만큼 줄면 합이 같아 놓친다. 그래서 링크 계층 대신 IP·TCP 같은 위 계층에서 쓴다.

</div>


## 예시로 보기

두 워드 `0x8000`, `0x8001`을 보낸다[^s1].

| 단계 | 값 |
|---|---|
| 더하기 | `0x8000 + 0x8001 = 0x10001` (17비트로 넘침) |
| 넘친 1을 맨 아래로 되돌려 더하기 | `0x0001 + 1 = 0x0002` |
| 비트 뒤집기(1의 보수) | `~0x0002 = 0xFFFD` ← 체크섬 |
| 받는 쪽: 셋을 모두 더하기 | `0x8000 + 0x8001 + 0xFFFD` → `0xFFFF` (오류 없음) |

넘친 자리올림을 버리지 않고 맨 아래에 다시 더하는 것이 "1의 보수 덧셈"이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시와 카드 C2, 잘 알려진 IPv4 헤더 예(체크섬 0xB861), 받는 쪽 합 0xFFFF, 무작위 1비트 오류 2,000개 모두 검출, 순서 바뀜과 ±1 상쇄는 놓침 — [49_internet-checksum_impl.py](/Hongs_Blog/studies/computer-communication/code/49_internet-checksum_impl/)</div>

</div>


## 정의

메시지를 16비트 정수의 연속으로 보고, 16비트 1의 보수 덧셈으로 모두 더한 뒤 결과의 1의 보수를 얻는다. 이 16비트 숫자가 체크섬이다[^1].

```c
u_short cksum(u_short *buf, int count) {
    register u_long sum = 0;
    while (count--) {
        sum += *buf++;
        if (sum & 0xFFFF0000) {     /* 자리올림이 생기면 */
            sum &= 0xFFFF;          /* 넘친 비트를 지우고 */
            sum++;                  /* 맨 아래에 1을 더한다 */
        }
    }
    return ~(sum & 0xFFFF);
}
```

받는 쪽은 받은 워드와 체크섬을 함께 1의 보수로 더해 `0xFFFF`가 나오는지 본다[^s1]. 필기의 요약도 같다. 16비트로 쪼개 더하고, 자리올림을 반영해 1의 보수를 EDC로 넣는다. IP와 TCP에서 쓰고 2계층에서는 쓰지 않는다[^2].

## 활용

- IPv4 헤더, TCP·UDP 세그먼트의 체크섬 칸이 이 방법이다(RFC 1071)[^s1].
- 복잡도: 워드마다 덧셈 한 번, $$O(n)$$. CPU에서 빠르다.
- 약점: 더하기는 순서와 상관이 없어 워드 순서가 바뀐 오류를 못 잡는다. 같은 자리의 비트가 한 워드에서 0→1, 다른 워드에서 1→0으로 바뀌어도 합이 같다. 검증 코드의 무작위 2·4비트 오류 8,000번 중 132번(약 1.6%)을 놓쳤다([오류 검출 방식 비교](/Hongs_Blog/studies/computer-communication/error-detection-compared/)).
- 흔한 실수: 넘친 자리올림을 버리는 것. 그러면 보통의 덧셈(2의 보수)이 되어 받는 쪽 결과가 `0xFFFF`로 맞지 않는다.

## 연결

- 선수: [오류 검출 코드](/Hongs_Blog/studies/computer-communication/error-detecting-code/), [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)(16진수, 자리올림)
- 쓰이는 계층: [인터넷 구조](/Hongs_Blog/studies/computer-communication/internet-architecture/)(IP, TCP)
- 다른 코드와 비교: [오류 검출 방식 비교](/Hongs_Blog/studies/computer-communication/error-detection-compared/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 인터넷 체크섬을 만드는 세 단계를 쓰라.</summary>


**답:** 메시지를 16비트 워드로 나눈다 → 1의 보수 덧셈으로 모두 더한다(자리올림은 맨 아래에 다시 더함) → 합의 비트를 뒤집는다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 두 워드 `0x8000`, `0x8001`의 체크섬을 계산하라.</summary>


**답:** 합 `0x10001` → 자리올림 되돌리기로 `0x0002` → 뒤집어 `0xFFFD`.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 코드의 `if (sum & 0xFFFF0000) { sum &= 0xFFFF; sum++; }`가 하는 일을 한 문장으로 쓰라.</summary>


**답:** 합이 16비트를 넘으면 넘친 자리올림을 떼어 내 맨 아래 자리에 1로 더해, 16비트 1의 보수 덧셈을 만든다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 체크섬이 놓치는 오류를 하나 들라.</summary>


**답:** 워드 `0x0005, 0x0010`이 `0x0006, 0x000F`로 바뀐 경우. 하나는 1 늘고 하나는 1 줄어 합이 같다. 워드 두 개의 순서가 바뀌어도 합이 같아 놓친다.

</details>

[^1]: 4-1학기/컴퓨터 통신/1.수업자료/04.2장-1.pptx, 슬라이드 50 "인터넷 체크섬 알고리즘" (4-1학기/pasted_images/Pasted image 20261008214123.png)
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/06.6주차.md, 87~91행
[^s1]: 에이전트 보충. 예시 표와 카드 C2, 받는 쪽 점검 방법, IPv4 헤더 예와 RFC 1071, 약점과 놓친 비율, 흔한 실수, 카드 C4는 원본에 없다. 구현 코드로 확인했다.
{% endraw %}
