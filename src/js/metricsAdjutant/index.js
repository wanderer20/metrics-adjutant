import YandexMetrika from "./metrics/yandexMetrika";

// https://tyapk.ru/blog/post/ym-and-gapi-counters
// TODO: https://www.kobzarev.com/technical-seo/yandex-metrika-lazy-load/

/**
 * Pattern: Ice Factory
 */
export default function metricsAdjutant() {
    const metrics = []
    
    const metricsTypes = {
        'yandex.metrika' : YandexMetrika
    }

    return Object.freeze({
        createMetric,
        createMetrics,
        getMetricById,
        getMetrics,
        removeMetric
    })

    /**
     * Метод создает метрику из объекта
     *
     * @param metricOptions
     */
    function createMetric(metricOptions) {
        if (typeof metricOptions['type'] !== 'undefined' && typeof metricsTypes[metricOptions['type']] !== "undefined") {
            const metric = new metricsTypes[metricOptions['type']](metricOptions)

            metrics.push(metric)

            setTimeout(() => {
                metric.sendTarget('ddd')
            },1500)
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
     * Метод получает метрику по id
     *
     * @param id
     * @returns {*[]}
     */
    function getMetricById(id) {
        return metrics.filter(metric => metric.id === id)
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