const gulp = require('gulp'),
    sass = require('gulp-dart-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    cleanCSS = require('gulp-clean-css');

gulp.task('scripts', function () {
    return gulp
        .src([
            'inc/bootstrap/js/bootstrap.bundle.js',
            'inc/matchHeight/jquery.matchHeight.js',
            'assets/js/method-fluid-video.js',
        ])
        .pipe(concat('assets/js/scripts.js'))
        .pipe(gulp.dest('.'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('.'));
});

gulp.task('compile-front-styles', function () {
    console.log('Running compile-front-styles'); // Debug output

    return gulp
        .src('./assets/scss/front.scss')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('./assets/css/'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS({ level: 2 }))
        .pipe(gulp.dest('./assets/css/'))
        .pipe(browserSync.stream());
});

gulp.task('compile-editorui-styles', function () {
    console.log('Running compile-editorui-styles'); // Debug output

    return gulp
        .src('./assets/scss/editorui.scss')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('./assets/css/'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS({ level: 2 }))
        .pipe(gulp.dest('./assets/css/'))
        .pipe(browserSync.stream());
});

gulp.task('compile-global-styles', function () {
    console.log('Running compile-global-styles'); // Debug output

    return gulp
        .src('./assets/scss/global.scss')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('./assets/css/'))
        .pipe(browserSync.stream())
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS('level: 2'))
        .pipe(gulp.dest('./assets/css/'));
});

gulp.task('compile-admin-styles', function () {
    console.log('Running compile-admin-styles'); // Debug output

    return gulp
        .src('./assets/scss/admin.scss')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('./assets/css/'))
        .pipe(browserSync.stream())
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS('level: 2'))
        .pipe(gulp.dest('./assets/css/'));
});

// Leaving this in for now while I decide on task naming
gulp.task(
    'styles',
    gulp.series(
        'compile-front-styles',
        'compile-editorui-styles',
        'compile-global-styles',
        'compile-admin-styles'
    )
);
gulp.task(
    'compile-all-styles',
    gulp.series(
        'compile-front-styles',
        'compile-editorui-styles',
        'compile-global-styles',
        'compile-admin-styles'
    )
);

gulp.task('serve', function () {
    browserSync.init({
        proxy: 'method.test',
    });

    // Watch all SCSS files for live injection
    gulp.watch(
        ['./**/*.scss', '!./node_modules/**', '!./.git/**'],
        gulp.series('compile-all-styles')
    );

    // Watch everything else for browser reload (exclude compiled CSS and SCSS)
    gulp.watch([
        './**/*',
        '!./**/*.scss',
        '!./**/*.css',
        '!./node_modules/**',
        '!./.git/**',
    ]).on('change', browserSync.reload);
});

gulp.task('watch-styles', function () {
    // Watch all SCSS files for live injection
    gulp.watch(
        ['./**/*.scss', '!./node_modules/**', '!./.git/**'],
        gulp.series('compile-all-styles')
    );
});
