import BaseMetric from "./baseMetric";
import { mergeDeep, logger } from "../utils/tools"

/**
 * Класс по Яндекс.Метрики
 */
export default class YandexMetrika extends BaseMetric {
    /**
     * Конструктор
     * @param props
     */
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


        this.obMetrika      = undefined

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

        if (this.isDebug() && this.isLoaded() && this.isExists()) {
            logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - STATUS: LOADED`)
        }

        this.eventPoolRealise()
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
                    logger('info', `${self.getType()} v${self.getVersion()} - SCRIPT [${urlVersion}] STATUS: ADDED`)
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
     * Отслеживание загрузки файлов с заданными расширениями.
     *
     * @param extensions Расширение имени файла, заданное в виде строки или список расширений, указанный в виде массива строк
     * @return { boolean }
     *
     * @see https://yandex.ru/support/metrica/objects/addfileextension.html
     */
    addFileExtension(extensions) {
        if (this.isLoaded() && this.isExists() && typeof this.obCounter !== "undefined") {
            if (this.version === '2.0') {
                window.ym(this.metricId, 'addFileExtension', extensions)
            } else {
                this.obCounter.addFileExtension(extensions)
            }

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - ADD FILE EXTENSION STATUS: SUCCESS`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - ADD FILE EXTENSION STATUS: FAILED`)
            }

            this.addEventPoolItem('addFileExtension', extensions)
        }

        return false
    }

    /**
     * Отправка информации о переходе по внешней ссылке
     *
     * @param url
     * @param options
     * @returns { boolean }
     *
     * @see https://yandex.ru/support/metrica/objects/extlink.html
     */
    extLink(url, options) {
        if (this.isLoaded() && this.isExists() && typeof this.obCounter !== "undefined") {
            if (this.version === '2.0') {
                window.ym(this.metricId, 'extLink', url, options)
            } else {
                this.obCounter.extLink(url, options)
            }

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - EXTLINK STATUS: SUCCESS`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - EXTLINK STATUS: FAILED`)
            }

            this.addEventPoolItem('extLink', url, options)
        }

        return false
    }

    /**
     * Отправка информации о загрузке файла
     *
     * @param url
     * @param options
     *
     * @return {boolean}
     *
     * @see https://yandex.ru/support/metrica/objects/file.html
     */
    file(url, options) {
        if (this.isLoaded() && this.isExists() && typeof this.obCounter !== "undefined") {
            if (this.version === '2.0') {
                window.ym(this.metricId, 'file', url, options)
            } else {
                this.obCounter.file(url, options)
            }

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - FILE STATUS: SUCCESS`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - FILE STATUS: FAILED`)
            }

            this.addEventPoolItem('file', url, options)
        }

        return false
    }

    /**
     * Получение идентификатора посетителя сайта, заданного Яндекс.Метрикой.
     *
     * @return { boolean|string|int }
     *
     * @see https://yandex.ru/support/metrica/objects/get-client-id.html
     */
    getClientID() {
        if (this.isLoaded() && this.isExists() && typeof this.obCounter !== "undefined") {
            let result;

            if (this.version === '2.0') {
                window.ym(this.metricId, 'getClientID', (clientID) => {
                    result = clientID
                })
            } else {
                result = this.obCounter.getClientID()
            }

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - GETCLIENTID STATUS: SUCCESS`)
            }

            return result
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - GETCLIENTID STATUS: FAILED`)
            }

            this.addEventPoolItem('getClientID')
        }

        return false
    }

    /**
     * Отправка данных о просмотре
     *
     * @param url
     * @param options
     *
     * @return {boolean}
     *
     * @see https://yandex.ru/support/metrica/objects/hit.html
     */
    hit(url, options) {
        if (this.isLoaded() && this.isExists() && typeof this.obCounter !== "undefined") {
            if (this.version === '2.0') {
                window.ym(this.metricId, 'hit', url, options)
            } else {
                this.obCounter.hit(url, options)
            }

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - HIT STATUS: SUCCESS`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - HIT STATUS: FAILED`)
            }

            this.addEventPoolItem('hit', url, options)
        }

        return false
    }

    /**
     * Передача информации о том, что визит пользователя не является отказом
     *
     * @param options
     *
     * @return {boolean}
     *
     * @see https://yandex.ru/support/metrica/objects/notbounce.html
     */
    notBounce(options) {
        if (this.isLoaded() && this.isExists() && typeof this.obCounter !== "undefined") {
            if (this.version === '2.0') {
                window.ym(this.metricId, 'notBounce', options)
            } else {
                this.obCounter.notBounce(options)
            }

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - NOTBOUNCE STATUS: SUCCESS`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - NOTBOUNCE STATUS: FAILED`)
            }

            this.addEventPoolItem('notBounce', options)
        }

        return false
    }

    /**
     * Передача произвольных параметров визита
     *
     * @param parameters
     *
     * @return {boolean}
     *
     * @see https://yandex.ru/support/metrica/objects/params-method.html
     */
    params(parameters) {
        if (this.isLoaded() && this.isExists() && typeof this.obCounter !== "undefined") {
            if (this.version === '2.0') {
                window.ym(this.metricId, 'params', parameters)
            } else {
                this.obCounter.params(parameters)
            }

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - PARAMS STATUS: SUCCESS`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - PARAMS STATUS: FAILED`)
            }

            this.addEventPoolItem('params', parameters)
        }

        return false
    }

    /**
     * Метод отправляет цель в метрику
     *
     * @param goalName
     * @param goalParams
     * @param callback
     *
     * @see https://yandex.ru/support/metrica/objects/reachgoal.html
     */
    reachGoal(goalName, goalParams = {}, callback) {
        if (this.isLoaded() && this.isExists() && typeof this.obCounter !== "undefined") {
            if (this.version === '2.0') {
                window.ym(this.metricId, 'reachGoal', goalName, goalParams, callback)
            } else {
                this.obCounter.reachGoal(goalName, goalParams, callback)
            }

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - REACH GOAL "${goalName}" STATUS: SENDED`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - REACH GOAL "${goalName}" STATUS: FAILED`)
            }

            this.addEventPoolItem('reachGoal', goalName, goalParams, callback)
        }

        return false
    }

    /**
     * Передача идентификатора посетителя сайта, заданного владельцем сайта
     *
     * @param id
     *
     * @return {boolean}
     *
     * @see https://yandex.ru/support/metrica/objects/set-user-id.html
     */
    setUserID(id) {
        if (this.isLoaded() && this.isExists() && typeof this.obCounter !== "undefined") {
            if (this.version === '2.0') {
                window.ym(this.metricId, 'setUserID', id)
            } else {
                this.obCounter.setUserID(id)
            }

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - setUserID STATUS: SUCCESS`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - setUserID STATUS: FAILED`)
            }

            this.addEventPoolItem('setUserID', id)
        }

        return false
    }

    /**
     * Передача произвольных параметров посетителей сайта
     *
     * @param parameters
     *
     * @return {boolean}
     *
     * @see https://yandex.ru/support/metrica/objects/user-params.html
     */
    userParams(parameters) {
        if (this.isLoaded() && this.isExists() && typeof this.obCounter !== "undefined") {
            if (this.version === '2.0') {
                window.ym(this.metricId, 'userParams', parameters)
            } else {
                this.obCounter.userParams(parameters)
            }

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - userParams STATUS: SUCCESS`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - userParams STATUS: FAILED`)
            }

            this.addEventPoolItem('userParams', parameters)
        }

        return false
    }

    /**
     * Метод добавляет событие в пул
     *
     * @param method
     * @param params
     */
    addEventPoolItem(method, ...params) {
        this.eventPool.push(({
            method      : 'reachGoal',
            params      : params,
            isRealised  : false
        }))

        if (this.isDebug()) {
            logger('info', `${this.getType()} v${this.getVersion()} add event ${method} to pool`)

            console.group(`Event "${method}" details`)
                for (let param of params) {
                    console.log(param)
                }
            console.groupEnd()
        }
    }

    /**
     * Метод проходится по пулу событий, которые не были отправлены и пробует отправить
     */
    eventPoolRealise() {
        if (this.isLoaded() && this.isExists() && this.eventPool.length > 0) {
            this.eventPool.forEach((item, i, arr) => {
                const { method, params, isRealised } = item

                if (!isRealised) {
                    const result = this[method](...params)

                    if (result !== false) {
                        arr[i].isRealised = true
                        arr.splice(i, 1)
                    }
                }
            })
        }
    }
}