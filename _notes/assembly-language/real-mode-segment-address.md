---
layout: "note"
title: "실주소 모드의 세그먼트 주소"
display_title: "실주소 모드의 세그먼트 주소 (Segmented Memory)"
kind: "concept"
kind_label: "기법"
num: "06"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Segmented Memory", "세그먼트 메모리", "세그먼트 오프셋 주소", "Segment-Offset Address", "선형 주소", "Linear Address", "절대 주소", "Absolute Address", "Calculating Linear Addresses"]
description: "실주소 모드에서는 메모리의 한 자리를 숫자 두 개로 가리킨다. \"몇 동\"과 \"그 동의 몇 호\"로 집을 찾는 것과 같다. 앞의 숫자가 구역이 시작하는 곳을, 뒤의 숫자가 그 안에서 얼마나 들어갔는지를 말한다. 작은 숫자 둘로 큰 메모리를 다 가리킬 수 있어 좋다. 대신 구역 하나가 …"
prev_url: "/studies/assembly-language/x86-operating-modes/"
prev_title: "x86 동작 모드"
next_url: "/studies/assembly-language/io-access-levels/"
next_title: "입출력 접근 수준"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "06_real-mode-segment-address_verify.py", "u": "/studies/assembly-language/code/06_real-mode-segment-address_verify/", "r": "검증"}]
permalink: "/studies/assembly-language/real-mode-segment-address/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

실주소 모드에서는 메모리의 한 자리를 숫자 두 개로 가리킨다. "몇 동"과 "그 동의 몇 호"로 집을 찾는 것과 같다. 앞의 숫자가 구역이 시작하는 곳을, 뒤의 숫자가 그 안에서 얼마나 들어갔는지를 말한다. 작은 숫자 둘로 큰 메모리를 다 가리킬 수 있어 좋다. 대신 구역 하나가 작고, 구역끼리 겹쳐 있어서 서로 다른 숫자 쌍이 같은 자리를 가리킬 수 있다.

</div>


## 예시로 보기

실주소 모드의 메모리는 1MB이고, 한 자리를 가리키려면 20비트가 든다. 그런데 이 모드의 레지스터는 16비트라서 `0000h`부터 `FFFFh`까지, 곧 65,536가지만 담는다. 레지스터 하나로는 1MB의 16분의 1밖에 못 가리킨다. 그래서 16비트 숫자 두 개를 함께 쓴다. 그림으로 보면 이렇다.

```
 진짜 주소
  F0000 +-------+
  ...   |       |          8000:FFFF  +---------+  ← 구역의 끝
  90000 +-------+                     |         |
  80000 |#######| ----------------->  |  구역   |
  70000 +-------+                     |  하나   |
  ...   |       |          8000:0250  |- - - - -|  ← 시작에서 0250h 들어간 곳
  10000 +-------+                     |         |
  00000 +-------+          8000:0000  +---------+  ← 구역의 시작
```

`8000:0250`은 "`8000`번 구역의 `0250h`번째 자리"다. 콜론 앞의 수를 세그먼트 값, 뒤의 수를 오프셋(offset)이라 부른다. 오프셋은 기준점에서 떨어진 거리라는 뜻이다. `8000`번 구역은 진짜 주소 `80000h`에서 시작한다. 거기서 `0250h`를 더 가면 `80250h`다.

진짜 주소, 곧 메모리 맨 처음부터 센 20비트 주소를 선형 주소(linear address) 또는 절대 주소라 부른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `08F1:0100` → `09010h`, 그림의 세 주소(`80000h`, `80250h`, `8FFFFh`), 16을 곱하는 것과 16진수 끝에 0을 붙이는 것이 같음, 같은 선형 주소를 만드는 쌍의 수, `FFFF:FFFF` → `10FFEFh`, 카드의 값 — [06_real-mode-segment-address_verify.py](/Hongs_Blog/studies/assembly-language/code/06_real-mode-segment-address_verify/)</div>

</div>


## 정의

세그먼트 값에 16을 곱하고 오프셋을 더하면 선형 주소다. 세그먼트 값과 오프셋은 둘 다 16비트 수다.

$$\text{선형 주소} = \text{세그먼트} \times 16 + \text{오프셋}$$


16진수에서 16을 곱하는 것은 끝에 0을 하나 붙이는 것이다. 10진수에서 10을 곱하면 끝에 0이 붙는 것과 같다.

**쓰는 때.** 주소가 `xxxx:yyyy` 꼴로 적혀 있고 실주소 모드(MS-DOS, BIOS)의 이야기일 때다. 보호 모드의 32비트 프로그램에서는 주소 하나가 32비트 수 하나라서 이 계산이 필요 없다.

**순서.**

