---
layout: "note"
title: "26_java-interface-methods_impl.java"
display_title: "26_java-interface-methods_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "26"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/java-interface-methods/"
parent_title: "디폴트·정적·private 메서드"
description: "자바 프로그래밍 · 디폴트·정적·private 메서드 구현 코드"
sitemap: false
permalink: "/studies/java/code/26_java-interface-methods_impl/"
---
{% raw %}
[디폴트·정적·private 메서드](/Hongs_Blog/studies/java/java-interface-methods/) 문서의 구현 코드다.

```java
// 인터페이스의 디폴트·정적·private 메서드
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 26_java-interface-methods_impl.java
// 문서(26.디폴트·정적·private 메서드.md)에 실은 출력과 카드의 답을 직접 비교한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

class InterfaceMethodsCheck {
    static String capture(Runnable r) {
        PrintStream old = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        System.setOut(new PrintStream(buf));
        try { r.run(); } finally { System.setOut(old); }
        return buf.toString();
    }

    static void check(String name, String got, String want) {
        if (!got.equals(want)) throw new AssertionError(name + "\n--- got ---\n" + got + "--- want ---\n" + want);
        System.out.println("ok: " + name);
    }

    public static void main(String[] args) {
        // 디폴트 메서드: 구현 클래스가 아무것도 안 써도 쓸 수 있다
        check("디폴트 메서드를 그대로 쓴다", capture(() -> {
            RemoteControl rc = new Television();
            rc.setMute(true);
            rc.setMute(false);
        }), "Mute on\nVolume 0\nMute off\nVolume 5\n");

        // 디폴트 메서드를 다시 정의한 구현 클래스
        check("디폴트 메서드를 다시 정의한다", capture(() -> {
            RemoteControl rc = new Audio();
            rc.setMute(true);
        }), "Audio mute on\n");

        // 정적 메서드: 객체 없이 인터페이스 이름으로 부른다
        check("정적 메서드", capture(() -> RemoteControl.changeBattery()), "Change battery\n");

        // 슬라이드의 Service 예제
        check("Service.staticMethod1", capture(() -> Service.staticMethod1()), "staticMethod1\nstaticCommon\n");
        check("Service.staticMethod2", capture(() -> Service.staticMethod2()), "staticMethod2\nstaticCommon\n");
        Service s = new ServiceImpl();
        check("defaultMethod1", capture(() -> s.defaultMethod1()), "defaultMethod1\ndefaultCommon\n");
        check("defaultMethod2", capture(() -> s.defaultMethod2()), "defaultMethod2\ndefaultCommon\nstaticCommon\n");

        // 카드 C3
        check("카드 C3", capture(() -> {
            Service x = new ServiceImpl();
            x.defaultMethod2();
            Service.staticMethod1();
        }), "defaultMethod2\ndefaultCommon\nstaticCommon\nstaticMethod1\nstaticCommon\n");

        System.out.println("ALL CHECKS PASSED");
    }
}

interface RemoteControl {
    int MAX_VOLUME = 10;
    int MIN_VOLUME = 0;

    void setVolume(int volume);                 // 추상 메서드

    default void setMute(boolean mute) {        // 디폴트 메서드
        if (mute) {
            System.out.println("Mute on");
            setVolume(MIN_VOLUME);              // 상수를 읽고 추상 메서드를 부른다
        } else {
            System.out.println("Mute off");
            setVolume(MAX_VOLUME / 2);
        }
    }

    static void changeBattery() {               // 정적 메서드
        System.out.println("Change battery");
    }
}

class Television implements RemoteControl {
    @Override
    public void setVolume(int volume) { System.out.println("Volume " + volume); }
}

class Audio implements RemoteControl {
    @Override
    public void setVolume(int volume) { System.out.println("Audio volume " + volume); }
    @Override
    public void setMute(boolean mute) { System.out.println(mute ? "Audio mute on" : "Audio mute off"); }
}

interface Service {
    default void defaultMethod1() {
        System.out.println("defaultMethod1");
        defaultCommon();
    }

    default void defaultMethod2() {
        System.out.println("defaultMethod2");
        defaultCommon();
        staticCommon();
    }

    private void defaultCommon() {
        System.out.println("defaultCommon");
    }

    static void staticMethod1() {
        System.out.println("staticMethod1");
        staticCommon();
    }

    static void staticMethod2() {
        System.out.println("staticMethod2");
        staticCommon();
    }

    private static void staticCommon() {
        System.out.println("staticCommon");
    }
}

class ServiceImpl implements Service { }
```
{% endraw %}
