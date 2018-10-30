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

let WxPage = function (options) {
    let wxPage = options.wxPage;

    if (wxPage && wxPage.enableFormSubmit) {
        prependFunction(options, 'onFormSubmit', function (e) { form.add(e.detail.formId); });
        prependFunction(options, 'onUnload', function () { form.flush(); });
        prependFunction(options, 'onHide', function () { form.flush(); });
    }

    Page(options);
};

export default WxPage;
