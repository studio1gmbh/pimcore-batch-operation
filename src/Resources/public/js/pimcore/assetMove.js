pimcore.registerNS("pimcore.plugin.BatchOperation.Asset.Move");

pimcore.plugin.BatchOperation.Asset.Move = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.BatchOperation.Move";
    },

    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);
    },

    pimcoreReady: function (params, broker) {
        console.log('BatchOperation move ready!');
    },

    buildTagPopupWindow: function (assetIds) {
        win = new Ext.create('Ext.window.Window', {
            title: t('asset_search'),
            autoScroll: true,
            y: 120,
            width: 400,
            height: 300,
            modal: true,
            closeAction: 'hide'
        });
        return win;
    },
});

var assetMove = new pimcore.plugin.BatchOperation.Asset.Move();