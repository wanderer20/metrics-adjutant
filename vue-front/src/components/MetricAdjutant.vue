<template>
    <div class="metric-adjutant__wrapper">
        <div class="metric-adjutant__inner">
            <div class="metric-adjutant__body">
                <div class="metric-adjutant__code">
                    <div class="metric-adjutant__title h3">
                        Код для вставки в метод <strong>createMetric</strong>
                    </div>
                    <pre class="language-javascript"><code>{{ getResultMetricSetting(getMetricConfig(currentMetricConfig)) }}</code></pre>
                </div>
                <div class="metric-adjutant__settings">
                    <div class="metric-adjutant__title h3">
                        Настройки новой метрики
                    </div>
                    <el-button-group class="metric-adjutant__choices">
                        <el-button v-for="metric in metrics"
                                   :id="metric.type"
                                   class="metric-adjutant__choice"
                                   @click="setCurrentMetric(metric.type)"
                                   :type="currentMetricConfig.type === metric.type ? 'primary' : ''"
                                   :class="{ 'active' : currentMetricConfig.type === metric.type }">
                            {{ metric.name }}
                        </el-button>
                    </el-button-group>

                    <div v-if="issetMetric(currentMetricConfig.type)" class="metric-adjutant__options">
                        <div class="metric-adjutant__list">
                            <div class="metric-adjutant__field">
                                <div class="metric-adjutant__label">Версия</div>
                                <div class="metric-adjutant__value">
                                    <el-radio-group v-model="currentMetricConfig.result.version">
                                        <el-radio v-for="version in currentMetricConfig.versions"
                                                  :label="version.version">{{ version.name }}</el-radio>
                                    </el-radio-group>
                                </div>
                            </div>

                            <div v-for="setting in currentMetricSettings" class="metric-adjutant__field">
                                <template v-if="setting.type === 'string'">
                                    <div class="metric-adjutant__label">
                                        {{ setting.title }}
                                    </div>
                                    <div class="metric-adjutant__value">
                                        <el-input v-model="setting.value" type="text" :name="setting.label" />
                                    </div>
                                </template>
                                <template v-if="setting.type === 'boolean'">
                                    <div class="metric-adjutant__value">
                                        <el-checkbox v-model="setting.value" type="checkbox" :label="setting.title" :name="setting.label" />
                                    </div>
                                </template>
                            </div>

                            <div v-for="option in currentMetricConfig.options" class="metric-adjutant__field">
                                <div class="metric-adjutant__value">
                                    <template v-if="option.type === 'string'">
                                        <el-checkbox v-model="option.active" type="checkbox" :label="option.title" :name="option.active"></el-checkbox>

                                        <div class="metric-adjutant__field">
                                            <div v-if="option.active" class="metric-adjutant__label">
                                                {{ option.label }}
                                            </div>
                                            <div class="metric-adjutant__value">
                                                <el-input v-if="option.active"
                                                          v-model="option.value"
                                                          type="text"
                                                          :name="option.label" disabled />
                                            </div>
                                        </div>

                                    </template>
                                    <template v-if="option.type === 'boolean'">
                                        <el-checkbox v-model="option.active" type="checkbox" :label="option.title" :name="option.active" />
                                    </template>
                                </div>
                            </div>
                        </div>

                        <div class="metric-adjutant__add" style="display: none">
                            <el-button size="large" type="primary" :disabled="!isCurrentMetricValidate()">Добавить</el-button>
                        </div>
                    </div>

                </div>
            </div>
            <div class="metric-adjutant__footer">
                <div class="metric-adjutant__result">
                    {{ metricPoolConfig }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { onMounted, ref } from "vue"

    export default {
        name: "MetricAdjutant",
        setup() {
            const currentMetricConfig           = ref("")
            const metricPoolConfig              = ref("")
            const currentMetricSettings         = ref([
                {
                    'label'     : 'id',
                    'title'     : 'ID ресурса',
                    'type'      : 'string',
                    'default'   : '',
                    'value'     : '',
                    'required'  : true,
                },
                {
                    'label'     : 'load',
                    'title'     : 'Загружать при старте',
                    'type'      : 'boolean',
                    'default'   : true,
                    'value'     : true,
                    'required'  : false,
                },
                {
                    'label'     : 'debug',
                    'title'     : 'Включить вывод сообщений в консоль',
                    'type'      : 'boolean',
                    'default'   : false,
                    'value'     : false,
                    'required'  : false,
                }
            ])
            const metrics = [
                {
                    'name'  : 'Яндекс.метрика',
                    'type'  : 'yandex.metrika',
                    'vendor': 'yandex',
                    'versions' : [
                        {
                            'name'      : 'Новая (v2.0)',
                            'version'   : '2.0'
                        },
                        {
                            'name'      : 'Старая (v1.0)',
                            'version'   : '1.0'
                        }
                    ],
                    'defaultOptions'    : [
                        {
                            'label'         : 'clickmap',
                            'type'          : 'boolean',
                            'value'         : true
                        },
                        {
                            'label'         : 'trackLinks',
                            'type'          : 'boolean',
                            'value'         : true
                        },
                        {
                            'label'         : 'accurateTrackBounce',
                            'type'          : 'boolean',
                            'value'         : true
                        },
                    ],
                    'options'   : [
                        {
                            'label'         : 'trackHash',
                            'title'         : 'Отслеживание хеша в адресной строке',
                            'type'          : 'boolean',
                            'active'        : false,
                            'value'         : true,
                        },
                        {
                            'label'         : 'ecommerce',
                            'title'         : 'Электронная коммерция',
                            'type'          : 'string',
                            'active'        : false,
                            'value'         : 'dataLayer',
                        },
                        {
                            'label'         : 'webvisor',
                            'title'         : 'Вебвизор',
                            'type'          : 'boolean',
                            'active'        : false,
                            'value'         : true
                        }
                    ]
                },
                {
                    'name'  : 'Google Analytics',
                    'type'  : 'google.analytics',
                    'vendor': 'google',
                    'versions' : [
                        {
                            'name'      : 'Google Analytics v4',
                            'version'   : 'GA4'
                        },
                        {
                            'name'      : 'Universal Analytics',
                            'version'   : 'UA'
                        }
                    ],
                },
                {
                    'name'  : 'Google Tag Manager',
                    'type'  : 'google.tag.manager',
                    'vendor': 'google',
                    'versions' : [
                        {
                            'name'      : 'GTM',
                            'version'   : 'GTM'
                        },
                    ],
                },
            ]

            const issetMetric = (metricType) => {
                const metric = getMetric(metricType)
                return !!metric
            }

            const getMetric = (metricType) => {
                return metrics.filter(i => i.type === metricType)[0] ?
                    metrics.filter(i => i.type === metricType)[0] :
                    false
            }
            
            const setCurrentMetric = (metricType) => {
                const metric = getMetric(metricType)

                if (!!metric) {
                    currentMetricConfig.value = getMetricConfig(metric)
                }
            }

            const getMetricConfig = (metric) => {
                if (typeof metric !== "undefined" && typeof metric !== 'string') {
                    const options = {}

                    if (typeof metric.result === "undefined") {
                        metric.result = {
                            id          : '',
                            type        : metric.type,
                            version     : metric.versions[0].version,
                            debug       : false,
                            load        : true,
                        }
                    }


                    currentMetricSettings.value.forEach(setting => {
                        metric.result[setting.label] = setting.value
                    })

                    if (typeof metric.defaultOptions !== "undefined") {
                        metric.defaultOptions.forEach(option => {
                            options[option.label] = option.value
                        })
                    }

                    console.log(metric)


                    if (typeof metric.options !== "undefined") {
                        metric.options.filter(option => option.active === true).forEach(option => {
                            options[option.label] = option.value
                        })
                    }

                    if (Object.keys(options).length > 0) {
                        metric.result.options = options
                    }

                    return metric
                }

                return false
            }

            const getResultMetricSetting = (metric) => {
                if (typeof metric !== "undefined" && typeof metric !== 'string' && !!metric !== false) {
                    return metric.result
                }

                return false
            }

            const isCurrentMetricValidate = () => {
                return currentMetricSettings.value.filter(i => i.required === true).reduce((acc, cur) => {
                    return acc || cur.value !== ''
                }, false)
            }

            onMounted(() => {
                setCurrentMetric(metrics[0]['type'])
            })

            return {
                metrics,
                currentMetricConfig,
                metricPoolConfig,
                currentMetricSettings,
                issetMetric,
                getMetric,
                setCurrentMetric,
                getMetricConfig,
                getResultMetricSetting,
                isCurrentMetricValidate,
            }
        }
    }
</script>

<style lang="scss">
    .metric-adjutant {
        $p: &;

        &__wrapper {
        }
        &__inner {
            display: flex;
            flex-direction: column;
        }
        &__header {}
        &__body {
            display: flex;
        }
        &__footer {}
        &__title {
            font-size: 1.1rem;
        }
        &__code {
            display: flex;
            flex-direction: column;
            flex: 1;




            + #{$p}__settings {
                margin-left: 60px;
            }
        }
        &__settings {
            flex: 1;
        }
        &__options {
            margin-top: 1rem;
        }
        &__result {}
        &__list {}
        &__field {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: 1rem;

            &:last-child {
                margin-bottom: 0;
            }
        }
        &__label {
            font-size: 0.8rem;
            font-weight: 600;
            flex: 0 0 auto;
            width: 120px;
        }
        &__value {
            flex: 1;

            .el-checkbox {
                height: auto;
            }
        }
        &__add {
            margin-top: 2rem;
        }
    }
</style>