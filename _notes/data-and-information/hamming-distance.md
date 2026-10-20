---
layout: "note"
title: "해밍 거리와 부호 거리"
display_title: "해밍 거리와 부호 거리 (Hamming Distance, Code Distance)"
kind: "concept"
kind_label: "정리"
num: "05"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-11"
status: "verified"
aliases: ["Hamming Distance", "해밍 거리", "해밍 무게", "Hamming Weight", "해밍 공", "Hamming Ball", "부호 거리", "Code Distance", "최소 거리", "Minimum Distance", "상대 거리", "오류 정정 부호", "Error-correcting Code", "오류 검출", "오류 정정", "지워짐", "Erasure"]
description: "길이가 같은 두 기호열이 몇 군데에서 다른지 센 수를 둘 사이의 거리로 삼는다. 쓸 낱말들을 서로 멀리 떨어뜨려 골라 두면, 전송 중에 몇 글자가 바뀌어도 다른 낱말로 둔갑하지 못한다. 가장 가까운 두 낱말 사이의 거리보다 하나 적은 개수까지는 틀린 것을 반드시 알아채고, 그 절반…"
prev_url: "/studies/data-and-information/code-encoding/"
prev_title: "부호와 부호화"
next_url: "/studies/data-and-information/linear-code/"
next_title: "선형 부호와 패리티 검사 행렬"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "05_hamming-distance_verify.py", "u": "/studies/data-and-information/code/05_hamming-distance_verify/", "r": "검증"}]
permalink: "/studies/data-and-information/hamming-distance/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

길이가 같은 두 기호열이 몇 군데에서 다른지 센 수를 둘 사이의 거리로 삼는다. 쓸 낱말들을 서로 멀리 떨어뜨려 골라 두면, 전송 중에 몇 글자가 바뀌어도 다른 낱말로 둔갑하지 못한다. 가장 가까운 두 낱말 사이의 거리보다 하나 적은 개수까지는 틀린 것을 반드시 알아채고, 그 절반쯤까지는 원래 낱말로 되돌린다. 그보다 많이 바뀌면 알아채지 못하거나 엉뚱한 낱말로 고친다.

</div>


## 예시로 보기

한 비트를 보내는데 전선에 잡음이 있다. `0`을 보냈는데 `1`로 바뀌어도 받는 쪽은 모른다. `0`과 `1`은 한 군데만 다르기 때문이다.

그래서 한 비트를 세 번 되풀이해 `000` 또는 `111`만 보내기로 한다. 두 부호어는 세 군데가 다르다.

- `000`을 보냈는데 `010`이 왔다. `010`은 약속에 없는 열이니 틀렸다는 것을 안다. `000`과는 한 군데, `111`과는 두 군데 다르니 `000`이었다고 고친다.
- `000`을 보냈는데 두 군데가 바뀌어 `011`이 왔다. 약속에 없는 열이라 틀린 것은 안다. 하지만 가까운 쪽으로 고치면 `111`이 되어 틀리게 고친다.
- 세 군데가 다 바뀌면 `111`이 온다. 멀쩡한 부호어라서 틀린 줄도 모른다.

거리 3인 부호는 2개까지 알아채고 1개까지 고친다. 아래 정리가 이 수를 일반적으로 말한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 길이 5의 모든 2진 열에서 거리의 네 조건과 $$\Delta(x, y) = \mathrm{wt}(x - y)$$, 해밍 공의 크기, 다섯 부호(거리 1, 2, 3, 3, 5)에서 검출·정정·채우기 개수의 전수 검사, 예시와 카드의 값 — [05_hamming-distance_verify.py](/Hongs_Blog/studies/data-and-information/code/05_hamming-distance_verify/)</div>

</div>


## 정의

알파벳 $$\Sigma$$의 기호를 $$n$$개 늘어놓은 열 전체를 $$\Sigma^n$$이라 적는다. 2진이면 길이 $$n$$의 0과 1의 줄 $$2^n$$개다.

**오류 정정 부호.** $$\Sigma^n$$에서 고른 일부 $$C \subseteq \Sigma^n$$이다. $$\vert \Sigma\vert  = q$$이면 $$q$$진 부호라 하고, $$n$$을 블록 크기라 한다. 보낼 내용(메시지)의 집합 $$\mathcal{M}$$에서 $$C$$로 가는 짝짓기가 부호화다.

**해밍 거리.** 두 열 $$x, y \in \Sigma^n$$에서 기호가 서로 다른 자리의 수다. $$\Delta$$는 델타라고 읽는다.

$$\Delta(x, y) = \bigl\vert \{\, i \in [n] : x_i \ne y_i \,\}\bigr\vert $$


