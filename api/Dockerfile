FROM node:12.18.3

WORKDIR /usr/app

COPY ./nest-cli.json ./nest-cli.json
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.build.json ./tsconfig.build.json
COPY ./.env ./.env

RUN npm install

COPY ./src ./src

CMD ["npm", "run", "start:debug"]