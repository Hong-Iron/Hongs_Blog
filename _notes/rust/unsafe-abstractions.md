---
layout: "note"
title: "unsafe와 안전한 감싸기"
display_title: "unsafe와 안전한 감싸기 (Unsafe Rust)"
kind: "concept"
kind_label: "기법"
num: "30"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Unsafe Rust", "unsafe", "Safe Abstraction", "안전한 추상", "SAFETY comment", "Raw Pointer", "원시 포인터", "Undefined Behavior", "정의되지 않은 동작", "unsafe_op_in_unsafe_fn", "unsafe extern", "unsafe(no_mangle)", "static_mut_refs", "Miri"]
description: "unsafe는 \"여기는 컴파일러가 확인할 수 없으니 내가 확인했다\"고 서명하는 칸이다. 주소를 직접 따라가는 일처럼 컴파일러가 옳다고 증명하지 못하는 몇 가지 일을 할 수 있게 해 준다. 서명이 틀리면 프로그램이 무슨 일이든 할 수 있는 상태(정의되지 않은 동작)가 된다. 그래서 …"
prev_url: "/studies/rust/interior-mutability/"
prev_title: "내부 가변성"
next_url: "/studies/rust/threads-send-sync/"
next_title: "스레드와 Send·Sync"
math: false
mermaid: false
code_count: 2
permalink: "/studies/rust/unsafe-abstractions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

`unsafe`는 "여기는 컴파일러가 확인할 수 없으니 내가 확인했다"고 서명하는 칸이다. 주소를 직접 따라가는 일처럼 컴파일러가 옳다고 증명하지 못하는 몇 가지 일을 할 수 있게 해 준다. 서명이 틀리면 프로그램이 무슨 일이든 할 수 있는 상태(정의되지 않은 동작)가 된다. 그래서 칸을 작게 두고, 지켜야 할 조건을 주석으로 적고, 바깥에는 잘못 쓸 수 없는 안전한 함수로 감싸 내놓는다. 그리고 `unsafe` 안에서도 빌림 검사는 그대로 돈다.

</div>


## 예시로 보기

슬라이스 하나를 앞과 뒤 두 조각으로 나눠 둘 다 고치고 싶다. 두 조각은 겹치지 않으니 문제가 없어 보인다. 그런데 안전한 코드로 쓰면 컴파일되지 않는다.

```rust
pub fn split_at_mut(values: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = values.len();
    assert!(mid <= len);
    (&mut values[..mid], &mut values[mid..])
}
```

```
error[E0499]: cannot borrow `*values` as mutable more than once at a time
```

빌림 검사기는 "같은 슬라이스를 `&mut`로 두 번 빌렸다"만 본다. 두 범위가 겹치지 않는다는 것까지는 알아내지 못한다[^1]. 컴파일러는 틀린 프로그램을 받아들이느니 맞는 프로그램 몇 개를 거절하는 쪽을 고른다[^1]. 이럴 때 사람이 확인하고 `unsafe`로 서명한다.

```rust
pub fn split_at_mut<T>(values: &mut [T], mid: usize) -> (&mut [T], &mut [T]) {
    let len = values.len();
    assert!(mid <= len, "mid {mid} > len {len}");
    let ptr = values.as_mut_ptr();
    // SAFETY:
    // - ptr은 `values`에서 왔으므로 len개의 T에 대해 유효하고 정렬되어 있다.
    // - mid <= len을 위에서 확인했으므로 ptr.add(mid)는 같은 할당 안(끝 포함)에 있다.
    // - 두 조각 [0, mid)와 [mid, len)은 겹치지 않으므로 두 &mut가 같은 원소를 가리키지 않는다.
    // - 반환 수명은 `values`의 빌림에 묶이므로, 조각이 살아 있는 동안 원본을 다른 곳에서 쓸 수 없다.
    unsafe {
        (
            slice::from_raw_parts_mut(ptr, mid),
            slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}
```

```
values: [ 1 | 2 | 3 | 4 | 5 | 6 ]
          ▲       ▲
          ptr     ptr.add(2)
          └ left ┘└──── right ────┘
```

