import client from '../../libs/client/client.js';
import WxPage from '../../libs/client/wxPage.js';

WxPage({
    wxPage: {
        enableFormSubmit: true,
        enablePageRequest: true
    },
    data: {
        loadStatus: 'loading'
    },
    onLoad: function (options) {
        this.loadData(false);
    },
    onRefresh: function () {
        this.loadData(false);
    },
    loadData: function (isUpdate = null) {
        this.pageRequest({
            isUpdate: isUpdate,
            auth: {
                type: 'full',
                success: (res) => {
                    console.log('auth success', res);
                },
                fail: (res) => {
                    console.log('auth fail', res);
                }
            },
            request: {
                type: 'List',
                data: {},
                success: (res) => {
                    console.log('request success', res);
                },
                fail: (res) => {
                    console.log('request fail', res);
                }
            }
        });
    },
    onTapButton: function () {

    }
});
