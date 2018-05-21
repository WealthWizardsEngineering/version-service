FROM quay.io/wealthwizards/ww-base-node:alpine-6

COPY package.json package.json
ENV NODE_ENV=production
RUN npm install

# Add your source files
COPY src/ src/
COPY main.js main.js

EXPOSE 80

CMD ["npm","start"]
