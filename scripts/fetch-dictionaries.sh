#!/bin/sh
# Fetches the US and British Hunspell dictionaries that scripts/check-us-spelling.mjs compares.
# Both come from the same SCOWL release and size, so they differ only in variant spellings;
# mixing in a distro en_GB (a different, larger build) would flag ordinary jargon as British.
set -eu

RELEASE=rel-2026.02.25
DIR=${SPELLING_DICT_DIR:-.cache/dictionaries}
BASE=https://github.com/en-wl/wordlist/releases/download/$RELEASE

sha256() {
  if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | cut -d' ' -f1
  else shasum -a 256 "$1" | cut -d' ' -f1
  fi
}

fetch() {
  name=$1 zip=$2 want=$3
  [ -f "$DIR/$name.dic" ] && [ -f "$DIR/$name.aff" ] && return 0
  tmp=$(mktemp)
  curl -fsSL -o "$tmp" "$BASE/$zip"
  got=$(sha256 "$tmp")
  if [ "$got" != "$want" ]; then
    echo "checksum mismatch for $zip: got $got, want $want" >&2
    rm -f "$tmp"
    exit 1
  fi
  unzip -oq "$tmp" "$name.dic" "$name.aff" -d "$DIR"
  rm -f "$tmp"
}

mkdir -p "$DIR"
fetch en_US hunspell-en_US-2026.02.25.zip ac8e73310e951d88c52c2cf2ba54ceaca34f8486a81630ac8a75dc5f931179f9
fetch en_GB-ise hunspell-en_GB-ise-2026.02.25.zip d6fbb91ae7824c52fb02f74d7bc2cd9092f130faec60f42326a59437fa7247a3
