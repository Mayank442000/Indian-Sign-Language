const createElement = (tagName, { id, className, style, innerText, src, href, value, onClick, type, childen } = {}) => {
    const element = document.createElement(tagName);
    if (id) element.id = id;
    if (className) element.className = className;
    if (style) element.className = className;
    if (innerText) element.innerText = innerText;
    if (src) element.src = src;
    if (href) element.href = href;
    if (value) element.value = value;
    if (onClick) element.onclick = onClick;
    if (type) element.type = type;
    if (childen) {
        if (!Array.isArray(childen)) Array(childen);
        element.append(childen);
    }
    return element;
};

const createButt = ({ id, className, style, innerText, src, href, value, onClick, type, childen }) =>
    createElement("button", { id, className, style, innerText, src, href, value, onClick, type, childen });
