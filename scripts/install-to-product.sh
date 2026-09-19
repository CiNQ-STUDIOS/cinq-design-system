#!/usr/bin/env bash
# CiNQ Design System - Project Installer
# Usage: ./install-to-product.sh [path/to/target/project] [--submodule | --clone]

set -e

TARGET_DIR="${1:-.}"
MODE="${2:---submodule}"
REPO_URL="https://github.com/CiNQ-STUDIOS/cinq-design-system.git"
DEST_DIR="$TARGET_DIR/brand/design-system"

echo "==> Setting up CiNQ Design System into: $DEST_DIR"

mkdir -p "$TARGET_DIR/brand"

if [ "$MODE" = "--submodule" ] && [ -d "$TARGET_DIR/.git" ]; then
    echo "==> Adding git submodule..."
    git -C "$TARGET_DIR" submodule add "$REPO_URL" brand/design-system
    git -C "$TARGET_DIR" submodule update --init --recursive
else
    echo "==> Cloning repository into $DEST_DIR..."
    git clone "$REPO_URL" "$DEST_DIR"
    echo "==> Removing .git from vendored folder..."
    rm -rf "$DEST_DIR/.git"
fi

echo "==> Done! CiNQ Design System is installed at $DEST_DIR"
echo "==> You can now prompt your AI agent using the prompt in brand/design-system/README.md"
