FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install express dotenv body-parser helmet express-rate-limit express-validator

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
