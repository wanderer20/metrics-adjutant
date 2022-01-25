<template>


    <section class="block block--dark">
        <div class="container">
            <div class="block__inner">
                <div class="block__header">
                    <h2 class="block__title">Возможности</h2>
                </div>
                <div class="block__body">
                    установка
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
                    установка
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
                    <code><pre>
                        /**
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
                            const buttons = Array.from(document.querySelectorAll('[data-btn]));

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

                        window.eventManager = new EventManager();
                    </pre></code>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import MetricAdjutant from "../components/MetricAdjutant.vue";

    export default {
        name: "Index",
        components: {
            MetricAdjutant
        }

    }
</script>

<style lang="scss">

</style>