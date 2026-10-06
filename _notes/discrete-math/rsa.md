---
layout: "note"
title: "RSA 암호"
display_title: "RSA 암호 (RSA Cryptosystem)"
kind: "concept"
kind_label: "알고리즘"
num: "31"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["RSA", "RSA 암호", "RSA cryptosystem", "공개키 암호", "public-key cryptography", "비대칭 암호", "asymmetric cryptography", "공개키", "public key", "개인키", "private key", "전자서명", "digital signature", "밀러–라빈", "Miller–Rabin"]
description: "누구나 채울 수 있지만 열쇠를 가진 사람만 열 수 있는 자물쇠를 수학으로 만든 것이다. 두 큰 소수를 곱해 공개하고, 그 곱을 쪼개야만 알 수 있는 열쇠는 혼자 갖는다. 곱하기는 쉽고 소인수분해는 어렵다는 비대칭 덕분에, 미리 비밀을 나누지 않은 사람끼리도 암호문을 주고받고 전자서…"
prev_url: "/studies/discrete-math/fermat-euler/"
prev_title: "페르마 소정리와 오일러 정리"
next_url: "/studies/discrete-math/graph-basics/"
next_title: "그래프의 기초"
math: true
mermaid: false
code_count: 2
permalink: "/studies/discrete-math/rsa/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

누구나 채울 수 있지만 열쇠를 가진 사람만 열 수 있는 자물쇠를 수학으로 만든 것이다. 두 큰 소수를 곱해 공개하고, 그 곱을 쪼개야만 알 수 있는 열쇠는 혼자 갖는다. 곱하기는 쉽고 소인수분해는 어렵다는 비대칭 덕분에, 미리 비밀을 나누지 않은 사람끼리도 암호문을 주고받고 전자서명을 확인할 수 있다. 다만 교과서 그대로의 RSA는 같은 평문이 늘 같은 암호문이 되어 안전하지 않다. 실제로는 무작위 패딩을 붙이고, 소수는 2048비트 이상의 수를 만들 만큼 커야 한다.

</div>


## 예시로 보기

작은 수로 전 과정을 따라간다. 소수 $$p = 5$$, $$q = 11$$을 고른다.

1. $$n = 55$$, $$\varphi(n) = 4 \times 10 = 40$$.
2. $$\varphi(n)$$과 서로소인 $$e = 3$$을 공개 지수로 고른다.
3. $$3d \equiv 1 \pmod{40}$$($$a \equiv b \pmod m$$은 "$$a$$와 $$b$$를 $$m$$으로 나눈 나머지가 같다")에서 $$d = 27$$($$81 = 2 \times 40 + 1$$).
4. 공개키 $$(n, e) = (55, 3)$$, 개인키 $$d = 27$$.
5. 평문 $$m = 2$$를 암호화하면 $$2^3 \bmod 55 = 8$$. 복호하면 $$8^{27} \bmod 55 = 2$$.

$$n = 55$$를 아는 사람은 누구나 암호화할 수 있다. 하지만 $$d$$를 구하려면 $$\varphi(n) = 40$$이 필요하고, 그러려면 55를 $$5 \times 11$$로 쪼개야 한다. 실제로는 $$p, q$$가 각각 1024비트 이상이라 쪼갤 수 없다.

## 정의

**입력:** 서로 다른 큰 소수 $$p, q$$. **출력:** 공개키 $$(n, e)$$와 개인키 $$d$$. 평문과 암호문은 $$0 \le m < n$$인 정수다[^1].

```
KEYGEN(p, q)
  n ← p·q
  φ ← (p − 1)(q − 1)
  e ← gcd(e, φ) = 1인 작은 홀수 (보통 65537)
  d ← e⁻¹ mod φ              # 확장 유클리드 호제법
  return 공개키 (n, e), 개인키 d

ENCRYPT(m, n, e) = m^e mod n    # 빠른 거듭제곱
DECRYPT(c, n, d) = c^d mod n
```

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">정확성</div>

