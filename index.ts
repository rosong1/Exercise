export function _bind(fn, ctx, ...args) {
    return function(...innerArgs) {
        return fn.apply(ctx, args.concat(innerArgs));
    }
}

Function.prototype.myApply = function(ctx, args) {
    if (ctx === null) {
        ctx = Object.create(null);
    }
    if (typeof ctx !== 'object') {
        ctx = ctx.__proto__;
    }
    ctx.fn = this;
    const result = ctx.fn(...args);
    delete ctx.fn;
    return result;
}

Function.prototype.myCall = function(ctx, ...args) {
    const that = this;
    if (ctx === null) {
        ctx = Object.create(null);
    }
    if (typeof ctx !== 'object') {
        ctx = ctx.__proto__;
    }
    ctx.fn = that;
    const result = ctx.fn(...args);
    delete ctx.fn;
    return result;
}

export function _instanceOf(left, right) {
    const originProto = right.prototype;
    let _checkProto = left.__proto__;
    while (1) {
        if (_checkProto === originProto) return true;
        if (_checkProto === null) return false;
        _checkProto = _checkProto.__proto__;
    }
}

function myNew(superClass, ...args) {
    const instance = Object.create(superClass);
    const result = superClass.call(instance, ...args);
    return typeof result === 'object' && result || instance; 
}

function create1(obj) {
    const result = {};
    result.__proto__ = obj;
    return result;
}

function create2(proto) {
    function F() {}
    F.prototype = proto;
    return new F();
}
