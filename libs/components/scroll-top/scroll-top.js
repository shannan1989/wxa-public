Component({
    properties: {
        scrollTop: {
            type: Number,
            value: 0,
            observer: function (newVal, oldVal) {
                if (newVal > oldVal) {// 向下滚动
                    if (newVal > this._windowHeight) {
                        var animation = wx.createAnimation({ duration: 700 });
                        animation.opacity(1).bottom(this.data.bottom + 'rpx').step();
                        this.setData({ scrollAnimation: animation.export() });
                    }
                }
                if (newVal < oldVal) {// 向上滚动
                    if (newVal < 10) {
                        var animation = wx.createAnimation({ duration: 700 });
                        animation.opacity(0).bottom(0).step();
                        this.setData({ scrollAnimation: animation.export() });
                    }
                }
            }
        },
        bottom: {
            type: Number,
            value: 100
        }
    },
    data: {},
    attached: function () {
        let info = wx.getSystemInfoSync();
        this._windowHeight = info.windowHeight;
        this._platform = info.platform;

        let pages = getCurrentPages();
        let page = pages[pages.length - 1];

        if (page.onPageScroll) {
            let scroll = page.onPageScroll;
            page.onPageScroll = (res) => {
                scroll(res);
                this.setData({ scrollTop: res.scrollTop });
            };
        } else {
            page.onPageScroll = (res) => {
                this.setData({ scrollTop: res.scrollTop });
            };
        }
    },
    methods: {
        onTapScrollTop: function () {
            wx.pageScrollTo({
                scrollTop: 0,
                duration: this._platform == 'android' ? 1000 : 0
            });
        }
    }
});
