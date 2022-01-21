import BaseMetric from "../baseMetric";

import { mergeDeep, loadScript, logger } from "../../utils/tools";

/**
 * Класс для Google Tag Manager
 */
export default class GoogleTagManager extends BaseMetric {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        const defaultProps = {
            'type'      : 'google.tag.manager',
            'version'   : 'GTM',
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
     * Метод срабатываемый на загрузку gtm
     * @param event
     */
    onLoad(event) {
        this.state.isLoaded     = true
        this.obCounter          = window.dataLayer || undefined

        if (this.isDebug() && this.isLoaded()) {
            logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - STATUS: LOADED`)
        }
    }

    /**
     * Метод загружает скрипт Google Tag Manager (gtm.js)
     */
    load() {
        const self = this

        if (!self.isLoaded()) {
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
                'gtm.start' : new Date().getTime(),
                'event'     : 'gtm.js'
            })

            const scriptExtUrl = `https://www.googletagmanager.com/gtm.js?id=${ this.metricId }`

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
            if (typeof window.dataLayer !== "undefined" && Array.isArray(window.dataLayer) && window.dataLayer.length > 0) {
                window.dataLayer.forEach((item, index) => {
                    if (item['event'] === 'gtm.js'
                        || item['event'] === 'gtm.dom'
                        || item['event'] === 'gtm.load') {
                        this.state.isLoaded = true;
                    }
                })
            }
        }

        return this.state.isLoaded
    }
}