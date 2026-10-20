---
layout: "note"
title: "성능 측정과 최적화"
display_title: "성능 측정과 최적화 (Performance Measurement)"
kind: "concept"
kind_label: "기법"
num: "47"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Performance", "Benchmark", "벤치마크", "Profiling", "프로파일링", "black_box", "Criterion", "Release Profile", "LTO", "codegen-units", "panic=abort", "with_capacity"]
description: "느린 곳을 짐작으로 고치면 대개 엉뚱한 곳을 고친다. 그래서 먼저 재고, 가장 오래 걸리는 곳 하나만 고치고, 다시 잰다. Rust에서는 빌드 설정만 바꿔도 열 배가 빨라지기도 하고, 반대로 컴파일러가 잴 코드를 통째로 지워 0초가 찍히기도 한다. 재는 방법이 틀리면 숫자는 거짓말…"
prev_url: "/studies/rust/sqlx-database/"
prev_title: "sqlx로 데이터베이스 쓰기"
next_url: "/studies/rust/ci-quality-gates/"
next_title: "CI 품질 게이트"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "47_performance-measurement_bench.rs", "u": "/studies/rust/code/47_performance-measurement_bench/", "r": "실험"}]
permalink: "/studies/rust/performance-measurement/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

느린 곳을 짐작으로 고치면 대개 엉뚱한 곳을 고친다. 그래서 먼저 재고, 가장 오래 걸리는 곳 하나만 고치고, 다시 잰다. Rust에서는 빌드 설정만 바꿔도 열 배가 빨라지기도 하고, 반대로 컴파일러가 잴 코드를 통째로 지워 0초가 찍히기도 한다. 재는 방법이 틀리면 숫자는 거짓말을 한다.

</div>


## 예시로 보기

"왜 내 Rust 코드가 파이썬보다 느리지?"라는 질문의 절반은 `cargo run`으로 돌린 결과다. `cargo run`과 `cargo build`는 기본으로 개발용 설정(dev 프로필)을 쓴다. 이 설정은 최적화를 끈다(`opt-level = 0`)[^1]. 배포용은 `--release`를 붙여야 켜진다(`opt-level = 3`)[^1].

같은 프로그램을 두 설정으로 컴파일해 돌려 보았다. `u64` 3천만 개를 섞어 더하는 반복문이다.

| 빌드 | 걸린 시간(세 번 중 최소) |
|---|---|
| `opt-level=0` (dev와 같다) | 약 140ms |
| `opt-level=3` (release와 같다) | 약 14ms |

열 배 차이다. 이 숫자는 이 기계(aarch64 macOS)에서 잰 한 번의 값이고, 다른 기계에서는 다르다. Rust Performance Book도 release 빌드가 dev보다 10~100배 빠른 일이 흔하다고 적는다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 용량 변화, 할당 횟수, 디버그 빌드 시간, opt-level 0과 3의 시간을 재고 결과가 같은지 확인했다 — [47_performance-measurement_bench.rs](/Hongs_Blog/studies/rust/code/47_performance-measurement_bench/). 검사 도구는 디버그 빌드로 돌리므로, 최적화 빌드 숫자는 이 파일 안에서 `rustc -C opt-level=3`으로 따로 컴파일해 얻었다.</div>

</div>


## 재는 법

### 마이크로 벤치마크와 black_box

함수 하나를 여러 번 돌려 시간을 재는 것을 마이크로 벤치마크라 부른다. 표준 라이브러리만으로는 `Instant`와 `black_box` 두 가지면 된다.

- `Instant::now()`와 `elapsed()`는 뒤로 가지 않는 시계로 걸린 시간을 잰다. 다만 눈금 간격이 늘 같다는 보장은 없다[^3].
- `std::hint::black_box(x)`는 하는 일 없이 `x`를 돌려준다. 컴파일러에게는 "이 값이 어디에 어떻게 쓰일지 모른다"고 알려서, 잴 계산을 지우거나 미리 계산해 두지 못하게 한다[^4].

```rust
let t = Instant::now();
black_box(push_n(black_box(100_000)));   // 입력과 결과 양쪽을 감싼다
println!("{:?}", t.elapsed());
```

