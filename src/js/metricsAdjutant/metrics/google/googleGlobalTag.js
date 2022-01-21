import BaseMetric from "../baseMetric";

import { mergeDeep, loadScript, logger } from "../../utils/tools";

/**
 * Класс для Google Global Tag
 */
export default class GoogleGlobalTag extends BaseMetric {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        const defaultProps = {
            'vendor'    : 'google',
            'debug'     : false,
            'load'      : true,
            'options'   : {

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
        this.do('config')
    }

    /**
     * Метод срабатываемый на загрузку аналитики
     * @param event
     */
    onLoad(event) {
        this.state.isLoaded     = true
        this.obCounter          = window.gtag || undefined

        if (this.isDebug() && this.isLoaded()) {
            logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - STATUS: LOADED`)
        }

        this.initAnalytics()

        this.eventPoolRealise()
    }

    /**
     * Метод загружает скрипт Google Global Tag (gtag.js)
     */
    load() {
        const self = this

        if (!self.isLoaded()) {
            window.gtag = window.gtag || function () {
                window.dataLayer = window.dataLayer || []
                window.dataLayer.push(arguments)
            }
            window.gtag('js', new Date())

            const scriptExtUrl = `https://www.googletagmanager.com/gtag/js?id=${ this.metricId }`

            loadScript(scriptExtUrl).then(() => {
                self.onLoad()
            })
        } else {
            self.onLoad()
        }
    }

    /**
     * Метод проверяет загружен ли скрипт на страницу
     *
     * @return {boolean}
     */
    isLoaded() {
        if (!this.state.isLoaded) {
            this.state.isLoaded = (
                typeof window.gtag !== "undefined" &&
                window.gtag.name === 'gtag'
            ) || this.state.isLoaded
        }

        return this.state.isLoaded
    }

    /**
     * Метод config из gtag.js
     *
     * @param params
     *
     * @return {boolean}
     *
     * @see https://developers.google.com/analytics/devguides/collection/gtagjs/pages#default_behavior
     */
    config(params) {
        const parameters = params || {}
        if (this.isLoaded()) {
            if (typeof params === "undefined") {
                this.obCounter('config', this.metricId)

                if (this.isDebug()) {
                    logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - config STATUS: SENDED`)
                }

            } else {
                this.obCounter('config', this.metricId, parameters)

                if (this.isDebug()) {
                    logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - config ${parameters} STATUS: SENDED`)
                }
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - config ${parameters} STATUS: FAILED`)
            }

            this.addEventPoolItem('config', params)
        }

        return false
    }

    /**
     * Метод event из gtag.js
     *
     * @param action
     * @param params
     *
     * @return {boolean}
     *
     * @see https://developers.google.com/analytics/devguides/collection/gtagjs/events#send_events
     */
    event(action, params) {
        const parameters = params || {}

        if (this.isLoaded()) {
            this.obCounter('event', action, parameters)

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - event ${action} ${parameters} STATUS: SENDED`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - event ${action} ${parameters} STATUS: FAILED`)
            }

            this.addEventPoolItem('event', action, params)
        }

        return false
    }

    /**
     * Метод set из gtag.js
     *
     * @param params
     *
     * @return {boolean}
     *
     * @see https://developers.google.com/analytics/devguides/collection/gtagjs/events#send_events
     */
    set(params) {
        const parameters = params || {}

        if (this.isLoaded()) {
            this.obCounter('set', parameters)

            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - set ${parameters} STATUS: SENDED`)
            }

            return true
        } else {
            if (this.isDebug()) {
                logger('error', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - set ${parameters} STATUS: FAILED`)
            }

            this.addEventPoolItem('set', params)
        }

        return false
    }
}