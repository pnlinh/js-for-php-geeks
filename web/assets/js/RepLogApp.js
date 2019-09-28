(function () {
    var RepLogApp = {
        initialize: function ($wrapper) {
            this.$wrapper = $wrapper;
            Helper.initialize($wrapper);

            this.$wrapper.find('.js-delete-rep-log').on(
                'click',
                this.hanldeRepLogDelete.bind(this)
            );

            this.$wrapper.find('tbody tr').on(
                'click',
                this.handleRowClick.bind(this)
            );

            // var newThis = {cat: 'meow', dog: 'woof'};
            // var boundWhatIsThis = this.whatIsThis.bind(this);
            // boundWhatIsThis.call(newThis, 'hello');
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
                Helper.calculateTotalWeight()
            );
        },


        handleRowClick: function () {
            console.log('row clicked');
        }
    };

    var Helper = {
        initialize: function ($wrapper) {
            this.$wrapper = $wrapper;
        },

        calculateTotalWeight: function () {
            var totalWeight = 0;

            this.$wrapper.find('tbody tr').each(function () {
                totalWeight += $(this).data('weight')
            });

            return totalWeight;
        },
    };
})();
