const extractDomain = (url) => url.split("//")[1].split("/")[0];

const getURL = () => location.href;

const getUniqURL = (url) => url.replace(/\w+\:\/\//, "").replace(/\/$/, "");
