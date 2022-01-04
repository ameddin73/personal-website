$(function () {
    /* open active project */
    const projectSelected = 'project_selected';
    const fuzzyImage = 'project_graphic_fuzzy';
    const $projectContainer = $('.project_container');
    $projectContainer.on('click', function () {
        const $content = $(this).find('.project_content');
        const $images = $(this).find('img');

        let addClass = true;
        if ($content.first().hasClass(projectSelected)) addClass = false;

        $('.project_content').removeClass(projectSelected);
        $('img').removeClass(fuzzyImage);
        $('.project_chevron').removeClass('flipped_chevron');

        if (addClass) {
            $content.addClass(projectSelected);
            $images.addClass(fuzzyImage);
            $(this).find('.project_chevron').addClass('flipped_chevron');
        }
    });

    $projectContainer.hover(function () {
        console.log($(this).find('.project_graphic_mobile'))
        $(this).find('.project_graphic_mobile').addClass('project_graphic_up');
        $(this).find('.project_graphic_desktop').addClass('project_graphic_down');
    }, function () {
        $(this).find('.project_graphic_mobile').removeClass('project_graphic_up');
        $(this).find('.project_graphic_desktop').removeClass('project_graphic_down');
    });

    /* prevent link clickthrough */
    $('a').on('click', function (event) {
        event.stopPropagation();
    });

    /* animate in */
    // Animate in
    $('.project_container').each(function (index) {
        $(this).css('animation-delay', `${index * 100}ms`);
    });
});