`assert!` 한 줄이 핵심이다. 이 검사 덕분에 `unsafe` 블록 안의 두 포인터가 모두 범위 안에 있다. 그래서 함수 자체는 `unsafe`로 표시하지 않아도 된다. 부르는 쪽이 무엇을 넣든 안전하다[^1]. 이것을 안전한 감싸기(safe abstraction)라고 부른다.

검증 코드에서 `split_at_mut(&mut v, 2)`로 나눈 두 조각에 값을 쓰자 `v`는 `[10, 2, 30, 4, 5, 60]`이 되었다. `mid`가 0과 `len`일 때도 맞았고, `mid` 0~6 모두에서 표준 라이브러리의 `split_at_mut`와 결과가 같았다. `mid > len`이면 `unsafe` 블록에 닿기 전에 `assert!`가 panic한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 감싼 `split_at_mut`과 `sum_pairs`는 [30_unsafe-abstractions_impl.rs](/Hongs_Blog/studies/rust/code/30_unsafe-abstractions_impl/)에서 `#![deny(clippy::undocumented_unsafe_blocks)]`와 `#![deny(unsafe_op_in_unsafe_fn)]`를 켠 채 테스트했다. 오류·경고 코드(E0133 세 가지, E0499 두 가지, E0200, 2024 에디션 변경 다섯 가지, clippy 린트 세 개, `forbid(unsafe_code)`)는 [30_unsafe-abstractions_verify.rs](/Hongs_Blog/studies/rust/code/30_unsafe-abstractions_verify/)에서 rustc 1.99로 컴파일해 확인했다.</div>

</div>


## unsafe가 허락하는 것

`unsafe` 블록이 여는 능력은 다섯 가지뿐이다[^1].

| 능력 | 예 | `unsafe` 밖에서 하면 |
|---|---|---|
| 원시 포인터 따라가기 | `*p` (`p: *const i32`) | E0133 ``dereference of raw pointer is unsafe`` |
| `unsafe` 함수·메서드 부르기 | `v.get_unchecked(i)`, `std::env::set_var` | E0133 ``call to unsafe function`` |
| 고칠 수 있는 정적 변수 읽고 쓰기 | `COUNT += 1` (`static mut COUNT`) | E0133 ``use of mutable static is unsafe`` |
| `unsafe` 트레이트 구현 | `unsafe impl Send for X {}` | E0200 ``the trait `Send` requires an `unsafe impl` declaration`` |
| `union`의 필드 읽기 | C와 주고받는 공용체 | — |

원시 포인터(raw pointer) `*const T`, `*mut T`는 참조와 달리 빌림 규칙을 따르지 않고, 유효한 곳을 가리킨다는 보장이 없고, 널일 수도 있다[^1]. 만드는 것은 안전하다. `let p = &raw const x;`는 `unsafe` 없이 컴파일된다. 따라가는 순간에만 `unsafe`가 필요하다.

`unsafe`가 끄지 않는 것도 중요하다. 책은 `unsafe`가 빌림 검사기나 다른 안전 검사를 끄지 않는다고 적는다[^1]. 검증 코드에서 `unsafe` 블록 안에 `&mut v`를 두 개 만들자 블록 밖과 똑같이 E0499가 났다. 다섯 능력 말고는 아무것도 풀리지 않는다.

## 정의

`unsafe`로 서명한 코드가 지켜야 할 조건을 안전 조건이라고 한다. 조건을 누가 지키느냐에 따라 표시가 둘로 나뉜다.

- **`unsafe fn`**: 부르는 쪽이 조건을 지켜야 한다. 부르는 쪽이 할 일을 문서로 적는다[^1]. 관례는 문서 주석의 `# Safety` 절이고, clippy `missing_safety_doc`이 이 절을 찾는다.
- **`unsafe { }` 블록**: 블록을 쓴 사람이 조건이 지켜졌음을 확인했다. 블록 바로 위에 `// SAFETY:` 주석으로 왜 지켜지는지 적는다[^1].

