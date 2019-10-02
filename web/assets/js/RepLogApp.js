'use strict';

(function (window, $) {
    window.RepLogApp = function ($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper($wrapper);

        console.log();

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

        _selecttors: {
            newRepForm: '.js-new-rep-log-form'
        },

        hanldeRepLogDelete: function (e) {
            e.preventDefault();

            var $link = $(e.currentTarget);

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

            $.ajax({
                url: deleteUrl,
                method: 'DELETE',
                success: function () {
                    $row.fadeOut('normal', function () {
                        $(this).remove();
                        self.updateTotalWeightLifted();
                    });
                }
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

            $.ajax({
                url: $form.data('url'),
                method: 'POST',
                data: JSON.stringify(formData),
                success: function (data) {
                    self._clearForm();
                    self._addRow(data);
                },
                error: function (jqXHR) {
                    var errorData = JSON.parse(jqXHR.responseText);
                    self._mapErrorsToForm(errorData);
                }
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
            console.log(repLog);
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
})(window, jQuery);
