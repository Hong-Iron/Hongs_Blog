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
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Internet Checksum", "체크섬", "Checksum", "1의 보수 합", "One's Complement Sum", "자리올림 되돌리기", "End-around Carry"]
description: "메시지를 16비트 숫자들로 잘라 모두 더하고, 그 합의 비트를 모두 뒤집은 값(체크섬)을 붙여 보낸다. 받는 쪽이 받은 숫자와 체크섬을 함께 더하면, 오류가 없을 때 모든 비트가 1인 값이 나온다. 덧셈만 하므로 소프트웨어로도 빠르지만, 더하는 순서가 바뀌거나 한 숫자가 늘고 다른…"
prev_url: "/studies/computer-communication/two-dimensional-parity/"
prev_title: "2차원 패리티"
next_url: "/studies/computer-communication/crc/"
next_title: "CRC"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "49_internet-checksum_impl.py", "u": "/studies/computer-communication/code/49_internet-checksum_impl/", "r": "구현"}, {"t": "49_internet-checksum_plot.py", "u": "/studies/computer-communication/code/49_internet-checksum_plot/", "r": "그림 생성"}]
permalink: "/studies/computer-communication/internet-checksum/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

메시지를 16비트 숫자들로 잘라 모두 더하고, 그 합의 비트를 모두 뒤집은 값(체크섬)을 붙여 보낸다. 받는 쪽이 받은 숫자와 체크섬을 함께 더하면, 오류가 없을 때 모든 비트가 1인 값이 나온다. 덧셈만 하므로 소프트웨어로도 빠르지만, 더하는 순서가 바뀌거나 한 숫자가 늘고 다른 숫자가 같은 만큼 줄면 합이 같아 놓친다. 그래서 링크 계층 대신 IP·TCP 같은 위 계층에서 쓴다.

</div>


## 예시로 보기

패리티는 1의 개수만 세므로 비트 두 개가 함께 바뀌면 놓친다. CRC는 훨씬 강하지만 비트마다 XOR 나눗셈을 되풀이해야 해서, 전용 회로 없이 CPU로 계산하면 덧셈보다 품이 많이 든다. 인터넷 체크섬은 CPU가 가장 빨리 하는 덧셈만으로 메시지 전체를 숫자 하나로 줄인다[^s2].

계산에는 두 가지 재료가 쓰인다. 비트 뒤집기(1의 보수)와, 넘친 자리올림을 버리지 않는 덧셈이다. 4비트짜리 작은 수로 먼저 본다.

### 1의 보수: 비트를 모두 뒤집기

어떤 수의 1의 보수는 그 수의 비트를 모두 뒤집은 수다. 0은 1로, 1은 0으로 바꾼다. 4비트 `0101`의 1의 보수는 `1010`이다. C 코드에서는 `~` 기호로 쓴다[^s2].

보수(補數)는 "채워 주는 수"라는 뜻이다. `0101`과 `1010`을 세로로 맞춰 더해 보면, 자리마다 한쪽은 0이고 다른 쪽은 1이다. 그래서 자리올림이 하나도 생기지 않고 모든 자리가 1로 찬다. `0101 + 1010 = 1111`이다.

이것은 아무 수에서나 맞다. 어떤 수 $$x$$든 $$x$$와 그 1의 보수 $$\sim x$$를 더하면 모든 비트가 1이다. 이 성질이 받는 쪽 검사의 핵심이다[^s2].

### 넘친 1을 맨 아래로 되돌리는 덧셈

4비트 칸에 두 수를 더하면 결과가 4비트를 넘을 수 있다. `1011`(11) + `0110`(6) = `10001`(17)이다. 다섯째 자리로 1이 넘쳤다.

컴퓨터의 보통 정수 덧셈은 이 넘친 1을 버리고 `0001`만 남긴다. 체크섬에 쓰는 덧셈(1의 보수 덧셈)은 넘친 1을 버리지 않고 맨 아래 자리에 다시 더한다. `0001 + 1 = 0010`이다.

왜 맨 아래에 더할까? 다섯째 자리의 1은 16이다. 이것을 1로 바꿔 더한다는 것은 16을 1로 본다는 뜻이다. $$16 = 15 + 1$$이므로, 이 덧셈은 결국 15로 나눈 나머지를 남기는 계산이다. 실제로 $$11 + 6 = 17$$이고, 17을 15로 나눈 나머지는 2, 곧 `0010`이다. 16비트에서는 같은 원리로 65,535로 나눈 나머지를 남긴다[^s2].

나머지 계산이라 좋은 점이 있다. 여러 수를 더할 때 순서를 바꾸거나 묶는 방법을 바꿔도 결과가 같다. 그래서 보내는 쪽과 받는 쪽이 워드를 다른 순서로 더해도 같은 합을 얻는다.

### 4비트 체크섬 한 번 만들기

