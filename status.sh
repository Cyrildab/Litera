#!/bin/bash

echo "📦 Statut des conteneurs LitEra :"
docker ps -a --filter "name=litera"

echo ""
echo "🔎 Conteneurs arrêtés (exit code ≠ 0) :"
docker ps -a --filter "status=exited" --filter "exit-code=1"
