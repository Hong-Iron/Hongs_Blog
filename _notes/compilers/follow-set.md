---
layout: "note"
title: "FOLLOW 집합"
display_title: "FOLLOW 집합 (Follow Set)"
kind: "concept"
kind_label: "알고리즘"
num: "19"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Follow Set", "FOLLOW", "Follow 집합", "팔로우 집합", "후속 기호 집합", "Endmarker", "끝 표시", "입력 끝 기호"]
description: "문법의 어떤 이름 바로 뒤에 올 수 있는 낱말을 모두 모은 것이다. 그 이름 자신의 규칙이 아니라, 그 이름이 다른 규칙 안에서 어디에 쓰이는지를 보고 구한다. 아무것도 내놓지 않고 사라질 수 있는 이름을 읽을 때 쓴다. 사라졌다면 다음 낱말은 그 이름 뒤에 오던 것일 테니, 다음…"
prev_url: "/studies/compilers/first-set/"
prev_title: "FIRST 집합"
next_url: "/studies/compilers/ll1-parsing-table/"
next_title: "LL(1) 파싱 표"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "19_follow-set_impl.py", "u": "/studies/compilers/code/19_follow-set_impl/", "r": "구현"}]
permalink: "/studies/compilers/follow-set/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

문법의 어떤 이름 바로 뒤에 올 수 있는 낱말을 모두 모은 것이다. 그 이름 자신의 규칙이 아니라, 그 이름이 다른 규칙 안에서 어디에 쓰이는지를 보고 구한다. 아무것도 내놓지 않고 사라질 수 있는 이름을 읽을 때 쓴다. 사라졌다면 다음 낱말은 그 이름 뒤에 오던 것일 테니, 다음 낱말이 이 모음 안에 있으면 "여기서는 사라지는 쪽"이라고 정한다. 문장의 맨 끝도 '끝 표시'라는 낱말 하나로 쳐서 함께 넣는다.

</div>


## 예시로 보기

[FIRST 집합](/Hongs_Blog/studies/compilers/first-set/)은 규칙을 펼치면 맨 앞에 무엇이 나오는지 알려 준다. 그런데 $$E' \to \epsilon$$처럼 아무것도 내놓지 않는 규칙은 맨 앞에 나오는 것이 없다. 다음 입력이 무엇일 때 이 규칙을 골라야 하는지 FIRST로는 정할 수 없다.

문법 $$E \to TE'$$, $$\ E' \to +E \mid \epsilon$$, $$\ T \to FT'$$, $$\ T' \to *T \mid \epsilon$$, $$\ F \to (E) \mid id$$로 $$(id)$$를 읽는다고 하자. `(`와 $$id$$를 읽고 나면 남은 모양은 $$(id\ T'E')\ T'E'$$이고 다음 입력은 `)`다. 가장 왼쪽 비단말 기호 $$T'$$를 $$*T$$로 펼치면 $$*$$가 나와야 하는데 입력은 `)`다. 그러니 $$T'$$는 사라져야 한다. 왜 그렇게 확신하는가? $$T'$$가 사라지고 그 뒤의 $$E'$$도 사라지면 `)`가 바로 온다. `)`는 "$$T'$$ 바로 뒤에 올 수 있는 토큰"이다. 이런 토큰을 비단말 기호마다 미리 모아 둔 것이 FOLLOW 집합이다.

입력의 맨 끝에는 끝 표시 $\$$가 붙어 있다고 친다. 시작 기호 뒤에는 아무것도 없으니 $\$$가 온다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 아래 산술식 예의 다섯 집합과 바퀴별 추적, 무작위 문법 100개에서 되풀이로 구한 값이 "문장 형식을 다 만들어 바로 뒤 기호를 모은 값"과 같은 것 — [19_follow-set_impl.py](/Hongs_Blog/studies/compilers/code/19_follow-set_impl/)</div>

</div>


## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

비단말 기호 $$A$$의 FOLLOW 집합은 시작 기호 $$S$$에서 유도되는 문장 형식 안에서 $$A$$ 바로 오른쪽에 올 수 있는 단말 기호를 모두 모은 집합이다.

$$Follow(A) = \{\,x \mid S \Rightarrow^* \alpha A x \beta\,\}$$

</div>


$$x$$는 단말 기호이고 $$\alpha$$, $$\beta$$는 단말·비단말 기호를 늘어놓은 것이다. "$$S$$에서 유도하다 보면 $$A$$ 바로 뒤에 $$x$$가 붙어 있는 모양이 나온다"로 읽는다. $$A$$가 문장 형식의 맨 끝에 올 수 있으면 끝 표시 $$\$$$를 넣는다. FOLLOW에는 $$\epsilon$$이 들어가지 않는다. 뒤에 오는 것은 실제 토큰이거나 입력의 끝이기 때문이다.

