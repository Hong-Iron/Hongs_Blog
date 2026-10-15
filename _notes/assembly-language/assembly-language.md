---
layout: "note"
title: "어셈블리어와 기계어"
display_title: "어셈블리어와 기계어 (Assembly Language)"
kind: "concept"
kind_label: "정의"
num: "01"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Assembly Language", "어셈블리 언어", "기계어", "Machine Language", "어셈블러", "Assembler", "니모닉", "Mnemonic", "일대일 대응", "이식성", "Portability"]
description: "컴퓨터의 두뇌인 프로세서가 알아듣는 말은 숫자뿐이다. 어셈블리어는 그 숫자 명령 하나하나에 사람이 읽을 수 있는 짧은 이름을 붙인 말이다. 요리사에게 \"3번 동작, 7번 재료\"라고 적는 대신 \"썰어라, 양파\"라고 적어 주는 것과 같아서, 한 줄이 프로세서의 동작 하나와 정확히 짝이…"
next_url: "/studies/assembly-language/virtual-machine-levels/"
next_title: "가상 기계 계층"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/assembly-language/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

컴퓨터의 두뇌인 프로세서가 알아듣는 말은 숫자뿐이다. 어셈블리어는 그 숫자 명령 하나하나에 사람이 읽을 수 있는 짧은 이름을 붙인 말이다. 요리사에게 "3번 동작, 7번 재료"라고 적는 대신 "썰어라, 양파"라고 적어 주는 것과 같아서, 한 줄이 프로세서의 동작 하나와 정확히 짝이 된다. 그래서 컴퓨터가 실제로 하는 일이 그대로 보인다. 대신 같은 일을 하는 데 줄 수가 훨씬 많이 들고, 프로세서 종류가 바뀌면 처음부터 다시 써야 한다.

</div>


## 예시로 보기

C++로 `cout << (A * B + C);` 한 줄을 쓰면 화면에 답이 나온다. 그런데 프로세서에는 "곱하고 더해서 출력하라"는 명령이 없다. 프로세서가 한 번에 할 수 있는 일은 값을 옮기기, 두 수를 곱하기, 두 수를 더하기처럼 아주 작은 동작뿐이다. 그래서 이 한 줄은 작은 동작 여러 개로 쪼개져야 한다.

같은 일을 네 가지 말로 적으면 이렇다.

```
사람의 말    : A 곱하기 B에 C를 더한 값을 보여라
C++          : cout << (A * B + C);
어셈블리어   : mov eax,A / mul B / add eax,C / call WriteInt
기계어       : A1 00000000 / F7 25 00000004 / 03 05 00000008 / E8 00500000
```

C++ 한 줄이 어셈블리어 네 줄이 되었다. 그리고 어셈블리어 네 줄은 기계어 네 줄과 줄 수가 같다. 줄마다 짝을 지으면 이렇다.

| 어셈블리어 | 기계어 (16진수) | 프로세서가 하는 일[^s1] |
|---|---|---|
| `mov eax,A` | `A1 00000000` | 0번지에 있는 A의 값을 프로세서 안의 저장 칸 EAX로 옮긴다 |
| `mul B` | `F7 25 00000004` | EAX에 4번지의 B를 곱한다 |
| `add eax,C` | `03 05 00000008` | EAX에 8번지의 C를 더한다 |
| `call WriteInt` | `E8 00500000` | 정수를 화면에 찍는 코드 묶음 `WriteInt`를 부른다 |

기계어 줄의 맨 앞 숫자가 "무슨 동작인가"이고, 뒤의 여덟 글자가 "어디에 있는 값인가"다. `A1`은 "메모리의 값을 EAX로 옮겨라", `E8`은 "저 코드를 불러라"다. `mov`(move), `mul`(multiply), `add`, `call`은 이 숫자들에 붙인 이름이다. 이렇게 기억하기 쉽게 붙인 이름을 니모닉(mnemonic)이라 부른다. 기억을 돕는 것이라는 뜻이다.

세 변수의 주소가 0, 4, 8로 4씩 떨어져 있다. 변수 하나가 4바이트(32비트)를 차지하기 때문이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 기계어 네 줄의 첫 바이트가 어셈블리어 네 줄과 같은 명령인지(25h의 가운데 세 비트 100b = 곱셈, 05h의 가운데 세 비트 000b = EAX), 주소 0·4·8, 네 줄을 흉내 낸 결과가 A × B + C(3 × 4 + 5 = 17, 무작위 1,000회) — [01_assembly-language_verify.py](/Hongs_Blog/studies/assembly-language/code/01_assembly-language_verify/). 실제 프로세서가 아니라 파이썬 흉내로 확인했다.</div>

</div>


## 정의

- **기계어 (machine language).** 프로세서가 바로 읽어 실행하는 숫자 명령이다. 프로세서 종류마다 숫자와 뜻이 다르다.
- **어셈블리어 (assembly language).** 기계어 명령 하나에 니모닉 하나를 붙여 글자로 적은 말이다. 어셈블리어 한 줄은 기계어 명령 한 개가 된다(일대일 관계).
- **어셈블러 (assembler).** 어셈블리어로 쓴 글을 기계어로 바꿔 주는 프로그램이다[^s2]. 이 과목에서는 마이크로소프트의 MASM을 쓴다.

