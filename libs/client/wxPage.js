import client from 'client.js';
import form from 'form.js';

function prependFunction(options, name, func) {
    if (options[name]) {
        var s = options[name];
        options[name] = function (e) {
            func.call(this, e, name), s.call(this, e);
        };
    } else {
        options[name] = function (e) {
            func.call(this, e, name);
        };
    }
}

function a(options, name, func) {
    if (options[name]) {
        var s = options[name];
        options[name] = function (e) {
            var n = s.call(this, e);
            func.call(this, [e, n], name);
            return n;
        };
    } else {
        options[name] = function (e) {
            func.call(this, e, name);
        };
    }
}

let WxPage = function (options) {
    let wxPage = options.wxPage;

    if (wxPage && wxPage.enableFormSubmit) {
        prependFunction(options, 'onFormSubmit', function (e) { form.add(e.detail.formId); });
        prependFunction(options, 'onUnload', function () { form.flush(); });
        prependFunction(options, 'onHide', function () { form.flush(); });
    }

    if (wxPage && wxPage.enablePageRequest) {
        options.pageRequest = function (opts) {
            if (this.data.status == 'loading' || this.data.status == 'auth') {
                return;
            }

            let isUpdate = opts.isUpdate;
            if (isUpdate === null) {
                if (this.data.loadStatus == 'success') {
                    isUpdate = true;
                }
                else {
                    isUpdate = false;
                }
            }
            if (!isUpdate && this.data.loadStatus != 'loading') {
                this.setData({ loadStatus: 'loading' });
            }

            let successCallback = () => {
                client.request({
                    type: opts.request.type,
                    data: opts.request.data,
                    success: (res) => {
                        if (!isUpdate) {
                            this.setData({ loadStatus: 'success' });
                        }
                        opts.request.success && opts.request.success(res);
                    },
                    fail: (res) => {
                        if (!isUpdate) {
                            this.setData({ loadStatus: 'fail' });
                        }
                        opts.request.fail && opts.request.fail(res);
                    },
                    complete: (res) => {
                        wx.stopPullDownRefresh();
                        opts.request.complete && opts.request.complete(res);
                    }
                });
            };

            if (!opts.auth) {// 无需登录
                successCallback();
            } else {
                let func = opts.auth.type == 'full' ? 'fullAuth' : 'baseAuth';
                client[func]({
                    auth: (res) => {
                        if (!isUpdate) {
                            if (this.data.loadStatus != 'success') {
                                this.setData({ loadStatus: 'auth' });
                            }
                        }
                    },
                    success: (res) => {
                        opts.auth.success && opts.auth.success();
                        successCallback();
                    },
                    fail: (res) => {
                        if (!isUpdate) {
                            if (this.data.loadStatus != 'success') {
                                this.setData({ loadStatus: 'fail' });
                            }
                        }
                        opts.auth.fail && opts.auth.fail();
                        wx.stopPullDownRefresh();
                    }
                });
            }
        };
    }

    Page(options);
};

export default WxPage;
