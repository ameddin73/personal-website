$(function () {
    const $page = $('.page_content');
    const $spotlight = $('.testimonial_spotlight');
    const $box = $('.testimonial_box');

    /* check for hash */
    if (window.location.hash) {
        window.location.replace(window.location.hash);
    }

    /* close spotlight */
    $(window).on('click', function () {
        if (window.location.hash) {
            window.location.replace("#");
            $('#testimonial_spotlight_container').removeClass('testimonial_spotlight_pointer_events')
        }
    });
    $spotlight.on('click', function (event) {
        event.stopPropagation();
    });

    $spotlight.on('target', function () {
        $('#testimonial_spotlight_container').addClass('testimonial_spotlight_pointer_events')
    })

    $box.on('click', function () {
        $page.animate({
            scrollTop: 0
        }, 500);
    });

    /* animate in */
    $box.each(function (index) {
        $(this).css('animation-delay', `${index * 75}ms`);
    });
});