```rust
/// 인덱스 검사 없이 읽는다. 부르는 쪽이 조건을 지켜야 한다.
///
/// # Safety
/// `i < v.len()`이어야 한다.
pub unsafe fn get_unchecked_copy(v: &[u32], i: usize) -> u32 {
    // SAFETY: 이 함수의 안전 조건(i < v.len())을 부르는 쪽이 지킨다고 약속했다.
    unsafe { *v.get_unchecked(i) }
}

pub fn sum_pairs(a: &[u32], b: &[u32]) -> Vec<u32> {
    let n = a.len().min(b.len());
    (0..n)
        .map(|i| {
            // SAFETY: i < n <= a.len()이고 i < n <= b.len()이다.
            unsafe { get_unchecked_copy(a, i) + get_unchecked_copy(b, i) }
        })
        .collect()
}
```

`sum_pairs`는 겉으로는 안전한 함수다. 경계를 한 번(`n`)만 정하고, 안쪽에서는 그 경계로 `unsafe fn`의 조건을 지킨다. `sum_pairs(&[1, 2, 3], &[10, 20])`은 `[11, 22]`, 빈 슬라이스를 넣으면 빈 `Vec`이었다.

안전한 감싸기가 옳다(sound)는 것은 이렇게 말할 수 있다. 안전한 코드로 그 함수를 어떻게 부르든 정의되지 않은 동작이 생기지 않는다. 이 조건은 함수 하나로 끝나지 않는다. `unsafe` 코드가 구조체 필드의 불변식(예: `Vec`의 `cap`이 실제 할당 크기와 같다)에 기대면, 그 필드를 만질 수 있는 안전한 코드도 모두 책임을 나눠 진다. Rustonomicon은 `cap`만 1 올리는 메서드를 예로 든다. 안전한 코드뿐인데도 `cap`이 실제 할당 크기와 달라져 `Vec`의 불변식이 깨진다. 이런 메서드가 공개되면 `Vec`은 더 이상 옳지 않다[^2]. 그래서 불변식이 걸린 필드는 비공개로 두고 모듈 경계로 막는다. 모듈 밖의 코드는 필드를 만질 수 없으니, 모듈 안만 확인하면 된다[^2].

## 2024 에디션에서 바뀐 것

| 바뀐 것 | 2021 에디션 | 2024 에디션 |
|---|---|---|
| `unsafe fn` 몸통 안의 `unsafe` 연산 | 블록 없이 됨 | `unsafe { }` 블록이 없으면 `unsafe_op_in_unsafe_fn` 경고[^3] |
| `extern` 블록 | `extern "C" { … }` | `unsafe extern "C" { … }`만 된다. 항목마다 `safe`·`unsafe`를 붙인다[^4] |
| `no_mangle`, `export_name`, `link_section` 속성 | `#[no_mangle]` | `#[unsafe(no_mangle)]`[^5] |
| `std::env::set_var`, `remove_var` | 안전한 함수 | `unsafe` 함수[^6] |
| `static mut`에 참조 만들기 | `static_mut_refs` 경고 | `static_mut_refs`가 기본으로 오류(deny)[^7] |

각 줄의 이유는 이렇다.