C++이나 Java 같은 고급 언어는 한 줄이 기계어 여러 개로 바뀐다(일대다 관계)[^s2]. 위의 `cout` 한 줄이 네 개가 된 것이 그 예다.

어셈블리어는 다른 종류의 프로세서로 옮겨 쓸 수 없다. 니모닉이 특정 프로세서의 기계어에 붙인 이름이기 때문이다[^s2]. 이 과목의 어셈블리어는 인텔 x86 계열 프로세서의 것이다. C++ 프로그램은 프로세서가 바뀌어도 그 프로세서용 번역기로 다시 번역하면 된다.

## 활용

- 프로그램의 대표 종류로는 업무용 응용 프로그램, 하드웨어 장치를 직접 다루는 프로그램(장치 드라이버), 기계 안에 들어가는 작은 컴퓨터용 프로그램(임베디드 시스템), 컴퓨터 게임이 있다. 뒤의 둘처럼 하드웨어를 직접 만지거나 메모리와 속도가 빠듯한 곳에서 어셈블리어가 쓰인다[^s2].
- 어셈블리어를 배우면 소프트웨어가 가장 낮은 단계에서 어떻게 만들어지는지 알게 된다. 고급 언어의 변수, 반복문, 함수 호출이 실제로 어떤 동작으로 바뀌는지는 뒤의 문서들이 다룬다: [조건 구조를 점프로 옮기기](/Hongs_Blog/studies/assembly-language/conditional-structures/), [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/).
- 흔한 실수: 어셈블리어와 기계어를 같은 것으로 부르는 것. 어셈블리어는 글자이고 기계어는 숫자다. 둘 사이에 어셈블러가 있다.

## 연결

- 선수: [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/). 기계어와 주소는 늘 16진수로 적는다.
- 어셈블리어가 컴퓨터의 여러 층 가운데 어디에 있는가: [가상 기계 계층](/Hongs_Blog/studies/assembly-language/virtual-machine-levels/)
- 한 줄을 이루는 조각들: [어셈블리 문장의 구성](/Hongs_Blog/studies/assembly-language/asm-statement-elements/). 글자가 실행 파일이 되는 길: [어셈블·링크·실행 과정](/Hongs_Blog/studies/assembly-language/assemble-link-execute/)
- 고급 언어를 기계어로 바꾸는 프로그램: [컴파일과 인터프리트 비교](/Hongs_Blog/studies/compilers/compilation-vs-interpretation/). Java는 실제 프로세서가 아니라 가상의 기계를 위한 명령으로 바뀐다: [JVM과 바이트코드](/Hongs_Blog/studies/java/jvm-bytecode/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 어셈블리어와 기계어는 "일대일", 고급 언어와 기계어는 "일대다"라고 한다. `cout << (A * B + C);`를 예로 들어 두 말의 뜻을 설명하라.</summary>

**답:** 이 C++ 한 줄은 기계어 명령 네 개(옮기기, 곱하기, 더하기, 부르기)가 된다. 고급 언어 한 줄이 기계어 여러 개가 되므로 일대다이다. 같은 일을 어셈블리어로 쓰면 `mov`, `mul`, `add`, `call` 네 줄이고, 한 줄이 기계어 명령 하나씩과 짝이 된다. 그래서 일대일이다.<br>
**흔한 오답:** "어셈블리어 프로그램과 C++ 프로그램은 줄 수가 같다". 일대일은 어셈블리어와 기계어 사이의 이야기다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 기계어 `03 05 00000008`은 예시의 어셈블리어 네 줄 가운데 어느 줄인가? 이 명령은 메모리에서 몇 바이트를 차지하는가?</summary>

**답:** `add eax,C`다. 6바이트를 차지한다.<br>
**이유:** `03`이 더하기 명령, `05`가 "EAX에, 뒤에 적힌 주소의 값을"이라는 뜻이고, `00000008`이 C의 주소다. 16진수 두 글자가 1바이트이므로 1 + 1 + 4 = 6바이트다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** x86 프로세서용으로 만든 프로그램을 전혀 다른 종류의 프로세서를 쓰는 기기로 옮기려 한다. 프로그램이 (가) C++로 쓰여 있을 때와 (나) 어셈블리어로 쓰여 있을 때 할 일은 각각 무엇인가?</summary>

**답:** (가) 새 프로세서용 번역기로 다시 번역한다. C++ 코드는 거의 그대로 쓴다. (나) 새 프로세서의 어셈블리어로 처음부터 다시 쓴다.<br>
**이유:** 어셈블리어의 니모닉은 그 프로세서의 기계어 명령에 붙인 이름이다. 프로세서가 다르면 명령의 종류와 저장 칸의 이름부터 다르다.

</details>


[^s1]: 첫 바이트의 뜻은 인텔 명령 부호 표(Intel 64 and IA-32 Architectures Software Developer's Manual, Vol. 2)를 따랐고 검증 코드에서 풀어 확인했다. 메모리에 실제로 놓이는 바이트 순서는 [리틀 엔디언](/Hongs_Blog/studies/assembly-language/little-endian/)에서 다룬다.
[^s2]: 답은 교재 Irvine, *Assembly Language for x86 Processors* 7판, 1.1절의 내용이다.
{% endraw %}
