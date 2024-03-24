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

  formatSkills();
});

function formatSkills() {
  var wList = [];
  var wrapped = $("li.resume_stack_entry")
  wrapped.each(function() { wList.push($(this)) })
  for (let i = 0; i < wList.length - 1; i++) {
    wList = []
    var wrapped = $("li.resume_stack_entry")
    wrapped.each(function() { wList.push($(this)) })
    if (wList[i + 1].position().left < wList[i].position().left) {
      // console.log(wList[i].text());
      // console.log(wList[i].position());
      // console.log(wList[i + 1].text());
      // console.log(wList[i + 1].position());
      wList[i + 1].css('border-left', 'none');
      wList[i + 1].css('padding-left', '0');
      wList[i + 1].css('text-align', 'left');

      wList[i].css('text-align', 'right');
      wList[i].css('padding-right', '10px');
    } else {
      wList[i + 1].css('border-left', '');
      wList[i + 1].css('padding-left', '');
      wList[i + 1].css('text-align', '');

      wList[i].css('text-align', '');
      wList[i].css('padding-right', '');
    }
  }
}