예: `10110`과 `10011`은 셋째와 다섯째 자리가 달라 $$\Delta = 2$$다. 길이로 나눈 $$\delta(x, y) = \Delta(x, y)/n$$을 상대 해밍 거리라 한다.

**해밍 무게.** 열 $$x$$에서 0이 아닌 기호의 수 $$\mathrm{wt}(x)$$다. `10110`의 무게는 3이다. 두 열의 거리는 둘의 차의 무게와 같다.

$$\Delta(x, y) = \mathrm{wt}(x - y)$$


2진에서는 빼기가 자리마다의 XOR(같으면 0, 다르면 1)이다. 다른 자리에만 1이 서니 1의 개수가 곧 거리다[^s1].

**해밍 공.** 열 $$x$$에서 거리 $$r$$ 안에 있는 열을 모두 모은 것 $$\{\, y \in \Sigma^n : \Delta(x, y) \le r \,\}$$이다. $$x$$에서 $$r$$자리까지 바뀌었을 때 나올 수 있는 열 전부다. 2진 길이 3에서 `000`의 반지름 1짜리 공은 `000`, `100`, `010`, `001` 네 개다.

**부호 거리.** 부호 $$C$$에서 서로 다른 두 부호어 사이의 거리 가운데 가장 작은 값이다.

$$\Delta(C) = \min_{\substack{c_1, c_2 \in C \\ c_1 \ne c_2}} \Delta(c_1, c_2)$$


상대 거리는 $$\delta(C) = \Delta(C)/n$$이다. 가장 가까운 쌍이 가장 약한 곳이라서 가장 작은 값을 잰다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">부호 거리와 능력</div>

부호 $$C$$와 정수 $$t \ge 0$$에 대해 다음 넷은 같은 말이다.
1. $$C$$의 부호 거리가 $$2t + 1$$ 이상이다.
2. $$C$$는 기호가 $$2t$$개까지 바뀐 것을 반드시 알아챈다.
3. $$C$$는 기호가 $$2t$$개까지 지워진 것(어느 자리가 비었는지는 안다)을 반드시 채운다.
4. $$C$$는 기호가 $$t$$개까지 바뀐 것을 반드시 고친다.

</div>


부호 거리를 $$d$$로 적으면, $$d - 1$$개까지 알아채고, $$d - 1$$개까지 채우고, $$\left\lfloor \frac{d-1}{2} \right\rfloor$$개까지 고친다.


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

부호 거리를 $$d$$라 하자. 받는 쪽은 받은 열이 부호어가 아니면 "틀렸다"고 하고, 고칠 때는 가장 가까운 부호어를 고른다.
1. **알아채기 ($$d - 1$$개까지).** 부호어 $$c$$에서 1개 이상 $$d - 1$$개 이하의 자리가 바뀐 열 $$r$$은 $$0 < \Delta(c, r) < d$$다. $$r$$이 다른 부호어라면 두 부호어의 거리가 $$d$$보다 작아져 부호 거리의 정의에 어긋난다. 그래서 $$r$$은 부호어가 아니고, 받는 쪽이 알아챈다. — 부호 거리의 정의
2. **$$d$$개는 놓칠 수 있다.** 거리가 정확히 $$d$$인 두 부호어 $$c_1, c_2$$가 있다. $$c_1$$을 보냈는데 둘이 다른 $$d$$자리가 모두 바뀌면 $$c_2$$가 온다. 멀쩡한 부호어라 알아챌 수 없다. — 최솟값을 주는 쌍
3. **고치기 ($$t$$개까지, $$2t + 1 \le d$$).** $$c$$에서 $$t$$개 이하가 바뀐 $$r$$을 받았다고 하자. 다른 부호어 $$c'$$도 $$r$$에서 거리 $$t$$ 이하라면 $$\Delta(c, c') \le \Delta(c, r) + \Delta(r, c') \le 2t < d$$가 되어 어긋난다. 그래서 $$r$$에서 거리 $$t$$ 안의 부호어는 $$c$$뿐이고, 가장 가까운 부호어를 고르면 $$c$$다. — 삼각부등식
4. **채우기 ($$d - 1$$개까지).** 지워진 자리를 뺀 나머지 자리에서 두 부호어 $$c, c'$$가 같다면, 둘은 지워진 자리에서만 다르니 $$\Delta(c, c') \le d - 1$$이 되어 어긋난다. 그래서 남은 자리와 맞는 부호어는 하나뿐이다. — 부호 거리의 정의 ∎

</details>


3번을 그림으로 보면, 부호어마다 반지름 $$t$$짜리 해밍 공을 그렸을 때 공들이 서로 겹치지 않는다는 말이다. 받은 열이 어느 공 안에 떨어졌는지 보면 보낸 부호어를 안다[^s1].

## 예제

