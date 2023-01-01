FROM node:18-alpine

EXPOSE 3000

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node package*.json ./

# Install app dependencies
RUN npm ci --only=production && npm cache clean --force

# Bundle app source
COPY --chown=node:node . .

#use the container as a "node" user instead of root user
USER node

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]