- **`unsafe_op_in_unsafe_fn`.** 예전에는 `unsafe fn`이라고 쓰면 두 가지 뜻이 겹쳤다. "부르는 쪽이 조건을 지켜라"와 "몸통 전체가 `unsafe` 블록이다". 2024는 둘을 떼어 놓았다[^3]. 검증 코드에서 `pub unsafe fn f(p: *const i32) -> i32 { *p }`는 2024에서 경고, 2021에서 조용했다. 컴파일러의 설명은 ``an unsafe function restricts its caller, but its body is safe by default``였다.
- **`unsafe extern`.** 다른 언어 함수의 시그니처를 잘못 적으면 정의되지 않은 동작이 된다. 그 책임이 블록을 쓴 사람에게 있다는 표시다[^4]. 이 문법은 1.82부터 모든 에디션에서 쓸 수 있고, 2024에서 필수가 되었다[^4]. 어떤 인자로 불러도 안전한 함수는 `safe fn`으로 적으면 `unsafe` 없이 부를 수 있다. 검증 코드에서 `unsafe extern "C" { pub safe fn abs(x: i32) -> i32; }`의 `abs(-3)`이 그대로 컴파일되었다. 다만 `safe`라고 적는다고 안전해지지는 않는다. 그 약속을 지키는 것도 쓴 사람의 몫이다[^1].
- **`unsafe(no_mangle)`.** 링크되는 모든 라이브러리의 기호 이름은 한 이름 공간을 쓴다. 이름이 부딪히면 안전한 코드만으로도 프로그램이 죽을 수 있다. 에디션 가이드는 `#[export_name = "malloc"]` 하나로 대부분의 유닉스 계열에서 죽는 예를 든다[^5]. 검증 코드에서 2024의 `#[no_mangle]`은 ``unsafe attribute used without unsafe`` 오류였다.
- **`set_var`.** 일부 플랫폼에서는 다른 스레드가 환경 변수를 읽는 동안 고치면 정의되지 않은 동작이 생긴다. 그래서 다른 스레드가 돌고 있을 수 있는 동안에는 부르면 안 된다[^6]. 검증 코드에서 2024의 `std::env::set_var("K", "V")`는 E0133 ``call to unsafe function `set_var` is unsafe``였다. `cargo fix --edition`이 `unsafe { }`를 붙여 주지만 부르는 자리가 맞는지는 확인해 주지 않는다[^6].
- **`static_mut_refs`.** `static mut`에 참조를 만드는 순간, 그 참조를 읽거나 쓰지 않아도 규칙을 어기면 바로 정의되지 않은 동작이다. 그것을 지키려면 프로그램 전체를 머릿속에 넣고 따져야 한다[^7]. 검증 코드에서 `let r = &COUNT;`는 2024에서 ``creating a shared reference to mutable static`` 오류, 2021에서 같은 문장의 경고였고, `&raw const COUNT`로 원시 포인터를 만드는 것은 통과했다. 에디션 가이드는 먼저 원자 타입, `Mutex`·`RwLock`, `OnceLock`·`LazyLock`으로 바꾸라고 권한다[^7]. [내부 가변성](/Hongs_Blog/studies/rust/interior-mutability/)과 [원자적 연산과 메모리 순서](/Hongs_Blog/studies/rust/atomics-memory-ordering/)의 타입들이다.

## 활용

- **실제로 쓰는 곳.** 표준 라이브러리의 `split_at_mut`, `Vec`, `String`처럼 메모리를 직접 다루는 자료구조. C 라이브러리를 부르는 바인딩: C의 `create`·`destroy` 짝을 구조체와 `Drop`으로 감싼다([malloc·free ↔ 소유권과 Drop](/Hongs_Blog/studies/rust/malloc-free-vs-ownership/)). 컴파일러가 증명하지 못하는 `Send`·`Sync` 구현([스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/)). 애플리케이션 코드에서 `unsafe`가 필요해 보이면, 먼저 표준 라이브러리나 검증된 크레이트에 같은 일을 하는 안전한 함수가 있는지 찾는다. `split_at_mut`도 이미 슬라이스 메서드로 있다.
- **작게, 감싸서.** `unsafe` 블록은 작게 둔다[^1]. 블록에는 `SAFETY` 주석 하나로 이유를 다 댈 수 있는 만큼만 담는다. 블록이 기대는 검사(`assert!`, 길이 계산)는 블록 바로 앞에 두어 눈으로 함께 보이게 한다.
- **린트로 강제하기.** 검증 코드에서 clippy를 기본 설정으로 돌린 결과는 이랬다.
  - `undocumented_unsafe_blocks`: 기본으로 꺼져 있다. 켜면 ``unsafe block missing a safety comment``로 `SAFETY` 주석 없는 블록을 잡는다. 이 문서의 `_impl.rs`처럼 크레이트 맨 위에 `#![deny(clippy::undocumented_unsafe_blocks)]`를 둔다.
  - `missing_safety_doc`: 기본 경고. `pub unsafe fn`에 `# Safety` 절이 없으면 ``unsafe function's docs are missing a `# Safety` section``.
  - `not_unsafe_ptr_arg_deref`: correctness 묶음, 기본으로 오류(deny). 원시 포인터 인자를 따라가는 공개 함수가 `unsafe`가 아니면 잡는다. 아무 포인터나 들어올 수 있으니 그 함수는 거의 확실히 `unsafe`여야 하기 때문이다[^8].
  - `unsafe`가 아예 없어야 하는 크레이트에는 `#![forbid(unsafe_code)]`를 둔다. 검증 코드에서 `unsafe` 블록이 ``usage of an `unsafe` block`` 오류가 되었다. CI에 넣는 법은 [CI 품질 게이트](/Hongs_Blog/studies/rust/ci-quality-gates/).
