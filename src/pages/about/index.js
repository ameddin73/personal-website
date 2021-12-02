/**
 * Main
 */
$(function () {

    // Load initial list of taglines
    let altTags = buildTaglines();

    // Let the first timeout go for awhile
    setTimeout(() => {
        rewrite(altTags);
    }, 4000);
});

function rewrite(altTags) {
    const tagline = $('#about_tagline_text');
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
    const pop = popTagline(altTags);
    altTags = pop.altTags;
    let newTagline = pop.newTagline;

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
                if (altTags.length <= 0) altTags = buildTaglines(newTagline);
                const newPop = popTagline(altTags);
                altTags = newPop.altTags;
                newTagline = newPop.newTagline;
                setTimeout(deleteLoop, 2000)
            }
        }, 100);
    }
}

// Get and remove tagline from altTags
function popTagline(altTags) {
    const newTagline = altTags[Math.floor(Math.random() * altTags.length)];
    const index = altTags.indexOf(newTagline)
    if (index > -1) altTags.splice(index, 1);
    return {altTags, newTagline};
}

// Rebuild alt tags from html list
function buildTaglines(lastTagline) {
    let altTags = [];
    $('.about_tagline_alt_text').each(function () {
        altTags.push($(this).text());
    });
    // Remove the most recent so we don't dupe
    if (lastTagline) {
        const index = altTags.indexOf(lastTagline)
        if (index > -1) altTags.splice(index, 1);
    }

    return altTags;
}