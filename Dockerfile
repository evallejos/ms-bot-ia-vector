FROM node:latest
WORKDIR /app
COPY . .
ENV PORT=80
ENTRYPOINT ["npm", "start"]
