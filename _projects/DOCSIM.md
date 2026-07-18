---
title: "DocSim"
subtitle: "Local-first document intelligence & knowledge mapping"
date: 2026-04-18
role: "Full-Stack Developer"
stack: ["Python", "FastAPI", "Sentence-Transformers", "scikit-learn", "Next.js", "React", "TypeScript", "Tailwind CSS", "Electron"]
status: "Alpha"
repo: "https://github.com/Hong-Iron/DocSim"
demo: null
summary: "A local-first desktop app that turns a folder of PDFs, Office docs, and images into semantically clustered, explorable knowledge maps without sending anything to the cloud."
cover: null
gallery: [/assets/img/uploads/DOCSIM.png]
tags: ["nlp", "machine-learning", "desktop-app", "electron", "fastapi", "developer-tools"]
---

## What it is

DocSim Desktop takes an unstructured folder of documents — PDFs, Word files, PowerPoint decks, spreadsheets, Markdown, even scanned images — and organizes them into "Intelligence Clusters": groups of semantically related files, automatically named and linked by topic. Everything runs on-device: text extraction, embedding, and clustering all happen locally, so no document content ever leaves the machine.

## Architecture

The app is a three-layer local stack:

- **Core intelligence engine (Python)** — a parsing layer (PyPDF2, python-docx, python-pptx, pandas, Tesseract OCR) feeds a `sentence-transformers` embedding model (`paraphrase-multilingual-MiniLM-L12-v2`), which in turn feeds `scikit-learn` Agglomerative Clustering over a pre-computed cosine-similarity matrix, plus a TF-IDF pass for automatic cluster naming.
- **API orchestrator (FastAPI)** — exposes ingestion, clustering, and file-management endpoints, and coordinates background re-indexing so the UI never blocks.
- **Interactive shell (Electron + Next.js/React)** — a force-directed knowledge graph, a stats dashboard, and an Obsidian-style Markdown editor with live preview.

## Engineering work: performance & reliability pass

The initial implementation worked but was slow and occasionally lost user work on re-index. The core problems, and the fixes:

- **Cold-start tax on every re-index.** Re-indexing shelled out to three separate Python subprocesses, each re-importing `torch`/`sentence-transformers` and reloading the embedding model from disk — up to three model loads per run. Replaced with in-process calls to a single shared, lazily-loaded embedder singleton, cutting repeated multi-second cold starts to zero after the first load.
- **Fake incrementality.** The pipeline claimed incremental sync but re-parsed every file (including OCR and Excel extraction) on every run regardless of whether it had changed. Added mtime-based skip logic to the parser and content-hash-based staleness detection to the embedding cache, so only genuinely new or edited files are reprocessed.
- **Destructive re-indexing.** The old flow deleted existing results *before* rebuilding them, so a failure partway through a re-index (or even a normal run) silently destroyed the user's prior organization and any manually renamed clusters. Rewrote the pipeline to build into a staging directory and atomically swap it into place only on success, preserving prior results on failure and manual cluster metadata across runs.
- **Silent failure everywhere.** Broad `except: pass` blocks (backend) and empty `catch` blocks (frontend) swallowed errors with no user-visible signal — including a bug where a single failed progress-poll would permanently freeze the UI's progress bar. Added structured logging, a surfaced error state end-to-end, and retry-with-backoff on the frontend poller.
- **A real data-loss bug.** Synced source files were keyed by filename only, so two files with the same name in different subfolders would silently overwrite each other. Switched to a collision-free, relative-path-based key.
- **A slow, unhealthy launcher.** The one-click launcher always ran the Next.js dev server and waited a blind, fixed `sleep(10)` before opening the desktop shell — flaky on first run and needlessly slow on every run after. Switched to a production build with an HTTP health-check loop.

## Stack notes

Backend: Python, FastAPI, NumPy, scikit-learn, Sentence-Transformers, PyPDF2/python-docx/python-pptx/openpyxl, Tesseract OCR.
Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, D3/Recharts, react-force-graph.
Desktop: Electron.
