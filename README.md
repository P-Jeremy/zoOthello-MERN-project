<h1 align="center">Welcome to zoOthello 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/npm-6.14.8-blue.svg" />
  <img src="https://img.shields.io/badge/node-14.15.0-blue.svg" />
  <img src="https://img.shields.io/badge/express-%5E4.17.1-blue.svg" />
  <img src="https://img.shields.io/badge/reversi-%5E3.0.0-blue.svg" />
  <img src="https://img.shields.io/badge/mongoose-%5E5.8.9-blue.svg" />
  <img src="https://img.shields.io/badge/react-%5E16.14.0-blue.svg" />
  <img src="https://img.shields.io/badge/@babel/runtime-%5E7.12.5-blue.svg" />
  <img src="https://img.shields.io/badge/webpack-%5E5.4.0-blue.svg" />
  <a href="https://github.com/D0C702WH0/MERN-Othello-Game-noCRA#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/D0C702WH0/MERN-Othello-Game-noCRA/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/D0C702WH0/MERN-Othello-Game-noCRA/blob/master/LICENSE" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/github/license/D0C702WH0/zoOthello" />
  </a>
  <a href="https://twitter.com/_jeremy_p_" target="_blank">
    <img alt="Twitter: _jeremy_p_" src="https://img.shields.io/twitter/follow/_jeremy_p_.svg?style=social" />
  </a>
</p>

A react(no CRA)/Express/mongoDB Othello game

## Important

For the game to work, you'll need a MongoDB Atlas data base.

Store your atlas config in a '.env' file in the root folder.

Your '.env' file should contain an environemnt variable that looks like this :

 MONGO_CONFIG_URL='mongodb+srv://(PUTYOURUSERNAMEHERE):(PUTYOURPASSWORDHERE)@cluster0-ctrcz.mongodb.net/test?retryWrites=true&w=majority'


## Prerequisites

- npm 6.14.8
- node 14.14.0
- docker

## Install

```sh
npm install
```

## Launch client

```sh
npm run webpack
```

## Launch server

```sh
npm run server
```

## Launch server & client

```sh
npm run dev
```

## Launch Docker for server testing

```sh
docker-compose up -d
```

## Run client tests

```sh
npm run test:client
```

## Run server tests with coverage

```sh
npm run test:server
```

## Run linter

```sh
npm run lint
```

## Special thanks
[@kjirou](https://github.com/kjirou) for his Reversi package (https://www.npmjs.com/package/reversi)

## Author

👤 **Jérémy Pluquet**

* Twitter: [@\_Jeremy\_p\_](https://twitter.com/_Jeremy_p_)
* Github: [@P-Jeremy](https://github.com/D0C702WH0)
* LinkedIn: [@jérémy pluquet](https://www.linkedin.com/in/j%C3%A9r%C3%A9my-pluquet-765a89169/)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Jérémy Pluquet](https://github.com/D0C702WH0).<br />
This project is [ISC](https://www.isc.org/licenses/) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
