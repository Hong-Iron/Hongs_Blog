---
layout: "note"
title: "함수 호출의 코드 생성"
display_title: "함수 호출의 코드 생성 (Code Generation for Function Calls)"
kind: "concept"
kind_label: "알고리즘"
num: "53"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
updated: "2026-10-12"
status: "verified"
aliases: ["Code Generation for Function Calls", "함수 호출 코드 생성", "호출 시퀀스", "Calling Sequence", "반환 시퀀스", "Return Sequence", "프롤로그", "Prologue", "에필로그", "Epilogue", "jr", "$ra"]
description: "남의 작업실을 빌려 쓸 때는 들어가기 전에 내 짐을 표시해 두고, 쓸 재료를 올려놓고, 끝나면 모두 치워서 처음 모습으로 돌려놓아야 한다. 함수를 부르는 코드도 그렇다. 부르기 전에 스택에 돌려받을 값의 칸, 넘겨줄 값, 부른 쪽 자리의 위치, 돌아올 곳, 불린 함수가 쓸 칸을 차…"
prev_url: "/studies/compilers/codegen-simple-operations/"
prev_title: "단순 연산과 분기의 코드 생성"
next_url: "/studies/compilers/register-interference-graph/"
next_title: "레지스터 간섭 그래프"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/codegen-function-call/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

남의 작업실을 빌려 쓸 때는 들어가기 전에 내 짐을 표시해 두고, 쓸 재료를 올려놓고, 끝나면 모두 치워서 처음 모습으로 돌려놓아야 한다. 함수를 부르는 코드도 그렇다. 부르기 전에 스택에 돌려받을 값의 칸, 넘겨줄 값, 부른 쪽 자리의 위치, 돌아올 곳, 불린 함수가 쓸 칸을 차례로 쌓는다. 함수가 끝나면 돌아올 곳을 되찾고 스택 꼭대기 표시를 처음 자리로 옮긴다. 칸을 하나씩 지우는 것이 아니라 표시만 옮긴다. 쌓은 순서와 칸 수를 한 칸이라도 틀리게 세면 엉뚱한 칸을 읽고, 엉뚱한 곳으로 돌아간다.

</div>


## 예시로 보기

[단순 연산과 분기의 코드 생성](/Hongs_Blog/studies/compilers/codegen-simple-operations/)에서 옮긴 줄들은 지금 도는 함수의 레코드 안에서만 일했다. 함수를 부르는 줄은 다르다. [활성 레코드](/Hongs_Blog/studies/compilers/activation-record/)를 새로 하나 쌓아야 하고, 끝나면 걷어야 한다. 레코드를 "쌓는다"는 말을 명령으로 풀면 무엇이 되는지가 이 문서의 내용이다.

슬라이드의 3주소 코드다. `main`이 `foo`를 인자 3으로 부르고 결과를 b에 받는다[^1].

```
begin foo                begin main
  t0 = a + 1               ...
  return t0                param 3
end foo                    b = call foo, 1
                           ...
                         end main
```

부르기 전의 스택이다. 번지를 숫자로 적어 따라가기 쉽게 했다. `main`의 b가 1004번지에 있고, `$sp`는 그 아래 빈칸 1000번지를 가리킨다[^s1].

```
            (부르기 전)                        (foo가 도는 중)

 1004 |  b               |            1004 |  b               | <--+
      +------------------+                 +------------------+    |
 1000 |  (빈칸)          | <-- $sp    1000 |  반환값 칸        |    |
  996 |                  |             996 |  a = 3           |    |
  992 |                  |             992 |  제어 링크 = 1004-+----+
  988 |                  |             988 |  돌아갈 주소      |
  984 |                  |             984 |  t0              |
  980 |                  |             980 |  (빈칸)          | <-- $sp
```

