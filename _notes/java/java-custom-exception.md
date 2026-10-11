---
layout: "note"
title: "사용자 정의 예외"
display_title: "사용자 정의 예외 (User-Defined Exception)"
kind: "concept"
kind_label: "기법"
num: "37"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
updated: "2026-10-11"
status: "verified"
aliases: ["User-Defined Exception", "Custom Exception", "커스텀 예외", "InsufficientException"]
description: "자바가 미리 만들어 둔 사고 종류에는 \"잔액이 모자란다\" 같은 내 프로그램만의 사고가 없다. 그럴 때 사고 종류를 직접 하나 만든다. 이름만 봐도 무슨 사고인지 알 수 있고, 받는 쪽에서 그 사고만 골라 처리할 수 있다. 만들 때 어느 부모 밑에 둘지를 골라야 한다. 그 선택에 따…"
prev_url: "/studies/java/java-throw/"
prev_title: "예외 던지기"
next_url: "/studies/java/java-generics/"
next_title: "제네릭"
math: false
mermaid: false
code_count: 1
permalink: "/studies/java/java-custom-exception/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

자바가 미리 만들어 둔 사고 종류에는 "잔액이 모자란다" 같은 내 프로그램만의 사고가 없다. 그럴 때 사고 종류를 직접 하나 만든다. 이름만 봐도 무슨 사고인지 알 수 있고, 받는 쪽에서 그 사고만 골라 처리할 수 있다. 만들 때 어느 부모 밑에 둘지를 골라야 한다. 그 선택에 따라, 쓰는 사람이 대비 코드를 꼭 써야 하는지가 갈린다.

</div>


## 예시로 보기

계좌에서 잔액보다 많은 돈을 찾으려 하면 막아야 한다. `withdraw`가 아무것도 안 하고 조용히 끝나면 부른 쪽은 돈이 나간 줄 안다. `false`를 돌려주게 해도 부른 쪽이 그 값을 안 보면 그만이다. 예외를 일으키면 부른 쪽이 모르고 지나갈 수 없다. 표준 라이브러리에는 "잔액 부족" 예외가 없으니 직접 만든다[^1].

```java
public class InsufficientException extends Exception {
    public InsufficientException() {}
    public InsufficientException(String message) {
        super(message);
    }
}
```

```java
public class Account {
    private long balance;

    public Account() {}

    public long getBalance() {
        return balance;
    }

    public void deposit(long money) {
        balance += money;
    }

    public void withdraw(long money) throws InsufficientException {
        if (balance < money) {
            throw new InsufficientException("Insufficient balance: need more " + (money - balance) + " won.");
        }
        balance -= money;
    }
}
```

`withdraw`는 잔액이 모자라면 `throw`로 예외를 일으키고, 선언에 `throws InsufficientException`을 붙여 부른 쪽에 넘긴다[^2]. 10000원을 넣고 돈을 찾아 본다[^3].

```java
Account account = new Account();

account.deposit(10000);
System.out.println("Deposit: " + account.getBalance());

try {
    account.withdraw(5000);
} catch (InsufficientException e) {
    String message = e.getMessage();
    System.out.println(message);
} finally {
    System.out.println("Deposit: " + account.getBalance());
}
```

찾는 돈을 바꿔 가며 돌린 결과다[^s1].

| `withdraw`에 준 돈 | 찍히는 줄 |
|---|---|
| 5000 (슬라이드 그대로) | `Deposit: 10000` → `Deposit: 5000` |
| 30000 | `Deposit: 10000` → `Insufficient balance: need more 20000 won.` → `Deposit: 10000` |
| 10000 (잔액과 같다) | `Deposit: 10000` → `Deposit: 0` |
| 10001 (1원 모자란다) | `Deposit: 10000` → `Insufficient balance: need more 1 won.` → `Deposit: 10000` |

30000원을 찾으려 하면 20000원이 모자란다(30000 − 10000). `throw`에서 메서드가 끝나므로 그 아래의 `balance -= money`는 실행되지 않고, 잔액은 10000 그대로다. 조건이 `balance < money`라서 잔액과 꼭 같은 돈은 찾을 수 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 네 줄, 예외의 종류, 생성자 두 개의 메시지, 실행 예외로 만든 판 — [37_java-custom-exception_impl.java](/Hongs_Blog/studies/java/code/37_java-custom-exception_impl/)</div>

</div>


## 정의

**사용자 정의 예외**는 표준 라이브러리에 없어서 직접 선언하는 예외 클래스다. 일반 예외로 만들려면 `Exception`의 자식으로, 실행 예외로 만들려면 `RuntimeException`의 자식으로 선언한다[^1].

```java
public class XXXException extends Exception {        // 또는 extends RuntimeException
    public XXXException() {
    }
    public XXXException(String message) {
        super(message);
    }
}
```

생성자는 보통 둘을 둔다. 인자 없는 기본 생성자와, 사고 설명 글을 받는 생성자다. 글을 받는 생성자는 [super(message)](/Hongs_Blog/studies/java/java-super-constructor/)로 그 글을 부모에게 넘긴다. 부모(`Exception`)가 글을 보관하고 있다가 `getMessage()`를 부르면 돌려준다[^1].

일으킬 때는 `throw` 뒤에 객체를 만들어 준다. 사고 원인을 알리는 글은 생성자 인자로 넣는다[^4].

```java
throw new InsufficientException();
throw new InsufficientException("예외메시지");
```

기본 생성자로 만든 예외의 `getMessage()`는 `null`을 돌려준다[^s1].

