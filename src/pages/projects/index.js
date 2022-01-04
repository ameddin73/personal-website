$(function () {
    /* open active project */
    const projectSelected = 'project_selected';
    const fuzzyImage = 'project_graphic_fuzzy';
    $('.project_container').on('click', function () {
        const $content = $(this).find('.project_content');
        const $images = $(this).find('img');

        let addClass = true;
        if ($content.first().hasClass(projectSelected)) addClass = false;

        $('.project_content').removeClass(projectSelected);
        $('img').removeClass(fuzzyImage);

        if (addClass) {
            $content.addClass(projectSelected);
            $images.addClass(fuzzyImage);
        }
    });

    /* prevent link clickthrough */
    $('a').on('click', function (event) {
        event.stopPropagation();
    });
});