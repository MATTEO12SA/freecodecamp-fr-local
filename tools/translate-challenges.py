#!/usr/bin/env python3
"""
Translate freeCodeCamp challenge .md files from English to French
using Argos Translate (offline, free).

Strategy: NEVER feed code/HTML/URL tokens to the translator. Split the
text on those boundaries, only translate the prose segments, then
concatenate the original tokens back in place.

Usage:
    python tools/translate-challenges.py                # full run
    python tools/translate-challenges.py --limit 10     # first 10 files
    python tools/translate-challenges.py --block <name> # only one block
    python tools/translate-challenges.py --dry-run      # print plan only
    python tools/translate-challenges.py --workers 4    # override CPU count
"""
from __future__ import annotations

import argparse
import multiprocessing as mp
import os
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "curriculum" / "challenges" / "english" / "blocks"
OUT_DIR = ROOT / "curriculum" / "i18n-curriculum" / "curriculum" / "challenges" / "french" / "blocks"

# Patterns whose matches MUST be preserved verbatim — never fed to translator.
FENCED_CODE = re.compile(r"```[\s\S]*?```", re.MULTILINE)
INLINE_CODE = re.compile(r"`[^`\n]+`")
MD_LINK_URL = re.compile(r"(\[[^\]]+\])\(([^)]+)\)")  # special: keep URL, translate label
HTML_TAG = re.compile(r"</?[A-Za-z][^>]*>")
SECTION_MARKER_LINE = re.compile(r"(^|\n)(#{1,6}\s*--[a-z0-9\-]+--\s*)(?=\n|$)")
FRONTMATTER_BLOCK = re.compile(r"\A---\s*\n([\s\S]*?)\n---\s*\n", re.MULTILINE)
TITLE_LINE = re.compile(r"^(title:\s*)(.+)$", re.MULTILINE)

# Pre-compose a multi-pattern matcher: returns all the protected spans.
PROTECTED_PATTERNS = (FENCED_CODE, INLINE_CODE, HTML_TAG)


def find_protected_spans(text: str) -> list[tuple[int, int, str]]:
    """Return non-overlapping (start, end, verbatim_text) spans to preserve."""
    spans = []
    for pat in PROTECTED_PATTERNS:
        for m in pat.finditer(text):
            spans.append((m.start(), m.end(), m.group(0)))
    # Markdown links: protect URL, translate the label.
    # We treat the link as: label_translatable + "(" + URL_protected + ")"
    # For simplicity here, protect the WHOLE "(url)" portion including parens.
    for m in MD_LINK_URL.finditer(text):
        url_start = m.start(2) - 1  # include '('
        url_end = m.end(2) + 1      # include ')'
        spans.append((url_start, url_end, text[url_start:url_end]))
    # Section markers: protect the whole line of "# --foo--"
    for m in SECTION_MARKER_LINE.finditer(text):
        spans.append((m.start(2), m.end(2), m.group(2)))
    # Sort, then drop overlaps (earlier match wins).
    spans.sort(key=lambda t: (t[0], -t[1]))
    out = []
    last_end = -1
    for s, e, t in spans:
        if s >= last_end:
            out.append((s, e, t))
            last_end = e
    return out


def translate_prose(translator, text: str) -> str:
    """Translate a chunk; skip empty / non-letter content.

    Preserves leading and trailing whitespace (Argos strips it otherwise,
    which breaks markdown inline code spacing).
    """
    if not text:
        return text
    if not re.search(r"[A-Za-z]", text):
        return text
    leading = text[: len(text) - len(text.lstrip())]
    trailing = text[len(text.rstrip()):]
    core = text.strip()
    if not core:
        return text
    try:
        translated = translator.translate(core)
    except Exception as e:
        sys.stderr.write(f"  warn: translate failed: {e}\n")
        return text
    return leading + translated + trailing


def translate_preserving(translator, text: str) -> str:
    """Translate prose between protected spans; reinsert spans verbatim."""
    spans = find_protected_spans(text)
    if not spans:
        return translate_prose(translator, text)
    out = []
    cur = 0
    for s, e, verbatim in spans:
        if s > cur:
            out.append(translate_prose(translator, text[cur:s]))
        out.append(verbatim)
        cur = e
    if cur < len(text):
        out.append(translate_prose(translator, text[cur:]))
    return "".join(out)


