---
layout: "note"
title: "조건 점프"
display_title: "조건 점프 (Conditional Jumps)"
kind: "concept"
kind_label: "정의"
num: "31"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Conditional Jump", "Jcond", "Jcc", "조건 분기", "JZ", "JNZ", "JE", "JNE", "JC", "JNC", "JO", "JNO", "JS", "JNS", "JP", "JNP", "JA", "JAE", "JB", "JBE", "JG", "JGE", "JL", "JLE", "JCXZ", "JECXZ"]
description: "갈림길에 선 사람이 신호등을 보고 초록이면 옆길로, 아니면 가던 길로 간다. 이 명령들은 바로 앞 계산이 남긴 표시등을 보고, 조건이 맞으면 다른 줄로 넘어가고 아니면 바로 아래 줄로 간다. 이것으로 \"같으면\", \"크면\", \"0이면\" 같은 갈림을 만든다. 명령 자신은 아무것도 견주…"
prev_url: "/studies/assembly-language/test-cmp/"
prev_title: "TEST와 CMP"
next_url: "/studies/assembly-language/signed-vs-unsigned-jumps/"
next_title: "부호 있는 비교 점프와 부호 없는 비교 점프"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/conditional-jumps/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

갈림길에 선 사람이 신호등을 보고 초록이면 옆길로, 아니면 가던 길로 간다. 이 명령들은 바로 앞 계산이 남긴 표시등을 보고, 조건이 맞으면 다른 줄로 넘어가고 아니면 바로 아래 줄로 간다. 이것으로 "같으면", "크면", "0이면" 같은 갈림을 만든다. 명령 자신은 아무것도 견주지 않는다. 표시등을 켜 줄 계산이 바로 앞에 있어야 하고, 크고 작음을 물을 때는 수를 부호 없이 보는지 부호 있게 보는지에 따라 다른 이름의 명령을 써야 한다.

</div>


## 예시로 보기

[JMP](/Hongs_Blog/studies/assembly-language/jmp-loop/)는 무조건 넘어가고 `LOOP`는 횟수만 센다. "EAX가 EBX보다 크면 이 줄들을 건너뛰어라" 같은 갈림은 둘로는 못 만든다. 고급 언어의 `if`가 하는 일을 할 명령이 필요하다.

갈림은 두 줄로 만든다. 첫 줄이 견주고, 둘째 줄이 갈라 간다.

```asm
    cmp eax,ebx     ; EAX - EBX를 해 보고 플래그만 남긴다
    ja  Larger      ; 부호 없는 수로 EAX가 더 크면 Larger로
```

`CMP`가 플래그([TEST와 CMP](/Hongs_Blog/studies/assembly-language/test-cmp/))를 매기고, `JA`가 그 플래그를 읽는다. EAX = FFFFFFFFh, EBX = 1이라 하자. 부호 없는 수로 보면 4,294,967,295와 1이라 `ja`는 점프한다. 같은 자리에 `jg`를 쓰면 부호 있는 수로 읽는다. FFFFFFFFh는 −1이고 −1은 1보다 크지 않으니 점프하지 않는다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 비교 점프 16개의 플래그 조건을 8비트 두 수의 모든 쌍(65,536쌍)과 16비트 무작위 20,000쌍에서 실제 크고 작음과 대조, 특정 플래그 점프 10개, JECXZ·JCXZ, 예제의 응용 코드(Large, Small, 메모리 값 견주기), 카드 C2·C3 — [31_conditional-jumps_verify.py](/Hongs_Blog/studies/assembly-language/code/31_conditional-jumps_verify/) (파이썬 흉내로 확인. 실제 MASM으로 돌린 것이 아니다)</div>

</div>


## 정의

조건 점프 명령은 레지스터나 플래그가 정해진 조건을 채우면 레이블로 넘어간다. 채우지 못하면 바로 아래 명령으로 간다. 꼴은 `J조건 레이블`이고, 조건 자리에 오는 글자에 따라 수십 가지가 있다. 무엇을 보느냐에 따라 넷으로 묶을 수 있다.

**특정 플래그를 보는 점프.**

