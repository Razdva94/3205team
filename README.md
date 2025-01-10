# Проект: Тестовое задание. Компания "CRAFFTECH"

## Технологии

![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=TypeScript&logoColor=black&labelColor=white)
![Express](https://img.shields.io/badge/express-white?logo=express&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-green?logo=node.js&logoColor=black)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)



## Описание проекта

Тестовое задание. Проект написан на TypeScript, ORM Prisma, Express, Node.js.
Документация Swagger

## Запуск проекта

Для запуска проекта необходимо выполнить следующие действия:

1. Склонировать проект на ваш компьютер с [Github](https://github.com/Razdva94/Crafftech) с помощью команды:

```
git clone https://github.com/Razdva94/Crafftech.git
```

Перейдите в корневую папку проекта

2. Установить зависимости:

```
yarn install
```

3. Отредактируйте файл .env и добавьте параметры подключения к базе данных,
   пример в env.example

4. Выполните миграцию в выбранную базу данных

```
yarn migrate
```

5. Запустить проект:

```
yarn dev
```
