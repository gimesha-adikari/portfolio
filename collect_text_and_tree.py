from __future__ import annotations
import argparse
import os
from pathlib import Path
import sys
import tokenize
import mimetypes
import re
import fnmatch

HEADER_LINE = "=" * 80

DEFAULT_EXCLUDED_DIRS = {
  ".git", ".hg", ".svn", ".idea", ".vs", ".vscode",
  "node_modules", ".next", ".nuxt", ".cache", ".parcel-cache", ".vite",
  ".svelte-kit", ".angular", ".yarn", ".pnp", ".pnpm-store", ".vercel",
  ".netlify", ".docusaurus",
  "__pycache__", ".pytest_cache", ".mypy_cache", ".ruff_cache", ".tox",
  ".ipynb_checkpoints", ".venv", "venv", "env", ".eggs",
  ".gradle", ".build", "build", "out", "libs",
  "Pods", "DerivedData",
  "target",
  "bin",
  "obj",
  "target",
  ".terraform", ".serverless",
  ".firebase", ".expo", ".dart_tool",
  "collect_text_and_tree.py"
}

DEFAULT_EXCLUDED_DIR_PATTERNS = [
  r".*\.egg-info$",
]

DEFAULT_EXCLUDED_FILES = {
  "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb",
  "Pipfile.lock", "poetry.lock", "requirements.txt.lock",
  "composer.lock", "Gemfile.lock", "Cargo.lock",
  "Podfile.lock",
  "gradle-wrapper.jar", ".DS_Store", "Thumbs.db",
  ".coverage",
}

DEFAULT_EXCLUDED_FILE_GLOBS = [
  ".coverage.*",
  "*.pyc", "*.pyo", "*.pyd",
  "*.class",
  "*.o", "*.obj", "*.a", "*.so", "*.dll", "*.dylib",
  "*.min.*.map",
  ".env.*.local", ".env.local", ".env", "*.local.env",
  "stats.*.json", "stats.json",
  "*.txt",
]

TEXT_EXTS = {
  ".py", ".java", ".kt", ".kts",
  ".js", ".ts", ".jsx", ".tsx",
  ".css", ".scss", ".sass", ".less",
  ".html", ".htm", ".vue", ".svelte",
  ".c", ".h", ".cpp", ".hpp", ".cc", ".m", ".mm",
  ".go", ".rs", ".php", ".rb", ".swift", ".scala",
  ".cs", ".sql", ".sh", ".bat", ".ps1",
  ".json", ".yaml", ".yml", ".xml", ".ini", ".cfg", ".conf", ".properties",
  ".toml", ".gradle", ".md", ".env", ".csv", ".tsv",
  ".gitignore", ".gitattributes", ".editorconfig", ".prettierrc", ".eslintrc",
}

TEXT_MIME_PREFIXES = ("text/",)
TEXT_MIME_EXTRAS = {
  "application/json", "application/xml", "application/javascript",
  "application/x-sh", "application/x-shellscript",
}

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
  weird = sum(1 for b in head if (b < 32 and b not in (9, 10, 13, 12)))
  return (len(head) > 0) and (weird / len(head) > 0.30)

def is_text_file(path: Path, sample_bytes: int = 4096) -> bool:
  if path.suffix.lower() in TEXT_EXTS:
    return True
  try:
    with path.open("rb") as f:
      head = f.read(sample_bytes)
  except Exception:
    return False
  if _has_bom(head):
    return True
  mt, _ = mimetypes.guess_type(path.as_posix())
  if mt and (mt.startswith(TEXT_MIME_PREFIXES) or mt in TEXT_MIME_EXTRAS):
    return True
  return not _looks_binary(head)

def read_text_preserve(path: Path) -> str:
  if path.suffix.lower() == ".py":
    with tokenize.open(path) as f:
      return f.read()
  with path.open("rb") as fb:
    head = fb.read(4)
  enc = _has_bom(head)
  if enc:
    return path.read_text(encoding=enc)
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

def _compile_dir_regexes(patterns: list[str]) -> list[re.Pattern]:
  return [re.compile(p) for p in patterns]

DEFAULT_EXCLUDED_DIR_REGEXES = _compile_dir_regexes(DEFAULT_EXCLUDED_DIR_PATTERNS)

def dir_is_excluded(name: str, name_set: set[str], name_regexes: list[re.Pattern], extra_globs: list[str]) -> bool:
  if name in name_set:
    return True
  for rgx in name_regexes:
    if rgx.match(name):
      return True
  for g in extra_globs:
    if fnmatch.fnmatch(name, g):
      return True
  return False

def file_is_excluded(basename: str, base_set: set[str], base_globs: list[str]) -> bool:
  if basename in base_set:
    return True
  for g in base_globs:
    if fnmatch.fnmatch(basename, g):
      return True
  return False

def load_gitignore_patterns(root: Path) -> tuple[list[str], list[str]]:
  dir_globs: list[str] = []
  file_globs: list[str] = []
  for gp in root.rglob(".gitignore"):
    try:
      text = gp.read_text(encoding="utf-8", errors="ignore")
    except Exception:
      continue
    for line in text.splitlines():
      line = line.strip()
      if not line or line.startswith("#"):
        continue
      pat = line.lstrip("/")
      if pat.endswith("/"):
        dir_globs.append(pat.rstrip("/"))
      else:
        dir_globs.append(pat)
        file_globs.append(pat)
  return dir_globs, file_globs

