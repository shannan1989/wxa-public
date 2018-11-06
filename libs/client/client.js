import settings from '../../settings.js';
import cookie from 'cookie.js';
import cache from 'cache.js';

let client = {
    request: function (params) {
        let url = '', data = {}, header = {};

        if (params.url) {
            url = params.url;
        } else {
            url = (settings.debug && settings.debugRequestUrl) ? settings.debugRequestUrl : settings.requestUrl;
            url = url + '?' + params.type + '&app=' + settings.app + '&appVersion=' + settings.appVersion;
        }

        data._cookies = cookie.getAll();

        if (params.type) {
            data.type = params.type;
        }

        if (params.data) {
            for (let i in params.data) {
                data[i] = params.data[i];
            }
        }

        settings.debug && console.log(url + '&data=' + encodeURIComponent(JSON.stringify(data)));
        settings.debug && console.log('action', params.type, params.data);

        wx.request({
            url: url,
            data: data,
            header: header,
            method: params.method ? params.method : 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
                if (res.statusCode == 200) {
                    for (let key in res.data.caches) {
                        cache.add(key, res.data.caches[key]);
                    }
                    for (let key in res.data.cookies) {
                        cookie.add(key, res.data.cookies[key]);
                    }
                    params.success && params.success(res.data);
                } else {
                    params.fail && params.fail(res);
                }
            },
            fail: function (res) {
                params.fail && params.fail(res);
            },
            complete: function (res) {
                params.complete && params.complete(res);
            }
        });
    },
    fullAuth: function (options = {}, authInfo = true) {
        return this._auth(options, authInfo);
    },
    baseAuth: function (options) {
        return this._auth(options);
    },
    _auth: function (options, authInfo = false) {
        if (options.success) {
            this._addCallback(authInfo === false ? 'baseAuth' : 'fullAuth', options);
        }

        if (typeof authInfo == 'object') {
            this._doAuth('full', authInfo);
            return;
        }

        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: (res) => {
                            this._doAuth('full', res);
                        }
                    });
                } else {
                    if (authInfo === false) {
                        this._doAuth('base');
                    } else {
                        if (options.auth) {
                            options.auth();
                        } else {
                            this._triggerCallbacks('fullAuth', 'auth', null, false);
                        }
                    }
                }
            },
            fail: () => {
                if (authInfo === false) {
                    this._doAuth('base');
                } else {
                    if (options.auth) {
                        options.auth();
                    } else {
                        this._triggerCallbacks('fullAuth', 'auth', null, false);
                    }
                }
            }
        });
    },
    _doAuthing: 0,
    _doAuth: function (authType = 'base', authInfo = false) {

        if (authType == 'base') {
            if (this.baseAuthed()) {
                this._triggerCallbacks('baseAuth', 'success', this.getUser());
                return;
            }
        }

        if (authType == 'full') {
            if (this.fullAuthed()) {
                this._triggerCallbacks('baseAuth', 'success', this.getUser());
                this._triggerCallbacks('fullAuth', 'success', this.getUser());
                return;
            }
        }

        if (this._doAuthing >= (authType == 'base' ? 1 : 2)) {
            return;
        }
        this._doAuthing = (authType == 'base' ? 1 : 2);

        wx.login({
            success: (res) => {
                let data = {};
                data.code = res.code;
                data.authType = authType;
                if (typeof authInfo == 'object') {
                    data.authinfo = JSON.stringify(authInfo);
                }
                client.request({
                    type: 'Auth',
                    data: data,
                    success: (res) => {
                        this._doAuthing = 0;
                        if (res.errcode == 0) {
                            this._triggerCallbacks('baseAuth', 'success', this.getUser());
                            if (this.fullAuthed()) {
                                this._triggerCallbacks('fullAuth', 'success', this.getUser());
                            } else {
                                if (this._hasCallback('fullAuth')) {
                                    this.fullAuth();
                                }
                            }
                        } else {
                            this._triggerCallbacks('baseAuth', 'fail', res);
                            if (authType == 'full') {
                                this._triggerCallbacks('fullAuth', 'fail', res);
                            }
                        }
                    },
                    fail: (res) => {
                        this._doAuthing = 0;

                        this._triggerCallbacks('baseAuth', 'fail', res);
                        if (authType == 'full') {
                            this._triggerCallbacks('fullAuth', 'fail', res);
                        }
                    }
                });
            }
        });
    },
    getUser: function () {
        return cache.get('user');
    },
    baseAuthed: function () {
        let user = this.getUser();
        return user != null;
    },
    fullAuthed: function () {
        let user = this.getUser();
        return user && user.fullAuth ? true : false;
    },
    _callbacks: {},
    _addCallback: function (key, obj) {
        if (!this._callbacks[key]) {
            this._callbacks[key] = [];
        }
        this._callbacks[key].push(obj);
    },
    _hasCallback: function (key) {
        return !!(this._callbacks[key]) && this._callbacks[key].length > 0;
    },
    _triggerCallbacks: function (key, callbackType, data, clear = true) {
        if (!this._callbacks[key]) {
            return;
        }

        if (callbackType) {
            for (let obj of this._callbacks[key]) {
                if (obj[callbackType]) {
                    obj[callbackType](data);
                }
            }
        }

        if (clear) {
            this._callbacks[key] = [];
        }
    }

};

export default client;
