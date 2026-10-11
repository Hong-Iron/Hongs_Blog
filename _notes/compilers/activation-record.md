---
layout: "note"
title: "활성 레코드"
display_title: "활성 레코드 (Activation Record)"
kind: "concept"
kind_label: "자료구조"
num: "49"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
updated: "2026-10-12"
status: "verified"
aliases: ["Activation Record", "활성 레코드", "활성화 레코드", "Stack Frame", "스택 프레임", "Control Link", "제어 링크", "Return Address", "반환 주소", "복귀 주소", "Saved Machine Status", "저장된 기계 상태"]
description: "식당 주방에 주문이 들어올 때마다 쪽지를 한 장씩 꽂아 둔다. 쪽지에는 무엇을 만들지, 어느 자리로 내갈지, 만드는 동안의 메모가 적혀 있고, 음식이 나가면 쪽지를 뺀다. 함수도 부를 때마다 이런 쪽지 한 장을 스택에 올린다. 받은 값, 돌려줄 값을 적을 칸, 끝나면 돌아갈 자리,…"
prev_url: "/studies/compilers/activation-tree/"
prev_title: "활성 트리와 호출 스택"
next_url: "/studies/compilers/runtime-memory-layout/"
next_title: "실행 시 메모리 배치"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/activation-record/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

식당 주방에 주문이 들어올 때마다 쪽지를 한 장씩 꽂아 둔다. 쪽지에는 무엇을 만들지, 어느 자리로 내갈지, 만드는 동안의 메모가 적혀 있고, 음식이 나가면 쪽지를 뺀다. 함수도 부를 때마다 이런 쪽지 한 장을 스택에 올린다. 받은 값, 돌려줄 값을 적을 칸, 끝나면 돌아갈 자리, 부른 쪽의 쪽지가 어디 있는지, 계산하면서 쓸 칸이 들어 있다. 같은 함수를 여러 번 부르면 쪽지도 여러 장이라 값이 서로 섞이지 않는다. 대신 부를 때마다 쪽지를 만들고 치우는 일이 들고, 함수가 끝나면 쪽지에 적은 값은 사라진다.

</div>


## 예시로 보기

[활성 트리와 호출 스택](/Hongs_Blog/studies/compilers/activation-tree/)에서 함수를 한 번 부른 것(활성)마다 스택에 무언가를 올린다는 것까지 정했다. 무엇을 올려야 할까. `fib(3)`이 `fib(2)`를 부른 동안 `fib(3)`의 `n`은 3으로 남아 있어야 하고, `fib(2)`의 `n`은 2여야 한다. 변수 `n`의 자리가 하나뿐이면 덮어써진다. 활성마다 자기 `n`을 둘 자리가 따로 있어야 한다. 끝나면 어디로 돌아갈지도 활성마다 다르다.

슬라이드의 예다. 왼쪽 C 코드를 3주소 코드로 옮긴 것이 오른쪽이다[^1].

```
int fib(int n) {                         begin fib              begin main
    if (n <= 1) return n;                  t0 = n <= 1            param 1
    return fib(n - 1) + fib(n - 2);        if t0 goto L0          t0 = call fib, 1
}                                          t1 = n - 1             a = t0
int main() {                               param t1             end main
    int a = fib(1);                        t2 = call fib, 1
}                                          t3 = n - 2
                                           param t3
                                           t4 = call fib, 1
                                           t5 = t2 + t4
                                           return t5
                                         L0:
                                           return n
                                         end fib
```

`main`이 `fib(1)`을 부른 순간의 스택이다. 스택은 아래로 자란다[^2].

```
              +----------------------------------+
  main의      | a                                |
  레코드      | t0                               | <--+
              +----------------------------------+    |
              | 반환값 칸 (아직 빔)              |    |
              | n = 1                            |    |
  fib(1)의    | 제어 링크: main 레코드의 주소  --+----+
  레코드      | 돌아갈 주소: main의 a = t0 줄    |
              | t0                               |
              | t1                               |
              | t2, t3, t4, t5                   |
              +----------------------------------+
                         | 스택이 자라는 쪽
                         v
```

