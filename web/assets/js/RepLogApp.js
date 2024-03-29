'use strict';

(function (window, $, Routing, swal) {
    window.RepLogApp = function ($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper($wrapper);

        this.loadRepLogs();

        this.$wrapper.on(
            'click',
            '.js-delete-rep-log',
            this.hanldeRepLogDelete.bind(this)
        );

        this.$wrapper.on(
            'click',
            'tbody tr',
            this.handleRowClick.bind(this)
        );

        this.$wrapper.on(
            'submit',
            this._selecttors.newRepForm,
            this.handleNewFormSubmit.bind(this)
        );

        // console.log(this.helper, Object.keys(this.helper));
        // console.log(Helper, Object.keys(Helper));
        // var newThis = {cat: 'meow', dog: 'woof'};
        // var boundWhatIsThis = this.whatIsThis.bind(this);
        // boundWhatIsThis.call(newThis, 'hello');

        // var playObject = {
        //     lift: 'stuff'
        // };
        //
        // playObject.__proto__.cat = 'meow';
        // console.log(playObject.lift, playObject.cat);
    };

    $.extend(window.RepLogApp.prototype, {
        // whatIsThis: function (greeting) {
        //     console.log(this, greeting);
        // },

        loadRepLogs: function () {
            var self = this;

            $.ajax({
                url: Routing.generate('rep_log_list'),
            }).then(function (data) {
                $.each(data.items, function (key, repLog) {
                    self._addRow(repLog);
                });
            });
        },

        _selecttors: {
            newRepForm: '.js-new-rep-log-form'
        },

        hanldeRepLogDelete: function (e) {
            e.preventDefault();

            var $link = $(e.currentTarget);
            var self = this;

            swal({
                title: 'Delete this log?',
                text: 'What? Did you not actually lift this?',
                showCancelButton: true,
                showLoaderOnConfirm: true,
                preConfirm: function () {
                    return self._deleteRepLog($link);
                }
            }).catch(function (arg) {
                // canceling is cool
            });
        },

        _deleteRepLog: function ($link) {
            $link.addClass('text-danger');
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');

            // console.log(e.currentTarget === this);
            // e.target.className = e.target.className + 'text-danger';

            var deleteUrl = $link.data('url');
            var $row = $link.closest('tr');
            var self = this;

            return $.ajax({
                url: deleteUrl,
                method: 'DELETE',
            }).then(function () {
                $row.fadeOut('normal', function () {
                    $(this).remove();
                    self.updateTotalWeightLifted();
                });
            });
        },

        updateTotalWeightLifted: function () {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.calculateTotalWeight()
            );
        },


        handleRowClick: function () {
            console.log('row clicked');
        },

        handleNewFormSubmit: function (e) {
            e.preventDefault();

            var $form = $(e.currentTarget);
            var formData = {};
            var self = this;

            $.each($form.serializeArray(), function (key, fieldData) {
                formData[fieldData.name] = fieldData.value;
            });

            this._saveRepLog(formData)
            .then(function (data) {
                self._clearForm();
                self._addRow(data);
            }).catch(function (errorData) {
                self._mapErrorsToForm(errorData);
            });
        },

        _saveRepLog: function (data) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: Routing.generate('rep_log_new'),
                    method: 'POST',
                    data: JSON.stringify(data),
                }).then(function (data, textStatus, jqXHR) {
                    $.ajax({
                        url: jqXHR.getResponseHeader('Location')
                    }).then(function (data) {
                        // we're finally done
                        resolve(data);
                    });
                }).catch(function (jqXHR) {
                    var errorData = JSON.parse(jqXHR.responseText);
                    reject(errorData);
                });
            });
        },

        _mapErrorsToForm: function (errorData) {
            // reset things
            var $form = this.$wrapper.find(this._selecttors.newRepForm);
            this._removeFormErrors();

            $form.find(':input').each(function () {
                var fieldName = $(this).attr('name');
                var $wrapper = $(this).closest('.form-group');

                if (!errorData[fieldName]) {
                    // no error!
                    return;
                }

                var $error = $('<span class="js-field-error help-block"></span>');
                $error.html(errorData[fieldName]);
                $wrapper.append($error);
                $wrapper.addClass('has-error');
            });
        },

        _removeFormErrors: function () {
            var $form = this.$wrapper.find(this._selecttors.newRepForm);
            $form.find('.js-field-error').remove();
            $form.find('.form-group').removeClass('has-error');
        },

        _clearForm: function () {
            this._removeFormErrors();

            var $form = this.$wrapper.find(this._selecttors.newRepForm);
            $form[0].reset();
        },

        _addRow: function (repLog) {
            var tplText = $('#js-rep-log-row-template').html();
            var tpl = _.template(tplText);

            var html = tpl(repLog);
            this.$wrapper.find('tbody')
                .append($.parseHTML(html));

            this.updateTotalWeightLifted();
        }
    });

    /**
     * A "private" object
     */
    var Helper = function ($wrapper) {
        this.$wrapper = $wrapper;
    };

    $.extend(Helper.prototype, {
        calculateTotalWeight: function () {
            var totalWeight = 0;

            this.$wrapper.find('tbody tr').each(function () {
                totalWeight += $(this).data('weight')
            });

            return totalWeight;
        }
    });
})(window, jQuery, Routing, swal);
