#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK_DIR="$ROOT_DIR/.bundle-build"
ARCHIVE="$WORK_DIR/axante-v2.tar.gz"
EXTRACT_DIR="$WORK_DIR/extracted"
OUTPUT_DIR="$ROOT_DIR/dist"

rm -rf "$WORK_DIR" "$OUTPUT_DIR"
mkdir -p "$EXTRACT_DIR" "$OUTPUT_DIR"

mapfile -t PARTS < <(find "$ROOT_DIR/bundle" -maxdepth 1 -type f -name 'part-*.b64' | sort)

if [ "${#PARTS[@]}" -eq 0 ]; then
  echo "No bundle parts found in bundle/" >&2
  exit 1
fi

cat "${PARTS[@]}" | tr -d '\r\n\t ' | base64 --decode > "$ARCHIVE"

gzip -t "$ARCHIVE"

if ! tar -tzf "$ARCHIVE" >/dev/null 2>&1; then
  echo "The reconstructed bundle is valid gzip but not a tar.gz archive." >&2
  exit 1
fi

tar -xzf "$ARCHIVE" --no-same-owner --no-same-permissions -C "$EXTRACT_DIR"

INDEX_FILE="$(find "$EXTRACT_DIR" -type f -name index.html -printf '%d %p\n' | sort -n | head -n 1 | cut -d' ' -f2-)"

if [ -z "$INDEX_FILE" ] || [ ! -f "$INDEX_FILE" ]; then
  echo "The reconstructed bundle does not contain an index.html file." >&2
  exit 1
fi

SITE_ROOT="$(dirname "$INDEX_FILE")"
cp -a "$SITE_ROOT"/. "$OUTPUT_DIR"/

find "$OUTPUT_DIR" -name '.DS_Store' -delete

if [ ! -f "$OUTPUT_DIR/index.html" ]; then
  echo "Build completed without dist/index.html." >&2
  exit 1
fi

echo "Axante v2 extracted successfully to dist/."
