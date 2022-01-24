/**
 * Copyright (c) Oleg Biryukov <>
 */
import YandexMetric from "./metrics/yandexMetric";
import GoogleMetric from "./metrics/googleMetric";

// https://tyapk.ru/blog/post/ym-and-gapi-counters
// TODO: https://www.kobzarev.com/technical-seo/yandex-metrika-lazy-load/

/**
 * Pattern: Ice Factory
 */
export default function metricsAdjutant() {
    const metrics = []
    
    const metricsTypes = {
        'yandex.metrika' : YandexMetric,
        'google.analytics' : GoogleMetric,
        'google.tag.manager' : GoogleMetric,
        'google.adwords' : GoogleMetric,
    }

    return Object.freeze({
        createMetric,
        createMetrics,
        getMetricById,
        getMetrics,
        removeMetric,
        push,
    })

    /**
     * Метод создает метрику из объекта
     *
     * @param metricOptions
     */
    function createMetric(metricOptions) {
        if (typeof metricOptions['type'] !== 'undefined' &&
            typeof metricsTypes[metricOptions['type']] !== "undefined") {
            const metric = new metricsTypes[metricOptions['type']](metricOptions)

            // console.log(typeof metric)
            // console.log(metric)
            // metric.do('send', {'da': 'da'})
            if (typeof metric !== "undefined") {
                metrics.push(metric)
            }
        }
    }

    /**
     * Метод создает метрики из массива объектов
     *
     * @param metricsOptionsArray
     */
    function createMetrics(metricsOptionsArray) {
        metricsOptionsArray.forEach(metricOptions => createMetric(metricOptions))
    }

    /**
     * Исполнение методов внутри метрик
     *
     * @param id - id метрики
     * @param method - ее метод
     * @param params - параметры функции
     */
    function push(id, method, params) {
        const metric = getMetricById(id)

        if (metric !== false) {
            metric.do(method, params)
        }
    }

    /**
     * Метод получает метрику по id (внутреннему),
     * если не найдет - осуществит поиск по metricId
     *
     * @param id - связка из `${type}-${id}`
     * @returns {*}
     */
    function getMetricById(id) {
        const main = metrics.filter(metrics => metrics.id === id)
        const result = main.length === 0 ? getMetricByMetricId(id) : main[0]
        return typeof result !== "undefined" ? result : false
    }

    /**
     * Метод получает метрику по ее metricId
     *
     * @param metricId
     * @return {*}
     */
    function getMetricByMetricId(metricId) {
        const result = metrics.filter(metric => metric.metricId === metricId)[0]
        return typeof result !== "undefined" ? result : false
    }

    /**
     * Метод получает список метрик
     *
     * @returns {[]}
     */
    function getMetrics() {
        return metrics
    }

    /**
     * Метод удаляет метрику из списка
     *
     * @param id
     * @returns {boolean}
     */
    function removeMetric(id) {
        const metricIndex = metrics.findIndex(metric => metric.id === id)

        if (metricIndex > -1) {
            metrics[metricIndex].destroy()
            metrics.splice(metricIndex, 1)
            return true
        }

        return false
    }
}

module.exports = metricsAdjutant
module.exports.default = metricsAdjutant
module.exports.metricsAdjutant = metricsAdjutant
module.exports.__esModule = true