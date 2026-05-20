#!/bin/bash
# Town Pizza-Hut — GitHub Push Script
# Usage: bash push-to-github.sh YOUR_GITHUB_TOKEN

TOKEN="${1:-$GITHUB_PAT}"
REPO="https://${TOKEN}@github.com/hk28737372-gif/townpizzahut.git"

if [ -z "$TOKEN" ]; then
  echo "Error: No token provided."
  echo "Usage: bash push-to-github.sh YOUR_GITHUB_TOKEN"
  exit 1
fi

echo "Setting git config..."
git config user.email "townpizzahut@replit.com"
git config user.name "Town Pizza-Hut"

echo "Adding GitHub remote..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO"

echo "Pushing to GitHub..."
git push -u origin main --force

echo ""
echo "Done! Check your repo: https://github.com/hk28737372-gif/townpizzahut"
