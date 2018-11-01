Component({
    properties: {
        status: {
            type: String,
            value: '',
            observer: function (newVal, oldVal) {
                if (newVal == oldVal) {
                    return;
                }

                if (newVal == 'loading') {
                    this.selectComponent("#loading").show();
                }
                else {
                    this.selectComponent("#loading").hide();
                }

                if (newVal == 'auth') {
                    this.setData({ authing: true });
                }
            }
        }
    },
    data: {
        authing: false
    },
    attached: function () { },
    methods: {
        onRefresh: function () {
            this.triggerEvent('Refresh', {}, {});
        },
        onAuthOK: function () {
            let data = { authing: false };
            if (this.data.status == 'auth') {
                data.status = 'loading';
            }
            this.setData(data);
        }
    }
});