| 명령 | 뜻 | 점프하는 때 |
|---|---|---|
| `JZ` | 0이면 | ZF = 1 |
| `JNZ` | 0이 아니면 | ZF = 0 |
| `JC` | 올림이 있으면 | CF = 1 |
| `JNC` | 올림이 없으면 | CF = 0 |
| `JO` | 넘쳤으면 | OF = 1 |
| `JNO` | 안 넘쳤으면 | OF = 0 |
| `JS` | 부호 비트가 1이면 | SF = 1 |
| `JNS` | 부호 비트가 0이면 | SF = 0 |
| `JP` | 1이 짝수 개면 | PF = 1 |
| `JNP` | 1이 홀수 개면 | PF = 0 |

**같은지를 보는 점프.** 아래 표들에서 왼쪽 값은 `CMP`의 첫 피연산자, 오른쪽 값은 둘째 피연산자다.

| 명령 | 뜻 | 점프하는 때 |
|---|---|---|
| `JE` | 같으면 (왼쪽 = 오른쪽) | ZF = 1 |
| `JNE` | 다르면 (왼쪽 ≠ 오른쪽) | ZF = 0 |
| `JCXZ` | CX가 0이면 | CX = 0 |
| `JECXZ` | ECX가 0이면 | ECX = 0 |

**부호 없는 수의 크고 작음.** A는 above(위), B는 below(아래)다.

| 명령 | 같은 명령 | 뜻 | 점프하는 때[^s1] |
|---|---|---|---|
| `JA` | `JNBE` | 왼쪽 > 오른쪽 | CF = 0이고 ZF = 0 |
| `JAE` | `JNB` | 왼쪽 ≥ 오른쪽 | CF = 0 |
| `JB` | `JNAE` | 왼쪽 < 오른쪽 | CF = 1 |
| `JBE` | `JNA` | 왼쪽 ≤ 오른쪽 | CF = 1이거나 ZF = 1 |

**부호 있는 수의 크고 작음.** G는 greater(더 큰), L은 less(더 작은)다.

| 명령 | 같은 명령 | 뜻 | 점프하는 때[^s1] |
|---|---|---|---|
| `JG` | `JNLE` | 왼쪽 > 오른쪽 | ZF = 0이고 SF = OF |
| `JGE` | `JNL` | 왼쪽 ≥ 오른쪽 | SF = OF |
| `JL` | `JNGE` | 왼쪽 < 오른쪽 | SF ≠ OF |
| `JLE` | `JNG` | 왼쪽 ≤ 오른쪽 | ZF = 1이거나 SF ≠ OF |

"같은 명령" 칸은 이름만 다르고 하는 일이 같은 짝이다. `JNBE`는 "아래도 아니고 같지도 않으면"이니 "위면"과 같은 말이다. 플래그 조건이 같은 것끼리도 같은 명령이다. `JE`와 `JZ`는 둘 다 ZF = 1을 보고, `JB`와 `JC`는 둘 다 CF = 1을 본다. 뺄셈 뒤에 "같으면"으로 읽고 싶을 때 `JE`, 다른 연산 뒤에 "0이면"으로 읽고 싶을 때 `JZ`를 쓰면 코드가 뜻대로 읽힌다[^s1].

### 설계 이유

왜 "크면 점프"가 `JA`와 `JG` 둘일까? CPU는 레지스터의 비트가 부호 있는 수인지 모른다. `CMP`는 뺄셈을 한 번 하고 부호 없는 수용 표시(CF)와 부호 있는 수용 표시(SF, OF)를 모두 남긴다. 어느 쪽을 읽을지는 점프 명령의 이름으로 프로그래머가 고른다([부호 있는 비교 점프와 부호 없는 비교 점프](/Hongs_Blog/studies/assembly-language/signed-vs-unsigned-jumps/)).

견주는 일과 갈라 가는 일을 두 명령으로 나눈 덕에, 점프 앞에 `CMP`가 아닌 다른 연산이 와도 된다. `and ax,1` 뒤의 `jz`, `dec ecx` 뒤의 `jnz`처럼 쓴다[^s1].

### 조건 점프인 것과 아닌 것

- 조건 점프다: `jz L1`(ZF를 본다), `jb L1`(CF를 본다), `jecxz L1`(플래그가 아니라 ECX를 본다).
- 조건 점프가 아니다: `jmp L1`(아무것도 보지 않고 늘 넘어간다), `loop L1`(ECX를 줄이는 일까지 한다. 조건 점프는 아무 값도 바꾸지 않는다)[^s1].