왜 양쪽을 감싸나? `black_box`는 들어가는 값을 어떻게 다룰지가 아니라 나오는 값만 막는다. `black_box(5 * 10)`은 곱셈이 미리 접힐 수 있으니 `black_box(5) * black_box(10)`처럼 재료를 감싸라고 문서가 적는다[^4]. 이것은 "최선을 다한다" 수준의 힌트다. 벤치마크에는 믿고 써도 되지만, 프로그램의 정확성이나 보안을 여기에 기대면 안 된다[^4].

한 번 잰 시간은 흔들린다. 메모리 배치가 조금만 바뀌어도 일시적인 큰 변동이 생긴다[^5]. 검증 코드는 여러 번 돌려 가장 짧은 값을 골랐다. 다른 일이 끼어든 회차는 길어지기만 하기 때문이다.

### Criterion: 표준 도구

손으로 짠 반복문 대신 실무에서는 Criterion을 많이 쓴다. 통계로 여러 번 재고, 지난 실행과 비교해 "빨라졌다/느려졌다"를 유의확률과 함께 알려 준다[^6]. 지금 버전은 0.8.2다[^7]. 이 과목의 실행 환경에는 설치되어 있지 않아 아래 설정은 실행하지 않았다.

```toml
[dev-dependencies]
criterion = "0.8"

[[bench]]
name = "my_benchmark"
harness = false   # 기본 벤치 실행기 대신 Criterion의 main을 쓴다
```

```rust
// benches/my_benchmark.rs
use criterion::{criterion_group, criterion_main, Criterion};
use std::hint::black_box;

fn bench(c: &mut Criterion) {
    c.bench_function("fib 20", |b| b.iter(|| fibonacci(black_box(20))));
}
criterion_group!(benches, bench);
criterion_main!(benches);
```

`cargo bench`로 돌린다[^6]. Criterion 0.8의 `criterion::black_box`는 더 쓰지 말라고(deprecated) 표시되어 있어서 `std::hint::black_box`를 쓴다[^7]. 같은 일을 하는 다른 도구로 Divan이 있고, 프로그램 전체를 명령줄에서 재려면 Hyperfine을 쓴다[^5].

### 프로파일러: 어디가 느린지 찾기

벤치마크는 "얼마나"를 재고, 프로파일러는 "어디서"를 찾는다. Linux에서는 perf, macOS에서는 Instruments, 여러 운영체제에서는 samply를 쓰고, 결과를 불꽃 그래프(flamegraph)로 본다. 할당이 많은 곳은 DHAT으로 찾는다[^8]. release 빌드를 프로파일링할 때는 줄 번호 정보를 남겨야 결과가 읽힌다[^8].

```toml
[profile.release]
debug = "line-tables-only"
```

## 고치는 법

### 할당 줄이기

`Vec`은 꽉 차면 더 큰 자리를 새로 잡고 옮긴다. `Vec<u64>`에 하나씩 넣으며 용량을 찍어 보면 `0, 4, 8, 16, 32, 64, 128`로 두 배씩 자랐다. 성능 책도 같은 수열을 적는다[^9].

| 상황 | 할당 횟수(실행 결과) |
|---|---|
| `Vec::new()`에 1,000개 push | 9번 |
| `Vec::with_capacity(1000)`에 1,000개 push | 1번 |
| 1,000줄을 줄마다 `format!` | 1,900번 |
| `String` 하나를 바깥에 두고 `clear()` 후 `writeln!` | 1번 |

할당 횟수는 시간과 달리 몇 번을 돌려도 같다. 검증 코드는 전역 할당자를 감싸 횟수를 셌다. `format!`은 줄마다 새 `String`을 만든다[^9]. 1,900번인 까닭은 번호가 100 이상인 900줄에서 처음 잡은 자리가 모자라 한 번 더 잡았기 때문이다. 버퍼를 반복문 바깥에 두고 `clear()`하면 내용만 비우고 자리는 남는다. 그래서 할당이 처음 한 번뿐이다[^9].

크기를 미리 알면 `with_capacity`나 `reserve`로 한 번에 잡는다[^9]. `clone()`은 힙을 가진 값을 통째로 복사한다. `Rc`·`Arc`만 참조 수를 하나 올릴 뿐이다[^9].

### 빌드 설정

`Cargo.toml`의 `[profile.release]`에서 바꾼다. 기본값과 효과는 이렇다.

