import BaseMetric from "./baseMetric";
import { mergeDeep, logger } from "../utils/tools"

export default class YandexMetrika extends BaseMetric{
    constructor(props) {
        const defaultProps  = {
            'type'      : 'yandex.metrika',
            'version'   : '2.0',
            'vendor'    : 'yandex',
            'debug'     : false,
            'load'      : true,
            'options'   : {
                'clickmap'              : true,
                'trackLinks'            : true,
                'accurateTrackBounde'   : true
            }
        }
        super(mergeDeep(defaultProps, props))


        this.isLoaded       = this.isLoaded.bind(this)
        this.isExists       = this.isExists.bind(this)
    }

    /**
     * Метод срабатываемый на загрузку метрики
     * @param event
     */
    onLoad(event) {
        this.state.isLoaded = true
        this.obCounter = window[`yaCounter${this.metricId}`] || undefined
        this.obMetrika = window.Ya &&
            (
                window.Ya.Metrika ||
                window.Ya.Metrika2
            ) || undefined

        if (this.isDebug()) {
            logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - STATUS: LOADED`)
        }
    }

    /**
     * Метод добавляет события
     */
    attachEvents() {
        this.onLoad = this.onLoad.bind(this)

        if (this.version === '2.0') {
            document.addEventListener(`yacounter${this.metricId}inited`, this.onLoad)
        }
    }

    /**
     * Метод убирает события
     */
    detachEvents() {
        if (this.version === '2.0') {
            document.removeEventListener(`yacounter${this.metricId}inited`, this.onLoad)
        }
    }


    /**
     * Метод загружает скрипт метрики
     */
    load() {
        const self = this

        if (!self.isLoaded() && typeof self.metricId !== "undefined") {
            const script        = document.createElement('script')
            const firstScript   = document.getElementsByTagName('script')[0]
            const urlVersion    = self.version === '2.0' ?
                'https://mc.yandex.ru/metrika/tag.js' :
                'https://mc.yandex.ru/metrika/watch.js'

            self.onLoad         = self.onLoad.bind(self)

            script.type = "text/javascript";
            script.src = true;
            script.src = urlVersion;

            const addScriptOnPage = function() {
                firstScript.parentNode.insertBefore(script, firstScript)

                if (self.isDebug()) {
                    logger('info', `${self.getType()} v${self.getVersion()} - STATUS: SCRIPT ADDED`)
                }
            }

            if (self.version === '2.0') {
                // Настройки скрипта для версии метрики 2.0
                window.ym = window.ym || function() {
                    window.ym.a = window.ym.a || []
                    window.ym.a.push(arguments)
                };
                window.ym.l = 1 * new Date();

                const initOptionsV2 = mergeDeep(
                    self.options,
                    {
                        'triggerEvent'  : true
                    }
                );

                window.ym(self.metricId, "init", initOptionsV2)
            } else {
                // Настройки скрипта для версии метрики 1.0
                const initOptionsV1 = mergeDeep(
                    self.options,
                    {
                        'id'            : self.metricId,
                    }
                )

                const callbacks = 'yandex_metrika_callbacks'

                window[callbacks] = window[callbacks] || []
                window[callbacks].push(function () {
                    try {
                        window[`yaCounter${self.metricId}`] = new window.Ya.Metrika(initOptionsV1)
                        self.onLoad()
                    } catch (e) { }
                })
            }

            if (self.version === '1.0' && window.opera == "[object Opera]") {
                document.addEventListener("DOMContentLoaded", addScriptOnPage, false)
            } else {
                addScriptOnPage()
            }
        }
    }

    /**
     * Метод проверяет загружен ли скрипт на страницу
     *
     * @returns {boolean}
     */
    isLoaded() {
        if (!this.state.isLoaded) {
            this.state.isLoaded = (
                typeof window.Ya !== "undefined" &&
                (
                    typeof window.Ya.Metrika !== "undefined" ||
                    typeof window.Ya.Metrika2 !== "undefined"
                )
            ) || this.state.isLoaded
        }

        return this.state.isLoaded
    }

    /**
     * Метод проверят на существование счетчика на странице
     *
     * @returns {boolean}
     */
    isExists() {
        if (this.isLoaded()) {
            const obYandexMetrika = window.Ya &&
                (
                    window.Ya.Metrika ||
                    window.Ya.Metrika2
                ) || undefined

            if (typeof obYandexMetrika !== "undefined") {
                const counters = obYandexMetrika.counters()
                if (counters.length !== 0) {
                    return counters.some(el => el.id === this.metricId)
                }
            }
        }

        return false
    }

    /**
     * Метод отправляет цель в метрику
     *
     * @param goalName
     * @param goalParams
     * @param callback
     */
    sendTarget(goalName, goalParams = {}, callback) {
        if (this.isLoaded() && this.isExists() && typeof this.obCounter !== "undefined") {
            this.obCounter.reachGoal(goalName, goalParams, callback)

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - SEND GOAL "${goalName}" STATUS: SENDED`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - SEND GOAL "${goalName}" STATUS: FAILED`)
            }

            this.eventPool.push(({
                goalName    : goalName,
                goalParams  : goalParams,
                callback    : callback,
                isRealised  : false
            }))

            if (this.isDebug()) {
                logger('info', `${this.getType()} add event with name - "${goalName}" to pool`)

                console.group(`Event "${goalName}" details`)
                console.log(`goalName: ${goalName}`)
                console.log('goalParams:')
                console.log(goalParams)
                if (typeof callback !== "undefined") {
                    console.log('callback:')
                    console.log(callback)
                }
                console.groupEnd()
            }
        }

        return false
    }

    eventPoolRealise() {
        if (this.isLoaded() && this.isExists() && this.eventPool.length > 0) {
            let isTryRealiseAllEvents = false
            while (!isTryRealiseAllEvents) {
                // TODO: доделать
            }
        }
    }
}