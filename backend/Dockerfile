FROM node:20-slim

RUN apt update && apt install -y openssl procps
RUN npm install -g ts-node
RUN npm i -g @nestjs/cli

# USER node

WORKDIR /home/node/app

CMD [ "/home/node/app/start.sh" ]

