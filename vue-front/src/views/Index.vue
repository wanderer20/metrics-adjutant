<template>
    <div v-highlight >

        <section class="block">
            <div class="container">
                <div class="block__inner">
                    <div class="block__header">
                        <h2 class="block__title">Описание</h2>
                    </div>
                    <div class="block__body">
                        <p>
                            Решение призвано собрать в себе популярные метрики, унифицировать взаимодействие с ними, убрать ошибки отправки событий. Автоматическое подключение метрики нужно версии и переключение ее методов на загруженную версию.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="block block--filled">
            <div class="container">
                <div class="block__inner">
                    <div class="block__header">
                        <h2 class="block__title">Установка</h2>
                    </div>
                    <div class="block__body">
                        <h3>Через npm</h3>
                        <pre class="language-javascript"><code>npm install metricadjutant --save</code></pre>
                        <pre class="language-javascript"><code>import metricsAdjutant from "metricAjutant"

const ma = metricAdjutant()

ma.createMetrics([...])

// или, если метрика одна

ma.createMetric({...})</code></pre>

                        <h3>На страницу</h3>
                        <p>Между <strong>&lt;head&gt;</strong> и <strong>&lt;/head&gt;</strong></p>
                        <pre class="language-javascript"><code>&lt;script src="../metricAdjutant/dist/index.js">&lt;/script>

&lt;script type="text/javascript">

    ma.createMetrics([...])

    // или, если метрика одна

    ma.createMetric({...})

&lt;/script>
                        </code></pre>
                    </div>
                </div>
            </div>
        </section>

        <section class="block">
            <div class="container">
                <div class="block__inner">
                    <div class="block__header">
                        <h2 class="block__title">Сформировать конфиг для новой метрики</h2>
                    </div>
                    <div class="block__body">
                        <MetricAdjutant />
                    </div>
                </div>
            </div>
        </section>


        <section class="block block--filled">
            <div class="container">
                <div class="block__inner">
                    <div class="block__header">
                        <h2 class="block__title">Как пользоваться</h2>
                    </div>
                    <div class="block__body">
                        <p>
                            Для удобства можно создать "класс", который будет обрабатывать события. Внутри него применять методы для отправки событий в метрики. Ниже будет пример такого подхода:
                        </p>
                        <p>
                            Файл <strong>eventmanager.js</strong>
                        </p>
                        <pre class="language-javascript"><code>/**
* Класс для менеджера событий (целей)
* @constructor
*/
function EventManager() {
    this.initEvents();
}
/**
* Инициализация событий
*/
EventManager.prototype.initEvents = function () {
    const self = this;

    /**
    * Если у кнопок есть data-btn, data-target
    */
    const buttons = Array.from(document.querySelectorAll('[data-btn]'));

    buttons.forEach(function(item) {
        item.addEventListener('click', function() {
            const target = item.getAttribute('data-target');
            if (typeof window.ma !== "undefinde") {
                window.ma.push(YANDEX_METRIKA_ID, 'reachGoal', {
                    'goalName'  : target
                })
            }
        })
    });
}

window.eventManager = new EventManager();</code></pre>

                        <h3>Параметры метрики</h3>

                        <el-table :data="metricData" style="width: 100%">
                            <el-table-column prop="variable" label="Параметр" width="240"></el-table-column>
                            <el-table-column prop="description" label="Описание"></el-table-column>
                            <el-table-column prop="default" label="Значение по-умолчанию" width="240"></el-table-column>
                            <el-table-column prop="example" label="Пример"></el-table-column>
                        </el-table>

                        <h3>Методы</h3>
                        <el-table :data="methodData" style="width: 100%">
                            <el-table-column prop="method" label="Метод" width="240" />
                            <el-table-column prop="description" label="Описание" />
                            <el-table-column label="Параметры">
                                <template #default="scope">
                                    <template v-for="param in scope.row.params">
                                        <div>
                                            <strong>@param</strong> {{ param.variable }} - {{ param.description }} {{ param.default ? `(${param.default})` : ''}}
                                        </div>
                                    </template>
                                </template>
                            </el-table-column>
                        </el-table>

                        <h3>Поддерживаемые методы</h3>
                        <h4>Яндекс.метрика</h4>
                        <el-table :data="yandexMetricMethods" style="width: 100%">
                            <el-table-column prop="method" label="Метод" width="240" />
                            <el-table-column prop="description" label="Описание" />
                            <el-table-column label="Параметры">
                                <template #default="scope">
                                    <template v-for="param in scope.row.params">
                                        <div>
                                            <strong>@param</strong> {{ param.variable }} - {{ param.description }} {{ param.default ? `(${param.default})` : ''}}
                                        </div>
                                    </template>
                                </template>
                            </el-table-column>
                        </el-table>

                        <h4>Global Tag Manager (gtag)</h4>
                        <el-table :data="googleGtagMethods" style="width: 100%">
                            <el-table-column prop="method" label="Метод" width="240" />
                            <el-table-column prop="description" label="Описание" />
                            <el-table-column label="Параметры">
                                <template #default="scope">
                                    <template v-for="param in scope.row.params">
                                        <div>
                                            <strong>@param</strong> {{ param.variable }} - {{ param.description }} {{ param.default ? `(${param.default})` : ''}}
                                        </div>
                                    </template>
                                </template>
                            </el-table-column>
                        </el-table>

                        <h3>Примеры отправки событий в метрики</h3>
                        <p>Оправка данных по цели в Яндекс.метрику</p>
                        <pre class="language-javascript"><code>ma.push(YANDEX_METRIKA_ID, 'reachGoal', {
    'goalName'      : 'phone_click',
    'goalParams'    : {
        'category'      : 'btn',
        'label'         : 'phone'
    }
})</code></pre>
                        <p>Оправка данных в Google Analytics (схож с gtag)</p>
                        <pre class="language-javascript"><code>ma.push(GOOGLE_ANALYTICS_ID, 'event', {
    'action'        : 'login',
    'params'        : {
        'method'      : 'Google'
    }
})</code></pre>


                    </div>
                </div>
            </div>
        </section>
    </div>

