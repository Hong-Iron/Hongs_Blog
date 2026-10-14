---
layout: "note"
title: "슬라이스와 String·&str"
display_title: "슬라이스와 String·&str (Slices, String and &str)"
kind: "concept"
kind_label: "자료구조"
num: "09"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Slices", "Slice", "슬라이스", "String", "str", "&str", "문자열 슬라이스", "String Slice", "&[T]", "&mut [T]", "UTF-8", "글자 경계", "Char Boundary", "chars", "bytes", "char_indices", "역참조 강제 변환", "Deref Coercion", "문자열 리터럴", "String Literal", "E0277", "E0308", "E0505", "E0599"]
description: "책 한 권을 가진 것과, 그 책의 \"몇 쪽부터 몇 쪽까지\"를 가리키는 쪽지는 다르다. Rust에서 글을 가지고 늘리거나 줄이는 주인이 String이고, 그 글의 한 구간을 \"여기서부터 몇 바이트\"로 가리키기만 하는 쪽지가 &str이다(배열의 한 구간이면 &[T]). 쪽지는 글을 베…"
prev_url: "/studies/rust/lifetimes/"
prev_title: "수명"
next_url: "/studies/rust/structs-methods/"
next_title: "구조체와 메서드"
math: true
mermaid: false
code_count: 1
permalink: "/studies/rust/slices-strings/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

책 한 권을 가진 것과, 그 책의 "몇 쪽부터 몇 쪽까지"를 가리키는 쪽지는 다르다. Rust에서 글을 가지고 늘리거나 줄이는 주인이 `String`이고, 그 글의 한 구간을 "여기서부터 몇 바이트"로 가리키기만 하는 쪽지가 `&str`이다(배열의 한 구간이면 `&[T]`). 쪽지는 글을 베끼지 않아 싸고, 쪽지가 쓰이는 동안 원본이 바뀌거나 사라지면 컴파일러가 막는다. 대신 위치를 글자가 아닌 바이트로 세기 때문에, 한글처럼 한 글자가 여러 바이트인 글을 아무 데서나 자르면 프로그램이 멈춘다.

</div>


## 예시로 보기

문장에서 첫 단어를 돌려주는 함수가 필요하다. 첫 단어를 새 `String`으로 베껴 돌려주면 부를 때마다 힙에 자리를 새로 잡는다. 첫 단어가 끝나는 위치(`"hello world"`라면 5)만 돌려주면 싸지만, 그 숫자는 원래 문자열과 묶여 있지 않다. 문자열을 `clear()`로 비워도 숫자 5는 그대로 남는다. 이제 아무 뜻도 없는 숫자다[^1].

해법은 원래 문자열의 한 구간을 빌려 주는 것이다. 이것을 슬라이스(slice)라 부른다. 문자열의 슬라이스는 타입이 `&str`이다[^1].

```rust
fn first_word(s: &str) -> &str {
    s.split(' ').next().unwrap_or("")
}

let s = String::from("hello world");
let hello = first_word(&s); // "hello"
let world = &s[6..];        // 6번 바이트부터 끝까지: "world"
```

메모리에서 보면 이렇다. `String`은 스택의 세 칸(주소, 길이, 용량)이고 글자는 힙에 있다([소유권과 이동](/Hongs_Blog/studies/rust/ownership-move/)). `world`는 스택의 두 칸이다. 시작 주소와 길이뿐이다[^1].

```
           스택                           힙 (s가 가진 버퍼)
         ┌──────────┐                         0   1   2   3   4   5   6   7   8   9  10
 s       │ ptr ─────┼──────────────────────▶┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
 String  │ len  11  │                       │ h │ e │ l │ l │ o │   │ w │ o │ r │ l │ d │
         │ cap  11  │                       └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
         ├──────────┤                                                 ▲
 world   │ ptr ─────┼─────────────────────────────────────────────────┘
 &str    │ len   5  │
         └──────────┘
```