| 설정 | release 기본값 | 바꾸면 | 대가 |
|---|---|---|---|
| `opt-level` | `3`[^1] | `"s"`·`"z"`는 크기를 줄인다[^1] | 느려질 수 있다 |
| `lto` | `false`(자기 크레이트 안에서만 thin LTO)[^1] | `"thin"`, `"fat"`(= `true`)은 크레이트를 넘어 최적화한다. 10~20% 이상 빨라지기도 한다[^2] | 컴파일이 오래 걸린다 |
| `codegen-units` | `16`(dev는 256)[^1] | `1`이면 최적화 기회가 늘고 파일이 작아진다[^2] | 컴파일이 병렬로 덜 돈다 |
| `panic` | `"unwind"`[^1] | `"abort"`면 파일이 조금 작고 빨라질 수 있다[^2] | panic을 잡아 회복할 수 없다. 테스트에는 적용되지 않는다[^1] |
| `debug` | `false`[^1] | `"line-tables-only"`는 프로파일링용[^8] | 파일이 커진다 |

LTO(link-time optimization)는 링크할 때 크레이트 경계를 넘어 함수를 합치고 지우는 최적화다. 이 밖에 `-C target-cpu=native`(이 CPU 전용 명령을 쓴다, 다른 CPU에서 안 돌 수 있다), 프로필 기반 최적화(PGO, 10% 이상), jemalloc·mimalloc 같은 다른 할당자가 있다[^2]. 성능 책은 바꿀 때마다 하나씩 재라고 권한다[^2].

## 활용

- **순서.** 프로파일러로 오래 걸리는 곳을 찾고 → Criterion으로 그 함수의 기준 시간을 잡고 → 하나만 고치고 → 다시 잰다. 고친 뒤 결과가 같은지는 [테스트](/Hongs_Blog/studies/rust/testing-strategy/)가 지킨다.
- **흔한 실수.**
  - dev 빌드로 재고 결론을 낸다.
  - `black_box` 없이 결과를 버리는 반복문을 잰다. 최적화 빌드에서 반복문이 통째로 사라져 0에 가까운 시간이 찍힌다.
  - 첫 회만 잰다. 캐시가 데워지지 않은 회차가 섞인다. 캐시가 왜 차이를 만드는지는 [지역성의 원리](/Hongs_Blog/studies/computer-architecture/locality-principle/)에 있다.
  - 반복자 체인을 `collect`로 끊었다가 다시 `iter`한다. 중간 `Vec`이 할당된다([반복자](/Hongs_Blog/studies/rust/iterators/)).
- **clippy가 잡아 주는 것.** 기본 묶음(`clippy::all`)의 `vec_init_then_push`(만들자마자 push), `large_enum_variant`(한 변형만 큰 열거형), `manual_memcpy`(손으로 짠 복사 반복문). 기본에서 꺼진 nursery 묶음의 `redundant_clone`, `needless_collect`, pedantic 묶음의 `format_push_string`(`s += &format!(..)`)도 있다. 묶음은 이 기계의 clippy 0.1.99로 직접 돌려 확인했다.
- **비동기 서비스.** 요청 하나가 느린 이유는 대개 계산이 아니라 기다림(DB, 네트워크)이다. 이때는 [tracing](/Hongs_Blog/studies/rust/tracing-observability/)의 구간 시간을 먼저 본다.

## 연결

