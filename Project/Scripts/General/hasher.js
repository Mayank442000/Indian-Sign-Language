const rand = (n) => {
    n = Math.E * (n + Math.PI);
    return onlyFloat2Int(Math.abs(Math.sin(n)));
};

const Hash = (s, ln = 8) => {
    if (Array.isArray(s)) s = s.map(arr2str).join(String(ln));
    else if (typeof s === "object") s = JSON.stringify(s);
    s = String(s) + String(ln);
    let ls = s.length;
    s = s.padStart(ls + (ls % ln) + 1, s.repeat(Math.ceil(ln / ls))).repeat(ln);
    let u16 = strC_u16c(s);
    let u16ln = u16.length;
    //console.log("u16 : ", u16, "u16ln : ", u16ln, "s : ", s, "ln : ", ln);
    let i = -1,
        shft = (u16ln % (ln - 1)) + 1;
    let r16 = new Uint16Array(ln);
    while (++i < u16ln) r16[(i + r16[(i + shft) % ln]) % ln] ^= u16[i] ^ rand(i) % 256;
    //console.log("r16 : ", r16);
    return u16c_strC(r16);
};
const strHash = Hash;
