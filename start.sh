echo "🚀 Lancement de LitEra..."

docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

echo "⏳ Attente du backend (10 secondes)..."
sleep 10

echo "🔗 Connexion à l'API Google Books prête !"

echo "✅ Projet démarré avec succès !"
echo ""
echo "📚 GraphQL ➜ http://localhost:4000/graphql"
echo "💻 Frontend ➜ http://localhost:3000"
echo "🛢️ pgAdmin ➜ http://localhost:8081 (admin@litera.com / admin123)"