### 어느 부모 밑에 둘까

| 부모 | 종류 | 일으키는 메서드 | 부르는 쪽 |
|---|---|---|---|
| `Exception` | 일반 예외 | `throws`를 꼭 붙인다 | `try-catch`나 `throws`가 없으면 번역되지 않는다 |
| `RuntimeException` | 실행 예외 | `throws` 없이도 된다 | 대비 코드 없이도 번역된다. 안 받으면 실행 중에 끝난다 |

`InsufficientException`을 `Exception`의 자식으로 두었기 때문에, `withdraw`에서 `throws`를 빼면 `unreported exception InsufficientException; must be caught or declared to be thrown` 오류가 난다[^s2]. 부르는 사람이 "잔액 부족"에 꼭 대비하게 하고 싶으면 일반 예외로, 대비를 맡기고 싶으면 실행 예외로 만든다.

## 활용

- 예외 클래스 이름은 `Exception`으로 끝낸다. 슬라이드의 틀이 `XXXException`이고, 표준 예외도 모두 그렇다[^1].
- 메시지에는 수습에 필요한 숫자를 넣는다. 위 예는 "모자란다"만이 아니라 얼마가 모자라는지(`money - balance`)를 넣었다.
- 사고 검사는 상태를 바꾸기 전에 한다. `withdraw`는 `balance -= money`보다 `throw`가 먼저라서, 예외가 난 뒤에도 잔액이 망가지지 않는다.
- 사용자 정의 예외도 `Exception`의 자손이라 `catch (Exception e)`에 걸린다. 따로 처리하려면 그 앞에 `catch (InsufficientException e)`를 둔다([try-catch-finally](/Hongs_Blog/studies/java/java-try-catch/)의 순서 규칙).

## 연결

- 선수: [예외 던지기](/Hongs_Blog/studies/java/java-throw/)(`throw`와 `throws`), [예외와 예외 클래스](/Hongs_Blog/studies/java/java-exception/)(부모에 따라 종류가 정해진다)
- 만드는 방법은 [상속](/Hongs_Blog/studies/java/java-inheritance/)과 [부모 생성자 호출](/Hongs_Blog/studies/java/java-super-constructor/) 그대로다. 새로 배울 문법은 없다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 나이에 음수가 들어오면 일으킬 `InvalidAgeException`을 실행 예외로 선언하라. 생성자는 기본 생성자와 메시지를 받는 생성자 둘이다.</summary>

**답:** `public class InvalidAgeException extends RuntimeException { public InvalidAgeException() {} public InvalidAgeException(String message) { super(message); } }`<br>
**이유:** 실행 예외이므로 부모는 `RuntimeException`이다. `Exception`을 부모로 쓰면 일반 예외가 된다. `super(message)`를 빼먹으면 `getMessage()`가 `null`을 돌려준다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 본문의 `Account`에 10000원을 넣은 뒤 `try { account.withdraw(30000); } catch (InsufficientException e) { System.out.println(e.getMessage()); } finally { System.out.println("Deposit: " + account.getBalance()); }`를 실행하면 무엇이 찍히는가?</summary>

**답:** `Insufficient balance: need more 20000 won.` 다음 줄에 `Deposit: 10000`.<br>
**이유:** 10000 < 30000이라 `throw`가 실행되고, 메시지의 숫자는 30000 − 10000 = 20000이다. `throw`에서 `withdraw`가 끝나므로 `balance -= money`는 실행되지 않아 잔액은 10000 그대로다. `Deposit: -20000`이라고 답하면 `throw` 뒤의 줄이 실행된다고 본 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `InsufficientException`의 부모를 `Exception`에서 `RuntimeException`으로 바꾸면 `Account`를 쓰는 사람에게 무엇이 달라지는가? 어느 쪽이 "잔액 부족"에 어울리는가?</summary>

**답:** `withdraw`를 `try-catch` 없이 불러도 번역된다. 대신 대비를 깜빡한 채 잔액이 모자라면 프로그램이 실행 중에 끝난다. 잔액 부족은 정상으로 쓰다가도 흔히 만나는 일이고 부른 쪽이 수습할 수 있으므로(다시 입력받기 등), 대비를 강제하는 일반 예외가 어울린다.<br>
**이유:** 일반 예외는 번역기가 처리 코드를 검사하고, 실행 예외는 검사하지 않는다. 슬라이드도 `extends Exception`으로 만들었다.

</details>


[^1]: 소프트웨어 프로젝트 15회 강의 자료 「Software Project 15. Exception handling」, p.18 (사용자 정의 예외의 뜻, 부모 고르기, 생성자 두 개의 틀), p.20 (InsufficientException.java)
[^2]: 같은 자료, p.21 (Account.java)
[^3]: 같은 자료, p.22 (AccountExample.java)
[^4]: 같은 자료, p.19 (throw로 예외 객체 주기, 메시지는 생성자 인자로)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 실행 결과는 원본에 없다. 원본 p.22는 5000원을 찾아 예외가 나지 않는 경우만 싣는다. 30000원, 10000원, 10001원의 경우와 `getMessage()`가 `null`인 경우는 검증 코드로 확인했다. 예시로 보기 첫 문단의 "조용히 끝나거나 `false`를 돌려주는 방법"과의 비교도 원본에 없다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 부모에 따른 차이 표, 번역 오류 문구, 활용의 항목들, 카드 세 장은 원본에 없다. 번역 오류는 JDK 21 javac로, 실행 예외로 만든 판(`NegativeAmountException`)은 검증 코드로 확인했다.
{% endraw %}
