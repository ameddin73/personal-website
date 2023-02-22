$(function() {
  // Animate in
  $("h1, h2, h3, h4, a, p, li, span").each(function(i) {
    $(this).css("animation-delay", `${i * 18}ms`);
  });

  // Copy email
  const $emailText = $("#resume_email_text");
  $("#resume_email_copy").on("click", function() {
    navigator.clipboard.writeText("meddin.alex@gmail.com");

    $emailText.css("width", $emailText.width());
    $emailText.text("Copied!");
    setTimeout(function() {
      $emailText.text("meddin.alex@gmail.com");
    }, 1000);
  });

  // Remove list wrapped dividers
  const wList = [];
  const wrapped = $("li.resume_stack_entry")
  wrapped.each(function() { wList.push($(this)) })
  for (let i = 1; i < wList.length; i++) {
    if (i == 0) {
      return;
    }
    if (wList[i].offset().left < wList[i - 1].offset().left) {
      wList[i].css('border-left', 'none')
      wList[i].css('padding-left', '0')
    }
  }
});
