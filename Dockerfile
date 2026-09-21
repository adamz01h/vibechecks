FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache curl unzip
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p /app/public/fonts /tmp/nimra \
 && curl -fsSL https://makkuk.com/nimra/makkuk-nimra-1.02.zip -o /tmp/nimra.zip \
 && unzip -q /tmp/nimra.zip -d /tmp/nimra \
 && find /tmp/nimra -type f -name '*.ttf' -exec cp {} /app/public/fonts/Nimra-Regular.ttf \; \
 && test -s /app/public/fonts/Nimra-Regular.ttf \
 && curl -fsSL https://raw.githubusercontent.com/aiaf/nimra/4a59d8e25749fced77bc519bbad29f5c2219d2e6/OFL.txt -o /app/public/fonts/Nimra-OFL.txt
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY server ./server
COPY database ./database
COPY knexfile.js ./knexfile.js
EXPOSE 3001
USER node
CMD ["node","server/index.js"]