`fib(1)`이 돌면서 일어나는 일은 셋이다[^3].

1. 자기 레코드의 `n` 칸에서 1을 읽는다. `t0 = n <= 1`이 참이라 `t0` 칸에 참을 적고 `L0`으로 간다.
2. `return n`이 반환값 칸에 1을 적는다.
3. `fib(1)`의 레코드를 통째로 걷어 낸다. 레코드에 적어 둔 돌아갈 주소로 가서 `main`의 남은 일을 한다. 반환값 1이 `main`의 `t0`에 옮겨지고 `a = t0`로 `a`도 1이 된다.

끝난 뒤 스택에는 `main`의 `a = 1`, `t0 = 1`만 남는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 3주소 코드를 스택의 칸만으로 실행해 위 그림의 칸 순서와 값(슬라이드 p.26~30), 제어 링크가 늘 부른 쪽 레코드를 가리킴, $$n = 0 \sim 12$$에서 `a`가 피보나치 수와 같음, 가장 깊을 때의 칸 수 $$2 + 10 \times \max(n, 1)$$, `fib(3)`에서 `n` 칸 셋이 3, 2, 1로 따로 있음, 카드 C2 — [49_activation-record_verify.py](/Hongs_Blog/studies/compilers/code/49_activation-record_verify/)</div>

</div>


## 레코드에 드는 것

함수 $$F$$의 활성 하나를 관리하는 데 필요한 정보를 모은 것이 활성 레코드(activation record)다. 다섯 가지가 든다[^4].

| 칸 | 든 것 | 누가 채우나 | 왜 필요한가 |
|---|---|---|---|
| 반환값 칸 | $$F$$가 돌려줄 값 | $$F$$가 끝날 때 채운다 | 부른 쪽이 결과를 가져가려고 |
| 입력 인자 | $$F$$가 받은 값 | 부른 쪽이 넣는다 | $$F$$가 계산에 쓰려고 |
| 제어 링크(control link) | 바로 앞 레코드, 곧 $$F$$를 부른 함수의 레코드를 가리키는 주소 | 부를 때 | $$F$$가 끝나면 스택을 부른 쪽 레코드까지 되돌리려고 |
| 저장한 기계 상태 | $$F$$를 부르기 직전의 기계 상태. 돌아갈 주소, 레지스터에 들어 있던 값 등 | 부를 때 | $$F$$가 끝난 뒤 부른 쪽이 하던 일을 이어 가려고 |
| 지역·임시 변수 | $$F$$ 안에서 쓰는 변수와 `t0`, `t1`, … | $$F$$가 돌면서 | $$F$$의 계산 자리 |

`fib`의 레코드는 반환값 1칸, 인자 `n` 1칸, 제어 링크 1칸, 돌아갈 주소 1칸, `t0`~`t5` 6칸으로 모두 10칸이다[^2]. 지역·임시 변수가 몇 칸인지는 함수의 3주소 코드를 보면 컴파일할 때 알 수 있다[^s1].

**쓰임새로 본 약속.** 레코드를 쓰는 쪽이 하는 일은 넷이다[^s1].

| 하는 일 | 언제 | 드는 일 |
|---|---|---|
| 레코드를 스택에 올린다 | 함수를 부를 때 | 칸 수만큼 스택을 늘린다 |
| 자기 레코드의 칸을 읽고 쓴다 | 함수가 도는 동안 | 스택 꼭대기에서 정해진 칸 수만큼 떨어진 곳을 바로 찾아간다 |
| 반환값 칸을 채운다 | `return`에서 | 칸 하나 쓰기 |
| 레코드를 걷는다 | 함수가 끝날 때 | 스택 꼭대기를 부른 쪽 레코드로 되돌린다 |

네 가지 모두 레코드가 몇 겹 쌓여 있든 걸리는 시간이 같다. 칸의 위치가 꼭대기에서 몇 칸 떨어졌는지로 정해져 있어서 찾아 헤매지 않는다.

**늘 맞아야 하는 것.**