`world`의 주소는 `s`의 버퍼 주소에 6을 더한 값이다. 글자를 베끼지 않았다는 뜻이다. 64비트 기계에서 `String`은 24바이트, `&str`은 16바이트다[^s1].

이 쪽지는 원본을 빌린 것이라서, 쓰이는 동안 원본을 고치지 못한다. 앞에서 걱정한 코드를 그대로 쓰면 컴파일되지 않는다[^1].

```rust
let mut s = String::from("hello world");
let w = first_word(&s);
s.clear();            // error[E0502]
println!("{w}");
```

컴파일러는 세 자리를 짚는다. `first_word(&s)`에 "immutable borrow occurs here", `s.clear()`에 "mutable borrow occurs here", `println!`에 "immutable borrow later used here"다. `clear`는 `&mut s`가 필요한데, `w`가 아직 `s`를 빌리고 있다([빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/)).

쪽지 비유가 틀어지는 곳이 하나 있다. 종이 쪽지는 책을 고쳐도 막지 못하지만, Rust의 슬라이스가 살아 있는 동안에는 주인도 원본을 고칠 수 없다.

코드에 직접 적은 글 `"hello"`(문자열 리터럴)도 `&str`이다. 글자는 실행 파일 안에 들어 있고, 리터럴은 그 자리를 가리키는 슬라이스다. 그래서 리터럴은 고칠 수 없다[^1]. 프로그램이 끝날 때까지 그 자리에 있으므로 타입을 끝까지 적으면 `&'static str`이다[^2].

