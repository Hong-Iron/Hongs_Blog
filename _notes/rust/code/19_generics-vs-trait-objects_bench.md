---
layout: "note"
title: "19_generics-vs-trait-objects_bench.rs"
display_title: "19_generics-vs-trait-objects_bench.rs"
kind: "code"
kind_label: "코드 · 실험"
num: "19"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/generics-vs-trait-objects/"
parent_title: "제네릭과 트레이트 객체 비교"
description: "Rust · 제네릭과 트레이트 객체 비교 실험 코드"
sitemap: false
permalink: "/studies/rust/code/19_generics-vs-trait-objects_bench/"
---
{% raw %}
[제네릭과 트레이트 객체 비교](/Hongs_Blog/studies/rust/generics-vs-trait-objects/) 문서의 실험 코드다.

```rust
//! 19 제네릭과 트레이트 객체 비교: (1) 제네릭은 섞인 타입을 한 Vec에 못 담는다(E0308),
//! (2) 함수 사본 개수: 제네릭은 타입 수만큼, dyn은 하나(LLVM IR 정의 개수),
//! (3) 같은 일을 정적 디스패치·dyn·enum으로 했을 때 걸린 시간(-C opt-level=3로 따로 컴파일해 이 기계에서 잰 값).
//!     넓이를 f64로 더할 때와 u64로 더할 때를 따로 잰다.
//! (4) 타입 40개로 부를 때 목적 파일 크기와 컴파일 시간(opt-level=2, 이 기계에서 잰 값).
//! (5) 왜 f64 합에서는 차이가 작은가: 인라인된 합 루프의 어셈블리에서 합을 쌓는 레지스터 수를 센다
//!     (u64는 여러 갈래로 나눠 더하고, f64는 한 줄로 차례로 더한다. aarch64 macOS에서만 확인),
//!     실수 덧셈은 묶는 순서에 따라 결과가 달라진다는 것도 확인한다.
//! 시간은 기계와 부하에 따라 바뀌므로 시간의 크고 작음은 단언하지 않고, 계산 결과가 같은지,
//! 함수 사본 개수, 목적 파일 크기의 크고 작음만 단언한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/19_generics-vs-trait-objects_bench.rs"

use std::collections::BTreeSet;
use std::fmt::Write as _;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::time::{Duration, Instant};

static SNIPPET: AtomicUsize = AtomicUsize::new(0);

fn snippet_dir() -> std::path::PathBuf {
    let n = SNIPPET.fetch_add(1, Ordering::Relaxed);
    let dir = std::env::temp_dir().join(format!("vr19_{}_{}", std::process::id(), n));
    std::fs::create_dir_all(&dir).unwrap();
    dir
}

fn rustc(dir: &std::path::Path, code: &str, extra: &[&str]) -> std::process::Output {
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    std::process::Command::new("rustc")
        .args(["--edition", "2024"])
        .args(extra)
        .arg("--out-dir")
        .arg(dir)
        .arg(&file)
        .output()
        .expect("rustc 실행")
}

fn count_definitions(code: &str, name: &str) -> usize {
    let dir = snippet_dir();
    let out = rustc(
        &dir,
        code,
        &["--crate-type=lib", "-C", "opt-level=2", "--emit=llvm-ir"],
    );
    assert!(
        out.status.success(),
        "{}",
        String::from_utf8_lossy(&out.stderr)
    );
    std::fs::read_to_string(dir.join("snippet.ll"))
        .unwrap()
        .lines()
        .filter(|l| l.starts_with("define") && l.contains(name))
        .count()
}

// NUM 자리에 f64나 u64를 넣어 두 번 쓴다.
const BENCH: &str = r#"
use std::hint::black_box;
use std::time::Instant;

trait Shape { fn area(&self) -> NUM; }
#[derive(Clone, Copy)] struct Circle { r: NUM }
#[derive(Clone, Copy)] struct Square { s: NUM }
impl Shape for Circle { fn area(&self) -> NUM { 3 as NUM * self.r * self.r } }
impl Shape for Square { fn area(&self) -> NUM { self.s * self.s } }
enum AnyShape { C(Circle), S(Square) }
impl AnyShape { fn area(&self) -> NUM { match self { AnyShape::C(c) => c.area(), AnyShape::S(s) => s.area() } } }

fn total_generic<T: Shape>(xs: &[T]) -> NUM { xs.iter().map(|x| x.area()).sum() }
fn total_dyn(xs: &[&dyn Shape]) -> NUM { xs.iter().map(|x| x.area()).sum() }
fn total_box(xs: &[Box<dyn Shape>]) -> NUM { xs.iter().map(|x| x.area()).sum() }
fn total_enum(xs: &[AnyShape]) -> NUM { xs.iter().map(|x| x.area()).sum() }

fn time<F: FnMut() -> NUM>(mut f: F) -> (NUM, u128) {
    let mut best = u128::MAX; let mut v = 0 as NUM;
    for _ in 0..7 { let t = Instant::now(); v = black_box(f()); best = best.min(t.elapsed().as_micros()); }
    (v, best)
}

fn main() {
    let n = 2_000_000u64;
    let circles: Vec<Circle> = (0..n).map(|i| Circle { r: (i % 7) as NUM }).collect();
    let refs: Vec<&dyn Shape> = circles.iter().map(|c| c as &dyn Shape).collect();
    let boxes: Vec<Box<dyn Shape>> = circles.iter().map(|&c| Box::new(c) as Box<dyn Shape>).collect();
    let enums: Vec<AnyShape> = circles.iter().map(|&c| AnyShape::C(c)).collect();
    let mixed: Vec<Box<dyn Shape>> = (0..n).map(|i| if i % 2 == 0 { Box::new(Circle { r: (i % 7) as NUM }) as Box<dyn Shape> } else { Box::new(Square { s: (i % 7) as NUM }) }).collect();
    let mixed_enum: Vec<AnyShape> = (0..n).map(|i| if i % 2 == 0 { AnyShape::C(Circle { r: (i % 7) as NUM }) } else { AnyShape::S(Square { s: (i % 7) as NUM }) }).collect();
    let (a, ta) = time(|| total_generic(black_box(&circles)));
    let (b, tb) = time(|| total_dyn(black_box(&refs)));
    let (c, tc) = time(|| total_box(black_box(&boxes)));
    let (d, td) = time(|| total_enum(black_box(&enums)));
    let (e, te) = time(|| total_box(black_box(&mixed)));
    let (f, tf) = time(|| total_enum(black_box(&mixed_enum)));
    println!("{a} {ta} {b} {tb} {c} {tc} {d} {td} {e} {te} {f} {tf}");
}
"#;

/// 넓이 타입을 `num`으로 바꾼 BENCH를 최적화해 컴파일하고 실행한 뒤 숫자 12개를 돌려준다.
fn run_bench(num: &str) -> Vec<f64> {
    let dir = snippet_dir();
    let out = rustc(&dir, &BENCH.replace("NUM", num), &["-C", "opt-level=3"]);
    assert!(
        out.status.success(),
        "{}",
        String::from_utf8_lossy(&out.stderr)
    );
    let run = std::process::Command::new(dir.join("snippet"))
        .output()
        .expect("bench 실행");
    String::from_utf8_lossy(&run.stdout)
        .split_whitespace()
        .map(|x| x.parse().unwrap())
        .collect()
}

const TYPES: usize = 40;

// 크기 비교용: 같은 몸통을 제네릭 함수와 dyn 함수로 만들고, 타입 40개에서 부른다.
const REPORT_BODY: &str = r#"{
    let a = x.area();
    let mut parts = Vec::new();
    for k in 1..=4 { parts.push(format!("{}x{} = {:.3}", x.label(), k, a * k as f64)); }
    if a > 100.0 { parts.push(format!("big {}", x.label())); } else { parts.push(format!("small {:e}", a)); }
    parts.join(", ")
}"#;

fn size_snippet(dynamic: bool) -> String {
    let mut s = String::from(
        "pub trait Area { fn area(&self) -> f64; fn label(&self) -> &'static str; }
         macro_rules! shape { ($n:ident, $k:expr) => {
             pub struct $n(pub f64);
             impl Area for $n {
                 fn area(&self) -> f64 { self.0 * $k }
                 fn label(&self) -> &'static str { stringify!($n) }
             }
         } }\n",
    );
    for i in 0..TYPES {
        writeln!(s, "shape!(S{i}, {}.0);", i + 1).unwrap();
    }
    let params = if dynamic {
        "(x: &dyn Area)"
    } else {
        "<T: Area>(x: &T)"
    };
    writeln!(
        s,
        "#[inline(never)] fn report{params} -> String {REPORT_BODY}"
    )
    .unwrap();
    for i in 0..TYPES {
        writeln!(s, "pub fn run_s{i}(x: &S{i}) -> String {{ report(x) }}").unwrap();
    }
    s
}

/// 목적 파일을 세 번 만들어 가장 짧은 컴파일 시간과 파일 크기를 돌려준다.
fn object_size_and_time(code: &str) -> (u64, Duration) {
    let dir = snippet_dir();
    let mut best = Duration::MAX;
    for _ in 0..3 {
        let t = Instant::now();
        let out = rustc(
            &dir,
            code,
            &["--crate-type=lib", "-C", "opt-level=2", "--emit=obj"],
        );
        best = best.min(t.elapsed());
        assert!(
            out.status.success(),
            "{}",
            String::from_utf8_lossy(&out.stderr)
        );
    }
    let size = std::fs::metadata(dir.join("snippet.o")).unwrap().len();
    (size, best)
}

// 인라인된 합 루프: 정수와 실수 두 가지.
const SUMS: &str = "
    pub struct CircleU { pub r: u64 }
    pub struct CircleF { pub r: f64 }
    #[unsafe(no_mangle)] pub fn sum_u(xs: &[CircleU]) -> u64 { xs.iter().map(|c| 3 * c.r * c.r).sum() }
    #[unsafe(no_mangle)] pub fn sum_f(xs: &[CircleF]) -> f64 { xs.iter().map(|c| 3.0 * c.r * c.r).sum() }";

/// 어셈블리에서 함수 `func`의 몸통을 잘라, `acc = acc + x` 꼴(결과 레지스터가 입력에도 있음)의
/// `op` 명령이 쓰는 결과 레지스터를 모은다. 합을 몇 갈래로 나눠 쌓는지 알 수 있다.
fn accumulators(asm: &str, func: &str, op: &str) -> BTreeSet<String> {
    let start = format!("_{func}:");
    let mut set = BTreeSet::new();
    let body = asm
        .lines()
        .skip_while(|l| !l.starts_with(&start))
        .take_while(|l| !l.contains(".cfi_endproc"));
    for line in body {
        let Some(rest) = line.trim().strip_prefix(op) else {
            continue;
        };
        let ops: Vec<&str> = rest.split(", ").collect();
        if ops.len() == 3 && (ops[0] == ops[1] || ops[0] == ops[2]) {
            set.insert(ops[0].to_string());
        }
    }
    set
}

fn main() {
    // 1. 제네릭 Vec<T>에는 한 가지 타입만
    let dir = snippet_dir();
    let out = rustc(
        &dir,
        "pub trait Shape {} pub struct Circle; pub struct Square;
         impl Shape for Circle {} impl Shape for Square {}
         pub fn all<T: Shape>(_xs: Vec<T>) {}
         pub fn f() { all(vec![Circle, Square]); }",
        &["--crate-type=lib", "--emit=metadata"],
    );
    let err = String::from_utf8_lossy(&out.stderr);
    println!(
        "[제네릭 Vec에 두 타입] {}",
        err.lines().find(|l| l.starts_with("error")).unwrap()
    );
    assert!(err.contains("error[E0308]"));

    // 2. 함수 사본 개수
    let generic = "
        pub trait Area { fn area(&self) -> f64; }
        macro_rules! shape { ($n:ident, $k:expr) => {
            pub struct $n(pub f64);
            impl Area for $n { fn area(&self) -> f64 { self.0 * $k } }
        } }
        shape!(A, 1.0); shape!(B, 2.0); shape!(C, 3.0); shape!(D, 4.0); shape!(E, 5.0); shape!(F, 6.0);
        #[inline(never)] fn total<T: Area>(xs: &[T]) -> f64 { xs.iter().map(|x| x.area()).sum() }
        pub fn run(a: &[A], b: &[B], c: &[C], d: &[D], e: &[E], f: &[F]) -> f64 {
            total(a) + total(b) + total(c) + total(d) + total(e) + total(f)
        }";
    let dynamic = "
        pub trait Area { fn area(&self) -> f64; }
        macro_rules! shape { ($n:ident, $k:expr) => {
            pub struct $n(pub f64);
            impl Area for $n { fn area(&self) -> f64 { self.0 * $k } }
        } }
        shape!(A, 1.0); shape!(B, 2.0); shape!(C, 3.0); shape!(D, 4.0); shape!(E, 5.0); shape!(F, 6.0);
        #[inline(never)] fn total(xs: &[&dyn Area]) -> f64 { xs.iter().map(|x| x.area()).sum() }
        pub fn run(a: &[&dyn Area], b: &[&dyn Area], c: &[&dyn Area], d: &[&dyn Area], e: &[&dyn Area], f: &[&dyn Area]) -> f64 {
            total(a) + total(b) + total(c) + total(d) + total(e) + total(f)
        }";
    let g = count_definitions(generic, "5total");
    let d = count_definitions(dynamic, "5total");
    println!("total 정의 개수: 제네릭(타입 6개) {g}, dyn {d}");
    assert_eq!((g, d), (6, 1));

    // 3. 시간 재기: 최적화한 별도 프로그램을 만들어 돌린다.
    let labels = [
        "제네릭 Vec<Circle>",
        "&dyn Shape (값은 한 Vec에 붙어 있음)",
        "Box<dyn Shape> (값마다 따로 힙)",
        "enum Vec<AnyShape>",
        "Box<dyn Shape> 원·정사각형 섞음",
        "enum 원·정사각형 섞음",
    ];
    for num in ["f64", "u64"] {
        let v = run_bench(num);
        println!(
            "원소 2,000,000개 넓이({num}) 합, 7번 잰 것 중 가장 짧은 시간 (이 기계, opt-level=3):"
        );
        for (i, l) in labels.iter().enumerate() {
            println!("  {l:<40} {:>8} µs", v[2 * i + 1]);
        }
        // 같은 원만 담은 네 방식의 결과는 같아야 한다.
        assert_eq!(v[0], v[2]);
        assert_eq!(v[0], v[4]);
        assert_eq!(v[0], v[6]);
        // 섞은 두 방식의 결과도 같아야 한다.
        assert_eq!(v[8], v[10]);
    }

    // 4. 타입 40개로 부를 때 코드 크기와 컴파일 시간
    let generic40 = size_snippet(false);
    let dynamic40 = size_snippet(true);
    let gr = count_definitions(&generic40, "6report");
    let dr = count_definitions(&dynamic40, "6report");
    let (gs, gt) = object_size_and_time(&generic40);
    let (ds, dt) = object_size_and_time(&dynamic40);
    println!(
        "타입 {TYPES}개에서 부른 report (opt-level=2, 이 기계, 컴파일은 3번 중 가장 짧은 시간):"
    );
    println!(
        "  제네릭: 정의 {gr}개, 목적 파일 {gs}바이트, 컴파일 {} ms",
        gt.as_millis()
    );
    println!(
        "  dyn   : 정의 {dr}개, 목적 파일 {ds}바이트, 컴파일 {} ms",
        dt.as_millis()
    );
    assert_eq!((gr, dr), (TYPES, 1));
    assert!(gs > ds, "제네릭 쪽 목적 파일이 더 커야 한다: {gs} vs {ds}");

    // 5. 합을 몇 갈래로 쌓는가
    if cfg!(all(target_arch = "aarch64", target_os = "macos")) {
        let dir = snippet_dir();
        let out = rustc(
            &dir,
            SUMS,
            &["--crate-type=lib", "-C", "opt-level=3", "--emit=asm"],
        );
        assert!(
            out.status.success(),
            "{}",
            String::from_utf8_lossy(&out.stderr)
        );
        let asm = std::fs::read_to_string(dir.join("snippet.s")).unwrap();
        let int_acc = accumulators(&asm, "sum_u", "add\t");
        let float_acc = accumulators(&asm, "sum_f", "fadd\t");
        println!(
            "합을 쌓는 레지스터: u64 {}개 {int_acc:?}, f64 {}개 {float_acc:?}",
            int_acc.len(),
            float_acc.len()
        );
        assert!(int_acc.len() >= 2);
        assert_eq!(float_acc.len(), 1);
    } else {
        println!("합 갈래 확인은 aarch64 macOS에서만 한다");
    }
    // 실수 덧셈은 묶는 순서를 바꾸면 결과가 달라질 수 있다. 그래서 컴파일러가 순서를 바꾸지 않는다.
    let left = (0.1f64 + 0.2) + 0.3;
    let right = 0.1f64 + (0.2 + 0.3);
    println!("(0.1 + 0.2) + 0.3 = {left}, 0.1 + (0.2 + 0.3) = {right}");
    assert_ne!(left, right);

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
