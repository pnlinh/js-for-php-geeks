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
            '.js-new-rep-log-form',
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
        whatIsThis: function (greeting) {
            console.log(this, greeting);
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
            var $tbody = this.$wrapper.find('tbody');

            $.ajax({
                // url: $form.attr('action'),
                url: '/lift',
                method: 'POST',
                data: $form.serialize(),
                success: function (data) {
                    $tbody.append(data);
                },
                error: function (jqXHR) {
                    $form.closest('.js-new-rep-log-form-wrapper')
                        .html(jqXHR.responseText);
                }
            });
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
