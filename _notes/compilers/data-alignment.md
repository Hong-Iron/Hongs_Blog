---
layout: "note"
title: "데이터 정렬과 패딩"
display_title: "데이터 정렬과 패딩 (Data Alignment and Padding)"
kind: "concept"
kind_label: "정의"
num: "47"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Data Alignment", "데이터 정렬", "메모리 정렬", "Padding", "패딩", "N-byte Alignment", "런타임 환경", "Runtime Environment", "객체 표현", "Object Representation", "C 방식 배열", "Java 방식 배열", "다차원 배열 표현"]
description: "주차장에서 큰 차는 칸 선에 맞춰 세워야 하고, 선에 맞추다 보면 앞차와의 사이에 빈 자리가 남는다. 변수도 메모리에 아무 번지에나 두지 않고, 종류마다 정해진 눈금의 배수 번지에서 시작하게 둔다. 눈금에 맞추느라 사이사이에 안 쓰는 칸이 생긴다. 어느 변수가 어느 번지에 놓일지는…"
prev_url: "/studies/compilers/available-vs-live/"
prev_title: "사용 가능한 식과 생존 변수 비교"
next_url: "/studies/compilers/activation-tree/"
next_title: "활성 트리와 호출 스택"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/data-alignment/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

주차장에서 큰 차는 칸 선에 맞춰 세워야 하고, 선에 맞추다 보면 앞차와의 사이에 빈 자리가 남는다. 변수도 메모리에 아무 번지에나 두지 않고, 종류마다 정해진 눈금의 배수 번지에서 시작하게 둔다. 눈금에 맞추느라 사이사이에 안 쓰는 칸이 생긴다. 어느 변수가 어느 번지에 놓일지는 컴파일러가 미리 정해 두고, 그 번지로 찾아가는 코드를 만든다. 눈금이 얼마인지는 기계와 언어마다 다르다.

</div>


## 예시로 보기

3주소 코드에는 `a`, `b`, `t0` 같은 이름만 있고 번지가 없다. 기계어는 이름을 모른다. 코드 생성기는 이름을 번지로 바꿔야 하고, 그러려면 변수마다 몇 번지부터 몇 칸을 차지하는지 정해 둬야 한다. 변수, 배열, 함수 호출처럼 높은 수준의 구조를 실행 중에 받쳐 주는 자료 구조들을 통틀어 런타임 환경(runtime environment)이라 부른다. 그 첫 물음이 "객체가 메모리에서 어떤 모양인가"다[^1]. 여기서 객체는 변수나 배열처럼 메모리에 자리를 차지하는 것을 통틀어 부르는 말이다.

C 변수 다섯 개를 선언한 순서대로 놓는다. 32비트 x86 기계의 눈금은 아래 `정의`의 표에 있다[^2].

```c
char a;
short b;
short c;
int d;
double e;
```

```
번지   0    1    2    3    4    5    6    7    8         12                  20
     +----+----+----+----+----+----+----+----+---------+-------------------+
     | a  |빈칸|    b    |    c    |빈칸|빈칸|    d    |         e         |
     +----+----+----+----+----+----+----+----+---------+-------------------+
```

- `a`는 1바이트다. 0번지에 놓는다.
- `b`는 2바이트이고 2의 배수 번지에서 시작해야 한다. 다음 빈자리는 1번지인데 2의 배수가 아니다. 1번지를 비우고 2번지에 놓는다.
- `c`도 2의 배수 번지가 필요하다. 다음 빈자리 4번지가 마침 2의 배수다.
- `d`는 4의 배수 번지가 필요하다. 다음 빈자리는 6번지다. 6, 7번지를 비우고 8번지에 놓는다.
- `e`는 8바이트지만 이 기계에서는 4의 배수 번지면 된다. 12번지에 놓고 20번지 앞에서 끝난다.

변수 다섯의 크기를 더하면 1 + 2 + 2 + 4 + 8 = 17바이트인데 20바이트를 쓴다. 비워 둔 3바이트(1, 6, 7번지)를 패딩(padding)이라 부른다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 오프셋 0, 2, 4, 8, 12와 끝 20, 패딩 3(같은 규칙을 `ctypes`에 시켜도 같은 값), `double`을 8바이트 정렬로 바꾸면 e가 16번지로 밀림, 선언 순서를 바꿨을 때의 패딩, C 방식 2차원 배열의 칸 번호 $$i \times n + j$$, 카드 C1 — [47_data-alignment_verify.py](/Hongs_Blog/studies/compilers/code/47_data-alignment_verify/)</div>

</div>


## 정의

객체를 메모리에 어떻게 늘어놓고 어떻게 찾아갈지는 컴파일러가 정한다. 객체는 $$N$$바이트 정렬(N-byte alignment)로 놓인다. 객체가 시작하는 번지가 $$N$$의 배수라는 뜻이다. $$N$$은 객체의 타입에 따라 다르다[^3].

**기호로 쓰면.** 타입의 정렬 값을 $$N$$(눈금 간격), 지금까지 채운 다음 빈 번지를 $$p$$라 하면, 객체가 놓이는 번지는 $$p$$ 이상인 가장 작은 $$N$$의 배수다. 그 사이에 비는 바이트 수가 패딩이다[^s1].