**구하는 규칙 셋**.

| | 규칙 | 뜻 |
|---|---|---|
| ① | $$\$ \in Follow(S)$$ | 시작 기호 뒤는 입력의 끝이다 |
| ② | 규칙 $$B \to \alpha A \beta$$가 있으면 $$First(\beta) - \{\epsilon\} \subseteq Follow(A)$$ | $$A$$ 바로 뒤에 $$\beta$$가 오므로 $$\beta$$의 첫 토큰이 $$A$$ 뒤에 온다 |
| ③ | 규칙 $$B \to \alpha A \beta$$에서 $$\epsilon \in First(\beta)$$이거나, 규칙 $$B \to \alpha A$$가 있으면 $$Follow(B) \subseteq Follow(A)$$ | $$A$$ 뒤가 비면 $$A$$가 $$B$$의 맨 끝이다. $$B$$ 뒤에 오던 것이 $$A$$ 뒤에 온다 |

$$\subseteq$$는 "왼쪽 집합의 원소가 모두 오른쪽 집합에 들어 있다"는 뜻이다. 여기서는 "왼쪽 것을 오른쪽에 다 넣어라"로 읽으면 된다. $$First(\beta) - \{\epsilon\}$$은 $$First(\beta)$$에서 $$\epsilon$$을 뺀 것이다.

세 규칙 모두 $$A$$가 규칙의 **오른쪽**에 나오는 곳을 본다. $$A$$ 자신의 규칙($$A \to \dots$$)은 보지 않는다. $$A$$가 여러 규칙의 여러 자리에 나오면 자리마다 ②와 ③을 따진다.

### 예: 산술식 문법

FIRST는 앞 문서에서 구했다. $$First(F) = \{(, id\}$$, $$First(T') = \{*, \epsilon\}$$, $$First(T) = \{(, id\}$$, $$First(E') = \{+, \epsilon\}$$, $$First(E) = \{(, id\}$$.

| 비단말 | 오른쪽에 나오는 곳 | 계산 | 결과 |
|---|---|---|---|
| $$E$$ | 시작 기호, $$F \to (E)$$, $$E' \to +E$$ | $$\{\$\} \cup First()) \cup Follow(E')$$ | $$\{\$,\ )\}$$ |
| $$E'$$ | $$E \to TE'$$ | $$Follow(E)$$ | $$\{\$,\ )\}$$ |
| $$T$$ | $$E \to TE'$$, $$T' \to *T$$ | $$(First(E') - \{\epsilon\}) \cup Follow(E) \cup Follow(T')$$ | $$\{+,\ \$,\ )\}$$ |
| $$T'$$ | $$T \to FT'$$ | $$Follow(T)$$ | $$\{+,\ \$,\ )\}$$ |
| $$F$$ | $$T \to FT'$$ | $$(First(T') - \{\epsilon\}) \cup Follow(T)$$ | $$\{*,\ +,\ \$,\ )\}$$ |