```
 lit     ┌──────────┐        실행 파일 안의 글자
 &str    │ ptr ─────┼──────▶ ┌───┬───┬───┬───┬───┐
         │ len   5  │        │ h │ e │ l │ l │ o │
         └──────────┘        └───┴───┴───┴───┴───┘
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 크기(`String` 24, `&str`·`&[i32]`·`Box<str>` 16, `&String` 8), 슬라이스 주소가 원본 주소 + 6인 것, 바이트 길이와 글자 수 표, `chars`·`bytes`·`char_indices` 결과, 글자 경계 panic 메시지와 `get`의 `None`, 오류 E0277·E0502·E0505·E0308(두 경우)·E0599, clippy `ptr_arg`·`char_indices_as_byte_indices`, `prefix_chars`가 시험한 입력(7가지 글, n = 0~14) 모두에서 panic 없이 n글자를 돌려주는 것, 확인 문제 C1의 출력을 rustc 1.99.0으로 확인했다 — [09_slices-strings_verify.rs](/Hongs_Blog/studies/rust/code/09_slices-strings_verify/)</div>

</div>


## 정의

슬라이스는 이어진 원소들 가운데 한 구간을 빌린 참조다. 원소를 소유하지 않는다. 안에는 시작 원소의 주소와 길이, 두 값만 든다[^1][^3].

| 타입 | 무엇인가 | 스택 칸 | 크기(64비트) | 길이를 바꿀 수 있나 |
|---|---|---|---|---|
| `String` | 힙에 있는 UTF-8 글자를 소유한다 | 주소, 길이, 용량 | 24 | 된다(`push_str`, `clear`) |
| `&str` | 어딘가에 있는 UTF-8 글자 한 구간을 빌린다 | 주소, 길이(바이트) | 16 | 안 된다 |
| `&[T]` | 이어진 `T` 한 구간을 빌린다 | 주소, 길이(원소 수) | 16 | 안 된다 |
| `&mut [T]` | 같은 구간을 고칠 수 있게 빌린다 | 주소, 길이 | 16 | 안 된다. 칸의 값만 고친다 |
| `&String` | `String` 변수(스택 세 칸)를 가리킨다 | 주소 | 8 | — |

`str`과 `[T]`는 & 없이도 타입 이름이지만, 길이가 타입에 정해져 있지 않다. 그래서 보통 길이를 함께 드는 포인터 뒤에서 쓴다. Rust 책은 `str`이 "대개 빌린 꼴 `&str`로 보인다"고 적는다[^4]. `&mut [i32]`에 `push`를 부르면 E0599(no method named `push` found for mutable reference `&mut [i32]`)다. 길이를 바꾸려면 `Vec`이나 `String` 자체, 또는 그것을 가리키는 `&mut Vec`, `&mut String`이 있어야 한다[^s1].

기호로 쓰면 이렇다. `s`가 `String`이나 `&str`, $$a$$와 $$b$$가 바이트 위치(`usize`)일 때[^1]:

- `&s[a..b]` — $$a$$번 바이트부터 $$b$$번 바이트 **앞**까지. 길이는 $$b - a$$ 바이트다.
- `&s[..b]`는 `&s[0..b]`, `&s[a..]`는 `&s[a..s.len()]`, `&s[..]`는 전체다.
- 조건: $$0 \le a \le b \le$$ `s.len()`이고, $$a$$와 $$b$$가 모두 글자의 경계여야 한다. 어기면 panic이다[^1][^5].

배열과 `Vec`도 같은 문법이다. `let a = [1, 2, 3, 4, 5];`에서 `&a[1..3]`은 `&[2, 3]`이다[^1].

`String`과 `&str`이 늘 지키는 약속이 둘 있다.

1. 안의 바이트는 언제나 올바른 UTF-8이다. 라이브러리는 이것을 믿고 짜여 있다[^6].
2. `String`의 길이는 용량보다 크지 않다. 길이는 지금 든 바이트 수, 용량은 잡아 둔 버퍼의 바이트 수다[^5].

Rust 책은 `String`을 "`Vec<u8>`을 감싼 것"이라고 적는다. 바이트 `Vec`에 "늘 UTF-8"이라는 약속을 더한 것이다[^4].

### 길이는 바이트로 센다

UTF-8은 글자 하나를 1바이트로 쓰기도 하고 여러 바이트로 쓰기도 한다. `len()`은 바이트 수를 돌려준다. 사람이 세는 글자 수와 다를 수 있다[^6].

| 글 | `len()` (바이트) | `chars().count()` (`char` 수) | 글자 하나의 바이트 |
|---|---|---|---|
| `"Hola"` | 4 | 4 | 1 |
| `"Здравствуйте"` | 24 | 12 | 2 |
| `"안녕"` | 6 | 2 | 3 |
| `"नमस्ते"` | 18 | 6 | 3 |

`char`는 유니코드 스칼라 값 하나다. `"नमस्ते"`의 `char` 6개 가운데 넷째와 여섯째는 혼자서는 글자가 되지 못하고 앞 글자에 붙는 기호다. 그래서 사람이 보는 글자로는 4개다. 이런 "보이는 글자"(grapheme cluster)를 나누는 기능은 표준 라이브러리에 없고 crates.io의 크레이트가 한다[^4].

"어? 그럼 `s[0]`으로 첫 글자를 꺼내면 안 되나?" Rust는 정수 하나로 `String`을 인덱싱하는 것을 막는다(E0277, the type `str` cannot be indexed by `{integer}`). 이유는 둘이다[^4].

- `"Здравствуйте"`의 0번 바이트는 208이다. 208은 혼자서는 글자가 아니다. 돌려줄 것이 마땅치 않다.
- 인덱싱은 늘 $$O(1)$$이어야 하는데, $$n$$번째 글자를 찾으려면 앞에서부터 글자를 세며 걸어가야 한다.

컴파일러도 오류 아래에 "you can use `.chars().nth()` or `.bytes().nth()`"라고 길을 알려 준다. 범위로 자르는 것은 된다. `&hello[0..4]`는 `"Зд"`다. 하지만 글자 중간을 자르면 실행 중에 멈춘다[^4].

```text
end byte index 1 is not a char boundary; it is inside 'З' (bytes 0..2 of string)
end byte index 1 is not a char boundary; it is inside '안' (bytes 0..3 of string)
```

멈추지 않고 확인하려면 `get`을 쓴다. 같은 인덱싱이 panic할 자리에서 `None`을 돌려준다. `"Здравствуйте".get(0..1)`은 `None`, `get(0..2)`는 `Some("З")`다. 어느 위치가 경계인지는 `is_char_boundary`로 묻는다. `"안녕"`에서 1은 경계가 아니고 3은 경계다[^6].

### 글을 도는 세 방법

조각을 다룰 때는 글자를 원하는지 바이트를 원하는지 분명히 한다[^4].

| 메서드 | 하나씩 내주는 것 | `"Зд"` 또는 `"a안b"`에서 |
|---|---|---|
| `bytes()` | 바이트(`u8`) | `"Зд"` → 208, 151, 208, 180 |
| `chars()` | `char` | `"Зд"` → `'З'`, `'д'` |
| `char_indices()` | (바이트 위치, `char`) | `"a안b"` → (0, `'a'`), (1, `'안'`), (4, `'b'`) |

`char_indices()`의 위치는 글자 번호가 아니라 그 글자가 시작하는 바이트 위치다. `'안'`이 3바이트라서 `'b'`는 2가 아니라 4에서 시작한다[^6]. 그래서 자를 위치가 필요하면 `char_indices()`를 쓴다. 셋 모두 반복자(iterator)를 돌려준다([반복자](/Hongs_Blog/studies/rust/iterators/)).

### 인자는 `&str`, `&[T]`로 받는다

함수가 글을 읽기만 하면 `&String`보다 `&str`로 받는다. 그러면 `String`, 리터럴, 부분 슬라이스를 모두 받는다[^1].

```rust
let owned = String::from("hello world");
first_word(&owned);      // &String이 &str로 바뀌어 들어간다
first_word("hi there");  // 리터럴은 이미 &str
first_word(&owned[6..]); // 부분 슬라이스
```

`&owned`는 `&String`인데 `&str` 자리에 들어간다. `String`이 `Deref<Target = str>`를 구현하므로, 컴파일러가 인자 타입이 맞을 때까지 `deref`를 끼워 넣기 때문이다. 이것을 역참조 강제 변환(deref coercion)이라 부른다. 몇 번 끼울지는 컴파일할 때 정해지므로 실행 비용이 없다[^7][^5]. `Vec<T>`도 같은 방식으로 `&[T]` 자리에 들어간다. std 문서는 읽기만 할 때 `Vec` 대신 슬라이스를 인자로 받는 것이 흔하고, `String`과 `&str`도 같다고 적는다[^8].

거꾸로는 안 된다. `fn n(s: &String)`에 `"hi"`를 넘기면 E0308이다. 컴파일러는 "expected `&String`, found `&str`"라고 하고, 메모에 리터럴의 타입을 `&'static str`로 적는다. `&owned[1..]`을 넘겨도 같은 오류다[^s1].