def _init_worker_translator():
    """Initialize Argos translator in this worker. Retries the first
    `translate()` call to absorb the WinError 5 race on stanza/resources.json
    that happens when multiple workers fight to move the same temp file."""
    import argostranslate.translate as at
    langs = at.get_installed_languages()
    en = next(l for l in langs if l.code == "en")
    fr = next(l for l in langs if l.code == "fr")
    t = en.get_translation(fr)
    last_err = None
    for attempt in range(8):
        try:
            t.translate("Hello.")
            return t
        except Exception as e:
            last_err = e
            time.sleep(0.5 + attempt * 0.5)
    sys.stderr.write(f"  worker init failed after retries: {last_err}\n")
    return t


def process_file(args):
    src_path, dst_path, dry_run = args
    if dst_path.exists() and dst_path.stat().st_size > 0:
        return ("skip", src_path.name)
    if dry_run:
        return ("dry", src_path.name)

    if not hasattr(process_file, "_translator"):
        process_file._translator = _init_worker_translator()  # type: ignore[attr-defined]
    translator = process_file._translator  # type: ignore[attr-defined]

    raw = src_path.read_text(encoding="utf-8")

    # --- Frontmatter ---
    fm_match = FRONTMATTER_BLOCK.match(raw)
    if fm_match:
        fm_text = fm_match.group(0)
        body = raw[len(fm_text):]
        def replace_title(m):
            translated = translate_prose(translator, m.group(2).strip())
            return f"{m.group(1)}{translated}"
        fm_text = TITLE_LINE.sub(replace_title, fm_text, count=1)
    else:
        fm_text = ""
        body = raw

    # --- Body: split on protected spans, translate the rest ---
    translated_body = translate_preserving(translator, body)

    dst_path.parent.mkdir(parents=True, exist_ok=True)
    dst_path.write_text(fm_text + translated_body, encoding="utf-8")
    return ("ok", src_path.name)


def gather_files(only_block: str | None, limit: int | None):
    files = []
    if not SRC_DIR.exists():
        sys.exit(f"Source not found: {SRC_DIR}")
    for block in sorted(SRC_DIR.iterdir()):
        if not block.is_dir():
            continue
        if only_block and block.name != only_block:
            continue
        for md in sorted(block.glob("*.md")):
            rel = md.relative_to(SRC_DIR)
            dst = OUT_DIR / rel
            files.append((md, dst))
            if limit and len(files) >= limit:
                return files
    return files


def warm_up_model():
    """Run a single translation in the main process so that lazy resource
    extraction (stanza/resources.json) happens BEFORE workers fork. Without
    this, parallel workers race each other on the same temp-rename and crash
    with WinError 5 on Windows."""
    import argostranslate.translate as at
    langs = at.get_installed_languages()
    en = next(l for l in langs if l.code == "en")
    fr = next(l for l in langs if l.code == "fr")
    en.get_translation(fr).translate("Hello.")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--block", default=None)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--workers", type=int, default=max(1, (os.cpu_count() or 2) - 1))
    args = ap.parse_args()

    if not args.dry_run:
        print("Warming up translation model (main process)...")
        warm_up_model()

    files = gather_files(args.block, args.limit)
    total = len(files)
    print(f"Files to process: {total}  (workers={args.workers})")
    if total == 0:
        return

    payloads = [(s, d, args.dry_run) for s, d in files]
    start = time.time()
    ok = skipped = dry = 0

    def report(i, name):
        elapsed = time.time() - start
        rate = i / elapsed if elapsed else 0
        eta = (total - i) / rate if rate else 0
        print(f"  {i}/{total} — {name}  ({rate:.1f}/s, eta {eta/60:.1f}min)")

    if args.workers <= 1:
        for i, p in enumerate(payloads, 1):
            status, name = process_file(p)
            if status == "ok": ok += 1
            elif status == "skip": skipped += 1
            elif status == "dry": dry += 1
            if i % 20 == 0 or i == total:
                report(i, name)
    else:
        with mp.Pool(args.workers) as pool:
            for i, (status, name) in enumerate(
                pool.imap_unordered(process_file, payloads, chunksize=4), 1
            ):
                if status == "ok": ok += 1
                elif status == "skip": skipped += 1
                elif status == "dry": dry += 1
                if i % 50 == 0 or i == total:
                    report(i, name)

    print(f"\nDone. ok={ok}  skipped={skipped}  dry={dry}  in {(time.time()-start)/60:.1f}min")


if __name__ == "__main__":
    main()