- 스택에 있는 레코드는 [활성 트리](/Hongs_Blog/studies/compilers/activation-tree/)의 뿌리에서 지금 활성까지의 길에 있는 활성들이고, 그 순서대로 쌓여 있다.
- 레코드마다 제어 링크는 바로 아래 깔린 레코드(부른 쪽)를 가리킨다.
- 함수는 자기 레코드의 칸만 읽고 쓴다. 예외는 둘이다. 부른 쪽이 인자 칸을 채워 주고, 끝난 뒤 부른 쪽이 반환값 칸을 읽어 간다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 반환값 칸을 왜 불린 함수의 레코드 맨 위(부른 쪽에 가장 가까운 곳)에 두는가?</summary>

부른 쪽이 읽어 가야 하는 칸이기 때문이다. 레코드를 걷은 뒤에도 부른 쪽 레코드 바로 옆에 있으므로, 부른 쪽은 "내 레코드 끝 바로 다음 칸"으로 찾으면 된다. 불린 함수의 지역 변수가 몇 칸인지 몰라도 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 돌아갈 주소를 레지스터 하나에만 두지 않고 레코드에 적어 두는 까닭은?</summary>

불린 함수가 또 다른 함수를 부르면 그 레지스터에 새 돌아갈 주소가 들어가 앞의 것이 지워진다. 활성마다 돌아갈 자리가 다르므로 활성마다 따로 적어 둬야 한다. `fib(2)` 안의 `fib(1)`은 `t3 = n - 2` 줄로, `main`이 부른 `fib`는 `a = t0` 줄로 돌아간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 제어 링크 없이 "지역 변수 칸 수만큼 스택을 되돌린다"로도 걷을 수 있는가?</summary>

레코드의 칸 수가 컴파일할 때 정해져 있으면 된다. 이 수업의 `fib`는 10칸으로 정해져 있어 그렇게 할 수 있다. 슬라이드는 제어 링크에 적어 둔 주소로 한 번에 되돌리는 쪽을 쓴다. 칸 수를 따로 셈하지 않아도 되는 방법이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 구조의 핵심 아이디어는?</summary>

함수가 아니라 호출 한 번마다 자리를 따로 준다. 그러면 같은 함수가 겹쳐 불려도 값이 섞이지 않고, 끝나는 순서가 시작의 반대라서 스택으로 관리된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

운영체제가 프로세스를 바꿀 때도 하던 일의 상태(레지스터 값, 다음에 실행할 자리)를 적어 두었다가 되찾는다([프로세스 제어 블록](/Hongs_Blog/studies/operating-systems/process-control-block/)). 재귀를 반복문과 직접 만든 스택으로 바꿀 때 스택에 넣는 것도 "그 호출의 인자와 어디까지 했는지"다.

</details>


## 예제

**재귀에서 레코드가 겹치는 모습.** `main`이 `fib(3)`을 부르면 가장 깊을 때 스택에 `fib`의 레코드가 셋 있다. 처음으로 `return n`에 닿는 순간이다[^s2].

| 레코드 | `n` 칸 | 제어 링크가 가리키는 곳 | 돌아갈 줄 |
|---|---|---|---|
| main | 없음 | 없음 | 없음 |
| fib (n = 3) | 3 | main의 레코드 | main의 `a = t0` |
| fib (n = 2) | 2 | fib (n = 3)의 레코드 | fib의 `t3 = n - 2` |
| fib (n = 1) | 1 | fib (n = 2)의 레코드 | fib의 `t3 = n - 2` |

`n` 칸이 셋이고 값이 3, 2, 1로 다 다르다. `t0`~`t5`도 레코드마다 따로다. 가장 위의 `fib(1)`이 `n`을 읽으면 자기 레코드의 1을 읽는다.

**가정을 하나 빼면.** 레코드를 호출마다 만들지 않고 함수마다 하나만 둔다고 하자. `fib(3)`이 `fib(2)`를 부르는 순간 `n` 칸이 2로 덮이고, 그 안에서 부른 호출들이 또 덮는다. `fib(2)`가 끝나고 돌아온 `fib(3)`이 `t3 = n - 2`를 계산할 때 `n` 칸에는 3이 남아 있지 않다. 3 − 2 = 1을 얻어야 하는데 다른 값이 나온다. 재귀가 있으면 "함수마다 하나"로는 안 된다[^s2].

