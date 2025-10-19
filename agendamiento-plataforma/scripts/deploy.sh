#!/usr/bin/env bash
set -euo pipefail

# Simple deploy placeholder
# Usage: ./scripts/deploy.sh <env>
ENVIRONMENT=${1:-dev}

echo "Deploying backend to $ENVIRONMENT..."
# Add real deploy commands here (e.g., Docker push, k8s apply)