**부호 $$\{0000, 0011, 1100, 1111\}$$의 능력.**

1. *모든 쌍의 거리:* `0000`–`0011` 2, `0000`–`1100` 2, `0000`–`1111` 4, `0011`–`1100` 4, `0011`–`1111` 2, `1100`–`1111` 2.
2. *부호 거리:* 가장 작은 값 2.
3. *능력:* $$d - 1 = 1$$개까지 알아챈다. $$\lfloor \frac{1}{2} \rfloor = 0$$개까지 고친다. 곧 하나도 못 고친다.
4. *확인:* `0000`에서 한 자리가 바뀐 `0001`은 `0000`과도 `0011`과도 거리 1이다. 어느 쪽이었는지 알 수 없다.

**가정이 깨지는 곳.** 정리는 "$$t$$개까지"만 보장한다. $$\{000, 111\}$$에서 두 자리가 바뀐 `011`은 `111`로 고쳐진다. 고쳤다고 믿지만 틀렸다.

## 활용

- 부호를 고를 때는 길이 $$n$$, 부호어 수, 부호 거리 $$d$$ 세 가지를 함께 본다. 거리를 키우면 더 많이 고치지만 부호어를 덜 넣게 되어 [부호 비율](/Hongs_Blog/studies/data-and-information/code-encoding/)이 내려간다[^s1].
- 알아채기만 하고 다시 보내 달라고 할지, 받은 쪽에서 바로 고칠지는 통신 환경에 따라 고른다: [오류 검출 코드](/Hongs_Blog/studies/computer-communication/error-detecting-code/), [오류 복구와 FEC](/Hongs_Blog/studies/computer-communication/error-recovery-fec/)
- 해밍 거리는 길이가 같은 열에만 쓴다. 글자가 빠지거나 끼어들어 길이가 달라지는 경우는 [편집 거리](/Hongs_Blog/studies/data-and-information/edit-distance/)로 잰다.
- 흔한 실수: 부호 거리를 "평균 거리"나 "가장 큰 거리"로 재는 것. 능력은 가장 가까운 쌍이 정한다.

## 연결

- 선수: [부호와 부호화](/Hongs_Blog/studies/data-and-information/code-encoding/)
- 해밍 거리가 거리의 조건을 지킨다는 것: [거리와 유사도](/Hongs_Blog/studies/data-and-information/distance-similarity/). 증명의 3번이 삼각부등식을 쓴다.
- 부호 거리를 행렬로 구하는 법: [선형 부호와 패리티 검사 행렬](/Hongs_Blog/studies/data-and-information/linear-code/)
- 공이 겹치지 않아야 한다는 셈: [비둘기집 원리](/Hongs_Blog/studies/discrete-math/pigeonhole/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `1011010`과 `1001110`의 해밍 거리와 각 열의 해밍 무게를 구하라.</summary>

**답:** 셋째와 다섯째 자리가 달라 거리 2. 무게는 둘 다 4.<br>
**이유:** 자리마다 XOR하면 `0010100`이고 1이 2개다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 부호 거리가 5인 부호는 오류를 몇 개까지 알아채고, 몇 개까지 고치고, 지워진 자리를 몇 개까지 채우는가?</summary>

**답:** 4개까지 알아챈다. 2개까지 고친다($$5 = 2 \cdot 2 + 1$$). 4개까지 채운다.<br>
**흔한 오답:** 고치는 개수를 4로 답하는 것. 고치려면 받은 열에서 가장 가까운 부호어가 하나뿐이어야 해서 절반만 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 증명에서 "$$t$$개까지 고친다"를 보일 때 $$\Delta(c, c') \le 2t$$라는 부등식은 어디서 나오는가? 그리고 왜 그것이 모순인가?</summary>

**답:** 해밍 거리의 삼각부등식 $$\Delta(c, c') \le \Delta(c, r) + \Delta(r, c')$$에서 나온다. 두 항이 각각 $$t$$ 이하라고 가정했기 때문이다. 부호 거리가 $$2t + 1$$ 이상이므로 서로 다른 두 부호어의 거리가 $$2t$$ 이하일 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 부호 거리가 2인 부호가 오류 1개를 고치지 못하는 예를 만들어라.</summary>

**답:** $$\{00, 11\}$$. `00`을 보냈는데 `01`이 오면 `00`과도 `11`과도 거리 1이라 어느 쪽인지 정할 수 없다. 틀린 것은 알지만 고치지는 못한다.

</details>


[^s1]: 증명은 Guruswami, Rudra, Sudan, *Essential Coding Theory*, 1.4절(Proposition 1.4.2)을 따랐고, 작은 부호에서 전수 검사로 확인했다(실험 확인은 증명이 아니라 진술을 다시 점검한 것이다).
{% endraw %}
