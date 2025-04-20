# Étape de build
FROM node:18 AS build
WORKDIR /app

ARG REACT_APP_GRAPHQL_API_URL
ENV REACT_APP_GRAPHQL_API_URL=$REACT_APP_GRAPHQL_API_URL

COPY package*.json ./
RUN npm install

COPY . .

RUN echo "🛠️ Build avec URL: $REACT_APP_GRAPHQL_API_URL" && \
    if [ -z "$REACT_APP_GRAPHQL_API_URL" ]; then echo "❌ Variable REACT_APP_GRAPHQL_API_URL non définie" && exit 1; fi && \
    npm run build

# Étape de prod
FROM node:18-slim
WORKDIR /app

RUN npm install -g serve
COPY --from=build /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]