/**
 * Main
 */
$(function () {
    // Let the first timeout go for awhile
    setTimeout(() => {
        rewrite();
    }, 4000);
});

function rewrite() {
    const tagline = $('#about_tagline_text');
    let altTags = [];
    $('.about_tagline_alt_text').each(function () {
        altTags.push($(this).text());
    });
    let currentContent = tagline.text();

    // Delete current content
    function deleteLoop() {
        setTimeout(function () {
            currentContent = currentContent.slice(0, -1);
            tagline.text(currentContent);
            if (currentContent.length > 0) {
                deleteLoop();
            } else {
                addLoop();
            }
        }, 50);
    }

    deleteLoop();

    // Select new content
    let newTagline = altTags[Math.floor(Math.random() * altTags.length)];

    // Add new content
    let i = 1;

    function addLoop() {
        setTimeout(function () {
            currentContent = newTagline.slice(0, i);
            i++
            tagline.text(currentContent);
            if (currentContent.length < newTagline.length) {
                addLoop();
            } else {
                i = 1;
                while (newTagline === currentContent)
                    newTagline = altTags[Math.floor(Math.random() * altTags.length)];
                setTimeout(deleteLoop, 2000)
            }
        }, 100);
    }
}