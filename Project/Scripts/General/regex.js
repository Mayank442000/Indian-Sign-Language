const str2regstr = (s) => {
    const rplcmnt = [
        ["\\", "\\\\"],
        [".", "\\."],
        ["/", "\\/"],
    ];
    for (let replc of rplcmnt) s = s.replaceAll(replc[0], replc[1]);
    return s;
};
