import metricsAdjutant from "./metricsAdjutant";

// TODO: polyfill String.prototype.startsWith

const ma = metricsAdjutant()
window.ma = ma
ma.createMetrics([
    {
        'id'        : 'G-12314',
        'type'      : 'google.analytics',
        'debug'     : true,
        'load'      : true,
    },
    // {
    //     'id'        : 123,
    //     'type'      : 'yandex.metrika',
    //     'version'   : '2.0',
    //     'vendor'    : 'yandex',
    //     'debug'     : true,
    //     'load'      : true,
    //     'options'   : {
    //     }
    // }
])

ma.push(123, 'reachGoal', {
    'goalName'      : 'phone_click',
    'goalParams'    : {
        'category'      : 'btn',
        'label'         : 'phone'
    }
})