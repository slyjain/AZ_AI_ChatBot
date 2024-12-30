
(function () {
    console.log("Running inject.js")
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener("load", function () {
            const data = {
                url: this._url,
                status: this.status,
                response: this.responseText
            }
            const ifQuestion = data.url.split("/");
            const qid = ifQuestion[ifQuestion.length - 1];
            if (!isNaN(qid) && qid.trim() !== "") {
                console.log("qid contains all digits", qid);
                window.dispatchEvent(new CustomEvent("xhrDataFetched", { detail: data }))
            } else {
                console.log("qid does not contain all digits");
            }


        })
        return originalSend.apply(this, arguments);
    }
})();