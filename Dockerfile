FROM wealthwizardsengineering/ww-base-node:alpine-latest

COPY package.json package.json
COPY .npmrc .npmrc
ENV NODE_ENV=production
RUN npm install

# Add your source files
COPY src/ src/
COPY main.js main.js
COPY api.yaml api.yaml

ENV PORT=80
ENV HTTP_TIMEOUT=5000
EXPOSE 80

CMD ["npm","start"]
