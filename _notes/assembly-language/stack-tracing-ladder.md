---
layout: "note"
title: "스택 추적 예제 사다리"
display_title: "스택 추적 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "26"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 런타임 스택과 PUSH·POP, 프로시저와 CALL·RET."
prev_url: "/studies/assembly-language/array-loop-ladder/"
prev_title: "LOOP로 배열 돌기 예제 사다리"
next_url: "/studies/assembly-language/conditional-structures-ladder/"
next_title: "조건 구조를 점프로 옮기기 예제 사다리"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/stack-tracing-ladder/"
---
{% raw %}
사용 개념: [런타임 스택과 PUSH·POP](/Hongs_Blog/studies/assembly-language/runtime-stack/), [프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/).

"이 코드가 끝났을 때 스택과 레지스터는?"이라는 문제는 같은 하위목표의 되풀이다. ① 출발점: 처음 ESP를 적는다 ② ESP 따라가기: `push`와 `call`은 4를 빼고, `pop`과 `ret`은 4를 더한다 ③ 칸 채우기: 4를 뺀 자리에 무엇이 들어갔는지 적는다(`call`이면 다음 명령의 주소) ④ 꺼낸 값 보내기: `pop`은 맨 위 값을 레지스터로, `ret`은 맨 위 값을 EIP로 보낸다 ⑤ 마무리: 끝났을 때의 레지스터와 ESP를 적는다[^s1].

네 문제 모두 ESP는 00001000h에서 시작한다. 줄 앞의 여덟 자리 수는 그 명령의 주소다. 모든 답은 파이썬 흉내로 확인했다. 실제 MASM으로 돌린 것이 아니다.

## 문제 1 · 완전한 풀이

```asm
    mov eax,11h
    mov ebx,22h
    push eax
    push ebx
    pop eax
    pop ebx
```

1. *출발점:* ESP = 00001000h.
2. *ESP 따라가기와 칸 채우기:*

| 실행한 줄 | ESP | 쓰거나 읽은 칸 |
|---|---|---|
| `push eax` | 00000FFCh | 00000FFCh ← 00000011h |
| `push ebx` | 00000FF8h | 00000FF8h ← 00000022h |
| `pop eax` | 00000FFCh | 00000FF8h의 22h를 읽는다 |
| `pop ebx` | 00001000h | 00000FFCh의 11h를 읽는다 |

{: start="3"}
3. *꺼낸 값 보내기:* 맨 위에 있던 22h가 EAX로, 그다음 11h가 EBX로 간다.
4. *마무리:* EAX = 22h, EBX = 11h, ESP = 00001000h. 올린 순서와 같은 순서로 내려서 두 값이 서로 바뀌었다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [26_stack-tracing-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/26_stack-tracing-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

```asm
main PROC
    00000010  mov eax,5
    00000015  call Twice
    0000001A  mov ebx,eax
    exit
main ENDP

Twice PROC
    00000030  add eax,eax
    00000032  ret
Twice ENDP
```

1. *출발점:* ESP = 00001000h.
2. *ESP 따라가기와 칸 채우기:* `call Twice`가 ESP를 00000FFCh로 내리고 그 칸에 다음 명령의 주소 0000001Ah를 넣는다. EIP는 00000030h가 된다.
3. *꺼낸 값 보내기:* `add eax,eax`로 EAX = 0Ah. `ret`이 00000FFCh의 0000001Ah를 EIP에 넣고 ESP를 00001000h로 올린다.
4. *마무리:* `mov ebx,eax`까지 실행한 뒤 EBX = ______, ESP = ______.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

EBX = 0000000Ah(10), ESP = 00001000h.<br>
`ret`이 돌아온 곳이 `call` 다음 줄이라 `mov ebx,eax`가 실행된다. 올린 것(복귀 주소)을 `ret`이 내렸으니 ESP는 처음 값이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

```asm
main PROC
    00000000  mov ecx,3
    00000005  call Outer
    0000000A  exit
main ENDP

Outer PROC
    00000020  push ecx
    00000021  mov ecx,7
    00000026  call Inner
    0000002B  pop ecx
    0000002C  ret
Outer ENDP

Inner PROC
    00000040  mov edx,ecx
    00000042  ret
Inner ENDP
```

1. *출발점:* ESP = 00001000h.
2. *ESP 따라가기와 칸 채우기:* `Inner`의 `mov edx,ecx`를 실행하는 순간의 스택을 채우라.

```
 00000FFC  [ ______ ]
 00000FF8  [ ______ ]
 00000FF4  [ ______ ]←ESP
```

{: start="3"}
3. *꺼낸 값 보내기:* `Inner`의 `ret`은 0000002Bh로 돌아간다. `pop ecx`가 ______ 를 ECX에 넣는다. `Outer`의 `ret`은 ______ 로 돌아간다.
4. *마무리:* 끝났을 때 ECX = 3, EDX = ______, ESP = 00001000h.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. 00000FFCh에 0000000Ah(`main`으로 돌아갈 주소), 00000FF8h에 00000003h(올려 둔 ECX), 00000FF4h에 0000002Bh(`Outer`로 돌아갈 주소).
3. `pop ecx`는 00000003h를 넣는다. `Outer`의 `ret`은 0000000Ah로 돌아간다.
4. EDX = 7. `Inner`가 ECX를 읽은 때는 `Outer`가 7로 바꾼 뒤다.<br>
복귀 주소 둘 사이에 올려 둔 레지스터가 끼어 있다. `Outer`가 `pop ecx`를 해야 맨 위가 자기 복귀 주소가 된다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [26_stack-tracing-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/26_stack-tracing-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

```asm
main PROC
    00000000  mov eax,1
    00000005  call Bad
    0000000A  exit
main ENDP

Bad PROC
    00000050  push eax
    00000051  mov eax,0Ah
    00000056  ret
Bad ENDP
```

`Bad`의 `ret`을 실행한 직후의 EIP와 ESP를 구하라. 프로그램이 0000000Ah로 돌아오게 하려면 무엇을 고쳐야 하는가? 고친 뒤 `main`으로 돌아왔을 때 EAX는?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`call`이 ESP를 00000FFCh로 내리고 0000000Ah를 넣는다. `push eax`가 ESP를 00000FF8h로 내리고 00000001h를 넣는다. `ret`은 맨 위의 00000001h를 꺼내므로 EIP = 00000001h, ESP = 00000FFCh다. 복귀 주소 0000000Ah는 스택에 남는다.<br>
고치는 법: `ret` 앞에 `pop eax`를 넣어 올린 만큼 내린다. 그러면 `ret`이 0000000Ah를 꺼낸다. 돌아왔을 때 EAX는 1이다. `mov eax,0Ah`로 넣은 값은 `pop eax`가 옛 값으로 덮어쓴다.<br>
EAX = 0Ah를 돌려주려던 것이라면 `push eax`와 `pop eax`를 둘 다 지워야 한다. 돌려줄 레지스터는 치워 뒀다 되돌리면 안 된다([레지스터 매개변수와 USES](/Hongs_Blog/studies/assembly-language/procedure-register-parameters/)).

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [26_stack-tracing-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/26_stack-tracing-ladder_p4/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 주소는 원본에 없다. 슬라이드의 PUSH·POP 그림(wk06-3-2 p.6~8)과 CALL-RET 예제(wk06-3-3 p.7~9)를 연습하도록 만들었다. 줄 앞의 주소는 문제에서 정해 준 값이고 실제 기계어 길이와는 상관없다. 답은 문제 코드의 파이썬 흉내로 확인했다.
{% endraw %}