## 활용

- **API 인자 타입.** 읽기만 하면 `&str`, `&[T]`. 고치되 길이는 그대로면 `&mut [T]`. 받아서 저장하면 `String`, `Vec<T>`([소유권과 이동](/Hongs_Blog/studies/rust/ownership-move/)의 "생성자는 값을 받는다"). 함수가 입력의 일부를 돌려주면 `&str`을 돌려준다. 수명은 생략 규칙이 채운다([수명](/Hongs_Blog/studies/rust/lifetimes/)). 새로 만든 글을 돌려주면 `String`이다. 지역 `String`을 가리키는 `&str`을 돌려주면 E0515다([빌림 오류 고치기 예제 사다리](/Hongs_Blog/studies/rust/borrow-errors-ladder/) 문제 3).
- **화면에 줄여 보여 주기.** 게시글 미리보기처럼 "앞 n글자"가 필요할 때 `&s[..n]`을 쓰면 한글에서 panic한다. 바이트 위치를 글자 경계에서 찾아 자른다. 복사도 없다[^s1].

  ```rust
  fn prefix_chars(s: &str, n: usize) -> &str {
      s.char_indices().nth(n).map_or(s, |(i, _)| &s[..i])
  }
  // prefix_chars("안녕하세요", 2) == "안녕", prefix_chars("hi", 5) == "hi"
  ```

  번호는 0부터 세므로 `char_indices().nth(n)`은 앞의 n글자 바로 다음 글자가 시작하는 바이트 위치다. 글자가 n개 이하면 `None`이라 전체를 돌려준다. 새 `String`이 필요하면 `s.chars().take(n).collect::<String>()`을 쓴다.
