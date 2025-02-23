const Get = (url) => {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With");
        xhr.withCredentials = true;
        //xhr.responseType = "blob";
        xhr.onload = () => {
            //resolve(new Blob([xhr.response], { type: xhr.response.type }));
            resolve(xhr.response);
        };
        xhr.onerror = (e) => {
            reject(e);
        };
        xhr.send();
    });
};

const get = (url, headers = {}) => PgManager.netReqSndr(url, "GET", headers);
