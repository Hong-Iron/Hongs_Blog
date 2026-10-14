---
layout: "note"
title: "21_iterators_bench.rs"
display_title: "21_iterators_bench.rs"
kind: "code"
kind_label: "코드 · 실험"
num: "21"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/iterators/"
parent_title: "반복자"
description: "Rust · 반복자 실험 코드"
sitemap: false
permalink: "/studies/rust/code/21_iterators_bench/"
---
{% raw %}
[반복자](/Hongs_Blog/studies/rust/iterators/) 문서의 실험 코드다.

```rust
//! 21 반복자: 번호로 도는 for 문, 참조로 도는 for 문, 반복자 사슬이 같은 계산에서 걸리는 시간을 잰다.
//! 측정 프로그램을 -C opt-level=3으로 따로 컴파일해 돌린다(이 기계에서 잰 값이며, 기계마다 다르다).
//! 시간 크기는 단언하지 않고, 세 방식의 결과가 같은지만 단언한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/21_iterators_bench.rs"

const BENCH: &str = r#"
use std::hint::black_box;
use std::time::Instant;

#[allow(clippy::needless_range_loop)]
fn sum_index(v: &[u64]) -> u64 {
    let mut s = 0u64;
    for i in 0..v.len() { if v[i] % 2 == 0 { s = s.wrapping_add(v[i] * v[i]); } }
    s
}
fn sum_for(v: &[u64]) -> u64 {
    let mut s = 0u64;
    for &x in v { if x % 2 == 0 { s = s.wrapping_add(x * x); } }
    s
}
fn sum_iter(v: &[u64]) -> u64 {
    v.iter().filter(|&&x| x % 2 == 0).map(|&x| x * x).fold(0u64, |a, b| a.wrapping_add(b))
}
fn dot_index(a: &[f32], b: &[f32]) -> f32 {
    let mut s = 0.0; let n = a.len().min(b.len());
    for i in 0..n { s += a[i] * b[i]; }
    s
}
fn dot_zip(a: &[f32], b: &[f32]) -> f32 {
    a.iter().zip(b).map(|(x, y)| x * y).sum()
}
fn time<T: Copy, F: FnMut() -> T>(mut f: F) -> (T, u128) {
    let mut best = u128::MAX; let mut v = f();
    for _ in 0..9 { let t = Instant::now(); v = black_box(f()); best = best.min(t.elapsed().as_micros()); }
    (v, best)
}
fn main() {
    let v: Vec<u64> = (0..10_000_000u64).map(|i| i.wrapping_mul(2654435761) % 1000).collect();
    let a: Vec<f32> = (0..10_000_000).map(|i| (i % 13) as f32).collect();
    let b: Vec<f32> = (0..10_000_000).map(|i| (i % 7) as f32).collect();
    let (r1, t1) = time(|| sum_index(black_box(&v)));
    let (r2, t2) = time(|| sum_for(black_box(&v)));
    let (r3, t3) = time(|| sum_iter(black_box(&v)));
    let (d1, u1) = time(|| dot_index(black_box(&a), black_box(&b)));
    let (d2, u2) = time(|| dot_zip(black_box(&a), black_box(&b)));
    println!("{r1} {t1} {r2} {t2} {r3} {t3} {d1} {u1} {d2} {u2}");
}
"#;

fn main() {
    let dir = std::env::temp_dir().join(format!("vr21b_{}", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, BENCH).unwrap();
    let out = std::process::Command::new("rustc")
        .args(["--edition", "2024", "-C", "opt-level=3", "--out-dir"])
        .arg(&dir)
        .arg(&file)
        .output()
        .expect("rustc 실행");
    assert!(
        out.status.success(),
        "{}",
        String::from_utf8_lossy(&out.stderr)
    );
    let run = std::process::Command::new(dir.join("snippet"))
        .output()
        .expect("측정 프로그램 실행");
    let text = String::from_utf8_lossy(&run.stdout).into_owned();
    let f: Vec<&str> = text.split_whitespace().collect();
    println!("원소 10,000,000개, 9번 잰 것 중 가장 짧은 시간 (이 기계, opt-level=3):");
    println!(
        "  짝수 제곱 합: 번호 for {:>6} µs, 참조 for {:>6} µs, filter·map·fold {:>6} µs",
        f[1], f[3], f[5]
    );
    println!(
        "  내적:          번호 for {:>6} µs, zip·map·sum {:>6} µs",
        f[7], f[9]
    );
    assert_eq!(f[0], f[2]);
    assert_eq!(f[0], f[4]);
    assert_eq!(f[6], f[8]);
    println!("결과: 짝수 제곱 합 {}, 내적 {}", f[0], f[6]);
    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