- **clippy.** `&String`·`&Vec<T>` 인자는 `ptr_arg`가 기본으로 경고한다("writing `&String` instead of `&str` involves a new object where a slice will do"). `chars().enumerate()`의 글자 번호로 문자열을 자르면 `char_indices_as_byte_indices`가 잡는다. 이 린트는 correctness 묶음이라 기본으로 오류(deny)이고, `.char_indices()`로 바꾸라고 알려 준다[^9].
- **비용.**

  | 연산 | 비용 | 이유 |
  |---|---|---|
  | `s.len()` | $$O(1)$$ | 길이가 칸에 들어 있다 |
  | `&s[a..b]` | $$O(1)$$ | 바이트 위치로 자르고 두 끝이 경계인지만 본다[^5] |
  | `s.chars().count()` | $$O(n)$$ | 글자를 처음부터 센다 |
  | `s.chars().nth(k)` | $$O(k)$$ | $$k$$번째 글자까지 걸어간다. std 문서가 $$n$$번째 글자를 꺼내는 방법으로 권한다[^5] |
  | `s.to_string()`, `String::from(s)` | $$O(n)$$ + 할당 | 글자를 새 버퍼로 베낀다. 리터럴에서 쓰면 둘은 같은 일을 한다[^4] |

- **고치지 않는 글을 많이 들고 있을 때.** `Box<str>`은 16바이트로, `String`(24바이트)과 달리 용량 칸이 없다. 다 만든 글을 오래 보관하는 캐시나 설정에서 쓴다[^s1].
- **`&mut [T]`로 일부만 고치기.** `w[1..4].sort()`는 `Vec` 가운데 세 칸만 제자리에서 정렬한다. `[5, 4, 3, 2, 1]`이 `[5, 2, 3, 4, 1]`이 된다[^s1].
- **흔한 실수.**
  - `s.len()`을 글자 수로 쓴다. "닉네임 10자" 제한을 `len()`으로 검사하면 한글 닉네임은 3자까지만 들어간다. 한글 한 글자가 3바이트라서 4자면 12바이트다.
  - 슬라이스를 쥔 채 원본을 버린다. `let sl = &v[1..]; drop(v); println!("{sl:?}");`는 E0505(cannot move out of `v` because it is borrowed)다.
  - 빌림 오류를 피하려고 `.to_string()`을 뿌린다. 부를 때마다 할당이 생긴다. 먼저 `&str`로 넘길 수 있는지 본다.

## 연결

