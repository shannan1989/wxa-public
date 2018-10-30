import settings from '../../settings.js';

let client = {
    request: function (params) {
        let url = '', data = {}, header = {};

        if (params.url) {
            url = params.url;
        } else {
            url = (settings.debug && settings.debugRequestUrl) ? settings.debugRequestUrl : settings.requestUrl;
            url = url + '?' + params.type + '&app=' + settings.app + '&appVersion=' + settings.appVersion;
        }

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
    }
};

export default client;