## 활용

- 레코드를 실제로 쌓고 걷는 명령: [함수 호출의 코드 생성](/Hongs_Blog/studies/compilers/codegen-function-call/). 연습: [코드 생성 연습](/Hongs_Blog/studies/compilers/codegen-practice/)
- 함수가 끝나면 레코드가 사라지므로, 지역 변수의 주소를 돌려주면 안 된다. 그 주소에는 곧 다른 함수의 레코드가 올라온다[^s2].
- 끝난 뒤에도 남아야 하는 자료는 레코드가 아니라 힙에 둔다([실행 시 메모리 배치](/Hongs_Blog/studies/compilers/runtime-memory-layout/)).
- 흔한 실수: 스택 그림에서 `fib`의 `t0`와 `main`의 `t0`를 같은 칸으로 그린다. 이름이 같아도 레코드가 다르면 다른 칸이다.

## 연결

- 선수: [활성 트리와 호출 스택](/Hongs_Blog/studies/compilers/activation-tree/), [3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/)
- 어셈블리어에서 본 같은 것: [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/). x86에서는 인자, 돌아갈 주소, 저장한 EBP, 지역 변수가 한 프레임을 이룬다. 저장한 EBP가 여기의 제어 링크 구실을 한다. 돌아갈 주소를 쌓고 꺼내는 명령은 [프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/), 인자를 누가 치우는지 같은 약속은 [호출 규약](/Hongs_Blog/studies/assembly-language/calling-convention/)에 있다[^s3].
- Java에서 메서드를 부를 때마다 스택 영역에 생기는 프레임도 같은 것이다: [참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"활성 레코드는 함수마다 하나씩 있다"</div>

틀렸다. 호출 한 번마다 하나씩 있다. 코드에 `fib`가 하나뿐이니 `fib`의 변수 자리도 하나라고 생각하기 쉽다. 전역 변수는 실제로 그렇게 자리가 하나다. 하지만 지역 변수와 인자는 호출마다 값이 달라야 한다. 확인하는 법: `main`이 `fib(3)`을 부르면 가장 깊을 때 `n` 칸이 셋(3, 2, 1) 있다. 자리가 하나였다면 `fib(2)`에서 돌아온 `fib(3)`이 `t3 = n - 2`를 계산할 때 `n` 칸에 3이 남아 있지 않다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"함수가 끝나도 그 레코드의 값은 스택에 남아 있으니 써도 된다"</div>

틀렸다. 걷어 낸다는 것은 스택 꼭대기 표시만 옮기는 것이라 값이 당장 지워지지는 않는다. 그래서 잠깐은 읽히는 것처럼 보인다. 하지만 그 자리는 이제 빈자리로 치므로 다음 호출의 레코드가 그 위에 덮어쓴다. 슬라이드의 그림에서도 `fib(1)`이 끝난 뒤 스택에는 `a`와 `t0`만 있다. 끝난 뒤에도 필요한 값은 반환값 칸으로 넘기거나 힙에 둔다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 활성 레코드에 드는 다섯 가지를 쓰고, 각각을 누가 언제 채우는지 쓰라.</summary>

**답:** ① 반환값 칸: 불린 함수가 끝날 때. ② 입력 인자: 부른 쪽이 부를 때. ③ 제어 링크(부른 함수의 레코드를 가리키는 주소): 부를 때. ④ 저장한 기계 상태(돌아갈 주소, 레지스터 값): 부를 때. ⑤ 지역·임시 변수: 불린 함수가 도는 동안.<br>
**이유:** ①과 ②는 부른 쪽과 불린 쪽이 주고받는 칸이고, ③과 ④는 돌아가는 데 쓰는 칸이고, ⑤만 불린 함수 혼자 쓰는 칸이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 예시의 코드에서 `main`이 `fib(1)` 대신 `fib(2)`를 부른다(`param 2`). 실행이 처음으로 `return n` 줄에 닿는 순간, 스택에는 레코드가 몇 개이고 칸은 모두 몇 개인가? `fib` 레코드들의 `n`, 제어 링크, 돌아갈 줄을 쓰라.</summary>

**답:** 레코드 셋(main, fib(2), fib(1)), 칸은 2 + 10 + 10 = 22개. fib(2): n = 2, 제어 링크는 main의 레코드, 돌아갈 줄은 main의 `a = t0`. fib(1): n = 1, 제어 링크는 fib(2)의 레코드, 돌아갈 줄은 fib의 `t3 = n - 2`.<br>
**이유:** `fib(2)`는 `n <= 1`이 거짓이라 `t1 = n - 1`을 계산하고 `fib(1)`을 부른다. `return n`에 처음 닿는 것은 그 `fib(1)` 안이다. 돌아갈 줄은 `call` 바로 다음 줄이다. 끝까지 돌면 `a = 1`이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 전역 변수는 왜 활성 레코드에 두지 않는가?</summary>

**답:** 전역 변수는 어느 함수의 어느 호출에서 보든 같은 하나의 자리여야 한다. 레코드는 호출마다 새로 생기고 끝나면 사라지므로, 거기 두면 호출마다 다른 자리가 되고 함수가 끝날 때 값이 없어진다.<br>
**이유:** 그래서 전역 변수에는 프로그램이 도는 내내 바뀌지 않는 번지를 미리 정해 준다([실행 시 메모리 배치](/Hongs_Blog/studies/compilers/runtime-memory-layout/)).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "돌아갈 주소는 함수마다 하나면 충분하다"가 틀림을 예시의 `fib`로 보여라.</summary>

**답:** `main`이 `fib(2)`를 부르면 `fib`는 세 번 불린다. `main`에서 불린 `fib(2)`는 `a = t0` 줄로, `fib(2)` 안의 첫 호출 `fib(1)`은 `t3 = n - 2` 줄로, 둘째 호출 `fib(0)`은 `t5 = t2 + t4` 줄로 돌아가야 한다. 같은 함수인데 돌아갈 곳이 셋이다.<br>
**이유:** 돌아갈 곳은 함수가 아니라 "어디서 불렀는가"가 정한다. 그래서 호출마다 레코드에 적는다.

</details>


[^1]: 컴파일러 14회 강의 자료 「Lecture14 Code generation part 1」, p.25 (fib과 main의 C 코드와 3주소 코드)
[^2]: 같은 자료, p.26 (fib(1)의 활성 레코드), p.27~28 (main이 불렸을 때와 fib(1)이 불렸을 때의 스택)
[^3]: 같은 자료, p.29 (fib(1)이 도는 동안: 인자 1을 쓰고 반환값 1을 적는다), p.30 (끝난 뒤: 레코드를 걷고, 돌아갈 주소로 가서 반환값을 t0에 옮긴다)
[^4]: 같은 자료, p.24 (활성 하나를 관리하는 데 필요한 정보 다섯 가지), p.31 (둘째 물음의 답: 활성 레코드를 둔다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> "왜 필요한가" 칸, 쓰임새 표, 늘 맞아야 하는 것, 스스로 설명해 보기는 원본에 없다. 슬라이드 p.24의 다섯 항목과 p.27~30의 그림에서 읽은 것이고, 검증 코드가 제어 링크의 성질을 호출마다 확인한다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `fib(3)`의 레코드 표, "함수마다 하나"일 때의 반례, 지역 변수 주소 이야기, 오해 두 항목, 카드 C1~C4는 원본에 없다. 표와 카드의 값은 검증 코드로 확인했다. 스택 그림은 슬라이드 p.28의 그림을 글자로 옮긴 것이다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> x86 스택 프레임과의 대응은 원본에 없다. x86에서 `push ebp` / `mov ebp, esp`로 프레임을 여는 표준 방식에 따른 설명이고, 자세한 그림은 어셈블리어 과목의 [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/)에 있다.
{% endraw %}
