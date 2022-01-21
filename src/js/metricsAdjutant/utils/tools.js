/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

/**
 * Метод для вывода в консоль
 * @param type
 * @param content
 */
export function logger(type, content) {
    switch (type) {
        case 'info':
            console.log('%c Info ' + `%c ${content}`, 'color: white; background-color: #2274A5', 'color: blue;');
            break;
        case 'error':
            console.log('%c Error ' + `%c ${content}`, 'color: white; background-color: #D33F49', 'color: red;');
            break;
        default:
            console.log(content)
    }
}

/**
 * Метод добавляет промис на загрузку скрипта
 * @param url
 * @param isAsync
 * @param place
 * @return {Promise<unknown>}
 */
export function loadScript(url, isAsync = true, place = 'head') {
    return new Promise(((resolve, reject) => {
        const head = document.getElementsByTagName('head')[0]
        const script = document.createElement('script')

        script.type = 'text/javascript'
        script.src = url

        if (isAsync) {
            script.async = isAsync
        }

        script.onload = resolve
        script.onerror = reject

        switch (place) {
            case "head":
                document.head.appendChild(script)
                break;
            case "body-start":
                document.body.insertBefore(script, document.body.firstChild)
                break;
            case "body-end":
                document.body.appendChild(script)
                break;
        }

    }))
}