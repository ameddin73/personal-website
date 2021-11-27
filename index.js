const indices = {
    home: 0,
    projects: 1,
    resume: 2,
    testimonials: 3,
    contact: 4
}

// Create main body and append content
$(function () {
    let path = window.location.pathname.substring(1);
    if (!['home', 'projects', 'resume', 'testimonials', 'contact'].includes(path))
        path = 'home';
    navigate({
        data: {
            path,
            search: window.location.search
        }
    });

    // Routes for nav bar
    $('#home').on('click', null, {path: 'home'}, navigate);
    $('#projects').on('click', null, {path: 'projects'}, navigate);
    $('#resume').on('click', null, {path: 'resume'}, navigate);
    $('#testimonials').on('click', null, {path: 'testimonials'}, navigate);
    $('#contact').on('click', null, {path: 'contact'}, navigate);
});

// Push a new path and update document metadata
function navigate({data: {path, search}}) {
    // Get current path
    const origin = window.location.pathname;

    // Capitalize the path to get our title
    const title = path.charAt(0).toUpperCase() + path.slice(1);

    // Update path
    window.history.pushState(window.history.state,
        title,
        `/${path}${search ? search : ''}`);

    // Update page title
    document.title = `${title} | Alex Meddin`;

    // Update content
    $('#content').load(`/pages/${path}/index.html`);
    $('.nav_btn').removeClass('nav_btn_selected');
    $(`#${path}`).addClass('nav_btn_selected');

    // Scroll bg
    const newIndex = indices[path];
    const oldIndex = indices[origin.slice(1)];
    for (let key in indices) {
        const element = $(`#sld_${key}`);
        // Scroll
        // Remove existing
        element.removeClass('sld_left sld_right');
        if (indices[key] < newIndex) {
            // Scroll left
            element.addClass('sld_left');
        } else if (indices[key] > newIndex) {
            // Scroll right
            // element.addClass('sld_right');
        }

        // Delay animations
        // Remove existing delays
        element.removeClass(function (i, className) {
            return (className.match(/(^|\s)sld_delay\S+/g) || []).join(' ');
        });

        // Calculate new delay
        if (indices[key] < oldIndex) {
            // Scroll left
            element.addClass(`sld_delay_${oldIndex - indices[key]}`);
        } else if (indices[key] > oldIndex) {
            // Scroll right
            element.addClass(`sld_delay_${indices[key] - oldIndex}`);
        }
    }
}