### 부호 있는 "작다"가 SF ≠ OF인 까닭

**주장.** $$n$$비트 부호 있는 정수 $$a$$, $$b$$에 `CMP a, b`를 한 뒤, $$a < b$$인 것과 SF ≠ OF인 것은 같은 말이다[^s1].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

8비트로 쓴다. 다른 크기도 128과 256 자리의 수만 바뀐다. 진짜 차를 $$d = a - b$$라 하자. $$a, b$$가 −128부터 127 사이이므로 $$d$$는 −255부터 255 사이다. 경우를 둘로 나눈다.
1. **안 넘친 경우(OF = 0).** $$d$$가 −128부터 127 사이라는 뜻이다. 레지스터에 남는 결과는 $$d$$ 그대로다. 그래서 SF = 1 ⟺ $$d < 0$$ ⟺ $$a < b$$다. OF = 0이므로 SF = 1은 SF ≠ OF와 같다. — 넘침의 정의
2. **넘친 경우(OF = 1).** $$d$$가 127보다 크거나 −128보다 작다. 8비트에는 $$d$$에 256을 더하거나 뺀 값이 남는다. $$d > 127$$이면 남는 값은 $$d - 256$$이고, $$d \le 255$$라서 이 값은 음수다(SF = 1). $$d < -128$$이면 남는 값은 $$d + 256$$이고, $$d \ge -255$$라서 이 값은 양수다(SF = 0). 두 경우 모두 결과의 부호가 $$d$$의 부호와 반대다. — 2의 보수에서 256의 배수는 같은 비트
3. 그래서 넘친 경우에는 SF = 0 ⟺ $$d < 0$$ ⟺ $$a < b$$다. OF = 1이므로 SF = 0은 SF ≠ OF와 같다.
4. 두 경우 모두 $$a < b$$ ⟺ SF ≠ OF다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 1단계에서 "남는 결과는 $$d$$ 그대로"는 어디서 나오는가</summary>

넘침 플래그의 뜻이다. OF = 0은 진짜 답이 그 크기의 부호 있는 수 범위에 들어간다는 표시다([산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/)). 범위에 들어가면 레지스터의 비트를 부호 있게 읽은 값이 진짜 답이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 2단계에서 결과의 부호가 왜 반대로 나오는가</summary>

진짜 차가 범위를 벗어나면 256만큼 어긋난 값이 남는다. 127을 넘은 양수는 256을 빼면 음수가 되고, −128보다 작은 음수는 256을 더하면 양수가 된다. $$d$$가 −255와 255 사이라서 한 번 어긋나면 반드시 반대쪽 부호로 넘어간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 이 결과에서 `JGE`의 조건 SF = OF는 어떻게 나오는가</summary>

$$a \ge b$$는 $$a < b$$의 반대다. SF ≠ OF의 반대는 SF = OF다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

결과의 부호(SF)는 "진짜 차가 음수인가"를 알려 주려는 것이고, 넘침(OF)은 "그 부호가 거짓말인가"를 알려 준다. 둘을 XOR 하면 거짓말을 바로잡은 진짜 부호가 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

부호 없는 수의 "작다"가 CF = 1인 것도 같은 식으로 보인다. $$a < b$$면 뺄셈이 윗자리에서 빌려 와야 하고, 빌림이 곧 CF다. 여기서는 거짓말을 바로잡을 일이 없어서 플래그 하나로 끝난다.

</details>


## 예제

**응용 다섯.** 견주는 줄과 갈라 가는 줄이 짝을 이룬다.

부호 없는 수로 EAX가 EBX보다 크면, 부호 있는 수로 크면.

```asm
    cmp eax,ebx
    ja  Larger          ; 부호 없이

    cmp eax,ebx
    jg  Greater         ; 부호 있게
```

EAX가 `Val1` 이하면.

```asm
    cmp eax,Val1
    jbe L1              ; 부호 없이 (below or equal)

    cmp eax,Val1
    jle L1              ; 부호 있게
```

부호 없는 AX와 BX 중 큰 쪽을 `Large`에 넣는다. 먼저 BX를 넣어 두고, AX가 더 클 때만 덮어쓴다.

```asm
    mov Large,bx
    cmp ax,bx
    jna Next            ; AX가 더 크지 않으면 건너뛴다
    mov Large,ax
Next:
```