</template>

<script>
    import MetricAdjutant from "../components/MetricAdjutant.vue";
    import { component as CodeHighlight } from 'vue-code-highlight';

    export default {
        name: "Index",
        components: {
            MetricAdjutant,
            CodeHighlight
        },
        setup() {
            const metricData = [
                {
                    variable: 'id',
                    description: 'Реальный ID метрики',
                    default: '-',
                    example: '6716673516, G-112315, UA-3111312, GTM-76761'
                },
                {
                    variable: 'type',
                    description: 'Тип метрики, относящийся к вызываемому скрипту при подключении',
                    default: '-',
                    example: 'yandex.metrika, google.analytics, google.tag.manager'
                },
                {
                    variable: 'version',
                    description: 'Версия метрики',
                    default: 'в каждой метрике стоят последние версии по-умолчанию',
                    example: '2.0 - для яндекс.метрики; GA4 - для google.analytics; GTM - для google.tag.manager'
                },
                {
                    variable: 'vendor',
                    description: 'Кто владелец метрики',
                    default: 'в каждой метрике стоит по-умолчанию',
                    example: 'yandex, google'
                },
                {
                    variable: 'debug',
                    description: 'Включить вывод всех событий в консоль браузера',
                    default: 'false',
                    example: 'true, false'
                },
                {
                    variable: 'load',
                    description: 'Загружать скрипт метрики сразу при инициализации метрики',
                    default: 'true',
                    example: 'true, false'
                },
                {
                    variable: 'options',
                    description: 'Параметры передаваемые в метрику',
                    default: '-',
                    example: '{\n' +
                        '    "clickmap": true,\n' +
                        '    "trackLinks": true,\n' +
                        '    "accurateTrackBounce": true\n' +
                        '  }'
                }

            ]
            const methodData = [
                {
                    method: 'createMetric',
                    description: 'Метод создает метрику из набора параметров',
                    params: [
                        {
                            variable: 'metricOptions',
                            description: 'Набор параметров',
                            default: false
                        }
                    ]
                },
                {
                    method: 'createMetrics',
                    description: 'Метод создает метрики из массива объектов с параметрами каждой метрики',
                    params: [
                        {
                            variable: 'metricsOptionsArray',
                            description: 'Массив с наборами параметров',
                            default: false
                        }
                    ]
                },
                {
                    method: 'push',
                    description: 'Вызов методов внтури отдельной метрики',
                    params: [
                        {
                            variable: 'id',
                            description: 'ID метрики',
                            default: false
                        },
                        {
                            variable: 'method',
                            description: 'Метод метрики',
                            default: false
                        },
                        {
                            variable: 'params',
                            description: 'Параметры метода метрики',
                            default: false
                        },
                    ]
                },
                {
                    method: 'getMetricById',
                    description: 'Метод получает метрику по id (внутреннему), если не найдет - осуществит поиск по metricId',
                    params: [
                        {
                            variable: 'id',
                            description: 'ID метрики внутренний (связка "тип метрики-id") или реальный',
                            default: false
                        }
                    ]
                },
                {
                    method: 'getMetricByMetricId',
                    description: 'Метод получает метрику по ее metricId',
                    params: [
                        {
                            variable: 'id',
                            description: 'ID реальной метрики',
                            default: false
                        }
                    ]
                },
                {
                    method: 'getMetrics',
                    description: 'Метод получает список метрик',
                    params: []
                },
                {
                    method: 'removeMetric',
                    description: 'Метод удаляет метрику из списка',
                    params: [
                        {
                            variable: 'id',
                            description: 'ID метрики внутренний (связка "тип метрики-id")',
                            default: false
                        }
                    ]
                }
            ]

            const yandexMetricMethods = [
                {
                    method: 'addFileExtension',
                    description: 'Отслеживание загрузки файлов с заданными расширениями.',
                    link: 'https://yandex.ru/support/metrica/objects/addfileextension.html',
                    params: [
                        {
                            variable: 'extensions',
                            description: 'Расширение имени файла, заданное в виде строки или список расширений, указанный в виде массива строк',
                            default: false
                        }
                    ]
                },
                {
                    method: 'extLink',
                    description: 'Отправка информации о переходе по внешней ссылке',
                    link: 'https://yandex.ru/support/metrica/objects/extlink.html',
                    params: [
                        {
                            variable: 'url',
                            description: 'Внешняя ссылка',
                            default: false
                        },
                        {
                            variable: 'options',
                            description: 'Параметры',
                            default: false
                        }
                    ]
                },
                {
                    method: 'file',
                    description: 'Отправка информации о загрузке файла',
                    link: 'https://yandex.ru/support/metrica/objects/file.html',
                    params: [
                        {
                            variable: 'url',
                            description: 'Ссылка',
                            default: false
                        },
                        {
                            variable: 'options',
                            description: 'Параметры',
                            default: false
                        }
                    ]
                },
                {
                    method: 'getClientID',
                    description: 'Получение идентификатора посетителя сайта, заданного Яндекс.Метрикой.',
                    link: 'https://yandex.ru/support/metrica/objects/get-client-id.html',
                    params: [
                    ]
                },
                {
                    method: 'hit',
                    description: 'Отправка данных о просмотре',
                    link: 'https://yandex.ru/support/metrica/objects/hit.html',
                    params: [
                        {
                            variable: 'url',
                            description: 'Ссылка',
                            default: false
                        },
                        {
                            variable: 'options',
                            description: 'Параметры',
                            default: false
                        }
                    ]
                },
                {
                    method: 'notBounce',
                    description: 'Передача информации о том, что визит пользователя не является отказом',
                    link: 'https://yandex.ru/support/metrica/objects/notbounce.html',
                    params: [
                        {
                            variable: 'options',
                            description: 'Параметры',
                            default: false
                        }
                    ]
                },
                {
                    method: 'params',
                    description: 'Передача произвольных параметров визита',
                    link: 'https://yandex.ru/support/metrica/objects/params-method.html',
                    params: [
                        {
                            variable: 'parameters',
                            description: 'Параметры',
                            default: false
                        }
                    ]
                },
                {
                    method: 'reachGoal',
                    description: 'Метод отправляет цель в метрику',
                    link: 'https://yandex.ru/support/metrica/objects/reachgoal.html',
                    params: [
                        {
                            variable: 'goalName',
                            description: 'Наименование цели в метрике',
                            default: false
                        },
                        {
                            variable: 'goalParams',
                            description: 'Параметры цели в метрике',
                            default: '{}'
                        },
                        {
                            variable: 'callback',
                            description: 'Функция после срабатывания отправки цели',
                            default: false
                        }
                    ]
                },
                {
                    method: 'setUserID',
                    description: 'Передача идентификатора посетителя сайта, заданного владельцем сайта',
                    link: 'https://yandex.ru/support/metrica/objects/set-user-id.html',
                    params: [
                        {
                            variable: 'id',
                            description: 'ID посетителя',
                            default: false
                        },
                    ]
                },
                {
                    method: 'userParams',
                    description: 'Передача произвольных параметров посетителей сайта',
                    link: 'https://yandex.ru/support/metrica/objects/user-params.html',
                    params: [
                        {
                            variable: 'parameters',
                            description: 'Параметры',
                            default: false
                        },
                    ]
                },
            ]

            const googleGtagMethods = [
                {
                    method: 'config',
                    description: 'Настройки по-умолчанию',
                    link: 'https://developers.google.com/analytics/devguides/collection/gtagjs/pages#default_behavior',
                    params: [
                        {
                            variable: 'params',
                            description: 'Параметры',
                            default: false
                        },
                    ]
                },
                {
                    method: 'event',
                    description: 'Отправка данных о событии',
                    link: 'https://developers.google.com/analytics/devguides/collection/gtagjs/events#send_events',
                    params: [
                        {
                            variable: 'action',
                            description: 'Действие',
                            default: false
                        },
                        {
                            variable: 'params',
                            description: 'Параметры',
                            default: false
                        },
                    ]
                },
                {
                    method: 'set',
                    description: 'Позволяет задавать значения, которые сохраняются во всех последующих вызовах gtag() на странице',
                    link: 'https://developers.google.com/tag-platform/gtagjs/reference?hl=ru#set',
                    params: [
                        {
                            variable: 'action',
                            description: 'Действие',
                            default: false
                        },
                        {
                            variable: 'params',
                            description: 'Параметры',
                            default: false
                        },
                    ]
                },
            ]

            return {
                metricData,
                methodData,
                yandexMetricMethods,
                googleGtagMethods
            }
        }

    }
</script>

<style lang="scss">

</style>