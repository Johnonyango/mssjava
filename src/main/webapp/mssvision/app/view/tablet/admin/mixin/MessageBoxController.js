Ext.define('MssPhoenix.view.tablet.admin.mixin.MessageBoxController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-messagebox',

    getMaskClickAction: function() {
        return this.lookupReference('hideOnMaskClick').getValue() ? 'hide' : 'focus';
    },

    onSaveBtnClick: function() {
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', this.showResult, this);
        Ext.MessageBox.maskClickAction = this.getMaskClickAction();
    },

    onPromptClick: function() {
        Ext.MessageBox.prompt('Name', 'Please enter your name:', this.showResultText, this);
        Ext.MessageBox.maskClickAction = this.getMaskClickAction();
    },

    onMultiLinePromptClick: function(btn) {
        Ext.MessageBox.show({
            title: 'Address',
            msg: 'Please enter your address:',
            width: 300,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: true,
            scope: this,
            fn: this.showResultText,
            animateTarget: btn,
            buttonAlign: 'end',
            maskClickAction: this.getMaskClickAction()
        });
    },

    onYesNoCancelClick: function(btn) {
        Ext.MessageBox.show({
            title: 'Save Changes?',
            msg: 'You are closing a tab that has unsaved changes. <br />Would you like to save your changes?',
            buttons: Ext.MessageBox.YESNOCANCEL,
            scope: this,
            fn: this.showResult,
            animateTarget: btn,
            icon: Ext.MessageBox.QUESTION,
            maskClickAction: this.getMaskClickAction()
        });
    },

    onProgressClick: function(btn) {
        var me = this,
            i = 0,
            fn, val;

        Ext.MessageBox.show({
            title: 'Please wait',
            msg: 'Loading items...',
            progressText: 'Initializing...',
            width: 300,
            progress: true,
            closable: false,
            animateTarget: btn,
            maskClickAction: me.getMaskClickAction()
        });

        // Fake progress fn
        fn = function() {
            me.timer = null;
            ++i;

            if (i === 12 || !Ext.MessageBox.isVisible()) {
                Ext.MessageBox.hide();
                me.showToast('Your fake items were loaded', 'Done');
            }
            else {
                val = i / 11;

                Ext.MessageBox.updateProgress(val, Math.round(100 * val) + '% completed');
                me.timer = Ext.defer(fn, 500);
            }
        };

        me.timer = Ext.defer(fn, 500);

    },

    onWaitClick: function(btn) {
        var me = this;

        Ext.MessageBox.show({
            msg: 'Saving your data, please wait...',
            progressText: 'Saving...',
            width: 300,
            wait: {
                interval: 200
            },
            animateTarget: btn,
            maskClickAction: me.getMaskClickAction()
        });

        me.timer = Ext.defer(function() {
            // This simulates a long-running operation like a database save or XHR call.
            // In real code, this would be in a callback function.
            me.timer = null;
            Ext.MessageBox.hide();
            me.showToast('Your fake data was saved!', 'Done');
        }, 3000);
    },

    onAlertClick: function() {
        Ext.MessageBox.alert('Status', 'Changes saved successfully.', this.showResult, this);
        Ext.MessageBox.maskClickAction = this.getMaskClickAction();
    },

    onIconClick: function(btn) {
        var value = this.lookupReference('icon').getValue(),
            icon = Ext.MessageBox[value.toUpperCase()];

        Ext.MessageBox.show({
            title: 'Icon Support',
            msg: 'Here is a message with an icon!',
            buttons: Ext.MessageBox.OK,
            animateTarget: btn,
            scope: this,
            fn: this.showResult,
            icon: icon,
            cls: 'show-icon-messagebox',
            maskClickAction: this.getMaskClickAction()
        });
    },

    onCustomButtonText: function() {
        Ext.MessageBox.show({
            title: 'What, really?',
            msg: 'Are you sure?',
            width: Ext.theme.name === "Graphite" ? 300 : 250,
            buttons: Ext.MessageBox.YESNO,
            buttonText: {
                yes: "Definitely!",
                no: "No chance!"
            },
            buttonTips: {
                yes: {
                    text: "We would't!",
                    anchor: true,
                    align: 't-b'
                },
                no: {
                    text: "Probably best!",
                    anchor: true,
                    align: 't-b'
                }
            },
            scope: this,
            fn: this.showResult,
            maskClickAction: this.getMaskClickAction()
        });
    },

    showResult: function(btn, text) {
        this.showToast(Ext.String.format('You clicked the {0} button', btn));
    },

    showResultText: function(btn, text) {
        this.showToast(Ext.String.format('You clicked the {0} button and entered the text "{1}".', btn, text));
    },

    showToast: function(s, title) {
        Ext.toast({
            html: s,
            closable: false,
            align: 't',
            slideInDuration: 400
            // ,
            // minHeight: 1
        });
    },

    destroy: function() {
        if (this.timer) {
            window.clearTimeout(this.timer);
        }

        Ext.Msg.hide();
        this.callParent();
    }
});