부호 있는 AX와 BX 중 작은 쪽을 `Small`에 넣는다.

```asm
    mov Small,ax
    cmp bx,ax
    jnl Next            ; BX가 더 작지 않으면 건너뛴다
    mov Small,bx
Next:
```

메모리에 있는 값을 바로 견준다. 크기를 알려 주려고 `PTR`을 쓴다([OFFSET과 PTR 연산자](/Hongs_Blog/studies/assembly-language/offset-ptr-operators/)).

```asm
    cmp WORD PTR [esi],0
    je  L1              ; ESI가 가리키는 16비트 값이 0이면

    test DWORD PTR [edi],1
    jz  L2              ; EDI가 가리키는 32비트 값이 짝수면
```

**플래그까지 따라가기.** AL = 90h, BL = 20h에서 `cmp al,bl`을 한다[^s1].

| 해 보는 뺄셈 | 결과 | ZF | CF | SF | OF |
|---|---|---|---|---|---|
| 90h − 20h | 70h | 0 | 0 | 0 | 1 |

부호 없는 수로는 144와 32다. CF = 0, ZF = 0이라 `ja`가 점프한다. 부호 있는 수로는 −112와 32다. 결과 70h는 양수처럼 보이지만(SF = 0) 넘쳤다(OF = 1). SF ≠ OF라 `jl`이 점프한다. `jg`와 `jb`는 점프하지 않는다.

**경계 사례: 같을 때.** `cmp al,bl`에서 두 값이 같으면 ZF = 1, CF = 0, SF = OF = 0이다. 이때 `jae`, `jbe`, `jge`, `jle`는 점프하고 `ja`, `jb`, `jg`, `jl`은 점프하지 않는다. "이상"과 "초과"를 가르는 것이 ZF다[^s1].

**JECXZ의 쓰임.** `LOOP`는 ECX가 0으로 시작하면 40억 번을 돈다([JMP와 LOOP](/Hongs_Blog/studies/assembly-language/jmp-loop/)). 루프 바로 앞에 `jecxz`를 두면 ECX가 0일 때 루프를 통째로 건너뛴다[^s1].

```asm
    jecxz Done          ; 돌 것이 없으면 건너뛴다
L1: ...
    loop L1
Done:
```

## 활용

- 고급 언어의 `if`, `while`은 모두 `CMP`와 조건 점프의 조합으로 옮긴다([조건 구조를 점프로 옮기기](/Hongs_Blog/studies/assembly-language/conditional-structures/)). 컴파일러가 하는 일이 이것이다([단순 연산과 분기의 코드 생성](/Hongs_Blog/studies/compilers/codegen-simple-operations/)).
- 답을 플래그로 돌려주는 프로시저 뒤에도 쓴다. `IsDigit`은 AL이 숫자 글자면 ZF를 1로 만든다([Irvine32 라이브러리](/Hongs_Blog/studies/assembly-language/irvine32-library/)). `call IsDigit` 뒤에 `jz`를 붙인다.
- 흔한 실수: 부호 있는 값에 `JA`·`JB`를, 부호 없는 값(주소, 개수, 글자 코드)에 `JG`·`JL`을 쓴다. 두 값의 맨 위 비트가 서로 다를 때만 틀려서 시험해 봐도 잘 안 드러난다.
- 흔한 실수: `CMP`와 점프 사이에 `ADD`나 `INC`를 넣는다. 점프는 가장 마지막에 매겨진 플래그를 본다.
- 흔한 실수: `cmp eax,ebx` 뒤의 `jb`를 "EBX가 작으면"으로 읽는다. 늘 왼쪽(첫 피연산자)이 주어다.

## 연결

