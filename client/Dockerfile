FROM node:12.18.3

RUN npm i -g @angular/cli@10.0.8

WORKDIR /usr/client

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./angular.json ./angular.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.app.json ./tsconfig.app.json
COPY ./tsconfig.base.json ./tsconfig.base.json

RUN npm install

COPY ./src ./src

ENTRYPOINT ["ng", "serve", "--host=0.0.0.0", "--poll=1", "--disable-host-check"]