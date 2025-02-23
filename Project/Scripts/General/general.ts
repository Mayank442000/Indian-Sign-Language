// @ts-nocheck

const dc = document,
    wn = window;

const gebi = (id, DOM = dc) => DOM.getElementById(id);

const gebc = (className, n = false, DOM = dc): HTMLElement[] => {
    let els = Array.from(DOM.getElementsByClassName(className));
    if (n !== false) return els.at(n);
    return els;
};

const gebt = (tagName, n = false, DOM = dc) => {
    let els = Array.from(DOM.getElementsByTagName(tagName));
    if (n !== false) return els.at(n);
    return els;
};

const gebq = (query, n = false, DOM = dc) => {
    // console.log(query, n, DOM);
    let els = Array.from(DOM.querySelectorAll(query));
    if (n !== false) return els.at(n);
    return els;
};

const gebqs = (query, DOM = dc) => DOM.querySelector(query);

const cons = console.log;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onlyFloat2Int = (n, mul = 1000000000000000) => {
    let nt = parseInt(n);
    return Math.floor((n - nt) * mul) + nt;
};

const dtStamp = (typ = 0) => {
    if (typ === 0) return new Date().toGMTString().split(" GMT")[0];
    return new Date();
};

const eventPresent = (type, func, domEle = dc) =>
    getEventListeners(domEle)
        [type].map((x) => x.listener)
        .includes(func);

const setEvent = (type, func, domEle: HTMLElement = dc, stopPropagation = false, optns = { passive: true }) => {
    try {
        if (!eventPresent(type, func, domEle)) {
            if (stopPropagation) {
                const custEvent = (event) => {
                    func(event);
                    event.stopPropagation();
                };
                return domEle.addEventListener(type, custEvent, optns);
            } else return domEle.addEventListener(type, func, optns);
        }
    } catch (e) {
        return domEle.addEventListener(type, func, optns);
    }
};

// var exports = {};
// var require = (a) => {};

//const arr2str = (arr) => (Array.isArray(arr) ? arr.map(arr2str).join(":") : String(arr)); moved to data.js
//module.exports = { sleep: sleep, cons: cons };
export { dc, wn, gebi, gebc, gebt, gebq, gebqs, onlyFloat2Int, dtStamp, eventPresent, setEvent, cons, sleep };