- **Miri.** 공식 도구 Miri는 코드를 실제로 돌리며 정의되지 않은 동작을 찾는다. nightly 툴체인에 `rustup +nightly component add miri`로 설치하고 `cargo +nightly miri test`로 돌린다[^1]. 실행된 경로만 검사하므로 테스트가 좋아야 하고, Miri가 아무것도 못 찾았다고 버그가 없다는 뜻은 아니다[^1]. 이 문서의 검증 코드는 Miri로 돌리지 않았다.
- **성능 때문에 쓸 때.** `get_unchecked`처럼 검사를 건너뛰는 함수는 경계 검사가 정말로 병목인지 잰 뒤에만 쓴다([성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)). 쓰더라도 `sum_pairs`처럼 경계를 한 번 정하는 안전한 함수 안에 가둔다.
- **흔한 실수.**
  - `// SAFETY: 안전함`처럼 이유 없는 주석. 무엇이 왜 지켜지는지 적는다. 위 `split_at_mut`의 주석은 포인터 출처, 범위, 겹치지 않음, 수명을 하나씩 적었다.
  - tokio 서버의 `main`에서 `set_var`로 설정을 바꾼다. 런타임이 이미 다른 스레드를 띄웠을 수 있다. 설정은 값으로 읽어 넘긴다([설정과 비밀값](/Hongs_Blog/studies/rust/configuration-secrets/)).
  - 공개 필드에 불변식을 건다. 누구나 필드를 고칠 수 있으니 안전한 코드만으로 깨진다. 필드는 비공개로 둔다[^2].

## 연결

