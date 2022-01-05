$(function () {
    /* close spotlight */
    $(window).on('click', function () {
        if ($('.testimonial_spotlight').css('display') !== 'none') {
            window.location.replace("#");
        }
    });

    $('.testimonial_spotlight').click(function (event) {
        event.stopPropagation();
    });


    /* animate in */
    $('.testimonial_box').each(function (index) {
        $(this).css('animation-delay', `${index * 75}ms`);
    });
});