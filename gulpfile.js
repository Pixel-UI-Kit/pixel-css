/*
SPECIAL JAVASCRIPT FILE FOR PIXELUI KI DEBUGGING AND COMPILE RELEASES
!!! ONLY FOR DEVELOPERS !!!
AUTHOR:       Qroia FAK(C)E
CONTRIBUTORS: QROIA, ...
RELEASE: 0.9
*/

'use strict';

const gulp       = require('gulp');
const sass       = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const watch      = require('gulp-watch');
const csso       = require('gulp-csso');
const rename     = require('gulp-rename');
const group_mq   = require('gulp-group-css-media-queries');
const concat     = require('gulp-concat');
const bs         = require('browser-sync').create();

/* ~~~~~~~~~~~~~~~~~~~PATHS~~~~~~~~~~~~~~~~~~~~~~ */
const paths = {
    scss: './scss/**/*.scss',
    scss_min: './scss/main.scss',
    css: './res/**/*.css',
    res: './res/',
    res_min: './res/min/',
    html: './*.html',
    js: './js/**/*.js'
};

/* ~~~~~~~~~~~~DEBUGGING FUNCTIONS~~~~~~~~~~~~~~~ */

gulp.task('html', () => {  
    gulp.src('./*.html')
        .pipe(gulp.dest('./'));
});

gulp.task('scripts', function() {
    return gulp.src(paths.js)
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest('js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('./js'));
  });

// Compile SCSS file to CSS(+maps) for debugging
gulp.task('sass-compile', () => {
    return gulp.src(paths.scss)
        .pipe(concat('main.css'))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.res))
});

// Compile SCSS file to min.CSS file for using
gulp.task('minify', () => {
    return gulp.src(paths.scss)
        .pipe(concat('main.css'))
        // Compress file
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(group_mq())
        // Rename: *.css -> *.min.css
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.res_min))
        .pipe(csso())
});

// Watching files
gulp.task('watch', () => {
    gulp.watch(paths.scss,
        gulp.series('sass-compile', 'minify'))
});

// BrowserSync
gulp.task('browser-sync', () => {  
    bs.init([paths.css, paths.js], {
        server: {
            baseDir: "./"
        }
    });
});

// Default debugging Mode
gulp.task('default', gulp.series('sass-compile', 'browser-sync'), () => {  
    gulp.watch(paths.scss, ['sass-compile']).on("change", reload);
    gulp.watch(paths.html, ['html']).on("change", reload);
    gulp.watch(paths.js, ['scripts']).on("change", reload);
});

/* ~~~~~~~~~~~~~~~~~~~FUNCTIONS~~~~~~~~~~~~~~~~~~~~~~ */

// All *.scss files to united main.scss file
const merge = () => {
    return gulp.src(paths.scss)
        .pipe(concat('main.scss'))
};

// Compile main.scss to main.css and .map
const compile = () => {

};

// Minify main.scss to main.min.css
const minify = () => {
    return gulp.src(paths.scss)
        // Compress file
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(group_mq())
        // Rename: *.css -> *.min.css
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.res_min))
        .pipe(csso())
};


/* ~~~~~~~~~~~~~~~~~~~EXPORTS~~~~~~~~~~~~~~~~~~~~~~ */

// Export standart functions
exports.merge   = merge;
exports.compile = compile;
exports.minify  = minify;

exports.build   = series(
    merge,
    compile,
    minify
);