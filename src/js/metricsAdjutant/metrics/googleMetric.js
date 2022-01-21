import GoogleAnalytics from "./google/googleAnalytics";
import GoogleAdWords from "./google/googleAdWords";
import GoogleOptimize from "./google/googleOptimize";
import GoogleTagManager from "./google/googleTagManager";

import { mergeDeep, logger } from "../utils/tools"

/**
 * Класс для Google фабрики
 */
export default class GoogleMetric {
    metricsTypes = {
        'google.analytics'      : GoogleAnalytics,
        'google.tag.manager'    : GoogleTagManager,
        'google.adwords'        : GoogleAdWords,
        'google.optimize'       : GoogleOptimize
    }

    /**
     * Конструктор
     *
     * @param props
     * @return {undefined}
     */
    constructor(props) {
        const defaultProps = {
            'vendor'    : 'google',
            'debug'     : false,
            'load'      : true,
        }
        const metric = this.getGoogleMetricByProps(mergeDeep(defaultProps, props))

        return metric ? metric : undefined
    }

    /**
     * Метод получает метрику из свойств
     * @param props
     */
    getGoogleMetricByProps(props) {
        if (typeof props.id !== 'undefined') {
            props = mergeDeep(props, this.getPropsByMetricId(props.id))
        }

        if (typeof props['type'] !== 'undefined' &&
            typeof this.metricsTypes[props['type']] !== "undefined") {
            return new this.metricsTypes[props['type']](props)
        }

        return false
    }

    /**
     * Метод возвращает свойства метрики исходя из индентификатора
     * @param id
     * @return {{}}
     */
    getPropsByMetricId(id) {
        const result = {}

        if (id.startsWith('G-')) {
            result['type']      = 'google.analytics'
            result['version']   = 'GA4'
        }

        if (id.startsWith('UA-')) {
            result['type']      = 'google.analytics'
            result['version']   = 'UA'
        }

        if (id.startsWith('GTM-')) {
            result['type']      = 'google.tag.manager'
            result['version']   = 'GTM'
        }

        if (id.startsWith('AW-')) {
            result['type']      = 'google.adwords'
            result['version']   = 'AW'
        }

        return result
    }
}