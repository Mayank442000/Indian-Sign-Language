const simpleResolver = (...args: Array<string>) => {
    let pathArr = args.map((x) => x.split("/")).flat();
    let path = [],
        paLn = pathArr.length,
        pathPref = "";
    if (pathArr[0][0] === "") pathPref = "/";
    else if (pathArr[0][0] !== ".") pathPref = pathArr[0] + "/";
    for (let i = 1; i < paLn; ++i) {
        // @ts-ignore
        if (pathArr[i][0] !== ".") path.push(pathArr[i]);
        else if (pathArr[i] === "..") path.pop();
    }
    return pathPref + path.join("/");
};

export { simpleResolver };
