import $ from 'jquery';
import './index.css';
import html from './index.html';
import home from './home/home.html';
import projects from './projects/projects.html';

const routes = {
    home,
    projects
}

// Create main body and append content
$(html).appendTo('body');
// Get path name and load appropriate content
navigate({data: {path: window.location.pathname.substring(1)}});

// Routes for nav bar
$('#home').click({path: 'home'}, navigate);
$('#projects').click({path: 'projects'}, navigate);
$('#resume').click({path: 'resume'}, navigate);
$('#testimonials').click({path: 'testimonials'}, navigate);
$('#contact').click({path: 'contact'}, navigate);

// Push a new path and update document metadata
function navigate({data: {path}}) {
    // Make sure it's a real route
    if (!routes.hasOwnProperty(path)) path = 'home';

    // Capitalize the path to get our title
    const title = path.charAt(0).toUpperCase() + path.slice(1);

    // Update path
    window.history.pushState(window.history.state,
        title,
        `/${path}`);

    // Update page title
    document.title = `${title} | Alex Meddin`;

    // Update content
    $('#content').html(routes[path]);
}