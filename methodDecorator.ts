function createMethodDecorator(enhancer) {
    return function (target, prop, descriptor) {
        // @method fn() {...}
        if (descriptor) {
            if (descriptor.value) {
                return {
                    value: enhancer(descriptor.value),
                    enumerable: false,
                    configurable: true,
                    writable: true,
                }
            }
            // @method fn = () => {...} babel only
            return {
                enumerable: false,
                configurable: true,
                writable: true,
                initializer() {
                    return enhancer(descriptor.initializer.call(this))
                }
            }
        }
        // @method fn = () => {...} typescript
        return createPropertyDecorator(enhancer).apply(this, arguments);
    }
}

function createPropertyDecorator(enhancer) {
    function addHiddenProp(object: any, propName: PropertyKey, value: any) {
        Object.defineProperty(object, propName, {
            enumerable: false,
            writable: true,
            configurable: true,
            value
        })
    }
    return function define(target, prop, descriptor) {
        Object.defineProperty(target, prop, {
            ...descriptor,
            configurable: true,
            enumerable: false,
            get() {
                return undefined
            },
            set(value) {
                addHiddenProp(this, prop, enhancer(value))
            }
        })
    }
}



export function debounce$(ms): any {
    return createMethodDecorator(function (fn) { return debounce(fn, ms) });
}

export function throttle$(ms): any {
    return createMethodDecorator(function (fn) { return throttle(fn, ms) });
}

function debounce(fn, ms = 0) {
    let timerId = null;
    let result;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            result = fn.call(this, ...args);
        }, ms);
        return result;
    }
}

function throttle(fn, ms) {
    let timerId = null;
    let result;
    return function (...args) {
        if (timerId) return result;
        timerId = setTimeout(() => {
            timerId = null;
            result = fn.call(this, ...args);
        }, ms);
        return result;
    }
}