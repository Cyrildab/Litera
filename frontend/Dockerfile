# Étape de build
FROM node:18 AS build
WORKDIR /app

# On passe la variable à la build
ARG VITE_GRAPHQL_API_URL
ENV VITE_GRAPHQL_API_URL=$VITE_GRAPHQL_API_URL

COPY . .

RUN npm install
RUN npm run build

# Étape de production
FROM node:18-slim
WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
