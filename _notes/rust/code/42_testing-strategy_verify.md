---
layout: "note"
title: "42_testing-strategy_verify.rs"
display_title: "42_testing-strategy_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "42"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/testing-strategy/"
parent_title: "테스트 전략"
description: "Rust · 테스트 전략 검증 코드"
permalink: "/studies/rust/code/42_testing-strategy_verify/"
---
{% raw %}
[테스트 전략](/Hongs_Blog/studies/rust/testing-strategy/) 문서의 검증 코드다.

````rust
//! 테스트 종류를 한 파일에서 확인한다: 단위 테스트, #[should_panic], Result를 돌려주는 테스트,
//! proptest 성질 테스트와 축소(shrinking), #[tokio::test], 골든(기대 출력) 비교.
//! 통합 테스트(tests/)와 doc 테스트는 임시 cargo 패키지를 만들어 `cargo test`로 실제로 돌려 본다.
//! 의존성: proptest = "1", tokio = { version = "1", features = ["full"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/42_testing-strategy_verify.rs"

use std::time::Duration;

const ALPHABET: &[u8; 62] = b"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/// 숫자를 62진 문자열로 바꾼다. 단축 주소의 짧은 코드를 만들 때 쓰는 방식이다.
pub fn encode(mut n: u64) -> String {
    if n == 0 {
        return "0".into();
    }
    let mut out = Vec::new();
    while n > 0 {
        out.push(ALPHABET[(n % 62) as usize]);
        n /= 62;
    }
    out.reverse();
    String::from_utf8(out).expect("ascii")
}

pub fn decode(s: &str) -> Option<u64> {
    if s.is_empty() {
        return None;
    }
    s.bytes().try_fold(0u64, |acc, b| {
        let d = ALPHABET.iter().position(|&c| c == b)? as u64;
        acc.checked_mul(62)?.checked_add(d)
    })
}

/// 일부러 틀린 버전: 글자 3칸짜리 버퍼에 담아서, 62진 네 자리 이상(62^3 = 238328 이상)이면 앞자리를 잃는다.
fn buggy_encode(n: u64) -> String {
    let full = encode(n);
    let keep = full.len().min(3);
    full[full.len() - keep..].to_string()
}

/// 전체 중 일부가 몇 퍼센트인지. whole이 0이면 호출한 쪽의 버그이므로 panic한다.
pub fn percent(part: u64, whole: u64) -> u64 {
    assert!(whole > 0, "whole must be positive");
    part * 100 / whole
}

/// 사람이 읽는 보고서. 골든 테스트의 대상이다.
pub fn render_report(rows: &[(&str, u64)]) -> String {
    let total: u64 = rows.iter().map(|r| r.1).sum();
    let mut s = String::from("code  hits  share\n");
    for (code, hits) in rows {
        s.push_str(&format!(
            "{code:<5} {hits:>4}  {:>4}%\n",
            percent(*hits, total)
        ));
    }
    s
}

const GOLDEN_REPORT: &str = "\
code  hits  share
a1      30    75%
Zz      10    25%
";

/// 처음 몇 번은 실패하는 외부 호출을 흉내 내고, 재시도해서 성공한 횟수를 돌려준다.
pub async fn with_retry(fail_times: u32, max: u32) -> Result<u32, String> {
    let mut attempt = 0;
    loop {
        attempt += 1;
        if attempt > fail_times {
            return Ok(attempt);
        }
        if attempt >= max {
            return Err(format!("gave up after {attempt} attempts"));
        }
        tokio::time::sleep(Duration::from_millis(1)).await;
    }
}

/// proptest를 테스트 밖에서 직접 돌려 축소 결과를 본다.
fn shrink_demo() -> Option<u64> {
    use proptest::test_runner::{Config, TestError, TestRng, TestRunner};
    let config = Config {
        failure_persistence: None, // 데모라서 proptest-regressions 파일을 남기지 않는다
        ..Config::default()
    };
    let mut runner = TestRunner::new_with_rng(
        config.clone(),
        TestRng::deterministic_rng(config.rng_algorithm),
    );
    let result = runner.run(&(0u64..1_000_000), |n| {
        proptest::prop_assert_eq!(decode(&buggy_encode(n)), Some(n));
        Ok(())
    });
    match result {
        Err(TestError::Fail(_, n)) => Some(n),
        _ => None,
    }
}