모든 $$0 \le m < n$$에 대해 $$(m^e)^d \equiv m \pmod n$$.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. *지수 풀기:* $$ed \equiv 1 \pmod{\varphi(n)}$$이라 $$ed = 1 + k(p - 1)(q - 1)$$인 정수 $$k \ge 0$$이 있다.
2. *법 $$p$$에서:* $$p \nmid m$$이면 [페르마 소정리](/Hongs_Blog/studies/discrete-math/fermat-euler/)로 $$m^{ed} = m \cdot (m^{p-1})^{k(q-1)} \equiv m \cdot 1 = m$$. $$p \mid m$$이면 양변이 모두 0이다. 어느 쪽이든 $$m^{ed} \equiv m \pmod p$$.
3. *법 $$q$$에서:* 같은 논리로 $$m^{ed} \equiv m \pmod q$$.
4. *합치기:* $$p$$와 $$q$$가 모두 $$m^{ed} - m$$을 나누고 서로소라 $$pq = n$$도 나눈다([중국인의 나머지 정리](/Hongs_Blog/studies/discrete-math/modular-inverse-crt/)의 유일성). ∎

$$\gcd(m, n) = 1$$이면 오일러 정리로 한 줄에 끝나지만, 위 증명은 $$m$$이 $$p$$나 $$q$$의 배수인 드문 경우까지 포함한다.

</details>


**실행 추적.** 흔히 쓰는 교과서 예 $$p = 61$$, $$q = 53$$, $$e = 17$$[^s1].

| 단계 | 계산 | 값 |
|---|---|---|
| 곱 | $$n = 61 \times 53$$ | 3233 |
| 피 함수 | $$\varphi = 60 \times 52$$ | 3120 |
| 개인 지수 | $$17d \equiv 1 \pmod{3120}$$ | $$d = 2753$$ |
| 암호화 | $$65^{17} \bmod 3233$$ | 2790 |
| 복호 | $$2790^{2753} \bmod 3233$$ | 65 |

**복잡도.** 암호화와 복호는 빠른 거듭제곱이라 $$k$$비트 $$n$$에서 곱셈 $$O(k)$$번, 곱셈 하나가 $$O(k^2)$$ 비트 연산이면 모두 $$O(k^3)$$이다. 키 생성의 비용은 대부분 큰 소수를 찾는 데 든다. 무작위 홀수를 뽑아 밀러–라빈 판정을 되풀이하며, 소수 정리에 따라 $$k$$비트 홀수 약 $$\frac{k \ln 2}{2}$$개 중 하나꼴로 소수다. 1024비트면 355개 중 하나꼴이다[^1].

## 예제

**왜 안전한가, 그리고 언제 깨지는가.**

1. *공격자가 아는 것:* $$n$$, $$e$$, 암호문 $$c$$.
2. *필요한 것:* $$d$$. $$d$$는 $$\varphi(n)$$에서 나오고, $$\varphi(n)$$을 알면 $$p + q = n - \varphi(n) + 1$$과 $$pq = n$$에서 이차방정식으로 $$p, q$$가 나온다. 그래서 $$\varphi(n)$$을 구하는 것은 $$n$$을 인수분해하는 것만큼 어렵다[^s1].
3. *약한 설정:* 위 작은 예에서 $$m = 2$$, $$e = 3$$이면 $$m^3 = 8 < n$$이라 $$\bmod n$$이 아무 일도 하지 않았다. 공격자는 $$\sqrt[3]{8} = 2$$로 평문을 바로 얻는다. 또 같은 평문은 늘 같은 암호문이 되어, "예/아니오" 같은 짧은 메시지는 후보를 모두 암호화해 비교하면 들킨다.
4. *실제 대책:* 평문에 무작위 비트를 섞는 패딩(OAEP)을 붙여 암호화한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 작은 예(55, 3, 27, 8)와 추적 표(3233, 3120, 2753, 2790)를 계산, $$0 \le m < 3233$$의 모든 평문이 복호로 돌아옴($$p, q$$의 배수 포함), 512비트 소수 두 개로 만든 키에서 20회 왕복, CRT 복호가 같은 값, $$\varphi(n)$$에서 $$p, q$$ 되살리기, 세제곱근 공격 — [31_rsa_impl.py](/Hongs_Blog/studies/discrete-math/code/31_rsa_impl/), [31_rsa_verify.py](/Hongs_Blog/studies/discrete-math/code/31_rsa_verify/)</div>

</div>


## 활용

