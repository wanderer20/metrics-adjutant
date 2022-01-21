import BaseMetric from "../baseMetric";
import { mergeDeep, loadScript, logger } from "../../utils/tools";

/**
 * Класс для Google Universal Analytics
 */
export default class GoogleUniversalAnalytics extends BaseMetric {
    /**
     * Конструктор
     * @param props
     */
    constructor(props) {
        const defaultProps = {
            'type'      : 'google.analytics',
            'version'   : 'UA',
            'vendor'    : 'google',
            'debug'     : false,
            'load'      : true,
            'options'   : {
                'tracker'   : undefined,
                'create'    : 'auto',
                'pageview'  : true,
            }
        }

        super(mergeDeep(defaultProps, props))

        this.onLoad     = this.onLoad.bind(this)
        this.isLoaded   = this.isLoaded.bind(this)
    }

    /**
     * Инициализация метрики
     */
    initAnalytics() {
        this.do('create', this.options.create)
        if (this.options.pageview) {
            this.do('send', 'pageview')
        }
    }

    /**
     * Метод срабатываемый на загрузку аналитики
     * @param event
     */
    onLoad(event) {
        this.state.isLoaded = true
        this.obCounter = window.ga || undefined

        if (this.isDebug() && this.isLoaded()) {
            logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - STATUS: LOADED`)
        }

        this.initAnalytics()

        this.eventPoolRealise()
    }

    /**
     * Метод загружает скрипт Universal Analytics (analytics.js)
     */
    load() {
        const self = this

        if (!self.isLoaded()) {
            window['GoogleAnalyticsObject'] = 'ga';
            window.ga = window.ga || function () {
                window.ga.q = window.ga.q || []
                window.ga.q.push(arguments)
            };
            window.ga.l = 1 * new Date();

            const scriptExtUrl = 'https://www.google-analytics.com/analytics.js'

            loadScript(scriptExtUrl).then(() => {
                self.onLoad()
            })
        } else {
            self.onLoad()
        }
    }


    /**
     * Метод добавляет трекер, если он есть
     *
     * @param method
     *
     * @return {*}
     */
    tracker(method) {
        return typeof this.options.tracker === "undefined" || this.options.tracker === '' ?
            method :
            `${this.options.tracker}.${method}`
    }

    /**
     * Метод проверяет загружен ли скрипт на страницу
     *
     * @returns {boolean}
     */
    isLoaded() {
        if (!this.state.isLoaded) {
            this.state.isLoaded = (
                typeof window.ga !== "undefined" &&
                typeof window.ga.create !== "undefined"
            ) || this.state.isLoaded
        }

        return this.state.isLoaded
    }

    /**
     * Метод create из GA
     *
     * @param fieldsObject
     *
     * @return {boolean}
     *
     * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference?hl=ru#create
     */
    create(fieldsObject) {
        const defaultFields = typeof this.options.tracker === "undefined" || this.options.tracker === '' ?
            {} :
            {
                'name' : this.options.tracker
            } ;
        const params = typeof fieldsObject === 'object' ? mergeDeep(defaultFields, fieldsObject) : fieldsObject

        if (this.isLoaded()) {
            this.obCounter('create', this.metricId, params)

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - create ${fieldsObject.toString()} STATUS: SENDED`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - create ${fieldsObject.toString()} STATUS: FAILED`)
            }

            this.addEventPoolItem('create', params)
        }

        return false
    }


    /**
     * Метод send из GA
     *
     * @param fieldsObject
     *
     * @return {boolean}
     *
     * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/sending-hits?hl=ru#the_send_method
     */
    send(fieldsObject) {
        if (this.isLoaded()) {
            this.obCounter(this.tracker('send'), fieldsObject)

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - SEND ${fieldsObject} STATUS: SENDED`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - SEND ${fieldsObject} STATUS: FAILED`)
            }

            this.addEventPoolItem('send', fieldsObject)
        }

        return false
    }

    /**
     * Метод set из GA
     *
     * @param fieldsObject
     *
     * @return {boolean}
     *
     * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference?hl=ru#set
     */
    set(fieldsObject) {
        if (this.isLoaded()) {
            this.obCounter(this.tracker('set'), fieldsObject)

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - SET ${fieldsObject} STATUS: SENDED`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - SET ${fieldsObject} STATUS: FAILED`)
            }

            this.addEventPoolItem('set', fieldsObject)
        }

        return false
    }

    /**
     * Метод require из GA
     *
     * @param pluginName
     * @param pluginOptions
     *
     * @return {boolean}
     *
     * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference?hl=ru#require
     */
    require(pluginName, pluginOptions = {}) {
        if (this.isLoaded()) {
            this.obCounter(this.tracker('require'), pluginName, pluginOptions)

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - require ${pluginName} STATUS: SENDED`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - require ${pluginName} STATUS: FAILED`)
            }

            this.addEventPoolItem('set', pluginName, pluginOptions)
        }

        return false
    }

    /**
     * Метод provide из GA
     *
     * @param pluginName
     * @param pluginConstuctor
     *
     * @return {boolean}
     *
     * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference?hl=ru#provide
     */
    provide(pluginName, pluginConstuctor) {
        if (this.isLoaded()) {
            this.obCounter('provide', pluginName, pluginConstuctor)

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - provide ${pluginName} STATUS: SENDED`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - provide ${pluginName} STATUS: FAILED`)
            }

            this.addEventPoolItem('provide', pluginName, pluginConstuctor)
        }

        return false
    }

    /**
     * Метод remove из GA
     *
     * @return {boolean}
     *
     * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference?hl=ru#remove
     */
    remove() {
        if (this.isLoaded()) {
            this.obCounter(this.tracker('remove'))

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - remove STATUS: SENDED`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - remove STATUS: FAILED`)
            }

            this.addEventPoolItem('remove')
        }

        return false
    }
}