def iter_all_files(
  root: Path,
  followlinks: bool,
  exclude_dir_names: set[str],
  exclude_dir_name_regexes: list[re.Pattern],
  exclude_dir_globs: list[str],
  exclude_files: set[str],
  exclude_file_globs: list[str],
  out_path: Path | None = None,
) -> list[Path]:
  files: list[Path] = []
  for dirpath, dirnames, filenames in os.walk(root, followlinks=followlinks):
    pruned = []
    for d in list(dirnames):
      if dir_is_excluded(d, exclude_dir_names, exclude_dir_name_regexes, exclude_dir_globs):
        pruned.append(d)
    if pruned:
      dirnames[:] = [d for d in dirnames if d not in pruned]
    for fn in filenames:
      if file_is_excluded(fn, exclude_files, exclude_file_globs):
        continue
      p = Path(dirpath) / fn
      try:
        if out_path is not None and p.resolve() == out_path.resolve():
          continue
      except Exception:
        pass
      files.append(p)
  files.sort(key=lambda p: p.as_posix().lower())
  return files

def tree_lines(
  root: Path,
  exclude_dir_names: set[str],
  exclude_dir_name_regexes: list[re.Pattern],
  exclude_dir_globs: list[str],
  exclude_files: set[str],
  exclude_file_globs: list[str],
) -> list[str]:
  lines: list[str] = [f"{root.name}/"]

  def walk(d: Path, prefix: str):
    try:
      entries = sorted(list(d.iterdir()), key=lambda p: (not p.is_dir(), p.name.lower()))
    except PermissionError:
      return
    filtered = []
    for e in entries:
      name = e.name
      if e.is_dir():
        if dir_is_excluded(name, exclude_dir_names, exclude_dir_name_regexes, exclude_dir_globs):
          continue
      else:
        if file_is_excluded(name, exclude_files, exclude_file_globs):
          continue
      filtered.append(e)
    for i, e in enumerate(filtered):
      last = (i == len(filtered) - 1)
      conn = "└── " if last else "├── "
      if e.is_dir():
        lines.append(f"{prefix}{conn}{e.name}/")
        walk(e, prefix + ("    " if last else "│   "))
      else:
        lines.append(f"{prefix}{conn}{e.name}")

  walk(root, "")
  return lines

def collect(
  root: Path,
  out_path: Path,
  followlinks: bool,
  use_default_excludes: bool,
  extra_exclude_dirs: list[str],
  extra_exclude_files: list[str],
  respect_gitignore: bool,
) -> int:
  root = root.resolve()
  out_path = out_path.resolve()
  if not root.exists() or not root.is_dir():
    print(f"Error: root '{root}' is not a directory.", file=sys.stderr)
    return 2
  exclude_dir_names = set(DEFAULT_EXCLUDED_DIRS) if use_default_excludes else set()
  exclude_dir_name_regexes = list(DEFAULT_EXCLUDED_DIR_REGEXES) if use_default_excludes else []
  exclude_dir_globs: list[str] = []
  exclude_files = set(DEFAULT_EXCLUDED_FILES) if use_default_excludes else set()
  exclude_file_globs = list(DEFAULT_EXCLUDED_FILE_GLOBS) if use_default_excludes else []
  exclude_dir_globs.extend(extra_exclude_dirs or [])
  exclude_file_globs.extend(extra_exclude_files or [])
  if respect_gitignore:
    dglobs, fglobs = load_gitignore_patterns(root)
    exclude_dir_globs.extend(dglobs)
    exclude_file_globs.extend(fglobs)
  files = iter_all_files(
    root,
    followlinks,
    exclude_dir_names,
    exclude_dir_name_regexes,
    exclude_dir_globs,
    exclude_files,
    exclude_file_globs,
    out_path=out_path,
  )
  if not files:
    print("No files found (everything may be excluded).", file=sys.stderr)
    return 1
  out_path.parent.mkdir(parents=True, exist_ok=True)
  text_count = 0
  bin_count = 0
  with out_path.open("w", encoding="utf-8", newline="\n") as out:
    for f in files:
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
    out.write(f"{HEADER_LINE}\nPROJECT TREE\n{HEADER_LINE}\n")
    for line in tree_lines(
      root,
      exclude_dir_names,
      exclude_dir_name_regexes,
      exclude_dir_globs,
      exclude_files,
      exclude_file_globs,
    ):
      out.write(line + "\n")
    out.write("\n")
    out.write(f"{HEADER_LINE}\nSUMMARY\n{HEADER_LINE}\n")
    out.write(f"Text files written : {text_count}\n")
    out.write(f"Non-text/omitted   : {bin_count}\n")
    out.write(f"Total files seen   : {len(files)}\n")
  print(f"Done. Text={text_count}  Non-text={bin_count}  Wrote -> '{out_path}'.")
  return 0

def main():
  ap = argparse.ArgumentParser(description="Write all text files, list non-text files, then append project tree.")
  ap.add_argument("root", type=Path, help="Root directory to scan")
  ap.add_argument("output", type=Path, help="Output .txt file")
  ap.add_argument("--exclude-dirs", nargs="*", default=[], help="Extra directory name/glob patterns to prune")
  ap.add_argument("--exclude-files", nargs="*", default=[], help="Extra file basename/glob patterns to skip")
  ap.add_argument("--followlinks", action="store_true", help="Follow symlinked directories")
  ap.add_argument("--no-default-excludes", action="store_true", help="Do not apply built-in pruning")
  ap.add_argument("--respect-gitignore", action="store_true", help="Additionally prune patterns from .gitignore files (basic)")
  args = ap.parse_args()
  rc = collect(
    root=args.root,
    out_path=args.output,
    followlinks=args.followlinks,
    use_default_excludes=not args.no_default_excludes,
    extra_exclude_dirs=args.exclude_dirs,
    extra_exclude_files=args.exclude_files,
    respect_gitignore=args.respect_gitignore,
  )
  sys.exit(rc)

if __name__ == "__main__":
  main()
