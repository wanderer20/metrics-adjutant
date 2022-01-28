#!/usr/bin/env sh

cd vue-front

# остановить публикацию при ошибках
set -e

# сборка
npm run build

# переход в основной каталог
cd ../

git subtree push --prefix=vue-front/dist github gh-pages

cd -