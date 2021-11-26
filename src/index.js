import $ from 'jquery';
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
const url = window.location.pathname.substring(1);
navigate({
    data: {
        title: url.charAt(0).toUpperCase() + url.slice(1),
        path: url
    }
})

// Routes for nav bar
$('#home').click({title: 'Home', path: 'home'}, navigate);
$('#projects').click({title: 'Projects', path: 'projects'}, navigate);

// Push a new path and update document metadata
function navigate({data: {title, path}}) {
    window.history.pushState(window.history.state, title, `/${path}`);
    document.title = title;
    $('#content').html(routes[path]);
}