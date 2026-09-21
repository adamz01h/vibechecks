FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache python3 py3-pip git
COPY package*.json ./
RUN npm install
COPY . .
RUN python3 -m venv /tmp/fontenv \
 && /tmp/fontenv/bin/pip install --no-cache-dir fontmake \
 && git clone https://github.com/aiaf/nimra.git /tmp/nimra \
 && cd /tmp/nimra \
 && git checkout 4a59d8e25749fced77bc519bbad29f5c2219d2e6 \
 && mkdir -p /app/public/fonts \
 && /tmp/fontenv/bin/fontmake -u Nimra-Regular.ufo -o ttf --output-path /app/public/fonts/Nimra-Regular.ttf \
 && cp OFL.txt /app/public/fonts/Nimra-OFL.txt
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
