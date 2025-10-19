#!/usr/bin/env bash
set -euo pipefail

# Simple deploy placeholder
# Usage: ./scripts/deploy.sh <env>
ENVIRONMENT=${1:-dev}

echo "Deploying backend to $ENVIRONMENT..."
echo "Note: This project targets XAMPP/MySQL for DB in dev."