$$\text{시작 번지} = \left\lceil \frac{p}{N} \right\rceil \times N, \qquad \text{패딩} = \text{시작 번지} - p$$


$$\lceil\ \rceil$$는 올림이다. `d`를 놓을 때 $$p = 6$$, $$N = 4$$이므로 $$\lceil 6/4 \rceil \times 4 = 8$$번지이고 패딩은 2바이트다.

**32비트 x86 기계에서 C 기본 타입의 크기와 정렬**[^2].

| 타입 | 크기 | 정렬 |
|---|---|---|
| `char` | 1바이트 | 1바이트 |
| `short` | 2바이트 | 2바이트 |
| `int` | 4바이트 | 4바이트 |
| `long` | 4바이트 | 4바이트 |
| `float` | 4바이트 | 4바이트 |
| `double` | 8바이트 | 4바이트 |
| `long long` | 8바이트 | 4바이트 |
| 포인터(종류 무관) | 4바이트 | 4바이트 |

크기와 정렬이 늘 같지는 않다. `double`은 8바이트를 차지하지만 4의 배수 번지에서 시작하면 된다. 이 표는 "32비트 x86에서 흔한 값"이다. 다른 기계나 다른 컴파일러에서는 값이 다를 수 있다[^2].

정렬하는 까닭은 속도다. 값이 눈금에 맞게 놓여 있으면 한 번에 읽고, 눈금에 걸쳐 있으면 더 느리게 읽거나 기계에 따라서는 아예 읽지 못한다[^s2].

## 배열이 놓이는 모양

배열을 메모리에 놓는 법은 언어마다 다르다. 원소 $$n$$개짜리 배열 `A[n]`을 보자[^4].

```
C 방식:      | A[0] | A[1] | A[2] | A[3] | ... | A[n-1] |

Java 방식: | n | A[0] | A[1] | A[2] | A[3] | ... | A[n-1] |
```

- **C 방식.** 원소를 메모리에 연달아 놓는다. 원소마다 그 타입의 정렬을 따른다. 길이는 어디에도 적혀 있지 않다.
- **Java 방식.** 원소를 연달아 놓는 것은 같고, 맨 앞에 길이를 적은 칸이 하나 더 붙는다.

C 방식에서 `A[i]`의 번지는 (배열의 시작 번지) + $$i$$ × (원소 하나의 크기)다. 원소가 연달아 있고 크기가 모두 같아서 곱셈 한 번으로 찾아간다[^s1].

다차원 배열은 흔히 "배열의 배열"로 나타낸다. `A[m][n]`을 보자[^5].

```
C 방식:   | A[0][0] | A[0][1] | ... | A[0][n-1] | A[1][0] | ... | A[1][n-1] | ... | A[m-1][n-1] |

Java 방식:   | m | A[0] | A[1] | ... | A[m-1] |
                    |      |
                    |      +--> | n | A[1][0] | A[1][1] | ... | A[1][n-1] |
                    +---------> | n | A[0][0] | A[0][1] | ... | A[0][n-1] |
```

- **C 방식.** 0번 줄의 원소 $$n$$개, 이어서 1번 줄의 원소 $$n$$개, … 를 한 덩어리로 잇는다. `A[i][j]`는 앞에서부터 $$i \times n + j$$번째 칸이다(0부터 센다)[^s1].
- **Java 방식.** 바깥 배열에는 길이 $$m$$과 안쪽 배열을 가리키는 주소 $$m$$개가 들어 있다. 안쪽 배열은 저마다 따로 떨어진 덩어리이고, 각자 맨 앞에 자기 길이를 갖는다. 덩어리는 모두 $$1 + m$$개다.

## 활용

- 코드 생성기는 여기서 정한 번지를 심벌 테이블에 적어 두고, 변수를 읽고 쓰는 명령을 만들 때 꺼내 쓴다([단순 연산과 분기의 코드 생성](/Hongs_Blog/studies/compilers/codegen-simple-operations/)). 수업의 코드 생성에서는 계산을 쉽게 하려고 모든 객체를 4바이트 정렬로 친다[^6].
- 선언 순서가 크기를 바꾼다. 위 다섯 변수를 `double`, `int`, `short`, `short`, `char` 순서로 놓으면 패딩 없이 17바이트로 끝난다. 반대로 `char`, `int`, `char`, `int`는 크기 합이 10바이트인데 16바이트를 쓴다[^s3].
- Java 방식은 길이 칸이 있어서 실행 중에 인덱스가 범위를 벗어났는지 검사할 수 있다. C 방식은 길이를 모르므로 그런 검사를 하지 못한다[^s3].
- 흔한 실수: 크기를 그냥 더해서 다음 변수의 번지를 구한다. 번지는 늘 정렬 값의 배수로 올린 뒤에 정한다.
- 흔한 실수: `double`의 정렬을 8로 친다. 위 표에서는 4다. 8로 치면 `e`가 12번지가 아니라 16번지에 놓인다. 문제에 주어진 표를 먼저 본다.

