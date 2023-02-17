// see pimcore/vendor/pimcore/pimcore/bundles/AdminBundle/Resources/public/js/pimcore/element/selector/asset.js
pimcore.registerNS("pimcore.plugin.BatchOperation.Asset.Move");

pimcore.plugin.BatchOperation.Asset.Move = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.BatchOperation.Asset.Move";
    },

    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);
        this.initStore();
    },

    pimcoreReady: function (params, broker) {
        console.log('BatchOperation Asset Move ready!');
    },

    initStore: function () {
        this.store = new Ext.data.Store({
            autoDestroy: true,
            remoteSort: true,
            pageSize: 50,
            proxy: {
                type: 'ajax',
                url: Routing.generate('pimcore_admin_searchadmin_search_find'),
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                extraParams: {
                    type: 'asset'
                }
            },
            fields: ["id", "fullpath", "type", "subtype", "filename"]
        });
    },

    getPagingToolbar: function () {
        var pagingToolbar = pimcore.helpers.grid.buildDefaultPagingToolbar(this.store);
        return pagingToolbar;
    },

    /**
     * Search panel with input field and search button
     * @returns {*}
     */
    getForm: function () {
        var compositeConfig = {
            xtype: "toolbar",
            items: [{
                xtype: "textfield",
                name: "query",
                width: 370,
                hideLabel: true,
                enableKeyEvents: true,
                listeners: {
                    "keydown": function (field, key) {
                        if (key.getKey() == key.ENTER) {
                            this.search();
                        }
                    }.bind(this),
                    afterrender: function () {
                        this.focus(true, 500);
                    }
                }
            }, {
                xtype: "button",
                text: t("search"),
                iconCls: "pimcore_icon_search",
                handler: this.search.bind(this)
            }]
        };
        if (!this.formPanel) {
            this.formPanel = new Ext.form.FormPanel({
                region: "north",
                bodyStyle: "padding: 2px;",
                items: [compositeConfig]
            });
        }

        return this.formPanel;
    },

    getGridLayout: function () {
        gridPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            title: 'Grid Panel',
            html: 'Grid Panel content here',
            layout: 'fit'
        });
        return gridPanel;
    },

    getGridSelModel: function () {
        return Ext.create('Ext.selection.RowModel', "SINGLE");
    },

    getResultPanel: function () {
        if (!this.resultPanel) {
            var columns = [
                {
                    text: t("type"), width: 40, sortable: true, dataIndex: 'subtype',
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        return '<div style="height: 16px;" class="pimcore_icon_'
                            + value + '" name="' + t(record.data.subtype) + '">&nbsp;</div>';
                    }
                },
                {text: 'ID', width: 40, sortable: true, dataIndex: 'id', hidden: true},
                {
                    text: t("path"),
                    flex: 200,
                    sortable: true,
                    dataIndex: 'fullpath',
                    renderer: Ext.util.Format.htmlEncode
                },
                {
                    text: t("filename"),
                    width: 200,
                    sortable: true,
                    dataIndex: 'filename',
                    hidden: true,
                    renderer: Ext.util.Format.htmlEncode
                },
                {
                    text: t("preview"), width: 150, sortable: false, dataIndex: 'subtype',
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        var routes = {
                            image: "pimcore_admin_asset_getimagethumbnail",
                            video: "pimcore_admin_asset_getvideothumbnail",
                            document: "pimcore_admin_asset_getdocumentthumbnail"
                        };

                        if (record.data.subtype in routes) {
                            var route = routes[record.data.subtype];

                            var params = {
                                id: record.data.id,
                                width: 100,
                                height: 100,
                                cover: true,
                                aspectratio: true
                            };

                            var uri = Routing.generate(route, params);

                            return '<div name="' + t(record.data.subtype)
                                + '"><img src="' + uri + '" /></div>';
                        }
                    }
                }
            ];

            this.pagingtoolbar = this.getPagingToolbar();

            this.resultPanel = new Ext.grid.GridPanel({
                region: "center",
                store: this.store,
                columns: columns,
                loadMask: true,
                columnLines: true,
                stripeRows: true,
                viewConfig: {
                    forceFit: true,
                    markDirty: false
                },
                plugins: ['gridfilters'],
                selModel: this.getGridSelModel(),
                bbar: this.pagingtoolbar,
                listeners: {
                    cellclick: {
                        fn: function (view, cellEl, colIdx, store, rowEl, rowIdx, event) {

                            var data = view.getStore().getAt(rowIdx);

                        }.bind(this)
                    }
                }
            });
        }
        return this.resultPanel;
    },

    getGrid: function () {
        return this.resultPanel;
    },

    getButtonPanel: function () {
        if (!this.applyButton) {
            this.applyButton = Ext.create('Ext.button.Button', {
                iconCls: 'pimcore_icon_apply',
                text: t('batch_operation.move.apply'),
                handler: function () {
                    Ext.Ajax.request({
                        url: '/admin/batch-operation/move',
                        params: {
                            assetIds: this.assetIds,
                            targetFolderId: this.getGrid().getSelectionModel().getSelection()[0].data.id,
                        },
                        success: function (result) {
                            Ext.Msg.show({
                                title: t('batch_operation.success.title'),
                                message: t('batch_operation.move.success'),
                                buttons: Ext.MessageBox.OKCANCEL,
                                icon: Ext.Msg.INFO,
                                fn: function (msg) {
                                    if (msg === 'ok') {
                                        this.win.close();
                                    }
                                }
                            });
                        },
                        failure: function (result) {
                            result = Ext.decode(result.responseText);
                            console.error(result);
                            Ext.Msg.alert(t('error'), t(result['message']));
                        }.bind(this)
                    });
                    pimcore.layout.refresh();
                }.bind(this)
            });
        }
        if (!this.actionPanel) {
            this.actionPanel = Ext.create('Ext.panel.Panel', {
                region: 'south',
                height: 50,
                layout: {
                    type: 'hbox',
                    pack: 'end',
                    align: 'center'
                },
                items: [this.applyButton]
            });
        }
        return this.actionPanel;
    },

    getMainLayout: function () {
        if (!this.mainPanel) {
            this.mainPanel = Ext.create('Ext.Panel', {
                width: 780,
                height: 600,
                layout: 'border',
                defaults: {
                    split: false,
                    bodyPadding: 10
                },
                items: []
            });
            this.mainPanel.add(this.getForm());
            this.mainPanel.add(this.getResultPanel());
            this.mainPanel.add(this.getButtonPanel());
        }
        return this.mainPanel;
    },

    getErrorPanel: function (message) {
        if (!this.errorPanel) {
            this.errorPanel = Ext.create('Ext.panel.Panel', {
                region: "south",
                html: message,
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'middle'
                },
                bodyCls: 'error'
            });
        }
        return this.errorPanel;
    },

    getResultError: function(error) {
        var message = [];
        error.forEach(function(asset) {
            message.push(asset['key'] + '(' + asset['id'] + ')');
        })
        return message.join(', ');
    },

    showMyError: function (error) {
        this.getMainLayout().remove(this.getButtonPanel());
        this.getMainLayout().add(this.getErrorPanel(this.getResultError(error)));
    },

    search: function () {
        let formValues = this.formPanel.getForm().getFieldValues();
        let proxy = this.store.getProxy();
        let query = Ext.util.Format.htmlEncode(formValues.query);
        proxy.setExtraParam("query", query);
        proxy.setExtraParam("type", 'asset');
        proxy.setExtraParam("subtype", 'folder');
        this.pagingtoolbar.moveFirst();
    },

    buildSearchWindow: function (assetIds) {
        this.assetIds = assetIds;
        this.win = Ext.create('Ext.window.Window', {
            title: t('asset_search'),
            autoScroll: true,
            width: 800,
            height: 650,
            y: 120,
            modal: true,
            closeAction: 'hide'
        });
        this.win.add(this.getMainLayout());
        return this.win;
    },
});

var move = new pimcore.plugin.BatchOperation.Asset.Move();