#!/usr/bin/env python3
"""
Collect project sources:
- For text files: write full contents (preserved exactly).
- For non-text files: write only the file name (marked as UNSUPPORTED/BINARY).
- Finally, append an ASCII tree of the entire project.

Defaults: excludes heavy build/dependency folders (.next, node_modules); includes hidden files; deterministic order.
You can pass --exclude to skip additional directories, and --followlinks to follow symlinks.
"""

from __future__ import annotations
import argparse
import os
from pathlib import Path
import sys
import tokenize
import mimetypes
import re

HEADER_LINE = "=" * 80

# Common text-like extensions (still fallback to detection)
TEXT_EXTS = {
    # Code
    ".java", ".kt", ".kts",
    ".js", ".ts", ".jsx", ".tsx",
    ".css", ".scss", ".sass", ".less",
    ".html", ".htm", ".vue", ".svelte",
    ".c", ".h", ".cpp", ".hpp", ".cc", ".m", ".mm",
    ".go", ".rs", ".php", ".rb", ".swift", ".scala",
    ".cs", ".sql", ".sh", ".bat", ".ps1",
    # Config / data / docs
    ".json", ".yaml", ".yml", ".xml", ".ini", ".cfg", ".conf", ".properties",
    ".toml", ".gradle", ".md", ".txt", ".env", ".csv", ".tsv",
    ".gitignore", ".gitattributes", ".editorconfig", ".prettierrc", ".eslintrc",
}

# MIME types we treat as text even if extension is unknown
TEXT_MIME_PREFIXES = ("text/",)
TEXT_MIME_EXTRAS = {
    "application/json", "application/xml", "application/javascript",
    "application/x-sh", "application/x-shellscript",
}

# Default directories to skip while walking/printing the tree
DEFAULT_EXCLUDES = {".next", "node_modules"}

# ---------- Helpers ----------

def _has_bom(head: bytes) -> str | None:
    if head.startswith(b"\xef\xbb\xbf"):
        return "utf-8-sig"
    if head.startswith(b"\xff\xfe\x00\x00"):
        return "utf-32-le"
    if head.startswith(b"\x00\x00\xfe\xff"):
        return "utf-32-be"
    if head.startswith(b"\xff\xfe"):
        return "utf-16-le"
    if head.startswith(b"\xfe\xff"):
        return "utf-16-be"
    return None

def _looks_binary(head: bytes) -> bool:
    if b"\x00" in head:
        return True
    # Consider control chars (excluding \t, \n, \r, \f) as "weird"
    weird = sum(1 for b in head if (b < 32 and b not in (9,10,13,12)))
    # If > 30% are weird control bytes, likely binary
    return (len(head) > 0) and (weird / len(head) > 0.30)

def is_text_file(path: Path, sample_bytes: int = 4096) -> bool:
    # 1) Obvious by extension
    if path.suffix.lower() in TEXT_EXTS:
        return True
    # 2) BOM presence indicates text
    try:
        with path.open("rb") as f:
            head = f.read(sample_bytes)
    except Exception:
        return False
    if _has_bom(head):
        return True
    # 3) MIME hint
    mt, _ = mimetypes.guess_type(path.as_posix())
    if mt and (mt.startswith(TEXT_MIME_PREFIXES) or mt in TEXT_MIME_EXTRAS):
        return True
    # 4) Heuristic on bytes
    return not _looks_binary(head)

def read_text_preserve(path: Path) -> str:
    """Read text preserving original characters as closely as possible."""
    # Respect PEP 263 for Python files
    if path.suffix.lower() == ".py":
        with tokenize.open(path) as f:
            return f.read()
    # BOM-aware for common Unicode encodings
    with path.open("rb") as fb:
        head = fb.read(4)
    enc = _has_bom(head)
    if enc:
        return path.read_text(encoding=enc)
    # Try UTF-8, then Latin-1 (lossless mapping of bytes 0–255)
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="latin-1")

def write_header(out, rel_path: Path, size_bytes: int | None, marker: str | None = None):
    out.write(f"{HEADER_LINE}\n")
    out.write(f"FILE: {rel_path.as_posix()}")
    if size_bytes is not None:
        out.write(f"  (size: {size_bytes} bytes)")
    if marker:
        out.write(f"  [{marker}]")
    out.write("\n")
    out.write(f"{HEADER_LINE}\n")