오른쪽 그림의 다섯 칸(1000~984번지)이 `foo`의 활성 레코드다. 칸의 순서는 [활성 레코드](/Hongs_Blog/studies/compilers/activation-record/)에서 정한 그대로다. 한 칸을 쌓는 방법은 늘 같다. `$sp`가 가리키는 빈칸에 값을 넣고, `$sp`에서 4를 뺀다. 스택이 낮은 번지 쪽으로 자라기 때문에 빼는 것이 "올리는" 것이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 아래 명령들을 파이썬 흉내기로 돌려 걸음마다의 `$sp`(996, 992, 988, 984, 980)와 칸의 값, `foo` 안의 오프셋 4, 8, 12, 16, 20, 끝난 뒤 `$sp = 1000`, 반환값 4, `b = 4`를 확인. 같은 틀로 14회의 재귀 `fib`를 옮겨 $$n = 0 \sim 10$$에서 피보나치 수와 같고 `$sp`가 제자리로 돌아오며 스택이 $$40 \times \max(n, 1)$$바이트까지 자람. 카드 C2 — [53_codegen-function-call_impl.py](/Hongs_Blog/studies/compilers/code/53_codegen-function-call_impl/). 실제 MIPS 어셈블러로 돌린 것이 아니다.</div>

</div>


## 부를 때: 레코드를 쌓는다

`main`에서 `foo`를 부를 때 `foo`의 레코드를 스택에 쌓는다[^2].

| 걸음 | 하는 일 | 명령 | 뒤의 `$sp` | 새로 찬 칸 |
|---|---|---|---|---|
| 1 | 반환값 칸을 만든다 | `subi $sp $sp 4` | 996 | 1000번지 (비어 있음) |
| 2 | 인자를 넣는다 | `li $r0 3` / `sw $r0 0($sp)` / `subi $sp $sp 4` | 992 | 996번지 = 3 |
| 3 | 제어 링크를 넣는다 | `addi $r0 $sp 12` / `sw $r0 0($sp)` / `subi $sp $sp 4` | 988 | 992번지 = 1004 |
| 4 | 돌아갈 주소를 넣는다 | `sw $ra 0($sp)` / `subi $sp $sp 4` | 984 | 988번지 = `$ra`의 값 |
| 5 | 지역 변수 칸을 만든다 | `subi $sp $sp 4` | 980 | 984번지 (t0의 자리) |

- 1걸음은 값을 넣지 않고 칸만 비워 둔다. `foo`가 끝날 때 채운다.
- 3걸음의 12는 계산해서 나온 수다. 이때 `$sp`는 992이고, 그 위로 인자 칸(996), 반환값 칸(1000), 그리고 `main`의 마지막 칸 b(1004)가 있다. 세 칸 위이므로 4 × 3 = 12다. 슬라이드는 이 값을 "`main`의 활성 레코드의 시작 주소"라 부른다.
- 4걸음의 `$ra`는 돌아갈 주소를 담는 레지스터다.
- 5걸음에서 몇 칸을 만들지는 `foo`가 쓰는 변수를 적어 둔 심벌 테이블을 보고 정한다. `foo`는 t0 하나라 4바이트다.

슬라이드에는 `foo`의 첫 명령으로 뛰는 명령이 나오지 않는다. 실제 MIPS에서는 `jal foo`가 돌아올 주소를 `$ra`에 넣고 뛴다[^s2].

## 도는 동안: 자기 레코드의 칸을 읽고 쓴다

`foo` 안에서 `$sp`는 980이다. 레코드의 칸은 `$sp`에서 이만큼 떨어져 있다[^3].

| 칸 | 오프셋 | 번지 |
|---|---|---|
| t0 | 4 | 984 |
| 돌아갈 주소 | 8 | 988 |
| 제어 링크 | 12 | 992 |
| a | 16 | 996 |
| 반환값 칸 | 20 | 1000 |

`t0 = a + 1`은 [단순 연산](/Hongs_Blog/studies/compilers/codegen-simple-operations/)의 규칙 그대로이고, `return t0`는 t0를 반환값 칸에 옮기는 것이다.

