Component({
    _timer: null,
    properties: {
        title: {
            type: String,
            value: ''
        }
    },
    data: {
        zIndex: 1000,
        hidden: true
    },
    detached: function () {
        if (this._timer) {
            clearTimeout(this._timer);
        }
    },
    methods: {
        show: function () {
            //let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            //e.title && this.setData({ title: e.title });

            if (this._timer) {
                clearTimeout(this._timer);
            }

            this._timer = setTimeout(function () {
                this._timer = null;

                let animation = wx.createAnimation({ duration: 0 });
                animation.opacity(1).step();
                this.setData({ hidden: false, opacityAnimation: animation.export() });
            }.bind(this), 10);
        },
        hide: function () {
            if (this._timer) {
                clearTimeout(this._timer);
            }

            let duration = 500;

            let animation = wx.createAnimation({ duration: duration, timingFunction: 'ease-in-out' });
            animation.opacity(0).step();
            this.setData({ opacityAnimation: animation.export() });

            this._timer = setTimeout(function () {
                this._timer = null;
                this.setData({ hidden: true });
            }.bind(this), duration);
        }
    }
});
