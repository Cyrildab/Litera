#!/bin/bash

echo "📜 Affichage des logs LitEra..."

if ! command -v docker &> /dev/null
then
  echo "❌ Docker n'est pas installé. Veuillez l’installer pour continuer."
  exit 1
fi

echo "⏳ Récupération des logs récents..."

docker-compose logs --tail=50 --no-color

echo ""
echo "✅ Fin des logs. Tu peux aussi utiliser :"
echo "   ▶️ docker-compose logs -f         (pour suivre en live)"
echo "   🐳 docker ps                     (pour vérifier les statuts)"
