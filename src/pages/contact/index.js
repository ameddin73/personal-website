$(function () {
    // Form submit
    $('form').on('submit', function (e) {
        e.preventDefault();
        fetch('/', {
            method: 'POST',
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: $('#contact_form').serialize()
        }).then(submitSuccess).catch(submitFailure);
    });

    // Textarea resize
    const $messageTextArea = $('#contact_message');
    const $contactContainer = $('#contact_container');
    const $pageContent = $('#page_content');

    const initialHeight = $messageTextArea.prop('clientHeight');
    $messageTextArea.on('keyup', function () {
        if (initialHeight < $(this).prop('scrollHeight')) {
            // Don't grow once we're fullscreen
            console.log(`${$(this).prop('scrollHeight')} < ${$(this).prop('clientHeight')}`)
            const clientHeight = $(this).prop('clientHeight');
            const currentHeight = $(this).css('height');
            const notMax = $contactContainer.prop('scrollHeight') <= $pageContent.prop('scrollHeight') - 64;
            $(this).css('height', '1px');
            if ($(this).prop('scrollHeight') <= clientHeight || (notMax
                && $(this).prop('scrollHeight') > clientHeight)) {
                $(this).css('height', `${$(this).prop('scrollHeight')}px`);
            } else if ($(this).prop('scrollHeight') > clientHeight) {
                $(this).css('height', currentHeight);
            }
        }
    });
});

function submitSuccess() {
    $('#contact_form').hide();
}

function submitFailure() {
    alert('Something went wrong submitting. Please try again');
}
