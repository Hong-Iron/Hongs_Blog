---
layout: "note"
title: "37_java-custom-exception_impl.java"
display_title: "37_java-custom-exception_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "37"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/java-custom-exception/"
parent_title: "사용자 정의 예외"
description: "자바 프로그래밍 · 사용자 정의 예외 구현 코드"
sitemap: false
permalink: "/studies/java/code/37_java-custom-exception_impl/"
---
{% raw %}
[사용자 정의 예외](/Hongs_Blog/studies/java/java-custom-exception/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 37_java-custom-exception_impl.java
// (JDK 21. 이 파일이 있는 폴더에서 실행한다. 다른 파일을 불러오지 않는다.)
// 문서 「사용자 정의 예외」의 계좌 예제 출력과 카드의 답을 확인한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

// 맨 위 클래스에 main이 있어야 한 파일 실행이 된다. 예외 클래스와 Account는 아래쪽에 있다.
class CustomExceptionImpl {

    // System.out에 찍히는 글자를 모아 문자열로 돌려준다. 예외가 빠져나오면 그 예외를 그대로 다시 던진다.
    interface Body { void run() throws Throwable; }
    static String capture(Body body) throws Throwable {
        PrintStream old = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        System.setOut(new PrintStream(buf, true));
        try {
            body.run();
        } finally {
            System.setOut(old);
        }
        return buf.toString().replace("\r\n", "\n");
    }
    static void check(boolean ok, String what) {
        if (!ok) throw new AssertionError("FAILED: " + what);
        System.out.println("ok  " + what);
    }
    static void same(String got, String want, String what) {
        if (!got.equals(want)) throw new AssertionError("FAILED: " + what + "\n--- got ---\n" + got + "--- want ---\n" + want);
        System.out.println("ok  " + what);
    }

    // 슬라이드 p.22 AccountExample. 찾는 돈만 바꿔 가며 돌린다.
    static void example(long money) {
        Account account = new Account();

        account.deposit(10000);
        System.out.println("Deposit: " + account.getBalance());

        try {
            account.withdraw(money);
        } catch (InsufficientException e) {
            String message = e.getMessage();
            System.out.println(message);
        } finally {
            System.out.println("Deposit: " + account.getBalance());
        }
    }

    public static void main(String[] args) throws Throwable {
        same(capture(() -> example(5000)), "Deposit: 10000\nDeposit: 5000\n", "p.22 그대로(5000원 찾기): 예외 없음");
        same(capture(() -> example(30000)),
                "Deposit: 10000\nInsufficient balance: need more 20000 won.\nDeposit: 10000\n",
                "30000원 찾기: 예외가 나고 잔액은 그대로");
        same(capture(() -> example(10000)), "Deposit: 10000\nDeposit: 0\n", "경계: 잔액과 같은 돈은 찾을 수 있다");
        same(capture(() -> example(10001)),
                "Deposit: 10000\nInsufficient balance: need more 1 won.\nDeposit: 10000\n", "경계: 1원 모자라면 예외");

        // 종류
        Object e1 = new InsufficientException("m");
        check(e1 instanceof Exception && !(e1 instanceof RuntimeException), "InsufficientException은 일반 예외");
        Object e2 = new NegativeAmountException("m");
        check(e2 instanceof RuntimeException, "NegativeAmountException은 실행 예외");

        // 생성자 두 개
        check(new InsufficientException().getMessage() == null, "기본 생성자로 만들면 메시지는 null");
        check("m".equals(new InsufficientException("m").getMessage()), "super(message)로 넘긴 글이 getMessage()로 나온다");

        // 부모 타입 catch에도 걸린다
        String who = "";
        try { new Account().withdraw(1); } catch (Exception e) { who = e.getClass().getSimpleName(); }
        check(who.equals("InsufficientException"), "catch (Exception e)에도 걸린다");

        // 실행 예외 판: try 없이 불러도 컴파일된다
        String m = "";
        try { new Account().deposit(-5); } catch (NegativeAmountException e) { m = e.getMessage(); }
        check(m.equals("negative amount: -5"), "실행 예외 판의 메시지");

        System.out.println("ALL CHECKS PASSED");
    }
}

// 슬라이드 p.20 InsufficientException (일반 예외)
class InsufficientException extends Exception {
    public InsufficientException() {}
    public InsufficientException(String message) {
        super(message);
    }
}

// 같은 것을 실행 예외로 만든 판 (보충)
class NegativeAmountException extends RuntimeException {
    public NegativeAmountException(String message) {
        super(message);
    }
}

// 슬라이드 p.21 Account
class Account {
    private long balance;

    public Account() {}

    public long getBalance() {
        return balance;
    }

    public void deposit(long money) {
        if (money < 0) {
            throw new NegativeAmountException("negative amount: " + money);   // throws 없이도 컴파일된다
        }
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
{% endraw %}
