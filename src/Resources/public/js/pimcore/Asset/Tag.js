pimcore.registerNS("pimcore.plugin.BatchOperation.Asset.Tag");

pimcore.plugin.BatchOperation.Asset.Tag = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.BatchOperation.Asset.Tag";
    },

    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);
    },

    pimcoreReady: function (params, broker) {
        console.log('BatchOperation Asset Tags ready!');
    },

    getTagsTree: function () {
        if (!this.tagsTree) {
            this.tagsTree = new pimcore.element.tag.tree();
            this.tagsTree.setAllowAdd(false);
            this.tagsTree.setAllowDelete(false);
            this.tagsTree.setAllowDnD(false);
            this.tagsTree.setAllowRename(false);
            this.tagsTree.setShowSelection(true);
            this.tagsTree.setCheckChangeCallback(function (tagsTree) {
            }.bind(this, this.tagsTree));
        }
        return this.tagsTree;
    },


    buildTagPopupWindow: function (assetIds) {
        tagStore = Ext.create('Ext.data.Store', {
            storeId: 'tagStore',
            fields: ['id', 'path'],
            sorters: [{
                property: 'path',
                direction: 'ASC'
            }]
        });
        Ext.Ajax.request({
            url: '/admin/batch-operation/list-tags',
            success: function (result) {
                data = Ext.decode(result.responseText);
                tagStore.loadRawData(data);
            }.bind(this)
        });
        win = new Ext.create('Ext.window.Window', {
            title: t('batch_operation.tags.title'),
            autoScroll: true,
            y: 120,
            width: 600,
            height: 200,
            modal: true,
            bodyPadding: 20,
            closeAction: 'hide'
        });
        tagSelection = Ext.create('Ext.form.field.Tag', {
            fieldLabel: t('batch_operation.tags.selection'),
            queryMode: 'local',
            store: tagStore,
            displayField: 'path',
            valueField: 'id',
            forceSelection: true,
            allowBlank: false,
            margin: 10,
        });
        applyTagsButton = Ext.create('Ext.button.Button', {
            text: t('batch_operation.tags.apply'),
            iconCls: "pimcore_icon_apply",
            columnWidth: 0.5,
            // padding: 10,
            margin: 10,
            handler: function () {
                win.close();
                tagIds = encodeURIComponent(tagSelection.value);
                this.applyTags(assetIds, tagIds, 0);
            }.bind(this)
        });
        removeAndApplyTagsButton = Ext.create('Ext.button.Button', {
            text: t('batch_operation.tags.remove_and_apply'),
            iconCls: "pimcore_icon_apply",
            columnWidth: 0.5,
            // padding: 10,
            margin: 10,
            handler: function () {
                win.close();
                tagIds = encodeURIComponent(tagSelection.value);
                this.applyTags(assetIds, tagIds, 1);
            }.bind(this)
        });
        buttonPanel = Ext.create('Ext.panel.Panel', {
            layout: {
                type: 'column'
            },
            items: [applyTagsButton, removeAndApplyTagsButton]
        });
        win.add(tagSelection);
        win.add(buttonPanel);
        return win;
    },

    applyTags: function (assetIds, tagIds, replace) {
        Ext.Ajax.request({
            url: '/admin/batch-operation/add-tags',
            params: {
                assetIds: assetIds,
                tagIds: tagIds,
                replace: replace
            },
            success: function (result) {
                result = t(Ext.decode(result.responseText));
                Ext.Msg.show({
                    title: t('batch_operation.success.title'),
                    message: result,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.INFO,
                    fn: function (msgUpload) {
                        if (msgUpload === 'ok') {
                            console.log(result);
                        }
                    }
                });
            },
            failure: function (result) {
                result = t(Ext.decode(result.responseText));
                Ext.Msg.alert(t('error'), result);
            }
        });
    },
});

var BatchOperationBundlePlugin = new pimcore.plugin.BatchOperation.Asset.Tag();