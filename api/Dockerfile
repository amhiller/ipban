FROM node:14-alpine3.10
WORKDIR "/api"
COPY ["package.json", "./"]
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "prod"]