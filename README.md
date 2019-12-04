# gulp-webpack-example

Пример сборки проекта с использованием связки Gulp(styles) + Webpack(scripts)

[Гайд по установке и настройке NodeJS + npm в Ubuntu](https://www.digitalocean.com/community/tutorials/node-js-ubuntu-18-04-ru)

Предпочтителен метод из раздела "Установка при помощи NVM", для установки актульной версии

После скачивания актуальной версии (можно взять с [github](https://github.com/nvm-sh/nvm)), переходим в директорию

_cd ~/.nvm_

в статье скрипт установки называется иначе, акутально

_bash install.sh_

Обязательно выполнить

_source ~/.profile_

для регистарции nvm в системе, остальное по инструкции, ставить последнюю lts версию

Инициализация

_npm i_

Установка gulp, глобально

_npm i -g gulp_

Список доступных тасков

_gulp --tasks_

Есть на данный момент:

* gulp build - сборка проекта в production режиме, без sourcemap и сжатием, для релиза
* gulp build:dev - сборка проетка в development режиме, с подробной картой без жатия, для разработки
* gulp watch - отслеживание изменений файлов в папке src, для автоматической пересборки в development режиме
