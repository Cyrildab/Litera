#!/bin/bash

echo "🚀 Démarrage du projet LitEra..."

# Lancer Docker Compose en mode détaché
echo "🔄 Lancement des services Docker..."
docker-compose up -d

# Attendre quelques secondes pour que tout démarre
sleep 5

# Vérifier si les conteneurs sont bien lancés
echo "📡 Vérification des services en cours..."
docker ps

echo ""
echo "✅ Projet LitEra lancé avec succès !"
echo "➡️  Frontend : http://localhost:3000"
echo "➡️  Backend GraphQL : http://localhost:4000/graphql"
echo "➡️  PostgreSQL tourne sur le port 5432"
echo ""
echo "📌 Utilise 'docker-compose down' pour arrêter les services."