- 선수: [빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/)(`&mut`가 겹치면 안 되는 이유), [슬라이스와 String·&str](/Hongs_Blog/studies/rust/slices-strings/)(주소와 길이), [내부 가변성](/Hongs_Blog/studies/rust/interior-mutability/)(`UnsafeCell` 위의 안전한 API)
- `unsafe` 코드가 기대는 원자 연산의 순서가 틀리면 그때 정의되지 않은 동작이 된다: [원자적 연산과 메모리 순서](/Hongs_Blog/studies/rust/atomics-memory-ordering/)
- Rust 코드에서 `unsafe`가 차지하는 비중과 보안 걱정이 그곳에 모인다는 이야기: [Rust가 푸는 문제](/Hongs_Blog/studies/rust/why-rust/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 2024 에디션 크레이트에서 `pub fn f() { std::env::set_var("K", "V"); }`는 컴파일되는가? 안 되면 왜이고, `unsafe { }`로 감싸면 끝인가?</summary>

**답:** 안 된다(E0133, `set_var`는 `unsafe` 함수). 블록으로 감싸면 컴파일은 되지만 그것으로 끝이 아니다. 다른 스레드가 돌고 있을 수 있는 동안에는 부르면 안 된다는 조건을 확인하고 `// SAFETY:`에 적어야 한다.<br>
**이유:** 일부 플랫폼에서는 다른 스레드가 환경을 읽는 동안 고치면 정의되지 않은 동작이 생긴다. 예전 에디션에서 안전 함수로 둔 것이 실수였다고 보고 2024에서 `unsafe`가 되었다. `cargo fix`는 블록을 붙일 뿐 조건을 확인하지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `split_at_mut`에서 `assert!(mid <= len)`을 지우면 함수는 여전히 안전한 함수로 둘 수 있는가? 깨지는 입력을 들라.</summary>

**답:** 둘 수 없다. 길이 2인 슬라이스에 `mid = 3`을 넣으면 깨진다.<br>
**이유:** `from_raw_parts_mut(ptr, 3)`이 원소 2개뿐인 곳을 3개짜리 조각이라고 주장한다. `ptr.add(3)`은 할당의 끝을 지나 밖을 가리킨다. 그러면 안전한 코드인 `left[2] = 0`이 남의 메모리에 쓴다. 검사 한 줄이 "어떤 안전한 호출로도 정의되지 않은 동작이 생기지 않는다"를 지키고 있었다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 중 `unsafe`가 있어야 컴파일되는 것을 모두 고르라. (가) `let p = &raw const x;` (나) `let y = *p;` (다) `static mut` 변수 `COUNT += 1` (라) `v.get(3)` (마) `impl Send for Handle {}` (바) `unsafe` 블록 안에서 같은 `Vec`을 `&mut`로 두 번 빌리기</summary>

**답:** (나), (다), (마). (바)는 `unsafe`가 있어도 컴파일되지 않는다.<br>
**이유:** (가)는 포인터를 만들 뿐이라 안전하다. (나)는 원시 포인터 따라가기, (다)는 고칠 수 있는 정적 변수, (마)는 `unsafe` 트레이트 구현으로 다섯 능력에 들어간다. (라)는 `Option`을 돌려주는 안전한 함수다. (바)는 빌림 검사가 `unsafe` 안에서도 돌아 E0499다. 검증 코드의 컴파일 결과와 같다.

</details>


[^1]: The Rust Programming Language, 20.1 Unsafe Rust (다섯 가지 능력, `unsafe`는 빌림 검사기를 끄지 않음, 원시 포인터, `split_at_mut` 안전한 감싸기, `unsafe extern`과 `safe fn`, `SAFETY` 주석 관례, 블록을 작게, Miri) — https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html
[^2]: The Rustonomicon, Working with Unsafe (`make_room` 예, `unsafe`가 모듈 전체를 오염시킴, 모듈 경계와 비공개 필드) — https://doc.rust-lang.org/nomicon/working-with-unsafe.html
[^3]: The Rust Edition Guide, Rust 2024 — `unsafe_op_in_unsafe_fn` warning — https://doc.rust-lang.org/edition-guide/rust-2024/unsafe-op-in-unsafe-fn.html
[^4]: The Rust Edition Guide, Rust 2024 — Unsafe `extern` blocks (1.82부터 모든 에디션, 2024에서 필수, `safe`·`unsafe` 항목) — https://doc.rust-lang.org/edition-guide/rust-2024/unsafe-extern.html
[^5]: The Rust Edition Guide, Rust 2024 — Unsafe attributes (`export_name`, `link_section`, `no_mangle`, 기호 이름 충돌, `#[export_name = "malloc"]` 예) — https://doc.rust-lang.org/edition-guide/rust-2024/unsafe-attributes.html
[^6]: The Rust Edition Guide, Rust 2024 — Unsafe functions (`set_var`, `remove_var`, `before_exec`; 다른 스레드가 돌 수 있는 동안 부르면 안 됨, `cargo fix`의 한계) — https://doc.rust-lang.org/edition-guide/rust-2024/newly-unsafe-functions.html
[^7]: The Rust Edition Guide, Rust 2024 — Disallow references to static mut (`static_mut_refs` deny, 참조를 만드는 순간의 정의되지 않은 동작, 대안) — https://doc.rust-lang.org/edition-guide/rust-2024/static-mut-references.html
[^8]: Clippy Lints, `not_unsafe_ptr_arg_deref`(correctness, deny) — https://rust-lang.github.io/rust-clippy/master/index.html#not_unsafe_ptr_arg_deref . `undocumented_unsafe_blocks`와 `missing_safety_doc`은 같은 목록의 린트로, 검증 코드에서 clippy 1.99로 기본 꺼짐·기본 경고와 경고문을 확인했다.
{% endraw %}
