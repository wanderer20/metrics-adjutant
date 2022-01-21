import GoogleAnalytics4 from "./googleAnalytics4";
import GoogleUniversalAnalytics from "./googleUniversalAnalytics";

import { mergeDeep } from "../../utils/tools";

/**
 * Класс по Google Analytics фабрика
 */
export default class GoogleAnalytics {
    metricVersions = {
        'GA4'   : GoogleAnalytics4,
        'UA'    : GoogleUniversalAnalytics
    }

    /**
     * Конструктор
     * @param props
     */
    constructor(props) {
        const defaultProps = {
            'type'      : 'google.analytics',
            'version'   : 'GA4',
            'vendor'    : 'google',
            'debug'     : false,
            'load'      : true,
            'options'   : {

            }
        }
        const metric = this.getGoogleAnalyticsClassByProps(mergeDeep(defaultProps, props))

        return metric ? metric : undefined
    }

    /**
     * Метод отдает класс метрики подходящий для версии аналитики
     * @param props
     * @return {boolean}
     */
    getGoogleAnalyticsClassByProps(props) {
        if (typeof props['version'] !== 'undefined') {
            return new this.metricVersions[props['version']](props)
        }
        return false
    }
}