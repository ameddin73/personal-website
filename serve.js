const browserSync = require("browser-sync").create();
const history = require('connect-history-api-fallback');

browserSync.init({
    files: ["./**/*"],
    server: {
        baseDir: "./src/",
        middleware: [ history() ]
    }
});
