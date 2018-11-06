let cache = {
    _caches: {},
    add: function (key, data) {
        this._caches[key] = {
            key: key,
            data: data,
            expire: 0
        };
    },
    get: function (key) {
        let d = this._caches[key];
        if (!d) {
            return null;
        }
        return d.data;
    }
};

export default cache;
