---
layout: "note"
title: "27_box-heap_verify.rs"
display_title: "27_box-heap_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "27"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/box-heap/"
parent_title: "Box와 힙"
description: "Rust · Box와 힙 검증 코드"
permalink: "/studies/rust/code/27_box-heap_verify/"
---
{% raw %}
[Box와 힙](/Hongs_Blog/studies/rust/box-heap/) 문서의 검증 코드다.

```rust
//! Box와 힙: 재귀 타입은 Box 없이 컴파일되지 않는다(E0072, Option으로 감싸도), 포인터 크기(얇은 8바이트, 넓은 16바이트),
//! Option<Box<T>>가 Box<T>와 같은 크기, Box<dyn Trait>로 서로 다른 타입 담기, Box를 옮겨도 힙 주소는 그대로,
//! Drop이 한 번씩 도는 것, 쓸데없는 Box를 잡는 clippy 린트 네 개가 기본으로 켜져 있는 것을 확인한다.
//! (크기는 64비트 기계 기준)
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/27_box-heap_verify.rs"

use std::cell::Cell;
use std::fmt::Display;
use std::mem::size_of;

// ---------- 재귀 타입 ----------

#[derive(Debug)]
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

impl List {
    fn sum(&self) -> i32 {
        match self {
            Cons(v, rest) => v + rest.sum(),
            Nil => 0,
        }
    }
}

/// 이진 트리: 자식이 없을 수 있으므로 Option<Box<Node>>
struct Node {
    key: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

fn insert(slot: &mut Option<Box<Node>>, key: i32) {
    match slot {
        None => {
            *slot = Some(Box::new(Node {
                key,
                left: None,
                right: None,
            }))
        }
        Some(n) if key < n.key => insert(&mut n.left, key),
        Some(n) => insert(&mut n.right, key),
    }
}

fn in_order(slot: &Option<Box<Node>>, out: &mut Vec<i32>) {
    if let Some(n) = slot {
        in_order(&n.left, out);
        out.push(n.key);
        in_order(&n.right, out);
    }
}

// ---------- Box<dyn Trait> ----------

trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
}
struct Square(f64);
struct Circle(f64);
impl Shape for Square {
    fn area(&self) -> f64 {
        self.0 * self.0
    }
    fn name(&self) -> String {
        format!("square {}", self.0)
    }
}
impl Shape for Circle {
    fn area(&self) -> f64 {
        3.0 * self.0 * self.0 // 계산을 단순하게: π 대신 3
    }
    fn name(&self) -> String {
        format!("circle {}", self.0)
    }
}

// ---------- Drop 세기 ----------

thread_local! {
    static DROPS: Cell<u32> = const { Cell::new(0) };
}
struct Loud;
impl Drop for Loud {
    fn drop(&mut self) {
        DROPS.with(|d| d.set(d.get() + 1));
    }
}

fn take_box(b: Box<[u64; 1024]>) -> *const u64 {
    b.as_ptr()
}

fn compile_errors(code: &str) -> String {
    compile_with("rustc", "rustc", code)
}

/// 같은 조각을 clippy-driver로 컴파일한다(추가 -W 없이, 즉 기본 설정 그대로).
fn clippy(code: &str) -> String {
    compile_with("clippy-driver", "clippy", code)
}

fn compile_with(tool: &str, tag: &str, code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr27_{}_{tag}", std::process::id()));
    std::fs::create_dir_all(&dir).expect("임시 폴더");
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).expect("쓰기");
    let out = std::process::Command::new(tool)
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
        .expect("컴파일러 실행");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn main() {
    // 1. 재귀 타입
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
    assert_eq!(list.sum(), 6);
    assert_eq!(format!("{list:?}"), "Cons(1, Cons(2, Cons(3, Nil)))");
    let e = compile_errors("pub enum List { Cons(i32, List), Nil }\n");
    assert!(e.contains("error[E0072]"), "{e}");
    assert!(e.contains("recursive type `List` has infinite size"), "{e}");
    assert!(e.contains("insert some indirection"), "{e}");
    // Option으로 감싸도 안에 Node가 통째로 들어 있으므로 같은 오류다
    let e = compile_errors("pub struct Node { pub val: i32, pub next: Option<Node> }\n");
    assert!(e.contains("error[E0072]"), "{e}");
    assert!(e.contains("recursive type `Node` has infinite size"), "{e}");
    println!("1. Box 없는 재귀 타입: E0072 (Option<Node>도 E0072)");

    let mut root = None;
    for k in [5, 3, 8, 1, 4, 9, 7] {
        insert(&mut root, k);
    }
    let mut keys = Vec::new();
    in_order(&root, &mut keys);
    assert_eq!(keys, vec![1, 3, 4, 5, 7, 8, 9]);

    // 2. 크기
    let sizes = [
        ("&i32", size_of::<&i32>()),
        ("Box<i32>", size_of::<Box<i32>>()),
        ("Box<[i32; 1000]>", size_of::<Box<[i32; 1000]>>()),
        ("Option<Box<i32>>", size_of::<Option<Box<i32>>>()),
        ("Box<[i32]>", size_of::<Box<[i32]>>()),
        ("Box<str>", size_of::<Box<str>>()),
        ("Box<dyn Display>", size_of::<Box<dyn Display>>()),
        ("Vec<i32>", size_of::<Vec<i32>>()),
        ("List", size_of::<List>()),
        ("[i32; 1000]", size_of::<[i32; 1000]>()),
    ];
    for (n, s) in sizes {
        println!("   size_of::<{n}>() = {s}");
    }
    assert_eq!(size_of::<usize>(), 8, "64비트 기계에서 확인한다");
    assert_eq!(size_of::<Box<i32>>(), 8);
    assert_eq!(size_of::<Box<[i32; 1000]>>(), 8); // 가리키는 것이 커도 상자는 8바이트
    assert_eq!(size_of::<Option<Box<i32>>>(), 8); // None을 널 주소로 나타낸다
    assert_eq!(size_of::<Box<[i32]>>(), 16); // 주소 + 길이
    assert_eq!(size_of::<Box<str>>(), 16);
    assert_eq!(size_of::<Box<dyn Display>>(), 16); // 주소 + vtable 주소
    assert_eq!(size_of::<Vec<i32>>(), 24); // 주소 + 길이 + 용량
    assert_eq!(size_of::<List>(), 16); // i32 4 + Box 8 → 정렬 맞춰 16
    assert_eq!(size_of::<[i32; 1000]>(), 4000);
    // 더 늘리지 않을 목록은 Box<[T]>로 바꾸면 손잡이가 24 → 16바이트
    let v: Vec<i32> = (1..=5).collect();
    let frozen: Box<[i32]> = v.into_boxed_slice();
    assert_eq!(frozen.len(), 5);
    assert_eq!(&frozen[..], &[1, 2, 3, 4, 5]);
    let name: Box<str> = String::from("kim").into_boxed_str();
    assert_eq!(&*name, "kim");
    println!("2. 크기 확인");

    // 3. Box<dyn Trait>로 다른 타입을 한 Vec에
    let shapes: Vec<Box<dyn Shape>> = vec![Box::new(Square(2.0)), Box::new(Circle(1.0))];
    let total: f64 = shapes.iter().map(|s| s.area()).sum();
    let names: Vec<String> = shapes.iter().map(|s| s.name()).collect();
    assert_eq!(total, 7.0);
    assert_eq!(names, vec!["square 2", "circle 1"]);
    println!("3. Box<dyn Shape>: 넓이 합 {total}");

    // 4. Box를 함수로 넘겨도(이동) 힙의 데이터는 복사되지 않는다: 주소가 같다
    let big = Box::new([7u64; 1024]);
    let before = big.as_ptr();
    let after = take_box(big);
    assert_eq!(before, after);
    println!("4. 8KB 배열을 담은 Box 이동: 힙 주소 그대로");

    // 5. Drop은 정확히 한 번
    {
        let a = Box::new(Loud);
        let b = a; // 이동: 소유자가 b로 바뀐다
        let v: Vec<Box<Loud>> = vec![b, Box::new(Loud)];
        assert_eq!(v.len(), 2);
    }
    assert_eq!(DROPS.with(|d| d.get()), 2);
    println!("5. Box 두 개, Drop 두 번");

    // 6. 쓸데없는 Box를 잡는 clippy 린트(기본 설정에서 경고)
    let e = clippy(
        "pub fn run() -> usize {\n\
         struct S { v: Box<Vec<i32>> }\n\
         fn h(v: Vec<Box<i32>>) -> usize { v.len() }\n\
         fn k(x: Box<std::rc::Rc<i32>>) -> i32 { **x }\n\
         fn f(x: Box<i32>) -> i32 { *x + 1 }\n\
         let s = S { v: Box::new(vec![1]) };\n\
         s.v.len() + h(vec![Box::new(1)]) + k(Box::new(std::rc::Rc::new(1))) as usize + f(Box::new(1)) as usize\n\
         }\n",
    );
    for lint in [
        "box_collection",
        "vec_box",
        "redundant_allocation",
        "boxed_local",
    ] {
        assert!(
            e.contains(&format!("`#[warn(clippy::{lint})]` on by default")),
            "{lint}: {e}"
        );
    }
    assert!(
        e.contains("you seem to be trying to use `Box<Vec<..>>`"),
        "{e}"
    );
    assert!(
        e.contains("`Vec<T>` is already on the heap, the boxing is unnecessary"),
        "{e}"
    );
    println!("6. clippy 기본 경고: box_collection, vec_box, redundant_allocation, boxed_local");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_list_sums_to_zero() {
        assert_eq!(Nil.sum(), 0);
    }

    #[test]
    fn deref_box() {
        let b = Box::new(41);
        assert_eq!(*b + 1, 42);
    }
}
```
{% endraw %}
