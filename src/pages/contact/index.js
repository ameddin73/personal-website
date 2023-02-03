$(function() {
  // Form submit
  $('form').on('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(e.target)
    fetch('/', {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    }).then(submitSuccess).catch(submitFailure);
  });

  // Textarea resize
  const $messageTextArea = $('#contact_message');
  const $contactContainer = $('#contact_container');
  const $pageContent = $('#page_content');

  const initialHeight = $messageTextArea.prop('clientHeight');
  $messageTextArea.on('keyup', function() {
    if (initialHeight < $(this).prop('scrollHeight')) {
      // Don't grow once we're fullscreen
      const clientHeight = $(this).prop('clientHeight');
      const currentHeight = $(this).css('height');
      const notMax = $contactContainer.prop('scrollHeight') <= $pageContent.prop('scrollHeight') - 64;
      $(this).css('height', '1px');
      if ($(this).prop('scrollHeight') < clientHeight || (notMax
        && $(this).prop('scrollHeight') > clientHeight)) {
        $(this).css('height', `${$(this).prop('scrollHeight')}px`);
      } else {
        $(this).css('height', currentHeight);
      }
    }
  });
});

function submitSuccess() {
  const customCss = $("head").children(':last');
  $('#contact_form').addClass('form_sent');
  const $header = $('#contact_header');

  // Center header
  customCss.html(`
    .header_center {
        transform: translateY(${$(window).height() / 2 - $header.position().top - ($header.height() * 2)}px) !important;
    }
    `)

  $header.removeClass('appear_message');
  $header.addClass('header_sent');
  setTimeout(function() {
    $header.addClass('header_center');
  }, 10);
  setTimeout(function() {
    $header.text('Message sent.');
  }, 450);
}

function submitFailure() {
  alert('Something went wrong submitting. Please try again');
}
