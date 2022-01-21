import { logger } from "../utils/tools"

export default class BaseMetric {
    constructor(params) {
        this.id         = `${params['type']}-${params['id']}`
        this.type       = params['type']
        this.metricId   = params['id']
        this.version    = params['version']
        this.vendor     = params['vendor']
        this.options    = params['options']
        this.state      = {
            isLoaded        : false,
            isDebug         : typeof params['debug'] !== "undefined" ? params['debug'] : false,
            isLoadOnStart   : typeof params['load'] !== "undefined" ? params['load'] : true,
        }
        this.eventPool  = []
        this.obCounter  = undefined

        this.isDebug    = this.isDebug.bind(this)

        if (this.state.isLoadOnStart) {
            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - TRY INIT`)
            }
            this.init()
        }

    }

    attachEvents() {}
    detachEvents() {}

    init() {
        this.load()
        this.attachEvents()
    }
    load() {}
    isLoaded() {}
    do(method, params) {
        if (typeof this[method] === "function") {
            if (typeof params === "undefined") {
                return this[method]()
            }

            if (typeof params === "object") {
                return this[method](...Object.values(params))
            }

            return this[method](params)
        }
    }

    /**
     * Метод возвращает флаг на дебаг
     *
     * @returns {boolean}
     */
    isDebug() {
        return this.state.isDebug
    }

    destroy() {
        this.detachEvents()
    }

    getId() {
        return this.id
    }
    getType() {
        return this.type
    }
    getMetricId() {
        return this.metricId
    }
    getVersion() {
        return this.version
    }
    getOptions() {
        return this.options
    }

    /**
     * Метод добавляет событие в пул
     *
     * @param method
     * @param params
     */
    addEventPoolItem(method, ...params) {
        this.eventPool.push(({
            method      : method,
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
        if (this.isLoaded() && this.eventPool.length > 0) {
            this.eventPool.forEach((item, i, arr) => {
                const { method, params, isRealised } = item

                if (!isRealised) {
                    const result = this.do(method, params)

                    if (result !== false) {
                        arr[i].isRealised = true
                        // arr.splice(i, 1)
                    }
                }
            })
        }
    }
}