// see pimcore/vendor/pimcore/pimcore/bundles/AdminBundle/Resources/public/js/pimcore/element/selector/asset.js
pimcore.registerNS("pimcore.plugin.BatchOperation.Asset.Move");

pimcore.plugin.BatchOperation.Asset.Move = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.BatchOperation.Move";
    },

    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);
        this.initStore();
    },

    pimcoreReady: function (params, broker) {
        console.log('BatchOperation move ready!');
    },

    initStore: function () {
        this.store = new Ext.data.Store({
            autoDestroy: true,
            remoteSort: true,
            pageSize: 50,
            proxy : {
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
            fields: ["id","fullpath","type","subtype","filename"]
        });
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
                    "keydown" : function (field, key) {
                        if (key.getKey() == key.ENTER) {
                            this.search();
                        }
                    }.bind(this),
                    afterrender: function () {
                        this.focus(true,500);
                    }
                }
            }, {
                xtype: "button",
                text: t("search"),
                iconCls: "pimcore_icon_search",
                handler: this.search.bind(this)
            }]
        };
        if(!this.formPanel) {
            this.formPanel = new Ext.form.FormPanel({
                region: "north",
                bodyStyle: "padding: 2px;",
                items: [compositeConfig]
            });
        }

        return this.formPanel;
        //
        // searchText = Ext.create({
        //     xtype: 'textfield'
        // });
        // searchFolderButton = Ext.create('Ext.button.Button', {
        //     iconCls: 'pimcore_icon_search',
        //     text: t('search'),
        //     handler: function () {
        //         console.log(searchText.value());
        //         this.searchFolder(searchText.value());
        //     }
        // });
        // if (!this.searchPanel) {
        //     this.searchPanel = Ext.create('Ext.panel.Panel', {
        //         region: 'north',
        //         height: 80,
        //         layout: {
        //             type: 'hbox',
        //             pack: 'start',
        //             align: 'center',
        //         },
        //         defaults: {
        //             margin: 10,
        //         },
        //         items: [searchText, searchFolderButton]
        //     });
        // }
        // return this.searchPanel;
    },

    getGridLayout: function() {
        gridPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            title: 'Grid Panel',
            html: 'Grid Panel content here',
            layout: 'fit'
        });
        return gridPanel;
    },

    getActionLayout: function() {
        this.applyButton = Ext.create('Ext.button.Button', {
            iconCls: 'pimcore_icon_apply',
            text: t('batch_operation.move.apply'),
            handler: function() {

            }
        });
        actionPanel = Ext.create('Ext.panel.Panel', {
            region: 'south',
            height: 50,
            layout: {
                type: 'hbox',
                pack: 'end',
                align: 'center'
            },
            items: [this.applyButton]
        });
        return actionPanel;
    },

    getSelectionLayout: function () {
        selectionPanel = Ext.create('Ext.panel.Panel', {
            region: 'east',
            title: 'Selection',
            width: 190,
            html: 'selection comes here',
        });
        return selectionPanel;
    },

    getMainLayout: function() {
        mainPanel = Ext.create('Ext.Panel', {
            width: 780,
            height: 550,
            layout: 'border',
            defaults: {
                split: false,
                bodyPadding: 10
            },
            items: []
        });
        mainPanel.add(this.getForm());
        mainPanel.add(this.getGridLayout());
        mainPanel.add(this.getSelectionLayout());
        mainPanel.add(this.getActionLayout());
        return mainPanel;
    },

    buildSearchWindow: function (assetIds) {
        win = Ext.create('Ext.window.Window', {
            title: t('asset_search'),
            autoScroll: true,
            width: 800,
            height: 600,
            y: 120,
            modal: true,
            closeAction: 'hide'
        });
        win.add(this.getMainLayout());
        return win;
    },

    search: function () {
    },
);

var assetMove = new pimcore.plugin.BatchOperation.Asset.Move();