$$T$$ 줄을 풀어 본다. $$E \to TE'$$에서 $$T$$ 뒤에 $$E'$$가 온다. 규칙 ②로 $$First(E')$$에서 $$\epsilon$$을 뺀 $$\{+\}$$를 넣는다. $$E'$$는 사라질 수 있으므로($$\epsilon \in First(E')$$) 규칙 ③으로 $$Follow(E) = \{\$, )\}$$도 넣는다. $$T' \to *T$$에서는 $$T$$가 맨 끝이라 규칙 ③으로 $$Follow(T')$$를 넣는다.

여기서 $$Follow(E)$$는 $$Follow(E')$$를 쓰고 $$Follow(E')$$는 $$Follow(E)$$를 쓴다. $$Follow(T)$$와 $$Follow(T')$$도 서로를 쓴다. 손으로 풀 때는 이것을 $$Follow(E) = \{\$, )\} \cup Follow(E) = \{\$, )\}$$처럼 적기도 한다. 자기 자신을 다시 넣어도 새로 늘 것이 없다는 뜻이다.

### 알고리즘

서로 물려 있는 집합은 FIRST 때와 같이 "바뀌는 것이 없을 때까지 되풀이"로 구한다[^s2].

```
입력: 문법 G, 시작 기호 S, 모든 First
모든 비단말 기호 A에 대해 Follow(A) ← 빈 집합
Follow(S)에 $ 를 넣는다                                    (규칙 ①)
되풀이:
    모든 규칙 B → Y1 Y2 … Yn 과, 그 안의 비단말 기호 Yi 마다
        β ← Yi 뒤의 기호열 Y(i+1) … Yn
        Follow(Yi) ← Follow(Yi) ∪ (First(β) − {ε})          (규칙 ②)
        First(β)에 ε이 있으면(β가 비었을 때 포함)
            Follow(Yi) ← Follow(Yi) ∪ Follow(B)            (규칙 ③)
어느 집합도 커지지 않았으면 멈춘다
```

위 문법에서 규칙을 $$E, E', T, T', F$$ 순서로 돌 때의 추적이다.

| 바퀴 | $$Follow(E)$$ | $$Follow(E')$$ | $$Follow(T)$$ | $$Follow(T')$$ | $$Follow(F)$$ |
|---|---|---|---|---|---|
| 처음 | $$\{\$\}$$ | $$\{\}$$ | $$\{\}$$ | $$\{\}$$ | $$\{\}$$ |
| 1 | $$\{\$, )\}$$ | $$\{\$\}$$ | $$\{+, \$\}$$ | $$\{+, \$\}$$ | $$\{*, +, \$\}$$ |
| 2 | $$\{\$, )\}$$ | $$\{\$, )\}$$ | $$\{+, \$, )\}$$ | $$\{+, \$, )\}$$ | $$\{*, +, \$, )\}$$ |
| 3 | 그대로 | 그대로 | 그대로 | 그대로 | 그대로 → 멈춤 |

첫 바퀴에서 `)`는 마지막 규칙 $$F \to (E)$$를 볼 때에야 $$Follow(E)$$에 들어간다. 그 전에 지나간 $$E'$$, $$T$$, $$T'$$, $$F$$에는 아직 전해지지 않았고, 둘째 바퀴에서 전해진다.

**정확성.** 되풀이는 멈추고, 멈췄을 때의 값이 정의의 FOLLOW와 같다[^s2].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 스케치 펼치기</summary>

1. **멈춘다.** 집합은 커지기만 하고 넣을 수 있는 원소는 단말 기호와 $$\$$$뿐이라 유한하다. — 단조 증가와 유한성
2. **넣은 것은 모두 옳다.** 규칙 ②: $$B \to \alpha A \beta$$이고 $$x \in First(\beta)$$면 $$\beta \Rightarrow^* x\gamma$$다. $$B$$가 나오는 문장 형식에서 $$B$$를 이 규칙으로 바꾸면 $$A$$ 바로 뒤에 $$x$$가 온다. 규칙 ③: $$\beta \Rightarrow^* \epsilon$$이면 $$B$$를 바꾼 자리에서 $$A$$가 맨 끝이 되므로, $$B$$ 뒤에 오던 $$x \in Follow(B)$$가 $$A$$ 뒤에 온다. — 유도를 이어 붙이기. 시작 기호에서 닿을 수 없는 비단말 기호 $$B$$가 있으면 이 논증이 깨진다. 그런 기호는 문법에서 지우고 시작한다.
3. **빠진 것이 없다.** $$S \Rightarrow^* \alpha A x \beta$$인 유도의 걸음 수에 대한 귀납법으로 보인다. 이 $$A$$가 생긴 걸음에서 쓴 규칙을 $$B \to \gamma A \delta$$라 하자. $$x$$가 $$\delta$$에서 나왔으면 규칙 ②가 넣는다. $$\delta$$가 모두 사라졌으면 $$x$$는 그 걸음 전에 $$B$$ 바로 뒤에 올 수 있던 것이고, 더 짧은 유도이므로 귀납 가정으로 $$x \in Follow(B)$$다. 규칙 ③이 이것을 $$Follow(A)$$로 옮긴다. — 강한 귀납법 ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 규칙 ②에서 $$\epsilon$$을 빼는 까닭은?</summary>

$$First(\beta)$$의 $$\epsilon$$은 "$$\beta$$가 사라질 수 있다"는 표시이지 $$A$$ 뒤에 오는 토큰이 아니다. $$\beta$$가 사라졌을 때 실제로 $$A$$ 뒤에 오는 것은 $$B$$ 뒤에 오던 토큰이고, 그것은 규칙 ③이 챙긴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 규칙 ③에서 왜 $$Follow(B)$$를 $$Follow(A)$$에 넣고, 거꾸로는 넣지 않는가?</summary>