```
lw   $r0 16($sp)     # a (= 3)를 꺼낸다
addi $r1 $r0 1       # 3 + 1
sw   $r1 4($sp)      # t0 = 4

lw   $r0 4($sp)      # t0를 꺼낸다
sw   $r0 20($sp)     # 반환값 칸 = 4
```

## 끝날 때: 레코드를 걷고 돌아간다

`foo`가 끝나면 세 가지를 한다[^4].

| 걸음 | 하는 일 | 명령 | 뒤의 상태 |
|---|---|---|---|
| 1 | 기계 상태를 되찾는다 | `lw $ra 8($sp)` | `$ra` = 돌아갈 주소 |
| 2 | 레코드를 걷는다 | `lw $r0 12($sp)` / `subi $sp $r0 4` | `$r0` = 1004, `$sp` = 1000 |
| 3 | 돌아가서 하던 일을 한다 | `jr $ra` / `lw $r0 0($sp)` / `sw $r0 4($sp)` | `$r0` = 4, b = 4 |

- 2걸음은 칸을 지우지 않는다. `$sp`를 제어 링크가 가리키는 곳 바로 아래로 옮길 뿐이다. 제어 링크에 1004가 들어 있으므로 `$sp`는 1004 − 4 = 1000이 된다. 부르기 전과 같다.
- 3걸음의 `jr $ra`는 `$ra`에 든 주소로 뛴다. 뒤의 두 줄은 `main`으로 돌아온 뒤 실행되는 `main`의 명령이다. `$sp`(1000번지)에 반환값 4가 남아 있으므로 `0($sp)`에서 꺼내, b의 자리인 `4($sp)`에 넣는다.

### 정확성: 부르기 전과 후의 `$sp`가 같다

**주장.** 인자가 $$p$$개, 지역·임시 변수가 $$L$$개인 함수를 위 틀로 부르면, 돌아온 직후의 `$sp`는 부르기 직전의 `$sp`와 같고, 그 번지에 반환값이 들어 있다[^s3].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

부르기 직전의 `$sp`를 $$S$$라 하자. 부른 쪽 레코드의 마지막 칸은 $$S + 4$$번지다.
1. **쌓은 뒤의 `$sp`.** 반환값 1칸, 인자 $$p$$칸, 제어 링크 1칸, 돌아갈 주소 1칸, 지역 변수 $$L$$칸을 쌓는다. 칸마다 4를 빼므로 `$sp` $$= S - 4(p + L + 3)$$이다. — 칸 수 세기
2. **제어 링크의 값.** 제어 링크를 넣는 순간에는 반환값 칸과 인자 $$p$$칸만 쌓였다. `$sp` $$= S - 4(p + 1)$$이다. 여기에 $$4(p + 2)$$를 더하면 $$S + 4$$다. 예에서는 $$p = 1$$이라 12를 더했다. — 대입
3. **칸의 오프셋.** 1의 `$sp`에서 위로 세면 지역 변수가 $$4, \dots, 4L$$, 돌아갈 주소가 $$4L + 4$$, 제어 링크가 $$4L + 8$$, 인자가 $$4L + 12$$부터, 반환값 칸이 $$4L + 12 + 4p$$다. 반환값 칸의 번지는 $$S - 4(p + L + 3) + 4L + 12 + 4p = S$$다. — 대입
4. **걷은 뒤의 `$sp`.** 오프셋 $$4L + 8$$에서 제어 링크 $$S + 4$$를 꺼내 4를 빼면 `$sp` $$= S$$다. 3에서 반환값 칸이 $$S$$번지였으므로 `0($sp)`가 반환값이다. — 2와 3
5. **불린 함수가 또 함수를 불러도 된다.** 불린 함수가 안에서 다른 함수를 부르고 돌아오면, 귀납 가정으로 그 앞뒤의 `$sp`가 같다. 그러면 불린 함수 자신의 오프셋 계산(3)이 그대로 맞는다. 호출이 겹친 깊이에 대한 귀납법이다. — 수학적 귀납법 ∎