`1011`과 `0110`을 보낸다고 하자. 위에서 둘을 더해 `0010`을 얻었다. 이 합의 비트를 모두 뒤집은 `1101`이 체크섬이다. 보내는 쪽은 `1011`, `0110`, `1101`을 보낸다.

받는 쪽은 받은 세 수를 같은 방법으로 더한다. 앞의 둘은 `0010`이 되고, 여기에 `1101`을 더하면 `1111`이다. 모두 1이므로 오류가 없다고 본다[^s2].

### 16비트로 해 보기

실제 체크섬은 16비트 묶음(워드)으로 한다. 두 워드 `0xF0F0`, `0x1234`를 보낸다. `0x`는 16진수라는 표시이고, 16진수 한 자리가 2진수 네 자리다. 예를 들어 F는 `1111`, 0은 `0000`이다[^s1].

| 단계 | 값 |
|---|---|
| 더하기 | `0xF0F0 + 0x1234 = 0x10324` (17비트로 넘침) |
| 넘친 1을 맨 아래로 되돌려 더하기 | `0x0324 + 1 = 0x0325` |
| 비트 뒤집기(1의 보수) | `~0x0325 = 0xFCDA` ← 체크섬 |
| 받는 쪽: 셋을 모두 더하기 | `0xF0F0 + 0x1234 + 0xFCDA` → `0xFFFF` (오류 없음) |

첫 줄을 10진수로 따라가 본다. `0xF0F0`은 61,680, `0x1234`는 4,660이다. 더하면 66,340이다. 16비트에 담을 수 있는 가장 큰 수는 65,535라서 넘친다.

둘째 줄에서 넘친 부분 65,536을 떼어 내면 $$66{,}340 - 65{,}536 = 804$$, 곧 `0x0324`가 남는다. 떼어 낸 65,536을 맨 아래 1로 바꿔 더하면 805, 곧 `0x0325`다.

셋째 줄은 비트를 뒤집는다. 16진수에서는 자리마다 F(15)에서 빼면 같은 결과가 나온다. F - 0 = F, F - 3 = C, F - 2 = D, F - 5 = A라서 `0xFCDA`다[^s2].

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/49_internet-checksum_fig1.svg" alt="그림" width="687" height="276" loading="lazy">

그림은 위에서 아래로 읽는다. 맨 위 두 줄은 두 워드를 2진수 16자리로 쓴 것이고, 칸은 네 자리씩 묶여 16진수 한 자리가 된다. 셋째 줄 "더한 값"은 세로셈 결과인데, 맨 왼쪽 주황 칸이 16자리를 넘쳐 생긴 17번째 비트다.

주황 선은 그 넘친 1을 떼어 맨 아래(가장 오른쪽) 자리로 옮긴다. 그래서 넷째 줄 "접은 합"은 셋째 줄의 오른쪽 16자리에서 맨 끝 0이 1로 바뀐 `0x0325`다. 다섯째 줄 "체크섬"은 접은 합의 비트를 하나씩 모두 뒤집은 `0xFCDA`다.

점선 아래는 받는 쪽이다. 받은 두 워드를 더해 접으면 보내는 쪽과 같은 `0x0325`가 나온다. 그 아래 체크섬과 세로로 맞춰 보면 자리마다 1이 꼭 하나씩이다. 그래서 자리올림 없이 맨 아래 줄이 모두 1, 곧 `0xFFFF`가 된다[^s3].

### 받는 쪽이 모두 1을 얻는 이유

받는 쪽이 워드들을 더해 접은 값을 $$S$$라 하자. 오류가 없으면 $$S$$는 보내는 쪽의 합과 같다. 체크섬은 $$\sim S$$이므로, 둘을 더하면 앞에서 본 성질대로 모든 비트가 1이다. 1의 보수 덧셈은 순서를 바꿔도 결과가 같으므로, 체크섬을 맨 뒤에 더하든 중간에 끼워 더하든 같다[^s2].

오류가 받은 합을 $$S$$에서 $$d$$만큼 바꿨다고 하자. 그러면 $$\sim S$$를 더한 결과도 `0xFFFF`에서 $$d$$만큼 어긋난다. 이 덧셈은 65,535로 나눈 나머지 계산이므로, $$d$$가 0이거나 65,535의 배수일 때만 다시 `0xFFFF`가 나온다.

비트 하나가 뒤집히면 합은 그 자리의 값만큼 늘거나 준다. 자리의 값은 1, 2, 4, …, 32,768 가운데 하나라서 65,535의 배수가 될 수 없다. 그래서 1비트 오류는 늘 잡는다. 아래 '약점 두 가지'는 오류가 있어도 $$d = 0$$이 되는 경우다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 카드 C2, 잘 알려진 IPv4 헤더 예(체크섬 0xB861), 받는 쪽 합 0xFFFF, 무작위 1비트 오류 2,000개 모두 검출, 순서 바뀜과 ±1 상쇄는 놓침 — [49_internet-checksum_impl.py](/Hongs_Blog/studies/computer-communication/code/49_internet-checksum_impl/). 본문 예시 `0xF0F0 + 0x1234`, 4비트 예, 넘친 1을 버릴 때의 예, 두 약점의 예 — [49_internet-checksum_plot.py](/Hongs_Blog/studies/computer-communication/code/49_internet-checksum_plot/)</div>