$$B \to \alpha A$$에서 $$A$$는 $$B$$의 맨 끝이다. $$B$$ 뒤에 오는 것은 무엇이든 $$A$$ 뒤에도 온다. 거꾸로는 아니다. $$A$$는 다른 규칙 $$C \to A d$$에도 쓰일 수 있고, 거기서 $$A$$ 뒤에 오는 $$d$$는 $$B$$와 상관없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 표에서 $$Follow(F)$$에 $$+$$가 들어간 것은 어느 규칙을 몇 번 거친 결과인가?</summary>

$$T \to FT'$$에서 $$T'$$가 사라질 수 있어 규칙 ③으로 $$Follow(T)$$가 들어온다. $$Follow(T)$$의 $$+$$는 $$E \to TE'$$에서 규칙 ②로 들어온 $$First(E')$$의 것이다. 곧 $$E \Rightarrow TE' \Rightarrow FT'E' \Rightarrow FE' \Rightarrow F + E$$로 $$F$$ 바로 뒤에 $$+$$가 온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 계산의 핵심 아이디어는?</summary>

비단말 기호가 규칙 오른쪽에 놓인 자리마다 "바로 뒤에 무엇이 있는가"를 본다. 뒤에 기호가 있으면 그 첫 토큰을, 뒤가 비거나 사라질 수 있으면 부모 기호의 뒤를 물려받는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

상향식 파싱에서도 같은 FOLLOW를 쓴다. [SLR 파싱](/Hongs_Blog/studies/compilers/slr-parsing/)은 규칙 $$X \to \beta$$로 묶을지를 "다음 토큰이 $$Follow(X)$$에 있는가"로 정한다.

</details>


### 복잡도

한 바퀴는 규칙 오른쪽의 비단말 기호 자리마다 뒤쪽 기호열의 FIRST를 한 번 구한다. 바퀴 수는 많아야 (비단말 기호 수) × (단말 기호 수 + 1) + 1이다. 위 예는 세 바퀴였다[^s2].

## 활용

- **LL(1) 파싱 표의 ε 칸.** 규칙 $$A \to \alpha$$에서 $$\epsilon \in First(\alpha)$$이면, 이 규칙을 $$A$$ 줄의 $$Follow(A)$$에 든 단말 기호 칸마다 적는다. 산술식 문법에서는 $$E' \to \epsilon$$을 $$Follow(E') = \{\$, )\}$$의 두 칸에, $$T' \to \epsilon$$을 $$Follow(T') = \{+, \$, )\}$$의 세 칸에 적는다. → [LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/)
- **흔한 실수.**
    - $$A$$ 자신의 규칙 오른쪽을 본다. 봐야 할 곳은 $$A$$가 오른쪽에 **쓰인** 규칙들이다.
    - 규칙 ③을 빠뜨린다. $$E \to TE'$$에서 $$E'$$가 사라질 수 있는데 $$Follow(T)$$를 $$\{+\}$$로만 적는다.
    - 시작 기호에 $$\$$$를 넣지 않는다.
    - FOLLOW에 $$\epsilon$$을 넣는다.
- 연습: [FIRST·FOLLOW 예제 사다리](/Hongs_Blog/studies/compilers/first-follow-ladder/)

## 연결

- 선수: [FIRST 집합](/Hongs_Blog/studies/compilers/first-set/). 규칙 ②와 ③이 뒤쪽 기호열의 FIRST를 쓴다.
- 쓰이는 곳: [LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/)(빈 문자열 규칙의 자리), [SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/)(묶는 동작의 자리)
- 문장 형식이라는 말: [유도와 파스 트리](/Hongs_Blog/studies/compilers/derivation-parse-tree/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"Follow(A)는 A의 규칙 오른쪽을 보고 구한다"</div>

틀렸다. $$A$$의 규칙 오른쪽은 $$A$$가 무엇으로 바뀌는지를 말할 뿐이고, $$A$$ 뒤에 무엇이 오는지는 말해 주지 않는다. 그럴듯해 보이는 까닭은 FIRST를 그렇게 구했기 때문이다. FIRST는 $$A$$의 안쪽을 보고, FOLLOW는 $$A$$의 바깥(쓰인 자리)을 본다. 위 문법에서 $$T'$$의 규칙은 $$T' \to *T \mid \epsilon$$이지만 $$Follow(T')$$에 $$*$$는 없다. $$Follow(T') = \{+, \$, )\}$$는 $$T'$$가 쓰인 단 한 곳 $$T \to FT'$$에서 $$Follow(T)$$를 물려받은 것이다. 확인하는 법: 문법 전체에서 규칙 오른쪽에 그 기호가 나오는 곳을 모두 표시하고 거기서만 계산한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** FOLLOW 집합을 구하는 세 규칙을 쓰라.</summary>

