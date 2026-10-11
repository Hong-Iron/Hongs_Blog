---
layout: "note"
title: "08_java-reference-equality_impl.java"
display_title: "08_java-reference-equality_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "08"
course: "소프트웨어 프로젝트"
course_slug: "software-project"
course_url: "/studies/software-project/"
track: "컴퓨터 과학"
parent_url: "/studies/software-project/java-reference-equality/"
parent_title: "참조 비교와 null"
description: "소프트웨어 프로젝트 · 참조 비교와 null 구현 코드"
permalink: "/studies/software-project/code/08_java-reference-equality_impl/"
---
{% raw %}
[참조 비교와 null](/Hongs_Blog/studies/software-project/java-reference-equality/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 08_java-reference-equality_impl.java
// 참조 비교와 null 문서의 출력과 값을 확인한다.

import java.util.Arrays;

class ReferenceEqualityImpl {
    static void check(boolean ok, String what) {
        if (!ok) throw new AssertionError(what);
    }

    public static void main(String[] args) {
        // 1. 슬라이드 그림: refVar1 -> 객체1, refVar2와 refVar3 -> 객체2
        int[] refVar1 = {1, 2, 3};
        int[] refVar2 = {1, 2, 3};
        int[] refVar3 = refVar2;
        check((refVar1 == refVar2) == false, "내용이 같아도 다른 객체면 == 는 false");
        check((refVar1 != refVar2) == true, "!= 는 true");
        check((refVar2 == refVar3) == true, "같은 객체면 == 는 true");
        check((refVar2 != refVar3) == false, "!= 는 false");
        // 내용을 비교하려면 따로 비교 메서드를 쓴다
        check(Arrays.equals(refVar1, refVar2), "Arrays.equals는 칸을 하나씩 비교한다");
        check(refVar1.equals(refVar2) == false, "배열의 equals는 == 와 같다");

        // 2. 기본 타입의 == 는 값을 비교한다
        int a = 1000, b = 1000;
        check(a == b, "기본 타입은 값이 같으면 true");

        // 3. null: 아무 객체도 가리키지 않는다
        String refVar = null;
        check(refVar == null, "null과는 == 로 비교한다");
        int[] arr = null;
        check(arr == null, "배열 변수도 null을 담을 수 있다");
        String s1 = null, s2 = null;
        check(s1 == s2, "null == null 은 true");

        // 4. null인 변수로 객체를 쓰려 하면 NullPointerException
        boolean npe = false;
        String message = "";
        try {
            int len = refVar.length();
        } catch (NullPointerException e) {
            npe = true;
            message = e.getMessage();
        }
        check(npe, "null.length()는 NullPointerException");
        check(message.contains("String.length()"), "메시지가 어떤 호출인지 알려 준다: " + message);
        System.out.println("NPE 메시지 1: " + message);

        npe = false;
        try {
            arr[0] = 10;
        } catch (NullPointerException e) {
            npe = true;
            System.out.println("NPE 메시지 2: " + e.getMessage());
        }
        check(npe, "null 배열의 칸에 넣으면 NullPointerException");

        npe = false;
        try {
            int n = arr.length;
        } catch (NullPointerException e) {
            npe = true;
            System.out.println("NPE 메시지 3: " + e.getMessage());
        }
        check(npe, "null 배열의 length도 NullPointerException");

        // 5. 막는 법: 쓰기 전에 null인지 본다
        int length = (refVar != null) ? refVar.length() : 0;
        check(length == 0, "null이면 0");
        boolean ok = refVar != null && refVar.length() > 0;   // &&는 앞이 false면 뒤를 보지 않는다
        check(ok == false, "&&로 막는다");
        check("자바".equals(refVar) == false, "리터럴 쪽에서 equals를 부르면 안전하다");
        npe = false;
        try {
            boolean r = refVar.equals("자바");
        } catch (NullPointerException e) {
            npe = true;
        }
        check(npe, "null 쪽에서 equals를 부르면 NullPointerException");

        // 6. 주소를 넣어 주면 해결된다 (슬라이드: refVar1은 "자바"를 가리킨다)
        refVar = "자바";
        check(refVar.length() == 2, "이제 length()를 부를 수 있다");

        // 7. null은 "빈 것"과 다르다
        String empty = "";
        int[] zero = new int[0];
        check(empty != null && empty.length() == 0, "빈 문자열은 객체가 있다");
        check(zero != null && zero.length == 0, "길이 0 배열도 객체가 있다");

        // 8. 문자열에 null을 이어 붙이면 "null"이라는 글자가 된다
        String nothing = null;
        check(("값: " + nothing).equals("값: null"), "null + 문자열");

        // 9. 카드
        int[] x = {5};
        int[] y = {5};
        int[] z = x;
        z[0] = 6;
        check((x == y) == false && (x == z) == true && x[0] == 6 && y[0] == 5, "카드 추적");
        y = z;
        check(x == y, "대입 뒤에는 같은 객체");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
