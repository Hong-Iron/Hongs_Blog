---
layout: "note"
title: "17_generics-trait-bounds_verify.rs"
display_title: "17_generics-trait-bounds_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "17"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/generics-trait-bounds/"
parent_title: "제네릭과 트레이트 경계"
description: "Rust · 제네릭과 트레이트 경계 검증 코드"
permalink: "/studies/rust/code/17_generics-trait-bounds_verify/"
---
{% raw %}
[제네릭과 트레이트 경계](/Hongs_Blog/studies/rust/generics-trait-bounds/) 문서의 검증 코드다.

```rust
//! 17 제네릭과 트레이트 경계: 경계가 없으면 연산을 못 쓰는 것(E0369), where 절, 여러 경계, const 제네릭,
//! 단형화(monomorphization)로 타입마다 함수 사본이 생기는 것(LLVM IR에서 정의 개수 세기),
//! 무거운 몸통을 제네릭이 아닌 안쪽 함수로 빼면 사본이 바깥에만 생기는 것, `P: AsRef<Path>` 경계,
//! 타입 매개변수의 기본 Sized 경계와 ?Sized(E0277)를 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/17_generics-trait-bounds_verify.rs"

use std::fmt::{Debug, Display};
use std::sync::atomic::{AtomicUsize, Ordering};

static SNIPPET: AtomicUsize = AtomicUsize::new(0);

fn snippet_dir() -> std::path::PathBuf {
    let n = SNIPPET.fetch_add(1, Ordering::Relaxed);
    let dir = std::env::temp_dir().join(format!("vr17_{}_{}", std::process::id(), n));
    std::fs::create_dir_all(&dir).unwrap();
    dir
}

fn compile_errors(code: &str) -> String {
    let dir = snippet_dir();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = std::process::Command::new("rustc")
        .args([
            "--edition",
            "2024",
            "--crate-type=lib",
            "--emit=metadata",
            "--out-dir",
        ])
        .arg(&dir)
        .arg(&file)
        .output()
        .expect("rustc 실행");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

/// 최적화를 켜고 LLVM IR을 만든 뒤, 이름에 `name`이 들어간 함수 정의 줄 수를 센다.
fn count_definitions(code: &str, name: &str) -> usize {
    let dir = snippet_dir();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = std::process::Command::new("rustc")
        .args([
            "--edition",
            "2024",
            "--crate-type=lib",
            "-C",
            "opt-level=2",
            "--emit=llvm-ir",
            "--out-dir",
        ])
        .arg(&dir)
        .arg(&file)
        .output()
        .expect("rustc 실행");
    assert!(
        out.status.success(),
        "{}",
        String::from_utf8_lossy(&out.stderr)
    );
    let ir = std::fs::read_to_string(dir.join("snippet.ll")).unwrap();
    ir.lines()
        .filter(|l| l.starts_with("define") && l.contains(name))
        .count()
}

// 1. 트레이트 경계: 비교(PartialOrd)와 복사(Copy)를 할 수 있는 타입만 받는다.
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut best = list[0];
    for &item in list {
        if item > best {
            best = item;
        }
    }
    best
}

// 2. where 절: 경계가 길 때 시그니처를 읽기 쉽게 한다.
fn describe<T, U>(t: &T, u: &U) -> String
where
    T: Display + Clone,
    U: Clone + Debug,
{
    format!("{t} / {u:?}")
}

// 3. 경계를 조건으로 메서드 붙이기: T가 Display일 때만 show가 생긴다.
struct Pair<T> {
    a: T,
    b: T,
}

impl<T> Pair<T> {
    fn new(a: T, b: T) -> Self {
        Pair { a, b }
    }
}

impl<T: Display + PartialOrd> Pair<T> {
    fn show_larger(&self) -> String {
        if self.a >= self.b {
            format!("큰 쪽 a = {}", self.a)
        } else {
            format!("큰 쪽 b = {}", self.b)
        }
    }
}

// 4. const 제네릭: 배열 길이를 타입의 일부로 받는다.
fn sum_array<const N: usize>(xs: [i32; N]) -> i32 {
    xs.iter().sum()
}

struct Matrix<const R: usize, const C: usize> {
    cells: [[i32; C]; R],
}

impl<const R: usize, const C: usize> Matrix<R, C> {
    fn transpose(&self) -> Matrix<C, R> {
        let mut out = [[0; R]; C];
        for (i, row) in self.cells.iter().enumerate() {
            for (j, &v) in row.iter().enumerate() {
                out[j][i] = v;
            }
        }
        Matrix { cells: out }
    }
}

// 6. ?Sized: 크기를 모르는 타입(str, dyn Display)도 참조 뒤에서 받는다.
fn shout<T: Display + ?Sized>(x: &T) -> String {
    format!("{x}!")
}

// 1-1. P: AsRef<Path> 경계
fn path_len<P: AsRef<std::path::Path>>(p: P) -> usize {
    p.as_ref().as_os_str().len()
}

fn main() {
    // 1. 경계
    assert_eq!(largest(&[34, 50, 25, 100, 65]), 100);
    assert_eq!(largest(&['y', 'm', 'a', 'q']), 'y');
    assert_eq!(largest(&[1.5, -2.0, 0.25]), 1.5);
    println!(
        "largest: {} {} {}",
        largest(&[34, 50, 25, 100, 65]),
        largest(&['y', 'm', 'a', 'q']),
        largest(&[1.5, -2.0, 0.25])
    );
    let e = compile_errors(
        "pub fn largest<T>(list: &[T]) -> &T {
             let mut best = &list[0];
             for item in list { if item > best { best = item; } }
             best
         }",
    );
    println!(
        "[경계 없이 >] {}",
        e.lines().find(|l| l.starts_with("error")).unwrap()
    );
    assert!(e.contains("error[E0369]"));
    let e = compile_errors(
        "pub fn largest<T: PartialOrd>(list: &[T]) -> T {
             let mut best = list[0];
             for &item in list { if item > best { best = item; } }
             best
         }",
    );
    println!(
        "[Copy 경계 없이 값 꺼내기] {}",
        e.lines().find(|l| l.starts_with("error")).unwrap()
    );
    assert!(e.contains("error[E0508]") || e.contains("error[E0507]"));
    // 참조를 돌려주면 Copy 없이도 된다.
    let e = compile_errors(
        "pub fn largest<T: PartialOrd>(list: &[T]) -> &T {
             let mut best = &list[0];
             for item in list { if item > best { best = item; } }
             best
         }",
    );
    assert!(!e.contains("error"), "{e}");

    // 1-1. File::open과 같은 모양의 경계: 경로로 볼 수 있는 것은 모두 받는다.
    let path_buf = std::path::PathBuf::from("dir/c.txt");
    assert_eq!(path_len("a.txt"), 5);
    assert_eq!(path_len(String::from("b/b.txt")), 7);
    assert_eq!(path_len(&path_buf), 9);
    assert_eq!(path_len(path_buf), 9);

    // 2. where 절
    assert_eq!(describe(&"hi", &vec![1, 2]), "hi / [1, 2]");

    // 3. 조건부 메서드
    let p = Pair::new(3, 9);
    assert_eq!(p.show_larger(), "큰 쪽 b = 9");
    let e = compile_errors(
        "pub struct Pair<T> { a: T, b: T }
         impl<T: std::fmt::Display + PartialOrd> Pair<T> { pub fn show_larger(&self) -> bool { self.a > self.b } }
         pub struct NoDisplay;
         pub fn f(p: Pair<NoDisplay>) -> bool { p.show_larger() }",
    );
    println!(
        "[경계를 못 채운 타입에서 조건부 메서드] {}",
        e.lines().find(|l| l.starts_with("error")).unwrap()
    );
    assert!(e.contains("error[E0599]"));

    // 4. const 제네릭
    assert_eq!(sum_array([1, 2, 3]), 6);
    assert_eq!(sum_array([10; 5]), 50);
    let m = Matrix {
        cells: [[1, 2, 3], [4, 5, 6]],
    };
    let t = m.transpose();
    assert_eq!(t.cells, [[1, 4], [2, 5], [3, 6]]);
    println!("transpose 2x3 -> 3x2: {:?}", t.cells);
    let e = compile_errors(
        "pub struct Matrix<const R: usize, const C: usize> { pub cells: [[i32; C]; R] }
         pub fn f(a: Matrix<2, 3>) -> Matrix<3, 2> { a }",
    );
    println!(
        "[길이가 다른 행렬] {}",
        e.lines().find(|l| l.starts_with("error")).unwrap()
    );
    assert!(e.contains("error[E0308]"));

    // 5. 단형화: 쓴 타입 수만큼 함수 사본이 생긴다.
    let generic_one = "
        #[inline(never)]
        fn sum_sq<T: Copy + Into<f64>>(xs: &[T]) -> f64 {
            xs.iter().map(|&x| { let v: f64 = x.into(); v * v }).sum()
        }
        pub fn use_all(a: &[u8]) -> f64 { sum_sq(a) }";
    let generic_six = "
        #[inline(never)]
        fn sum_sq<T: Copy + Into<f64>>(xs: &[T]) -> f64 {
            xs.iter().map(|&x| { let v: f64 = x.into(); v * v }).sum()
        }
        pub fn use_all(a: &[u8], b: &[u16], c: &[u32], d: &[i8], e: &[i16], f: &[i32]) -> f64 {
            sum_sq(a) + sum_sq(b) + sum_sq(c) + sum_sq(d) + sum_sq(e) + sum_sq(f)
        }";
    let one = count_definitions(generic_one, "sum_sq");
    let six = count_definitions(generic_six, "sum_sq");
    println!("sum_sq 정의 개수: 타입 1개로 부름 -> {one}, 타입 6개로 부름 -> {six}");
    assert_eq!(one, 1);
    assert_eq!(six, 6);
    let generic_repeat = "
        #[inline(never)]
        fn sum_sq<T: Copy + Into<f64>>(xs: &[T]) -> f64 {
            xs.iter().map(|&x| { let v: f64 = x.into(); v * v }).sum()
        }
        pub fn use_all(a: &[u8], b: &[u16], c: &[u8]) -> f64 { sum_sq(a) + sum_sq(b) + sum_sq(c) }";
    let repeat = count_definitions(generic_repeat, "sum_sq");
    println!("sum_sq 정의 개수: u8, u16, u8로 세 번 부름 -> {repeat}");
    assert_eq!(repeat, 2);

    // 바깥은 제네릭, 무거운 몸통은 제네릭이 아닌 안쪽 함수 하나로: 사본은 얇은 바깥만 늘어난다.
    let thin_outer = "
        #[inline(never)]
        fn word_count<S: AsRef<str>>(s: S) -> usize {
            #[inline(never)]
            fn inner(s: &str) -> usize {
                s.split_whitespace().filter(|w| w.len() > 3).count() + s.lines().count()
            }
            inner(s.as_ref())
        }
        pub fn use_all(a: &str, b: String, c: &String, d: Box<str>,
                       e: std::borrow::Cow<'static, str>, f: std::rc::Rc<str>) -> usize {
            word_count(a) + word_count(b) + word_count(c) + word_count(d) + word_count(e) + word_count(f)
        }";
    let inner = count_definitions(thin_outer, "5inner");
    let outer = count_definitions(thin_outer, "10word_count") - inner;
    println!("word_count 바깥 사본 {outer}개, 안쪽 inner {inner}개");
    assert_eq!((outer, inner), (6, 1));

    // 6. ?Sized
    let d: &dyn Display = &5;
    assert_eq!(shout("hi"), "hi!");
    assert_eq!(shout(d), "5!");
    println!("shout: {} {}", shout("hi"), shout(d));
    let e = compile_errors(
        "pub fn byte_len<T: AsRef<[u8]>>(x: &T) -> usize { x.as_ref().len() }
         pub fn g() -> usize { byte_len(\"hi\") }",
    );
    println!(
        "[?Sized 없이 str] {}",
        e.lines().find(|l| l.starts_with("error")).unwrap()
    );
    assert!(e.contains("error[E0277]"));
    let e = compile_errors(
        "pub fn byte_len<T: AsRef<[u8]> + ?Sized>(x: &T) -> usize { x.as_ref().len() }
         pub fn g() -> usize { byte_len(\"hi\") }",
    );
    assert!(!e.contains("error"), "{e}");

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
