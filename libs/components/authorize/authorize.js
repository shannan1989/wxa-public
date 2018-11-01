import client from '../../client/client.js';

Component({
    properties: {},
    data: {
        hidden: false
    },
    attached: function () { },
    methods: {
        onTouchMove: function () { },
        onTapButton: function () {
            this.setData({ hidden: true });
        },
        onGetUserInfo: function (e) {
            if (e.detail.userInfo) {
                this.triggerEvent('AuthOK', {}, {});
                client.fullLogin({}, e.detail);
            } else {
                this.setData({ hidden: false });
            }
        }
    }
});
