pimcore.registerNS('pimcore.plugin.BatchOperation.Asset.Tag');

pimcore.plugin.BatchOperation.Asset.Tag = Class.create({
    getClassName: function () {
        return 'pimcore.plugin.BatchOperation.Asset.Tag';
    },

    initialize: function () {
        document.addEventListener(pimcore.events.pimcoreReady, this.pimcoreReady.bind(this));
    },

    pimcoreReady: function (params, broker) {
        console.log('BatchOperation Asset Tags ready!');
    },

    getLayout: function () {

        if (this.layout == null) {

            var gridStore = Ext.create('Ext.data.Store', {
                data: [],
                fields: ['id', 'path']
            });

            var tree = new pimcore.element.tag.tree();
            tree.setAllowAdd(false);
            tree.setAllowDelete(false);
            tree.setAllowRename(false);
            tree.setAllowDnD(false);
            tree.setShowSelection(true);
            tree.setCheckChangeCallback(function (gridStore, node, checked) {
                var record = {id: node.id, path: node.data.path};
                if (checked) {
                    gridStore.add(record);
                } else {
                    gridStore.removeAt(gridStore.findExact('id', node.id));
                    this.removeTagFromElement(node.id);
                }
                gridStore.sort('path', 'ASC');

            }.bind(this, gridStore));

            this.grid = Ext.create('Ext.grid.Panel', {
                title: t('your_selection'),
                region: 'center',
                height: 440,
                trackMouseOver: true,
                store: gridStore,
                columnLines: true,
                stripeRows: true,
                columns: {
                    items: [
                        {
                            text: t('name'),
                            dataIndex: 'path',
                            sortable: true,
                            width: 400
                        },
                        {
                            xtype: 'actioncolumn',
                            menuText: t('delete'),
                            width: 40,
                            items: [{
                                tooltip: t('delete'),
                                icon: '/bundles/pimcoreadmin/img/flat-color-icons/delete.svg',
                                handler: function (tree, grid, rowIndex) {
                                    var record = grid.getStore().getAt(rowIndex);

                                    grid.getStore().removeAt(rowIndex);
                                    var node = tree.getStore().findNode('id', record.id);
                                    if (node) {
                                        node.set('checked', false);
                                    }
                                }.bind(this, tree.getLayout())
                            }]
                        }
                    ]
                },
                bbar: [
                    '->',
                    {
                        text: t('batch_operation.tags.apply'),
                        iconCls: 'pimcore_icon_apply',
                        handler: function () {
                            this.applyTags(0);
                        }.bind(this)
                    },
                    {
                        text: t('batch_operation.tags.remove_and_apply'),
                        iconCls: 'pimcore_icon_apply',
                        handler: function () {
                            this.applyTags(1);
                        }.bind(this)
                    }
                ]
            });

            var treePanel = Ext.create('Ext.Panel', {
                items: [tree.getLayout()],
                layout: 'border',
                width: 380,
                height: 440,
                region: 'west',
            });

            this.layout = Ext.create('Ext.Panel', {
                tabConfig: {
                    tooltip: t('tags')
                },
                layout: 'border',
                items: [this.grid, treePanel],
                width: 880,
                height: 450,
                defaults: {
                    split: true,
                    frame: true,
                },
            });
        }
        return this.layout;
    },

    applyTags: function (replace) {
        if (this.grid.getStore().getData().items.length == 0) {
            Ext.Msg.alert(t('error'), t('batch_operation.tags.error'));
            return;
        }
        var ids = [];
        this.grid.getStore().getData().items.forEach(function (data) {
            ids.push(data.id);
        });
        tagIds = ids.join(',');
        Ext.Ajax.request({
            url: '/admin/batch-operation/add-tags',
            params: {
                assetIds: this.assetIds,
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
                            this.win.close();
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

    buildPopupWindow: function (assetIds) {
        this.assetIds = assetIds;
        this.win = Ext.create('Ext.window.Window', {
            title: t('batch_operation.tags.title'),
            autoScroll: true,
            width: 900,
            height: 500,
            y: 120,
            modal: true,
            closeAction: 'hide'
        });
        this.win.add(this.getLayout());
        return this.win;
    },
});

var BatchOperationBundlePlugin = new pimcore.plugin.BatchOperation.Asset.Tag();