## 연결

- 선수: [3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/)(번지가 없는 이름들), [컴파일러의 구조](/Hongs_Blog/studies/compilers/compiler-structure/)(코드 생성기의 자리)
- 런타임 환경의 나머지 두 물음: 함수는 어떤 모양인가 → [활성 트리와 호출 스택](/Hongs_Blog/studies/compilers/activation-tree/), [활성 레코드](/Hongs_Blog/studies/compilers/activation-record/). 어디에 놓는가 → [실행 시 메모리 배치](/Hongs_Blog/studies/compilers/runtime-memory-layout/)
- Java 쪽에서 본 같은 그림(`length`, 안쪽 배열의 길이가 달라도 되는 까닭): [배열](/Hongs_Blog/studies/java/java-array/)
- 타입이 크기와 정렬을 정한다: [타입과 타입 시스템](/Hongs_Blog/studies/compilers/type-system/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 위 표의 기계에서 `char c1; int i; char c2; short s; double d;`를 선언한 순서대로 놓는다. 변수마다 시작 번지, 끝나는 번지, 패딩 바이트 수를 구하라.</summary>

**답:** c1 0번지, i 4번지(1~3번지 비움), c2 8번지, s 10번지(9번지 비움), d 12번지. 20번지 앞에서 끝난다. 패딩은 3 + 1 = 4바이트.<br>
**이유:** 크기 합은 1 + 4 + 1 + 2 + 8 = 16이고 16 + 4 = 20이다. 흔한 오답은 s를 9번지에 두는 것이다. `short`는 2의 배수 번지에서 시작해야 한다. 같은 변수들을 `double`, `int`, `short`, `char`, `char` 순서로 놓으면 패딩 없이 16바이트다[^s3].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 예시에서 `e`가 16번지가 아니라 12번지에 놓이는 까닭은? 16번지에 놓이는 기계라면 표의 어느 칸이 달라야 하는가?</summary>

**답:** 표에서 `double`의 정렬이 4바이트라서, 다음 빈자리 12번지가 이미 4의 배수다. `double`의 정렬이 8바이트인 기계라면 12 다음의 8의 배수인 16번지에 놓이고 12~15번지 4바이트가 패딩이 된다.<br>
**이유:** 시작 번지를 정하는 것은 크기가 아니라 정렬 값이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `int A[3][4]`를 (가) C 방식 (나) Java 방식으로 놓는다. 메모리 덩어리는 각각 몇 개인가? `A[2][1]`을 찾아가는 방법은 어떻게 다른가?</summary>

**답:** (가) 한 덩어리. 원소 12개가 줄 순서대로 이어져 있고 `A[2][1]`은 $$2 \times 4 + 1 = 9$$번째 칸이다(0부터). (나) 덩어리 넷. 바깥 배열 하나와 안쪽 배열 셋이다. 바깥 배열의 2번 칸에서 주소를 읽어 그 안쪽 배열로 간 뒤, 거기서 1번 원소를 읽는다.<br>
**이유:** C 방식은 곱셈으로 칸 번호를 계산해 한 번에 가고, Java 방식은 주소를 한 번 따라간다. Java 방식은 안쪽 배열이 따로 떨어져 있어서 줄마다 길이가 달라도 된다.

</details>


[^1]: 컴파일러 14회 강의 자료 「Lecture14 Code generation part 1」, p.4~5 (높은 수준의 구조를 받치는 런타임 환경, 세 가지 물음)
[^2]: 같은 자료, p.7 (x86 32비트 기계의 C 타입 크기·정렬 표, 다섯 변수의 배치 그림, 패딩)
[^3]: 같은 자료, p.6 (N바이트 정렬의 뜻)
[^4]: 같은 자료, p.8 (C 방식 배열과 Java 방식 배열)
[^5]: 같은 자료, p.9 (다차원 배열)
[^6]: 컴파일러 15회 강의 자료 「Lecture15 Code generation part 2」, p.7 (모든 객체를 4바이트 정렬로 가정), p.10 (변수의 위치는 심벌 테이블에 둔다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 올림을 쓴 식, `A[i]`의 번지 식, 칸 번호 $$i \times n + j$$는 원본에 없다. 식은 슬라이드 p.6의 "시작 번지는 N의 배수"와 p.7의 그림에서, 칸 번호는 p.9의 C 방식 그림(A[0][0], A[0][1], …, A[0][n-1], A[1][0], … 순서)에서 읽었다. 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 정렬하는 까닭은 원본에 없다. 정렬되지 않은 값을 읽을 때의 손해는 기계마다 다르다(Bryant·O'Hallaron, Computer Systems: A Programmer's Perspective 3판, 3.9.3절).
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 선언 순서를 바꾼 예, 길이 칸과 범위 검사 이야기, 카드 C1~C3은 원본에 없다. 수치는 검증 코드로 확인했다. Java가 실행 중에 인덱스 범위를 검사한다는 것은 [배열](/Hongs_Blog/studies/java/java-array/)의 `ArrayIndexOutOfBoundsException`과 같은 이야기다.
{% endraw %}
