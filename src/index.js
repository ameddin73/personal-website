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
const contentClasses = {
    hidden: 'cont_hidden',
    animate: 'cont_animate'
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
    if ($('#top-nav').css('display') === 'none') {
        navigateMobile({
            page,
            search: window.location.search,
        });
    } else {
        navigateDesktop({
            page,
            search: window.location.search,
        });
    }

    // Routes for top nav bar
    $('.top-nav_btn').on('click', null, null, function () {
        // Don't do anything if it's already selected
        if ($(this).hasClass('top-nav_btn_selected')) return;
        const id = $(this).attr('value');
        navigateDesktop({page: pages[id]})
    });

    // Routes for top nav bar
    $('.bottom-nav_btn').on('click', null, null, function () {
        // Don't do anything if it's already selected
        if ($(this).hasClass('top-nav_btn_selected')) return;
        const id = $(this).attr('value');
        navigateMobile({page: pages[id]})
    });
});

// Trigger nav and update graphics for mobile dimension
function navigateMobile({page: {id, path, title}, search}) {
    const content = $('#page_content');
    const button = $(`#bottom-nav_${id}`);
    const buttons = $('.bottom-nav_btn');
    const icon = $(`#bottom-nav_icon_${id}`);
    const icons = $('.bottom-nav_icon');
    const topTitle = $('#top_title');
    const topTitleText = $('#top_title_text');
    const prevButtonText = $('.bottom-nav_btn_selected').attr('value');
    const styles = $('body').get(0).style;

    // Select new nav button
    buttons.addClass('bottom-nav_btn_unselected');
    buttons.removeClass('bottom-nav_btn_selected');
    button.removeClass('bottom-nav_btn_unselected');
    button.addClass('bottom-nav_btn_selected');
    icons.removeClass('bottom-nav_icon_image_selected');
    icon.addClass('bottom-nav_icon_image_selected');

    // Reset title animation
    styles.setProperty('--title-origin-color', content.css('background-color'));
    styles.setProperty('--title-destination-color', button.css('background-color'));
    styles.setProperty('--title-origin-content', `'${prevButtonText ? pages[prevButtonText].title : ''}'`);
    styles.setProperty('--title-destination-content', `'${title}'`);
    topTitle.removeClass('top_title_refresh_animation');
    topTitleText.removeClass('top_title_text_refresh_animation');

    // Update path + shared stuff
    navigate({
        path, title, search,
        button
    });

    // Refresh title
    topTitle.addClass('top_title_refresh_animation');
    topTitleText.addClass('top_title_text_refresh_animation');
}

// Trigger nav and update graphics for desktop dimension
function navigateDesktop({page: {id, path, title}, search}) {
    const content = $('#page_content');
    const button = $(`#top-nav_${id}`);

    // Update selected button and add new content
    $('.top-nav_btn').removeClass('top-nav_btn_selected');
    button.addClass('top-nav_btn_selected')

    // Update path + shared stuff
    navigate({
        id, path, title, search,
        button
    });

    // Update top-nav color
    $('#top-nav').css('background-color', content.css('background-color'))
}

// Push a new path and update document metadata
function navigate({path, title, search, button}) {
    const content = $('#page_content');
    const background = $('#page_bg');
    const customCss = $("head").children(':last');

    // Scroll bg
    // Get starting width (inherited from button)
    // create animated keyfraes for expand
    customCss.html(`
    .cont_visible {
        transform: translateX(${button[0].getBoundingClientRect().x}px)
            scale(${button[0].getBoundingClientRect().width / $(window).width()}, 0);
    }
    @keyframes expand {
        from {
            transform: translateX(${button[0].getBoundingClientRect().x}px)
                scale(${button[0].getBoundingClientRect().width / $(window).width()}, 0);
        }
        to {
            transform: translateX(0) scale(1, 1);
        }
    `);

    // Strip animation
    content.removeClass(contentClasses.animate);

    // Update path
    window.history.pushState(window.history.state,
        title,
        `${path}${search ? search : ''}`);
    // Update page title
    document.title = `${title} | Alex Meddin`;

    // Update content
    // Shift to bg
    background.css('background-color', content.css('background-color'))
    background.html(content.innerHTML);

    // Strip styling
    content.empty();
    content.addClass(contentClasses.hidden);

    console.log(button.css('background-color'));
    content.css('background-color', button.css('background-color'));

    // Add styling
    content.removeClass(contentClasses.hidden);
    content.addClass(contentClasses.animate);

    // Load new content
    content.load(`pages${path}/index.html`);

    // Select content for keyboard scroll
    content.attr('tabindex', -1);
    content.focus();
}