- 선수: [빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/)(슬라이스도 빌림 규칙을 따른다), [수명](/Hongs_Blog/studies/rust/lifetimes/)(`first_word`의 반환 수명은 생략 규칙 2가 채운다)
- C에서 배열을 함수에 넘기면 첫 칸의 주소만 간다. 그래서 `int sum(int a[], int n)`처럼 길이를 따로 넘긴다. C의 문자열은 끝에 `'\0'`을 붙여 어디서 끝나는지 표시한다([배열과 포인터](/Hongs_Blog/studies/data-structures/array-pointer/)). Rust의 슬라이스는 길이를 함께 들고 다닌다. 그래서 `"a\0b".len()`은 3이다. `'\0'`도 그냥 한 글자다.
- 파이썬의 `a[1:3]`은 잘라 낸 복사본을 새로 만든다([리스트와 문자열](/Hongs_Blog/studies/algorithms/list-string/)). Rust의 `&a[1..3]`은 복사하지 않고 원본을 가리킨다.
- Java의 `String`은 한 번 만들면 고칠 수 없다([String](/Hongs_Blog/studies/java/java-string/)). Rust는 고칠 수 있는 주인 `String`과 고칠 수 없는 쪽지 `&str`을 두 타입으로 나눈다.
- `Vec`의 슬라이스와 `HashMap<String, _>`을 `&str`로 찾기: [컬렉션](/Hongs_Blog/studies/rust/collections/)
- 빌림 오류를 직접 고쳐 보기: [빌림 오류 고치기 예제 사다리](/Hongs_Blog/studies/rust/borrow-errors-ladder/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`s.len()`은 글자 수이고, `&s[..n]`은 앞의 n글자다."</div>

틀렸다. 둘 다 바이트 단위다. 영어 글로만 시험하면 1글자 = 1바이트라서 맞는 것처럼 보인다. `"안녕".len()`은 6이고, `&"안녕"[..1]`은 "end byte index 1 is not a char boundary"로 panic한다. 글자 수는 `chars().count()`, 앞 n글자는 `char_indices()`로 경계를 찾아 자른다. 사람이 보는 글자 수가 필요하면 그것도 아니다. `"नमस्ते"`는 `char` 6개지만 보이는 글자는 4개다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`&s[1..3]`은 파이썬 슬라이싱처럼 그 부분을 잘라 낸 새 문자열이다."</div>

틀렸다. 이름이 같고 문법이 비슷해서 그렇게 보인다. Rust의 슬라이스는 원본 버퍼 안을 가리키는 주소와 길이일 뿐이다. 슬라이스의 `as_ptr()`이 원본 주소 + 시작 위치와 같다. 그래서 슬라이스가 살아 있는 동안 원본을 고치거나 버리면 컴파일러가 E0502·E0505로 막는다. 따로 가지고 싶으면 `.to_string()`이나 `.to_vec()`으로 베낀다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 출력을 예측하라.</summary>

```rust
let t = "a안b";
let starts: Vec<usize> = t.char_indices().map(|(i, _)| i).collect();
println!("{} {} {:?}", t.len(), t.chars().count(), starts);
```
**답:** `5 3 [0, 1, 4]`<br>
**이유:** `'a'`와 `'b'`는 1바이트, `'안'`은 3바이트라서 바이트는 $$1 + 3 + 1 = 5$$, `char`는 3개다. `char_indices`는 글자가 시작하는 바이트 위치를 준다. `'b'`는 `'안'`의 3바이트 뒤인 4에서 시작한다.<br>
**흔한 오답:** `3 3 [0, 1, 2]`. 길이와 위치를 글자로 센 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 컴파일되는가? 안 되면 오류 코드와 이유는? 그리고 `first_word`가 `usize`(첫 공백 위치)를 돌려주던 판에서는 같은 코드가 왜 컴파일되었고, 무엇이 문제였나?</summary>

```rust
let mut s = String::from("hello world");
let w = first_word(&s);   // fn first_word(s: &str) -> &str
s.clear();
println!("{w}");
```
**답:** 안 된다. E0502. `w`는 `s`를 빌린 슬라이스인데, `clear`는 `&mut s`가 필요하다. `w`를 `println!`에서 또 쓰므로 공유 빌림이 `clear`를 지나 이어진다.<br>
**이유:** `usize` 판은 숫자 5를 돌려준다. 숫자는 `s`를 빌리지 않으므로 `clear`가 막히지 않는다. 대신 비워진 문자열에 대해 5라는 숫자가 남아, 나중에 그 숫자로 자르면 틀린 값이 나오거나 panic한다. 슬라이스는 "원본과 묶여 있다"는 사실을 타입에 남겨서, 같은 실수를 컴파일 때 잡는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `fn a(s: &String) -> usize`와 `fn b(s: &str) -> usize`가 있다. `let owned = String::from("hello");`일 때 (가) `&owned` (나) `"hi"` (다) `&owned[1..]` 가운데 각 함수에 넘길 수 있는 것은? 안 되는 것의 오류 코드는?</summary>

**답:** `a`는 (가)만, `b`는 셋 다 받는다. `a`에 (나)나 (다)를 넘기면 E0308(expected `&String`, found `&str`)이다.<br>
**이유:** (가)는 `&String`인데, `b`에서는 역참조 강제 변환으로 `&str`이 된다. 반대 방향 변환은 없다. 리터럴과 부분 슬라이스는 처음부터 `&str`이고, 그것을 가리키는 `String` 변수가 따로 없다. 그래서 인자를 `&str`로 받는 쪽이 더 많은 입력을 받는다. clippy `ptr_arg`가 `&String` 인자를 경고하는 이유다.

</details>


[^1]: The Rust Programming Language, 4.3 The Slice Type (The first_word Problem, String Slices, String Literals as Slices, String Slices as Parameters, Other Slices) — https://doc.rust-lang.org/book/ch04-03-slices.html
[^2]: The Rust Programming Language, 10.3 Validating References with Lifetimes, The Static Lifetime (모든 문자열 리터럴은 `'static` 수명) — https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html
[^3]: std 문서, Primitive Type `slice` (A dynamically-sized view into a contiguous sequence, pointer and a length; `get`) — https://doc.rust-lang.org/std/primitive.slice.html
[^4]: The Rust Programming Language, 8.2 Storing UTF-8 Encoded Text with Strings (What Is a String?, Creating a New String, Indexing into Strings, Internal Representation, Bytes and Scalar Values and Grapheme Clusters, Slicing Strings, Iterating Over Strings) — https://doc.rust-lang.org/book/ch08-02-strings.html
[^5]: std 문서, Struct `std::string::String` (Representation, Deref, UTF-8, 바이트 범위 자르기는 상수 시간이고 경계가 아니면 panic, `chars().nth`) — https://doc.rust-lang.org/std/string/struct.String.html
[^6]: std 문서, Primitive Type `str` (`len`, `is_char_boundary`, `get`, `char_indices`, Representation, Invariant) — https://doc.rust-lang.org/std/primitive.str.html
[^7]: The Rust Programming Language, 15.2 Treating Smart Pointers Like Regular References, Using Deref Coercion in Functions and Methods — https://doc.rust-lang.org/book/ch15-02-deref.html
[^8]: std 문서, Struct `std::vec::Vec`, Slicing — https://doc.rust-lang.org/std/vec/struct.Vec.html
[^9]: Clippy Lints, `char_indices_as_byte_indices`(correctness, deny) — https://rust-lang.github.io/rust-clippy/stable/index.html. `ptr_arg`가 기본으로 경고하는 것과 두 린트의 메시지는 rustc 1.99.0의 `clippy-driver`로 확인했다.
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 타입 크기, 슬라이스 주소, `String::from("hello world")`의 용량 11(이 기계에서 관찰한 값), E0599·E0308·E0505 메시지, `prefix_chars` 함수, `w[1..4].sort()` 결과는 1차 자료에 그대로 있지 않아 rustc 1.99.0으로 컴파일·실행해 확인한 것이다. `prefix_chars`는 7가지 글(한글·키릴·데바나가리 포함)과 n = 0~14 전부에서 panic 없이 n글자(또는 전체)를 돌려주는 것을 테스트로 확인했다.
{% endraw %}
