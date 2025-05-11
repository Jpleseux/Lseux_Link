#!/bin/bash

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

if [ ! -f "sqlite/database.db" ]; then
  echo '' > sqlite/database.db
fi

npm install

npm run start:dev # rodar aplicação
# tail -f /dev/null