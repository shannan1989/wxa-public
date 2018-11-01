Component({
    properties: {},
    data: {},
    methods: {
        onTouchMove: function () { },
        onTapRefresh: function () {
            var eventDetail = {}; // detail对象，提供给事件监听函数
            var eventOption = {}; // 触发事件的选项
            this.triggerEvent('Refresh', eventDetail, eventOption);
        }
    }
});
