export function debounce(callback, wait) {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback(...args);
        }, wait);
    };
}

export function throwIfUndefinedOrNull(...values) {
    values.forEach(v => { if (v === undefined || v === null) throw Error('Some values were undefined or null') })
}

export function throwIfUndefinedOrNullWithKeys(obj) {
    const errorsKeys = []

    Object.keys(obj).forEach(k => {
        const v = obj[k]
        if (v === undefined || v === null)
            errorsKeys.push(k)
    })

    if (errorsKeys.length > 0 ) {
        console.error('Some values were null or undefined')
        console.error('Error keys: ', errorsKeys)
        throw new Error()
    }
}