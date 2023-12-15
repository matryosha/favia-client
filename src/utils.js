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