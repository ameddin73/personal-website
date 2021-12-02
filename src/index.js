const pages = {
    about: {
        id: 'about',
        path: '/about',
        title: 'About'
    },
    projects: {
        id: 'projects',
        path: '/projects',
        title: 'Projects'
    },
    resume: {
        id: 'resume',
        path: '/resume',
        title: 'Resume'
    },
    testimonials: {
        id: 'testimonials',
        path: '/testimonials',
        title: 'Testimonials'
    },
    contact: {
        id: 'contact',
        path: '/contact',
        title: 'Contact'
    },
}

/**
 * Main
 */
$(function () {
    // Append editable css
    $("head").append('<style></style>');

    // Get url path on landing
    let page = Object.entries(pages).find(([key, value]) => value.path === window.location.pathname);
    if (Array.isArray(page)) page = page[0];
    if (typeof page === 'string') page = pages[page];
    if (page === undefined) page = pages.about;

    // Navigate to path on load
    navigate({
        page,
        search: window.location.search
    });

    // Routes for nav bar
    $('.nav_btn').on('click', null, null, function () {
        // Don't do anything if it's already selected
        if ($(this).hasClass('nav_btn_selected')) return;
        const id = $(this).attr('id');
        navigate({page: pages[id]})
    });
});

// Push a new path and update document metadata
function navigate({page: {id, path, title}, search}) {
    const content = $('#page_content');
    const background = $('#page_bg');
    const classes = {
        hidden: 'cont_hidden',
        start: 'cont_start',
        visible: 'cont_visible',
        animate: 'cont_animate'
    }
    const button = $(`#${id}`);
    const customCss = $("head").children(':last');

    // Update path
    window.history.pushState(window.history.state,
        title,
        `${path}${search ? search : ''}`);
    // Update page title
    document.title = `${title} | Alex Meddin`;

    // Update content
    // Shift to bg
    $('.nav_btn').removeClass('nav_btn_selected');
    background.css('background-color', content.css('background-color'))
    background.html(content.innerHTML);

    // Strip styling
    content.empty();
    content.removeClass(`${classes.visible} ${classes.animate}`);
    content.addClass('cont_hidden');

    // Update selected button and add new content
    button.addClass('nav_btn_selected')
    content.load(`pages${path}/index.html`);
    content.css('background-color', button.css('background-color'))

    // Scroll bg
    // Get starting width (inherited from button)
    customCss.html(`.${classes.visible} {width: ${button[0].getBoundingClientRect().width}px;\
    left: ${button[0].getBoundingClientRect().x}px}`);
    content.addClass(classes.visible);
    content.removeClass(classes.hidden)
    content.addClass(classes.animate);
}
