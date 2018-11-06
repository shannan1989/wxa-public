let cookie = {
    _cookies: {},
    add: function (key, value) {
        this._cookies[key] = value;
    },
    getAll:function(){
        return this._cookies;
    }
};

export default cookie;
