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
        this.obMetrika  = undefined
        this.obCounter  = undefined

        this.isDebug    = this.isDebug.bind(this)

        if (this.state.isLoadOnStart) {
            if (this.isDebug()) {
                logger('info', `${this.getType()} v${this.getVersion()} ID: ${this.getMetricId()} - TRY CREATE`)
            }
            this.create()
        }

    }

    attachEvents() {}
    detachEvents() {}

    create() {
        this.load()
        this.attachEvents()
    }
    load() {}
    isLoaded() {}
    eventPoolRealise() {}

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
}