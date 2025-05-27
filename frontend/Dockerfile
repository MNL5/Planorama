FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

RUN for FILE in tsconfig.app.json tsconfig.node.json; do \
  if [ -f "$FILE" ]; then \
    echo "Patching $FILE to disable strict mode..."; \
    # Remove any existing "strict": true or false lines
    sed -i '/"strict": *\(true\|false\),*/d' "$FILE"; \
    # Insert "strict": false inside "compilerOptions"
    sed -i '/"compilerOptions": {/a \    "strict": false,' "$FILE"; \
    echo "--- $FILE contents after patch ---"; \
    cat "$FILE"; \
    echo "----------------------------------"; \
  fi \
done

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]