</details>


$$p = 1$$, $$L = 1$$을 넣으면 오프셋이 4, 8, 12, 16, 20이고 제어 링크에 더하는 수가 12다. 위 예와 같다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 2단계에서 더하는 수가 왜 $$4(p + 1)$$이 아니라 $$4(p + 2)$$인가?</summary>

$$4(p + 1)$$을 더하면 $$S$$, 곧 반환값 칸의 번지가 된다. 슬라이드의 제어 링크는 그보다 한 칸 위, 부른 쪽 레코드의 마지막 칸($$S + 4$$)을 가리킨다. 한 칸이 4바이트라 4가 더 붙는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 4단계에서 `$sp`에 제어 링크를 그대로 넣지 않고 4를 빼는 까닭은?</summary>

`$sp`는 "꼭대기 바로 다음 빈칸"을 가리키기로 했다. 제어 링크는 부른 쪽의 마지막 찬 칸($$S + 4$$)을 가리킨다. 그 바로 아래 칸이 $$S$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 5단계가 없으면 무엇을 보장하지 못하는가?</summary>

재귀처럼 불린 함수 안에서 호출이 또 일어나는 경우다. 안쪽 호출이 `$sp`를 제자리에 돌려놓지 않으면 바깥 함수가 `16($sp)`로 자기 인자를 찾을 때 다른 칸을 읽는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">4. 돌아갈 주소를 `$ra`에 두기만 하면 안 되고 레코드에 적어 뒀다가 되찾는 까닭은?</summary>

불린 함수가 또 함수를 부르면 `$ra`에 새 돌아갈 주소가 들어가 앞의 것이 지워진다. 레코드에 적어 두면 호출마다 자기 것을 되찾을 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

쌓은 칸 수를 세어 오프셋을 식으로 적고, 걷을 때 그 식이 처음 값으로 돌아가는지 대입해 본다. 겹친 호출은 "안쪽 호출이 `$sp`를 제자리에 돌려놓는다"를 귀납 가정으로 삼는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

x86의 프로시저도 들어올 때 프레임을 만들고 나갈 때 걷으며, "들어올 때와 나갈 때의 스택 꼭대기가 같아야 한다"를 똑같이 지킨다([스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/)). `PUSH`와 `POP`의 짝이 맞아야 한다는 것도 같은 이야기다.

</details>


## 활용

- 구현: [53_codegen-function-call_impl.py](/Hongs_Blog/studies/compilers/code/53_codegen-function-call_impl/). 연습: [코드 생성 연습](/Hongs_Blog/studies/compilers/codegen-practice/)
- 비용: 호출 한 번에 레코드의 칸 수에 비례하는 명령이 든다. 이 예는 `foo`의 몸통이 다섯 명령인데 부르는 데 열 명령, 돌아오는 데 여섯 명령이 든다. 작은 함수를 자주 부르면 부르는 값이 더 크다[^s3].
- 인자를 넣는 동안 `$sp`가 움직인다. 반환값 칸을 만든 뒤에 지역 변수를 인자로 넣으려면, 그 변수의 오프셋에 그동안 뺀 만큼(4, 8, …)을 더해야 한다[^s3].
- 흔한 실수: 스택에 올리는데 `addi $sp $sp 4`를 쓴다. 스택은 낮은 번지 쪽으로 자라므로 올릴 때 뺀다.
- 흔한 실수: `foo` 안의 오프셋을 `main` 기준으로 센다. 오프셋은 늘 지금의 `$sp`에서 센다. `foo` 안에서 a는 `16($sp)`이고, `main`으로 돌아온 뒤 b는 `4($sp)`다.
- 흔한 실수: 걷을 때 `lw $ra`보다 `subi $sp`를 먼저 한다. `$sp`를 옮기고 나면 `8($sp)`는 더는 돌아갈 주소 칸이 아니다.

