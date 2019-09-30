'use strict';

(function (window, $) {
    window.RepLogApp = {
        initialize: function ($wrapper) {
            this.$wrapper = $wrapper;
            this.helper = new Helper($wrapper);

            console.log(

            );

            this.$wrapper.find('.js-delete-rep-log').on(
                'click',
                this.hanldeRepLogDelete.bind(this)
            );

            this.$wrapper.find('tbody tr').on(
                'click',
                this.handleRowClick.bind(this)
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
        },

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
        }
    };

    /**
     * A "private" object
     */
    var Helper = function ($wrapper) {
        this.$wrapper = $wrapper;
    };

    Helper.prototype.calculateTotalWeight = function () {
        var totalWeight = 0;

        this.$wrapper.find('tbody tr').each(function () {
            totalWeight += $(this).data('weight')
        });

        return totalWeight;
    };
})(window, jQuery);
