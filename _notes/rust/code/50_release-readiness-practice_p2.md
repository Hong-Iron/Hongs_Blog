---
layout: "note"
title: "50_release-readiness-practice_p2.rs"
display_title: "50_release-readiness-practice_p2.rs"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "50"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/release-readiness-practice/"
parent_title: "배포 준비 연습"
description: "Rust · 배포 준비 연습 문제 2 풀이 코드"
permalink: "/studies/rust/code/50_release-readiness-practice_p2/"
---
{% raw %}
[배포 준비 연습](/Hongs_Blog/studies/rust/release-readiness-practice/) 문서의 문제 2 풀이 코드다.

```rust
//! 50 배포 준비 연습 p2: 바뀐 내용으로 다음 버전 번호 정하기. Cargo의 규칙(왼쪽에서 처음 0이 아닌 자리가 바뀌면
//! 호환되지 않음)으로 번호를 계산하고, 판정이 갈리는 변경 셋(비공개 필드 추가, 이름 바꾸기, deprecated로 남기기)은
//! 라이브러리 두 판과 쓰는 쪽 크레이트를 rustc로 컴파일해 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/50_release-readiness-practice_p2.rs"

use std::fmt;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
enum Change {
    Patch,
    Minor,
    Major,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct Version {
    major: u64,
    minor: u64,
    patch: u64,
}

impl Version {
    fn parse(s: &str) -> Option<Version> {
        let mut it = s.split('.').map(|p| p.parse::<u64>().ok());
        let v = Version {
            major: it.next()??,
            minor: it.next()??,
            patch: it.next()??,
        };
        it.next().is_none().then_some(v)
    }

    /// 다음 판 번호. 0.y.z는 y를 큰 변경, z를 작은 변경 자리로 쓴다. 0.0.z는 무엇이든 z를 올린다.
    fn bump(self, c: Change) -> Version {
        let Version {
            major,
            minor,
            patch,
        } = self;
        let v = |major, minor, patch| Version {
            major,
            minor,
            patch,
        };
        match (major, minor, c) {
            (0, 0, _) => v(0, 0, patch + 1),
            (0, _, Change::Major) => v(0, minor + 1, 0),
            (0, _, _) => v(0, minor, patch + 1),
            (_, _, Change::Major) => v(major + 1, 0, 0),
            (_, _, Change::Minor) => v(major, minor + 1, 0),
            (_, _, Change::Patch) => v(major, minor, patch + 1),
        }
    }

    /// Cargo가 `"1.3.0"`처럼 적은 의존성을 `newer`로 올려도 되는가: 왼쪽에서 처음 0이 아닌 자리가 같아야 한다.
    fn caret_accepts(self, newer: Version) -> bool {
        if newer.major != self.major {
            return false;
        }
        if self.major > 0 {
            return (newer.minor, newer.patch) >= (self.minor, self.patch);
        }
        if newer.minor != self.minor {
            return false;
        }
        if self.minor > 0 {
            return newer.patch >= self.patch;
        }
        newer.patch == self.patch
    }
}

impl fmt::Display for Version {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}.{}.{}", self.major, self.minor, self.patch)
    }
}

/// 한 판에 여러 변경을 넣으면 가장 큰 변경이 번호를 정한다.
fn release(changes: &[Change]) -> Change {
    changes.iter().copied().max().unwrap_or(Change::Patch)
}

// ---------- 컴파일로 판정 확인 ----------

fn tmp(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join(format!("vr50p2_{}_{name}", std::process::id()));
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn rustc(dir: &Path, args: &[&str]) -> Output {
    Command::new("rustc")
        .args(["--edition", "2024"])
        .args(args)
        .current_dir(dir)
        .output()
        .expect("rustc 실행")
}

/// 라이브러리 `store`를 `lib_src`로 만들고 `USER`를 컴파일한 결과(성공 여부, stderr).
fn against(dir: &Path, lib_src: &str) -> (bool, String) {
    std::fs::write(dir.join("store.rs"), lib_src).unwrap();
    let lib = rustc(
        dir,
        &["--crate-type=rlib", "--crate-name", "store", "store.rs"],
    );
    assert!(
        lib.status.success(),
        "{}",
        String::from_utf8_lossy(&lib.stderr)
    );
    std::fs::write(dir.join("user.rs"), USER).unwrap();
    let user = rustc(
        dir,
        &[
            "--crate-type=lib",
            "--emit=metadata",
            "--extern",
            "store=libstore.rlib",
            "-L",
            ".",
            "user.rs",
        ],
    );
    (
        user.status.success(),
        String::from_utf8_lossy(&user.stderr).into_owned(),
    )
}

/// 1.3.0: 비공개 필드가 하나 있는 Link와 resolve 함수.
const V1: &str = "pub struct Link { pub url: String, code: String }\n\
impl Link { pub fn new(url: &str) -> Self { Link { url: url.into(), code: \"a1\".into() } }\n\
            pub fn code(&self) -> &str { &self.code } }\n\
pub fn resolve(code: &str) -> Option<String> { Some(format!(\"https://x/{code}\")) }\n";

const USER: &str = "pub fn f() -> Option<String> { store::resolve(\"a1\") }\n\
pub fn g() -> String { let l = store::Link::new(\"u\"); format!(\"{} {}\", l.url, l.code()) }\n";

fn check_by_compiling() {
    let d = tmp("compile");
    let (ok, _) = against(&d, V1);
    assert!(ok, "1.3.0은 통과");

    // (다) 비공개 필드가 이미 있으면 밖에서 구조체 리터럴로 만들 수 없었다. 하나 더 넣어도 아무도 안 깨진다.
    let private_field = V1
        .replace("code: String }", "code: String, created_at: u64 }")
        .replace(
            "code: \"a1\".into() }",
            "code: \"a1\".into(), created_at: 0 }",
        );
    let (ok, err) = against(&d, &private_field);
    assert!(ok, "{err}");

    // (라) 이름을 바꾸면 쓰는 쪽에서 함수를 못 찾는다.
    let renamed = V1.replace("pub fn resolve", "pub fn lookup");
    let (ok, err) = against(&d, &renamed);
    assert!(!ok);
    assert!(
        err.contains("error[E0425]: cannot find function `resolve` in crate `store`"),
        "{err}"
    );

    // (라') 옛 이름을 deprecated로 남기면 경고만 나고 빌드는 된다.
    let kept = format!(
        "{renamed}#[deprecated(since = \"1.4.0\", note = \"use `lookup` instead\")]\n\
         pub fn resolve(code: &str) -> Option<String> {{ lookup(code) }}\n"
    );
    let (ok, err) = against(&d, &kept);
    assert!(ok, "{err}");
    assert!(
        err.contains("warning: use of deprecated function `store::resolve`: use `lookup` instead"),
        "{err}"
    );
    println!("컴파일: 비공개 필드 추가 통과, 이름 바꾸기 E0425, deprecated로 남기면 경고만");
}

fn main() {
    use Change::{Major, Minor, Patch};
    let v1 = Version::parse("1.3.0").unwrap();
    let v0 = Version::parse("0.4.2").unwrap();
    // (가)~(바)의 판정
    let changes = [
        ("가 버그 고침", Patch),
        ("나 새 공개 함수", Minor),
        ("다 비공개 필드 추가(이미 하나 있음)", Minor),
        ("라 공개 함수 이름 바꾸기", Major),
        ("마 non_exhaustive 없는 enum에 variant", Major),
        ("바 구현하는 트레이트에 필수 메서드", Major),
    ];
    let expect_1x = ["1.3.1", "1.4.0", "1.4.0", "2.0.0", "2.0.0", "2.0.0"];
    let expect_0x = ["0.4.3", "0.4.3", "0.4.3", "0.5.0", "0.5.0", "0.5.0"];
    for (i, (what, c)) in changes.iter().enumerate() {
        let a = v1.bump(*c);
        let b = v0.bump(*c);
        println!("{what}: {v1} → {a}, {v0} → {b}");
        assert_eq!(a.to_string(), expect_1x[i]);
        assert_eq!(b.to_string(), expect_0x[i]);
        // 큰 변경일 때만 Cargo가 저절로 올려 주지 않는다.
        assert_eq!(v1.caret_accepts(a), *c != Major);
        assert_eq!(v0.caret_accepts(b), *c != Major);
    }
    // 가·나·다를 한 판에: 1.4.0. 라까지 넣으면 2.0.0.
    assert_eq!(
        v1.bump(release(&[Patch, Minor, Minor])).to_string(),
        "1.4.0"
    );
    assert_eq!(
        v1.bump(release(&[Patch, Minor, Minor, Major])).to_string(),
        "2.0.0"
    );
    // 0.0.z는 무엇이든 호환되지 않는다.
    let tiny = Version::parse("0.0.3").unwrap();
    assert_eq!(tiny.bump(Patch).to_string(), "0.0.4");
    assert!(!tiny.caret_accepts(tiny.bump(Patch)));

    check_by_compiling();
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_rejects_bad_shapes() {
        assert_eq!(Version::parse("1.2"), None);
        assert_eq!(Version::parse("1.2.3.4"), None);
        assert_eq!(Version::parse("1.x.3"), None);
    }

    #[test]
    fn caret_does_not_go_backwards() {
        let v = Version::parse("1.3.0").unwrap();
        assert!(!v.caret_accepts(Version::parse("1.2.9").unwrap()));
        assert!(v.caret_accepts(Version::parse("1.9.0").unwrap()));
    }
}
```
{% endraw %}