/// 임시 cargo 패키지로 통합 테스트와 doc 테스트를 실제로 돌린다.
fn cargo_layout_demo() -> Result<String, String> {
    let root = std::env::temp_dir().join(format!("vr_testing_{}", std::process::id()));
    let _ = std::fs::remove_dir_all(&root);
    let w = |p: &str, s: &str| {
        let f = root.join(p);
        std::fs::create_dir_all(f.parent().expect("parent")).expect("mkdir");
        std::fs::write(f, s).expect("write");
    };
    w(
        "Cargo.toml",
        "[package]\nname = \"shortcode\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\n",
    );
    w(
        "src/lib.rs",
        r#"/// 두 배를 돌려준다.
///
/// ```
/// assert_eq!(shortcode::double(21), 42);
/// ```
///
/// ```compile_fail
/// shortcode::double("x");
/// ```
pub fn double(x: u32) -> u32 {
    helper(x) * 2
}

fn helper(x: u32) -> u32 {
    x
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn private_helper_is_testable_here() {
        assert_eq!(helper(3), 3);
    }
}
"#,
    );
    w("tests/common/mod.rs", "pub fn input() -> u32 {\n    5\n}\n");
    w(
        "tests/api.rs",
        "mod common;\n\n#[test]\nfn doubles_public_api() {\n    assert_eq!(shortcode::double(common::input()), 10);\n}\n",
    );
    let out = std::process::Command::new("cargo")
        .args(["test", "--offline"])
        .current_dir(&root)
        .env_remove("CARGO_TARGET_DIR")
        .output()
        .map_err(|e| e.to_string())?;
    let text =
        String::from_utf8_lossy(&out.stdout).into_owned() + &String::from_utf8_lossy(&out.stderr);
    let _ = std::fs::remove_dir_all(&root);
    if out.status.success() {
        Ok(text)
    } else {
        Err(text)
    }
}

fn main() {
    let mut ok = true;
    let mut check = |cond: bool, what: String| {
        println!("[{}] {what}", if cond { "ok" } else { "FAIL" });
        ok &= cond;
    };

    check(
        encode(0) == "0" && encode(61) == "z" && encode(62) == "10",
        "62진: 0, 61->z, 62->10".into(),
    );
    check(
        decode("10") == Some(62) && decode("").is_none() && decode("-").is_none(),
        "decode 경계".into(),
    );
    check(
        decode(&encode(u64::MAX)) == Some(u64::MAX),
        "u64::MAX 왕복".into(),
    );
    check(
        decode("zzzzzzzzzzzz").is_none(),
        "넘치면 None (checked_mul)".into(),
    );

    let report = render_report(&[("a1", 30), ("Zz", 10)]);
    check(report == GOLDEN_REPORT, format!("골든 비교:\n{report}"));

    let shrunk = shrink_demo();
    check(
        shrunk == Some(238_328),
        format!("proptest 축소 결과: {shrunk:?}"),
    );

    let rt = tokio::runtime::Builder::new_current_thread()
        .enable_time()
        .build()
        .expect("rt");
    check(
        rt.block_on(with_retry(2, 5)) == Ok(3),
        "재시도: 2번 실패 후 3번째 성공".into(),
    );

    match cargo_layout_demo() {
        Ok(text) => {
            let lines: Vec<&str> = text.lines().filter(|l| l.contains("test result")).collect();
            for l in text.lines().filter(|l| {
                l.contains("Running") || l.contains("Doc-tests") || l.starts_with("test ")
            }) {
                println!("    | {}", l.trim());
            }
            for l in &lines {
                println!("    {l}");
            }
            let passed: Vec<&str> = lines
                .iter()
                .map(|l| l.split(';').next().unwrap_or(""))
                .collect();
            check(
                passed == ["test result: ok. 1 passed"; 4] && text.contains("Doc-tests shortcode"),
                "cargo test: 단위 1, 통합 1, doc 테스트 2개가 두 묶음(합쳐 돈 것 1, compile_fail 1)".into(),
            );
        }
        Err(text) => check(false, format!("cargo test 실패:\n{text}")),
    }

    assert!(ok);
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;
    use proptest::prelude::*;

    #[test]
    fn encodes_small_numbers() {
        assert_eq!(encode(10), "A");
        assert_eq!(encode(3843), "zz"); // 62*62 - 1
    }

    #[test]
    #[should_panic(expected = "whole must be positive")]
    fn percent_of_zero_panics() {
        percent(1, 0);
    }

    #[test]
    fn decode_rejects_bad_input() -> Result<(), String> {
        let n = decode("1Z").ok_or("decode failed")?;
        if n == 62 + 35 {
            Ok(())
        } else {
            Err(format!("got {n}"))
        }
    }

    #[test]
    fn report_matches_golden() {
        assert_eq!(render_report(&[("a1", 30), ("Zz", 10)]), GOLDEN_REPORT);
    }

    proptest! {
        #[test]
        fn roundtrip(n in any::<u64>()) {
            prop_assert_eq!(decode(&encode(n)), Some(n));
        }

        #[test]
        fn encode_uses_only_alphabet(n in any::<u64>()) {
            prop_assert!(encode(n).bytes().all(|b| ALPHABET.contains(&b)));
        }

        #[test]
        fn longer_code_means_bigger_number(a in 0u64..1_000_000, b in 0u64..1_000_000) {
            if encode(a).len() < encode(b).len() {
                prop_assert!(a < b);
            }
        }
    }

    #[tokio::test]
    async fn retry_gives_up() {
        assert_eq!(
            with_retry(10, 3).await,
            Err("gave up after 3 attempts".into())
        );
    }

    #[tokio::test(flavor = "multi_thread", worker_threads = 2)]
    async fn retry_on_multi_thread_runtime() {
        let h = tokio::spawn(with_retry(1, 5));
        assert_eq!(h.await.unwrap(), Ok(2));
    }
}
````
{% endraw %}
