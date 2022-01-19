import metricsAdjutant from "./metricsAdjutant";

const ma = metricsAdjutant()
ma.createMetrics([
    {
        'id'        : 123,
        'type'      : 'yandex.metrika',
        'version'   : '2.0',
        'vendor'    : 'yandex',
        'debug'     : true,
        'load'      : true,
        'options'   : {
        }
    }
])