- 선수: [컬렉션](/Hongs_Blog/studies/rust/collections/), [테스트 전략](/Hongs_Blog/studies/rust/testing-strategy/)
- 컴파일러가 하는 최적화의 예: [지역 최적화 기법](/Hongs_Blog/studies/compilers/local-optimizations/)
- 메모리 접근이 시간을 좌우하는 까닭: [캐시 성능과 평균 접근 시간](/Hongs_Blog/studies/computer-architecture/cache-performance-amat/)
- 빌드 설정을 배포에 쓰는 법: [빌드와 배포](/Hongs_Blog/studies/rust/build-deploy/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"Rust는 원래 빠르니 재지 않아도 된다"</div>

틀렸다. 같은 Rust 코드도 빌드 설정에 따라 열 배가 달랐다. 할당을 어떻게 하느냐에 따라 1번과 1,900번이 갈렸다. 언어가 빠르다는 말은 "빠르게 짤 수 있다"는 뜻이지 "아무렇게나 짜도 빠르다"는 뜻이 아니다. release로 빌드하고, `black_box`로 지워지지 않게 하고, 고치기 전후를 재서 확인한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `for _ in 0..1_000_000 { fib(20); }`를 `--release`로 재니 1나노초도 안 걸렸다. 왜인가? 어떻게 고치나?</summary>

**답:** `fib(20)`의 결과를 아무도 쓰지 않고 입력도 상수라서, 최적화가 계산을 미리 하거나 통째로 지웠다. `black_box(fib(black_box(20)))`처럼 입력과 결과를 감싼다.<br>
**흔한 오답:** "`black_box(fib(20))`이면 충분하다." 결과만 감싸면 `fib(20)` 자체는 상수로 미리 접힐 수 있다. `black_box`는 나오는 값만 막는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `let mut v: Vec<u64> = Vec::new();`에 값을 하나씩 10개 넣는다. 용량이 바뀔 때마다 적으면?</summary>

**답:** 0 → 4 → 8 → 16.<br>
**이유:** 처음에는 자리가 없다. 첫 push에 4칸을 잡고, 다섯째에 8칸, 아홉째에 16칸으로 두 배씩 늘린다. 실행해서 찍은 값이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 서비스 실행 파일을 더 빠르게 하려고 한다. (가) `codegen-units = 1`, (나) `panic = "abort"`, (다) `lto = "fat"` 가운데 "panic이 나도 그 요청만 실패시키고 서버는 계속 돈다"는 동작을 깨뜨리는 것은?</summary>

**답:** (나). abort면 panic이 나는 순간 프로세스가 끝난다. 스택을 풀며 잡을 기회가 없다.<br>
**이유:** (가)와 (다)는 컴파일 시간만 늘리고 동작은 그대로다.

</details>


[^1]: The Cargo Book, Profiles — https://doc.rust-lang.org/cargo/reference/profiles.html (`[profile.dev]`·`[profile.release]` 기본값 표, `opt-level` 값의 뜻, `lto`의 `false`·`"thin"`·`"fat"`·`"off"`, `codegen-units`는 증분 빌드 256·아니면 16, `panic`은 테스트·벤치·빌드 스크립트·proc macro에 적용되지 않는다)
[^2]: The Rust Performance Book, Build Configuration — https://nnethercote.github.io/perf-book/build-configuration.html (release는 dev보다 10~100배 빠른 일이 흔하다, LTO 10~20% 이상, `codegen-units = 1`, `panic = "abort"`, 다른 할당자, `target-cpu=native`, PGO 10% 이상, 한 번에 하나씩 재라)
[^3]: std 문서, `std::time::Instant` — https://doc.rust-lang.org/std/time/struct.Instant.html (단조 비감소 시계, 안정적(steady)이라는 보장은 없다, 벤치마크에 쓴다)
[^4]: std 문서, `std::hint::black_box` — https://doc.rust-lang.org/std/hint/fn.black_box.html (최선을 다하는 힌트, 정확성·보안에 기대지 말 것, 벤치마크에는 써야 한다, 입력이 아니라 출력만 막는다, `black_box(5) * black_box(10)` 예)
[^5]: The Rust Performance Book, Benchmarking — https://nnethercote.github.io/perf-book/benchmarking.html (Criterion·Divan, Hyperfine, 벽시계 시간은 변동이 크고 메모리 배치의 작은 변화로도 흔들린다)
[^6]: Criterion.rs 사용자 안내서, Getting Started — https://bheisler.github.io/criterion.rs/book/getting_started.html (`bench` 표와 `harness = false`, `criterion_group!`·`criterion_main!`·`bench_function`, `cargo bench`, 이전 실행과의 비교와 p 값). 안내서의 예는 `criterion = "0.3"`이다.
[^7]: docs.rs, criterion 0.8.2 — https://docs.rs/criterion/latest/criterion/ (통계 기반 마이크로 벤치마크 라이브러리, `black_box`는 Deprecated)
[^8]: The Rust Performance Book, Profiling — https://nnethercote.github.io/perf-book/profiling.html (perf, Instruments, samply, flamegraph, DHAT, release 프로파일링에는 `debug = "line-tables-only"`)
[^9]: The Rust Performance Book, Heap Allocations — https://nnethercote.github.io/perf-book/heap-allocations.html (`Vec` 용량 0, 4, 8, 16, 32, 64, `with_capacity`·`reserve`, 컬렉션을 `clear`로 다시 쓰기, `format!`은 `String`을 할당한다, `clone`과 `Rc`·`Arc`)
{% endraw %}