1. *세그먼트 끝에 0 붙이기:* 세그먼트 값을 16진수로 쓰고 오른쪽에 0을 하나 붙인다.
2. *오프셋 더하기:* 오프셋을 16진수 덧셈으로 더한다.

## 예제

**`08F1:0100`을 선형 주소로**

1. *세그먼트 끝에 0 붙이기:* `08F1` → `08F10`.
2. *오프셋 더하기:* `08F10` + `0100` = `09010`.

```
   0 8 F 1 0      ← 세그먼트에 0을 붙인 값
 +   0 1 0 0      ← 오프셋
 -----------
   0 9 0 1 0      ← 선형 주소
```

오른쪽에서 셋째 자리에서 F + 1 = 16이라 0을 쓰고 1을 올린다. 그래서 8이 9가 된다.

**서로 다른 쌍이 같은 자리를 가리킨다.** `0900:0010`도 `09000` + `0010` = `09010h`다. `0901:0000`도 `09010h`다. 세그먼트 값이 1 늘면 구역의 시작이 16바이트만 뒤로 간다. 구역 하나의 길이는 65,536바이트(64KB)이므로 이웃 구역들이 거의 다 겹친다[^s1].

**가장 큰 쌍.** `FFFF:FFFF`는 `FFFF0` + `FFFF` = `10FFEFh`다. 20비트로 적을 수 있는 가장 큰 수 `FFFFFh`를 넘는다[^s1].

## 활용

- 실주소 모드에서 세그먼트 값은 세그먼트 레지스터(CS, DS, SS, ES)에 들어 있다: [x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/). 프로그램은 보통 오프셋만 적고, 프로세서가 레지스터의 세그먼트 값과 합친다[^s1].
- 인터럽트 벡터 표의 칸 하나는 이 꼴의 주소(세그먼트 16비트 + 오프셋 16비트 = 32비트)다: [INT 명령과 인터럽트 벡터 표](/Hongs_Blog/studies/assembly-language/interrupt-vector-table/).
- 흔한 실수: 두 수를 그냥 이어 붙이는 것. `08F1:0100`은 `08F10100h`가 아니다. 한 자리만 밀어서 더한다.
- 흔한 실수: 10진수로 더하는 것. `F + 1`은 10이 아니라 올림이 생기는 `10h`다. 연습은 [16진 계산과 2의 보수 연습](/Hongs_Blog/studies/assembly-language/asm-hex-practice/)에 있다.

## 연결

- 선수: [x86 동작 모드](/Hongs_Blog/studies/assembly-language/x86-operating-modes/), [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)
- 운영체제 과목의 [세그먼테이션](/Hongs_Blog/studies/operating-systems/segmentation/)도 "구역 번호 + 오프셋"으로 주소를 적는다. 다른 점은 구역의 시작 주소를 찾는 방법이다. 그쪽은 표에서 시작 주소와 길이를 찾아 길이를 넘는지 검사한다. 실주소 모드는 표 없이 16을 곱할 뿐이고, 길이 검사도 보호도 없다.
- 1MB 안의 어느 주소에 무엇이 있는가: [MS-DOS 메모리 배치](/Hongs_Blog/studies/assembly-language/msdos-memory-map/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `1234:0010`, `B800:0000`, `0040:0017`을 선형 주소로 바꾸라.</summary>

**답:** `12350h`, `B8000h`, `00417h`.<br>
**이유:** `12340` + `0010` = `12350`. `B8000` + `0000` = `B8000`. `00400` + `0017` = `00417`. 세 주소는 연습용으로 고른 값이다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 세그먼트 값에 왜 하필 16을 곱하는가? 곱하지 않고 그냥 더하면 무엇이 안 되는가?</summary>

**답:** 세그먼트와 오프셋은 둘 다 16비트라서, 그냥 더하면 합이 많아야 `1FFFEh`로 17비트밖에 안 된다. 1MB(20비트)를 다 가리키지 못한다. 16을 곱하면 세그먼트 값이 왼쪽으로 4비트 밀려 20비트 수가 되고, 구역의 시작점이 1MB 전체에 16바이트 간격으로 놓인다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "세그먼트:오프셋 쌍이 다르면 가리키는 자리도 다르다"가 틀렸음을 보이는 예를 들어라.</summary>

**답:** `1234:0010`과 `1000:2350`. 둘 다 `12350h`다. `12340 + 0010 = 12350`, `10000 + 2350 = 12350`.<br>
**이유:** 구역의 시작은 16바이트 간격인데 구역 하나의 길이는 65,536바이트라서 구역들이 겹친다.

</details>


[^s1]: 모든 값은 검증 코드로 확인했다. 내용은 교재 Irvine, *Assembly Language for x86 Processors* 7판, 2.3.1절에 있다.
{% endraw %}
