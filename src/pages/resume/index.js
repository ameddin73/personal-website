$(function() {
  // Add bonus stuff
  $("#resume_goal").load("pages/resume/customizer.html");

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

  function formatSkills() {
    var wList = [];
    var wrapped = $("li.resume_stack_entry")
    wrapped.each(function() { wList.push($(this)) })
    for (let i = 1; i < wList.length; i++) {
      wList = []
      wrapped.each(function() { wList.push($(this)) })
      if (wList[i].offset().left < wList[i - 1].offset().left) {
        // console.log(wList[i].text());
        // console.log(wList[i].offset());
        // console.log(wList[i - 1].text());
        // console.log(wList[i - 1].offset());
        wList[i].css('border-left', 'none');
        wList[i].css('padding-left', '0');
        wList[i].css('text-align', 'left');

        wList[i - 1].css('text-align', 'right');
        wList[i - 1].css('padding-right', '0');
      } else {
        wList[i].css('border-left', '');
        wList[i].css('padding-left', '');
        wList[i].css('text-align', '');

        wList[i - 1].css('text-align', '');
        wList[i - 1].css('padding-right', '');
      }
    }
  }

  formatSkills();
});