- 선수: [TEST와 CMP](/Hongs_Blog/studies/assembly-language/test-cmp/), [JMP와 LOOP](/Hongs_Blog/studies/assembly-language/jmp-loop/)
- 두 묶음을 가려 쓰기: [부호 있는 비교 점프와 부호 없는 비교 점프](/Hongs_Blog/studies/assembly-language/signed-vs-unsigned-jumps/)
- 횟수와 조건을 한꺼번에 보는 반복: [조건부 반복 명령](/Hongs_Blog/studies/assembly-language/conditional-loop-instructions/)
- 상태마다 글자를 보고 갈라 가는 프로그램: [유한 상태 기계](/Hongs_Blog/studies/assembly-language/asm-finite-state-machine/)
- 다른 기계의 조건 분기 명령: [코드 생성용 MIPS 명령어](/Hongs_Blog/studies/compilers/mips-instructions/)
- Java의 `if`와 비교 연산자: [제어문](/Hongs_Blog/studies/java/java-control-flow/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"조건 점프가 두 값을 견준다"</div>

틀렸다. 조건 점프는 피연산자가 레이블 하나뿐이고, 값은 보지도 않는다. 그 순간의 플래그만 읽는다. `cmp eax,ebx` / `ja L1`을 늘 붙여 쓰다 보니 `ja`가 EAX와 EBX를 견준다고 느끼기 쉽다. 실제로 견준 것은 `cmp`다. 확인하는 법: 둘 사이에 `add ecx,1`을 끼우면 `ja`는 EAX와 EBX가 아니라 그 덧셈의 플래그를 보고 움직인다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"부호 있는 수의 '작다'는 뺀 결과가 음수인지(SF)만 보면 된다"</div>

틀렸다. 뺄셈이 넘치면 결과의 부호가 뒤집혀 나온다. 넘치지 않는 수로만 시험하면 SF만 봐도 맞아서 그럴듯해 보인다. 8비트에서 −128과 1을 견주면 80h − 01h = 7Fh로 SF = 0이지만 −128이 더 작다. 8비트 두 수의 65,536쌍 가운데 16,384쌍(넷 중 하나)에서 SF만 본 답이 틀린다. 그래서 `JL`은 SF ≠ OF를 본다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 부호 없는 수의 >, ≥, <, ≤와 부호 있는 수의 >, ≥, <, ≤에 쓰는 점프 명령 여덟 개를 쓰라.</summary>

**답:** 부호 없는 수: `JA`, `JAE`, `JB`, `JBE`. 부호 있는 수: `JG`, `JGE`, `JL`, `JLE`.<br>
**이유:** above·below는 부호 없는 수, greater·less는 부호 있는 수다. 같다와 다르다(`JE`, `JNE`)는 두 쪽에 함께 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `mov al,90h` / `mov bl,20h` / `cmp al,bl` 뒤에 `ja`, `jb`, `jg`, `jl`, `je` 가운데 점프하는 것을 모두 고르라. ZF, CF, SF, OF도 쓰라.</summary>

**답:** 90h − 20h = 70h. ZF = 0, CF = 0, SF = 0, OF = 1. 점프하는 것은 `ja`와 `jl`.<br>
**이유:** 부호 없이 144 > 32라 `ja`. 부호 있게 −112 < 32라 `jl`. 결과 70h가 양수라고 `jg`를 고르면 틀린다. 넘쳐서 부호가 뒤집힌 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 증명에서 넘친 경우(OF = 1) "결과의 부호가 진짜 차의 부호와 반대"라고 했다. 이 말은 어디서 나오는가?</summary>

**답:** 넘쳤다는 것은 진짜 차 $$d$$가 −128~127을 벗어났다는 뜻이다. 8비트에는 $$d$$에서 256을 빼거나 더한 값이 남는다. $$d$$는 −255~255 사이라서 127보다 큰 $$d$$는 256을 빼면 음수가 되고, −128보다 작은 $$d$$는 256을 더하면 양수가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** `JE`와 `JZ`는 같은 명령인데 왜 이름이 둘인가? 어느 때 어느 이름을 쓰는가?</summary>

**답:** 둘 다 ZF = 1이면 점프한다. `CMP` 뒤에서는 "두 값이 같으면"으로 읽히도록 `JE`를, `AND`·`TEST`·`DEC` 같은 연산 뒤에서는 "결과가 0이면"으로 읽히도록 `JZ`를 쓴다. 기계어는 같고, 읽는 사람을 위한 이름이다.

</details>


[^s1]: 플래그 조건은 Intel 64 and IA-32 Architectures Software Developer's Manual 2권의 Jcc 항목을 따랐고, 8비트 두 수의 모든 쌍에서 CMP 뒤 플래그로 계산한 조건이 실제 크고 작음과 맞는지 전수 검사했다. 모두 검증 코드로 확인했다.
{% endraw %}
