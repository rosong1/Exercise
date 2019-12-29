export const classNames = (...args): string => {
    return args.reduce((acc, cur) => {
        if (typeof cur === undefined) return acc;
        if (typeof cur === null) return acc;
        if (typeof cur === 'string') return acc += ` ${cur}`;
        if (Array.isArray(cur)) return acc += classNames(...cur);
        if (typeof cur === 'object') { 
            for (const key in cur) {
                if (cur.hasOwnProperty(key) && cur[key]) acc += ` ${key}`;
            }
        };
        return acc;
    }, '');
}