**답:** ① 시작 기호의 FOLLOW에 $$\$$$를 넣는다. ② 규칙 $$B \to \alpha A \beta$$가 있으면 $$First(\beta)$$에서 $$\epsilon$$을 뺀 것을 $$Follow(A)$$에 넣는다. ③ 규칙 $$B \to \alpha A \beta$$에서 $$\beta$$가 사라질 수 있거나 $$B \to \alpha A$$ 꼴이면 $$Follow(B)$$를 $$Follow(A)$$에 넣는다.<br>
**이유:** ②는 $$A$$ 바로 뒤에 기호가 있을 때, ③은 $$A$$가 규칙의 끝이 될 수 있을 때다. 흔한 오답은 ③의 방향을 거꾸로 적는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$S \to AB$$, $$\ A \to a \mid \epsilon$$, $$\ B \to b \mid \epsilon$$의 $$Follow(S)$$, $$Follow(A)$$, $$Follow(B)$$를 구하라.</summary>

**답:** $$Follow(S) = \{\$\}$$, $$Follow(A) = \{b, \$\}$$, $$Follow(B) = \{\$\}$$.<br>
**이유:** $$A$$ 뒤에 $$B$$가 오므로 규칙 ②로 $$First(B) - \{\epsilon\} = \{b\}$$를 넣는다. $$B$$가 사라질 수 있으므로 규칙 ③으로 $$Follow(S) = \{\$\}$$도 넣는다. $$B$$는 $$S$$의 맨 끝이라 규칙 ③으로 $$Follow(S)$$를 받는다. $$Follow(A)$$에서 $$\$$$를 빠뜨리기 쉽다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 의사코드에서 "First(β)에 ε이 있으면 Follow(Yi)에 Follow(B)를 합친다"가 하는 일을 한 문장으로 쓰라.</summary>

**답:** $$Y_i$$ 뒤의 기호들이 모두 사라질 수 있으면 $$Y_i$$가 $$B$$의 맨 끝이 되므로, $$B$$ 바로 뒤에 올 수 있는 토큰을 모두 $$Y_i$$ 바로 뒤에 올 수 있는 토큰으로 넣는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 위 산술식 문법에서 $$) \in Follow(T')$$임을 보이는 유도를 쓰라. $$S \Rightarrow^* \alpha\,T'\,)\,\beta$$ 꼴의 문장 형식을 만들면 된다.</summary>

**답:** $$E \Rightarrow TE' \Rightarrow FT'E' \Rightarrow (E)T'E' \Rightarrow (TE')T'E' \Rightarrow (FT'E')T'E' \Rightarrow (FT')T'E'$$. 마지막 모양에서 안쪽 $$T'$$ 바로 뒤에 `)`가 있다.<br>
**이유:** 안쪽 $$E'$$를 $$\epsilon$$으로 바꾸는 걸음이 규칙 ③을 쓰는 자리다. $$E'$$가 사라져 $$T'$$가 괄호 안의 맨 끝이 되었다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 규칙 ③을 쓰지 않으면 위 산술식 문법의 어느 FOLLOW가 어떻게 틀리는가? 그 때문에 파서가 못 읽게 되는 가장 짧은 입력을 하나 들어라.</summary>

**답:** $$Follow(E')$$가 빈 집합, $$Follow(T)$$가 $$\{+\}$$, $$Follow(T')$$가 빈 집합이 된다. 그러면 $$T' \to \epsilon$$과 $$E' \to \epsilon$$을 $$\$$$ 칸에 적지 못해, $$id$$ 하나짜리 입력도 $$id$$를 읽은 뒤 $$T'$$에서 막힌다.<br>
**이유:** $$\$$$와 `)`는 모두 규칙 ③을 거쳐 전해진다. 규칙 ②만으로 들어오는 것은 $$+$$와 $$*$$, 그리고 $$F \to (E)$$의 `)`뿐이다.

</details>


[^s2]: 되풀이 알고리즘, 바퀴별 추적 표, 정확성 증명 스케치, 스스로 설명해 보기, 복잡도, 카드 C2·C4·C5는 보탠 것이다(Aho 외, *Compilers* 2판 4.4.2절). 추적 표와 카드의 값은 구현 코드로 확인했고, 무작위 문법 100개에서 정의대로 구한 값과 같았다. 이 비교는 실험이고, 모든 문법에 대한 근거는 증명 스케치다.
{% endraw %}
