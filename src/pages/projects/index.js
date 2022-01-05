$(function () {
    const projectSelected = 'project_selected';
    const fuzzyImage = 'project_graphic_fuzzy';

    /* check for hash */
    if (window.location.hash) {
        const $project = $(window.location.hash);
        $project.find('.project_content').addClass(projectSelected);
        $project.find('img').addClass(fuzzyImage);
        $project.find('.project_chevron').addClass('flipped_chevron');
        $project.get(0).scrollIntoView();
    }

    /* open active project */
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

            window.location.replace(`#${$(this).attr('id')}`);
        } else {
            window.location.replace("#");
        }
    });

    $projectContainer.hover(function () {
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