def iter_all_files(root: Path, followlinks: bool, exclude_dirs: set[str]) -> list[Path]:
    files: list[Path] = []
    for dirpath, dirnames, filenames in os.walk(root, followlinks=followlinks):
        # prune
        if exclude_dirs:
            dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
        for fn in filenames:
            files.append(Path(dirpath) / fn)
    files.sort(key=lambda p: p.as_posix().lower())
    return files

def tree_lines(root: Path, exclude_dirs: set[str], followlinks: bool) -> list[str]:
    """Produce an ASCII tree (dirs then files, sorted)."""
    lines: list[str] = [f"{root.name}/"]
    def walk(d: Path, prefix: str):
        try:
            entries = sorted(
                [e for e in d.iterdir() if e.name not in exclude_dirs],
                key=lambda p: (not p.is_dir(), p.name.lower())
            )
        except PermissionError:
            return
        for i, e in enumerate(entries):
            last = (i == len(entries) - 1)
            conn = "└── " if last else "├── "
            if e.is_dir():
                lines.append(f"{prefix}{conn}{e.name}/")
                walk(e, prefix + ("    " if last else "│   "))
            else:
                lines.append(f"{prefix}{conn}{e.name}")
    walk(root, "")
    return lines

# ---------- Main logic ----------

def collect(root: Path, out_path: Path, followlinks: bool, exclude_dirs: set[str]) -> int:
    root = root.resolve()
    out_path = out_path.resolve()

    if not root.exists() or not root.is_dir():
        print(f"Error: root '{root}' is not a directory.", file=sys.stderr)
        return 2

    files = iter_all_files(root, followlinks, exclude_dirs)
    if not files:
        print("No files found.", file=sys.stderr)
        return 1

    out_path.parent.mkdir(parents=True, exist_ok=True)

    text_count = 0
    bin_count = 0

    with out_path.open("w", encoding="utf-8", newline="\n") as out:
        for f in files:
            # Don't include the output file itself
            try:
                if f.resolve() == out_path:
                    continue
            except Exception:
                pass

            rel = f.relative_to(root)
            try:
                size_bytes = f.stat().st_size
            except Exception:
                size_bytes = None

            try:
                if is_text_file(f):
                    content = read_text_preserve(f)
                    write_header(out, rel, size_bytes)
                    out.write(content)
                    if not content.endswith("\n"):
                        out.write("\n")
                    out.write("\n")
                    text_count += 1
                else:
                    write_header(out, rel, size_bytes, marker="UNSUPPORTED/NON-TEXT")
                    out.write("(contents omitted)\n\n")
                    bin_count += 1
            except Exception as e:
                write_header(out, rel, size_bytes, marker="READ_ERROR")
                out.write(f"[ERROR] {e}\n\n")
                bin_count += 1

        # ---- Append project tree ----
        out.write(f"{HEADER_LINE}\nPROJECT TREE\n{HEADER_LINE}\n")
        for line in tree_lines(root, exclude_dirs, followlinks):
            out.write(line + "\n")

        # ---- Summary ----
        out.write("\n")
        out.write(f"{HEADER_LINE}\nSUMMARY\n{HEADER_LINE}\n")
        out.write(f"Text files written : {text_count}\n")
        out.write(f"Non-text/omitted   : {bin_count}\n")
        out.write(f"Total files seen   : {len(files)}\n")

    print(f"Done. Text={text_count}  Non-text={bin_count}  Wrote -> '{out_path}'.")
    return 0

def parse_excludes(argv_excludes: list[str]) -> set[str]:
    """
    Accept bare directory names (top-level names) to prune while walking.
    Always include defaults (.next, node_modules), while allowing users to add more.
    """
    return DEFAULT_EXCLUDES.union(set(argv_excludes or []))

def main():
    ap = argparse.ArgumentParser(description="Write all text files, list non-text files, then append project tree.")
    ap.add_argument("root", type=Path, help="Root directory to scan")
    ap.add_argument("output", type=Path, help="Output .txt file")
    ap.add_argument("--exclude", nargs="*", default=[], help="Extra directory names to exclude in addition to '.next' and 'node_modules' (space-separated)")
    ap.add_argument("--followlinks", action="store_true", help="Follow symlinked directories")
    args = ap.parse_args()

    exclude_dirs = parse_excludes(args.exclude)
    rc = collect(args.root, args.output, followlinks=args.followlinks, exclude_dirs=exclude_dirs)
    sys.exit(rc)

if __name__ == "__main__":
    main()
