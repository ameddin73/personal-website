$(function () {
    /* check for hash */
    if (window.location.hash) {
        window.location.replace(window.location.hash);
    }

    /* close spotlight */
    $(window).on('click', function () {
        if ($('.testimonial_spotlight').css('display') !== 'none') {
            window.location.replace("#");
            $('#testimonial_spotlight_container').removeClass('testimonial_spotlight_pointer_events')
        }
    });

    $('.testimonial_spotlight').click(function (event) {
        event.stopPropagation();
    });

    $('.testimonial_spotlight').on('target', function () {
        $('#testimonial_spotlight_container').addClass('testimonial_spotlight_pointer_events')
    })

    /* animate in */
    $('.testimonial_box').each(function (index) {
        $(this).css('animation-delay', `${index * 75}ms`);
    });
});