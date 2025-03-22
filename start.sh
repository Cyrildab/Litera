#!/bin/bash

echo "🚀 Lancement de LitEra..."

docker-compose up -d 

echo "⏳ Attente du backend (10 secondes)..."
sleep 10

echo "📥 Insertion des livres dans la base de données..."
docker-compose exec backend npm run seed

echo "✅ Projet démarré avec succès !"
echo ""
echo "📚 GraphQL ➜ http://localhost:4000/graphql"
echo "💻 Frontend ➜ http://localhost:3000"
echo "🛢️ pgAdmin ➜ http://localhost:8081 (admin@litera.com / admin123)"
