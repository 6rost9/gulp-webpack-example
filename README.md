# gulp-webpack-example

[Гайд по установке и настройке NodeJS + npm в Ubuntu](https://www.digitalocean.com/community/tutorials/node-js-ubuntu-18-04-ru)

Предпочтителен метод из раздела "Установка при помощи NVM", для установки актульной версии

Инициализация:

npm i

Список доступных тасков:

gulp --tasks

Есть на данный момент:

gulp build - сборка проекта в production режиме, без sourcemap и сжатием, для релиза
gulp build:dev - сборка проетка в development режиме, с подробной картой без жатия, для разработки
gulp watch - отслеживание изменений файлов в папке src, для автоматической пересборки в development режиме