## 연결

- 선수: [활성 레코드](/Hongs_Blog/studies/compilers/activation-record/)(쌓는 칸의 종류와 순서), [수업용 MIPS 명령어](/Hongs_Blog/studies/compilers/mips-instructions/), [단순 연산과 분기의 코드 생성](/Hongs_Blog/studies/compilers/codegen-simple-operations/)
- x86에서 같은 일: `CALL`이 돌아갈 주소를 스택에 올리고 `RET`이 꺼내서 뛴다([프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/)). 프레임을 여닫는 명령과 `[EBP+8]` 같은 오프셋은 [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/)에 있다. 인자를 누가 어떤 순서로 넣고 누가 치우는지는 [호출 규약](/Hongs_Blog/studies/assembly-language/calling-convention/)이 정한다. 여기서는 슬라이드의 한 가지 약속만 쓴다[^s2].
- 이 방식이 낳는 헛된 꺼내 오기·넣어 두기를 줄이는 길: [그래프 색칠 레지스터 할당](/Hongs_Blog/studies/compilers/graph-coloring-register-allocation/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"레코드를 걷으려면 쌓은 칸을 하나씩 꺼내야 한다"</div>

틀렸다. `$sp` 하나만 옮기면 끝난다. 쌓을 때 칸마다 `sw`와 `subi`를 했으니 걷을 때도 칸마다 무언가 해야 할 것 같다. 하지만 스택에서 "있다"와 "없다"를 가르는 것은 `$sp`의 위치뿐이다. `$sp`보다 낮은 번지는 빈칸으로 친다. 확인하는 법: 걷는 명령은 `lw $r0 12($sp)` / `subi $sp $r0 4` 둘뿐이고, 그 뒤 `$sp`는 1000이다. 984~996번지의 값은 그대로 남아 있지만 다음 호출이 덮어쓴다. 되찾아야 하는 것은 `$ra`처럼 레지스터에 다시 넣어야 하는 값뿐이다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"오프셋은 변수마다 정해진 수다"</div>

틀렸다. 오프셋은 "지금의 `$sp`에서 얼마나 떨어졌는가"라서 `$sp`가 움직이면 같은 칸의 오프셋도 바뀐다. 한 함수 안에서는 `$sp`가 거의 움직이지 않아 고정된 수처럼 보인다. 확인하는 법: 반환값 칸(1000번지)은 `foo` 안에서는 `20($sp)`이고, `main`으로 돌아온 뒤에는 `0($sp)`다. b(1004번지)는 `main`에서 `4($sp)`인데, 3걸음에서 제어 링크를 계산할 때는 `12($sp)` 자리다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 함수를 부를 때 스택에 쌓는 다섯 가지를 쌓는 순서대로 쓰고, 한 칸을 쌓는 명령 두 줄을 쓰라.</summary>

**답:** 반환값 칸 → 입력 인자 → 제어 링크 → 돌아갈 주소(기계 상태) → 지역·임시 변수 칸. 한 칸 쌓기: `sw (레지스터) 0($sp)` / `subi $sp $sp 4`. 값 없이 칸만 만들 때는 `subi`만 한다.<br>
**이유:** 순서는 활성 레코드의 칸 순서(높은 번지부터)와 같다. 부른 쪽이 읽어야 하는 반환값 칸이 부른 쪽 레코드에 가장 가깝다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 인자가 없고 지역 변수가 t0, t1 둘인 함수 `g`를 같은 틀로 부른다. 제어 링크를 넣을 때 `$sp`에 더하는 수는? `g` 안에서 t0, t1, 돌아갈 주소, 제어 링크, 반환값 칸의 오프셋을 쓰라. 걷는 명령 셋도 쓰라.</summary>

**답:** 더하는 수는 8. t0 `8($sp)`, t1 `4($sp)`, 돌아갈 주소 `12($sp)`, 제어 링크 `16($sp)`, 반환값 칸 `20($sp)`. 걷기: `lw $ra 12($sp)` / `lw $r0 16($sp)` / `subi $sp $r0 4`.<br>
**이유:** $$p = 0$$, $$L = 2$$다. 제어 링크를 넣는 순간 쌓인 것은 반환값 칸 하나뿐이라 $$4(0 + 2) = 8$$이다. 지역 변수 두 칸 위에 돌아갈 주소($$4L + 4 = 12$$), 그 위에 제어 링크($$4L + 8 = 16$$), 인자가 없으니 바로 그 위가 반환값 칸($$4L + 12 = 20$$)이다. 지역 변수 칸은 먼저 선언한 t0가 더 높은 번지라고 쳤다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `lw $r0 12($sp)` / `subi $sp $r0 4` 두 줄이 하는 일을 한 문장으로 쓰라.</summary>

**답:** 레코드에 적어 둔 제어 링크(부른 쪽 레코드의 마지막 칸 번지)를 꺼내 그 바로 아래 칸으로 `$sp`를 옮겨, 불린 함수의 레코드를 통째로 걷는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** `foo` 안에서 인자 a를 `16($sp)`로 읽는다. 16은 어디서 나오는가? `foo`의 지역 변수가 둘이었다면 얼마인가?</summary>

**답:** a 칸 아래에 제어 링크, 돌아갈 주소, t0의 세 칸이 있고, `$sp`는 그 아래 빈칸을 가리킨다. 빈칸에서 네 칸 위이므로 4 × 4 = 16이다. 지역 변수가 둘이면 한 칸이 더 끼어 20이다.<br>
**이유:** 인자는 지역 변수보다 먼저(높은 번지에) 쌓였다. 그래서 불린 함수의 지역 변수가 늘면 인자의 오프셋도 같이 커진다. 흔한 오답은 "첫 인자니까 4"다.

</details>


[^1]: 컴파일러 15회 강의 자료 「Lecture15 Code generation part 2」, p.19 (foo와 main의 3주소 코드, 부르기 전의 스택)
[^2]: 같은 자료, p.20 (반환값 칸), p.21 (인자), p.22 (제어 링크), p.23 (돌아갈 주소와 $ra), p.24 (지역 변수 칸, 심벌 테이블)
[^3]: 같은 자료, p.25 (foo가 도는 동안: t0 = a + 1, 반환값 넣기)
[^4]: 같은 자료, p.26 (기계 상태 되찾기), p.27 (레코드 걷기: $sp만 옮긴다), p.28 (돌아가서 반환값을 b에 옮긴다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 번지 1004, 1000, …, 980은 원본에 없다. 슬라이드는 번지 없이 화살표로 그린다. 걸음마다의 `$sp`와 칸의 값은 구현 코드의 흉내기가 돌려 확인한 것이다. 스택 그림 둘은 슬라이드 p.19와 p.25의 그림을 글자로 옮겼다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `jal` 이야기와 x86과의 비교는 원본에 없다. `jal`이 돌아올 주소를 `$ra`에 넣고 뛰는 것은 실제 MIPS 명령의 뜻이다(Patterson·Hennessy, Computer Organization and Design, MIPS판 2장). 구현 코드는 인자를 넣은 바로 뒤에 `jal`을 두고 돌렸다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 인자 $$p$$개·지역 변수 $$L$$개로 넓힌 식과 증명, 스스로 설명해 보기, 명령 수 비교, 인자를 넣는 동안 오프셋이 밀리는 이야기, 오해 두 항목, 카드 C1~C4는 원본에 없다. 슬라이드는 $$p = 1$$, $$L = 1$$인 예 하나만 보인다. 넓힌 틀로 재귀 `fib`($$p = 1$$, $$L = 6$$)와 카드 C2의 함수($$p = 0$$, $$L = 2$$)를 흉내기로 돌려 확인했다.
{% endraw %}
