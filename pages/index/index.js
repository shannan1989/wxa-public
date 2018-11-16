import client from '../../lib/client/client.js';
import WxPage from '../../lib/client/wxPage.js';

WxPage({
    wxPage: {
        enableFormSubmit: true,
        enablePageRequest: true,
        enableNextPage: true
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
                type: 'base',
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
    }
});
