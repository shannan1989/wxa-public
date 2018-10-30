import client from 'client.js';
import settings from '../../settings.js';

let formIds = [], times = 0, storageKey = '_formTimes';

wx.getStorage({
    key: storageKey,
    success: function (res) { times = res.data; }
});

let form = {
    add: function (formId) {
        if (formIds.indexOf(formId) < 0) {
            formIds.push(formId);
            times++;
            if (times <= 4) {
                this.flush();
            }

            wx.setStorage({
                key: storageKey,
                data: times
            });
        }

        if (formIds.length > 10) {
            this.flush();
        }
    },
    flush: function () {
        if (formIds.length > 0) {
            settings.debug && console.log('saveFormIds', formIds);
            client.request({
                type: 'SaveFormIds',
                data: {
                    form_ids: JSON.stringify(formIds)
                },
                success: (res) => { }
            });
            formIds = [];
        }
    }
};

export default form;