</div>


## 정의

메시지를 16비트 정수의 연속으로 보고, 16비트 1의 보수 덧셈으로 모두 더한 뒤 결과의 1의 보수를 얻는다. 이 16비트 숫자가 체크섬이다.

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

코드의 나머지 줄은 이렇게 읽는다. `buf`는 워드들이 놓인 곳이고 `count`는 워드 개수다. `sum`은 32비트 이상을 담는 `u_long`이라, 16비트를 넘친 자리올림도 잠깐 담아 둘 수 있다. `sum += *buf++`는 워드 하나를 더하고 다음 워드로 넘어간다. 마지막 `return ~(sum & 0xFFFF)`는 아래 16비트만 남겨 비트를 뒤집은 값을 돌려준다[^s2].

워드를 하나 더할 때마다 바로 넘친 1을 접어 넣기 때문에 `sum`은 17비트를 넘지 않는다. 16비트 수 둘을 더한 최댓값은 `0xFFFF + 0xFFFF = 0x1FFFE`라서 넘친 자리는 늘 1 하나뿐이다.

받는 쪽은 받은 워드와 체크섬을 함께 1의 보수로 더해 `0xFFFF`가 나오는지 본다[^s1]. 요약하면, 16비트로 쪼개 더하고, 자리올림을 반영해 1의 보수를 EDC로 넣는다. IP와 TCP에서 쓰고 2계층에서는 쓰지 않는다.

## 활용

- IPv4 헤더, TCP·UDP 세그먼트의 체크섬 칸이 이 방법이다(RFC 1071)[^s1].
- 복잡도: 워드마다 덧셈 한 번, $$O(n)$$. CPU에서 빠르다.

### 약점 두 가지

첫째, 더하기는 순서와 상관이 없어 워드 순서가 바뀐 오류를 못 잡는다. `0xF0F0`, `0x1234`가 `0x1234`, `0xF0F0` 순서로 도착해도 합은 똑같이 `0x0325`로 접힌다. 받는 쪽은 `0xFFFF`를 얻고 오류를 놓친다[^s2].

둘째, 같은 자리의 비트가 한 워드에서 0→1, 다른 워드에서 1→0으로 바뀌면 합이 같다. `0xF0F0`의 오른쪽에서 셋째 비트(4의 자리)는 0이고, `0x1234`의 같은 자리는 1이다. 이 두 비트가 함께 뒤집히면 `0xF0F0`은 `0xF0F4`가 되어 4 늘고, `0x1234`는 `0x1230`이 되어 4 준다. 합은 `0x10324` 그대로라 놓친다[^s2].

이런 오류가 실제로 얼마나 빠져나가는지 실험으로 보면, 검증 코드의 무작위 2·4비트 오류 8,000번 중 132번(약 1.6%)을 놓쳤다. 60번에 한 번꼴이다([오류 검출 방식 비교](/Hongs_Blog/studies/computer-communication/error-detection-compared/)).

### 흔한 실수: 넘친 1을 버리기

넘친 자리올림을 버리면 보통의 정수 덧셈이 되어, 표준대로 계산하는 받는 쪽 결과가 `0xFFFF`로 맞지 않는다. 보내는 쪽이 `0xF0F0 + 0x1234`에서 넘친 1을 버리면 합은 `0x0324`, 체크섬은 `~0x0324 = 0xFCDB`가 된다. 받는 쪽은 넘친 1을 되돌려 더해 `0x0325`를 얻고, 여기에 `0xFCDB`를 더하면 `0x10000`이 넘쳐 `0x0001`이 된다. 데이터는 멀쩡한데 오류로 판정한다[^s2].

양쪽이 모두 넘친 1을 버리면 서로 맞아떨어지기는 한다. 대신 검사가 약해진다. 두 워드의 맨 윗자리가 함께 0에서 1로 뒤집히면 합이 `0x8000 + 0x8000 = 0x10000`만큼 는다. 넘친 1을 버리면 이 변화가 통째로 사라져 놓친다. 1의 보수 덧셈에서는 넘친 1이 맨 아래 1로 돌아와 합이 1만큼 달라지므로 잡는다[^s2].

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

[^s1]: 구현 코드로 확인했다.
[^s2]: [49_internet-checksum_plot.py](/Hongs_Blog/studies/computer-communication/code/49_internet-checksum_plot/)와 구현 코드로 확인했다.
[^s3]: [49_internet-checksum_plot.py](/Hongs_Blog/studies/computer-communication/code/49_internet-checksum_plot/)로 그렸고, 더한 값 `0x10324`, 접은 합 `0x0325`, 체크섬 `0xFCDA`, 받는 쪽 합 `0xFFFF`를 같은 코드로 확인했다.
{% endraw %}