- **전자서명.** 개인키로 $$s = h^d \bmod n$$($$h$$는 문서의 해시)을 만들면, 누구나 공개키로 $$s^e \equiv h$$인지 확인한다. 웹 인증서의 서명에 널리 쓰인다. TLS 1.3에서는 RSA로 세션 키를 직접 주고받는 방식은 빠졌고, 서명 용도로 쓴다[^s2].
- **구현.** 실제 복호는 $$\bmod p$$, $$\bmod q$$에서 따로 계산해 [중국인의 나머지 정리](/Hongs_Blog/studies/discrete-math/modular-inverse-crt/)로 합친다. 교육용 구현: [31_rsa_impl.py](/Hongs_Blog/studies/discrete-math/code/31_rsa_impl/).
- **흔한 실수.** 직접 만든 RSA를 쓰는 것. 패딩, 부채널 공격, 난수 품질까지 챙긴 검증된 라이브러리를 쓴다.

## 연결

- 선수: [페르마 소정리와 오일러 정리](/Hongs_Blog/studies/discrete-math/fermat-euler/)
- 부품: [확장 유클리드 호제법](/Hongs_Blog/studies/discrete-math/gcd-euclid/)(개인키), [소수](/Hongs_Blog/studies/discrete-math/primes/)(키 생성과 안전성), [중국인의 나머지 정리](/Hongs_Blog/studies/discrete-math/modular-inverse-crt/)(빠른 복호)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"수식대로 구현한 RSA면 안전하다"</div>

틀렸다. 수식이 정확하게 복호되니 안전도 보장되는 것처럼 보인다. 하지만 교과서 RSA는 결정적이다. 같은 평문은 늘 같은 암호문이 되고, 작은 평문과 작은 $$e$$에서는 $$m^e < n$$이라 거듭제곱근으로 바로 풀린다($$m = 2$$, $$e = 3$$, $$n = 55$$에서 $$c = 8$$). 또 두 암호문을 곱하면 두 평문의 곱의 암호문이 되어 공격자가 암호문을 조작할 수 있다. 실제 RSA는 무작위 패딩(OAEP)을 붙이고, 서명에도 전용 패딩(PSS)을 쓴다[^s2].

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$p = 5$$, $$q = 11$$, $$e = 3$$일 때 $$n$$, $$\varphi(n)$$, $$d$$를 구하고 평문 $$m = 2$$의 암호문을 계산하라.</summary>

**답:** $$n = 55$$, $$\varphi = 40$$, $$3d \equiv 1 \pmod{40}$$에서 $$d = 27$$. 암호문은 $$2^3 \bmod 55 = 8$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 아래 두 줄이 각각 하는 일을 쉬운 말로 설명하라.</summary>

```python
d = pow(e, -1, (p - 1) * (q - 1))
m = pow(c, d, p * q)
```
**답:** 첫 줄은 $$\varphi(n)$$을 법으로 한 $$e$$의 역원, 즉 개인 지수 $$d$$를 확장 유클리드 호제법으로 구한다. 둘째 줄은 암호문 $$c$$를 $$d$$제곱해 $$n$$으로 나눈 나머지로, 복호한 평문이다. 빠른 거듭제곱이라 큰 지수도 금방 계산된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 공개 지수 $$e$$가 $$\varphi(n)$$과 서로소여야 하는 이유는?</summary>

**답:** 개인 지수 $$d$$는 $$e$$의 법 $$\varphi(n)$$에 대한 역원인데, 역원은 서로소일 때만 있다. 서로소가 아니면 서로 다른 평문이 같은 암호문으로 가서 복호가 하나로 정해지지 않는다. 예: $$n = 55$$, $$e = 5$$이면 $$\gcd(5, 40) = 5$$라 $$d$$가 없다.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 9장 "Number Theory"(RSA와 정확성 증명). Cormen et al., *Introduction to Algorithms* 3판, 31.7절 "The RSA public-key cryptosystem", 31.8절(소수 찾기와 밀러–라빈).
[^s1]: 에이전트 보충. $$p = 61$$, $$q = 53$$, $$e = 17$$의 예는 여러 교재와 해설에서 쓰는 값이다. 모든 값과 "$$\varphi(n)$$을 알면 $$p, q$$가 나온다"는 31_rsa_verify.py에서 계산으로 확인했다.
[^s2]: 에이전트 보충. OAEP와 PSS 패딩은 PKCS #1 v2.2(RFC 8017)에 정의되어 있다. TLS 1.3(RFC 8446)은 RSA 키 전송을 없애고 RSA를 서명에만 쓴다.
{% endraw %}
