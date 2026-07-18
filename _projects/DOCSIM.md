# DocSim: Automated File Organization & Knowledge Mapping

This document summarizes the enhancements made to the **DocSim** project, transforming it from a simple similarity engine into a full-scale automated knowledge management system with real-time tracking, automated cluster naming, and a React-based GUI.

## 🚀 Key Features Implemented

### 1. Multi-Format Document Ingestion
The system can now parse and process a variety of file formats into a unified JSON structure for analysis:
- **PDF**: Extracts text using `PyPDF2`.
- **Word (.docx)**: Extracts text using `python-docx`.
- **PowerPoint (.pptx)**: Extracts text from slides using `python-pptx`.
- **Markdown (.md)**: Native support for structured text.

### 2. Automated Correlation-Based Organization & Scalability
- **Clustering**: Uses `AgglomerativeClustering` (scikit-learn) to group files based on semantic similarity.
- **Scalability Upgrade**: Now computes a highly efficient $O(N^2)$ document-level similarity matrix using pre-computed mean-pooled vectors.
- **Folder Management**: Automatically moves/copies files into cluster-based folders.
- **Deduplication**: Automatically identifies files with >99% similarity and moves them to a `data/duplicates/` folder.

### 3. Real-Time Automation & Scope Selection
- **Background Watcher**: Run `src/watcher.py` to continuously monitor directories for new or modified files. When a file is detected, it is automatically ingested and organized.
- **Scope Ignorer**: Add a `.docsimignore` file to exclude specific folders (like `node_modules` or `.git`) from being processed.

### 4. Intelligent Cluster Naming & GUI
- **Automated Naming**: Generates concise cluster names from each cluster's content using local TF-IDF keyword extraction (no external LLM call). Names can be manually overridden per cluster.
- **Interactive React GUI**: A modern Next.js + TailwindCSS dashboard lets you visually explore your knowledge web, manage clusters, and manually override cluster names.

---

## 📂 Project Structure

```text
DocSim/
├── organize_files.py       # Main entry for Org, Dedup, and Mapping
├── api.py                  # NEW: FastAPI backend for the React GUI
├── src/
│   ├── watcher.py          # NEW: Real-time directory watcher (watchdog)
│   ├── ingest.py           # Recursive file scanner with .docsimignore support
│   ├── organizer.py        # Clustering and Deduplication logic (Optimized)
│   ├── mapper.py           # Knowledge map and TF-IDF cluster naming
│   ├── storage.py          # Embedding cache management (.npz)
│   ├── similarity.py       # Core vector math
│   └── embedder.py         # Sentence-transformer integration
├── gui/                    # NEW: Next.js React Application
└── data/
    ├── organized/          # Final organized folders, Maps, & Metadata
```

---

## 🛠 Usage Instructions

For normal use, `python launch.py` starts the API, frontend, and Electron shell together (see `README.md`). The steps below start each piece manually, which is useful for development or when running the background watcher.

### 1. Start the Background Watcher
To automatically ingest and organize files as you work:
```bash
. venv/bin/activate
python src/watcher.py /path/to/your/documents
```

### 2. Start the API Backend
To power the React GUI, start the FastAPI server:
```bash
. venv/bin/activate
python api.py
```

### 3. Launch the React GUI
In a separate terminal, start the Next.js frontend:
```bash
cd gui
npm run dev
```
Then open `http://localhost:3000` in your browser.

### 4. Manual CLI Run
You can still run the main organization script manually to clean your workspace and generate the knowledge map:
```bash
. venv/bin/activate
python organize_files.py --deduplicate
```

