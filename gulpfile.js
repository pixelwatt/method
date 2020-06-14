var gulp = require('gulp'),
sass = require('gulp-dart-sass'),
autoprefixer = require('gulp-autoprefixer'),
cssnano = require('gulp-cssnano'),
jshint = require('gulp-jshint'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
notify = require('gulp-notify'),
cache = require('gulp-cache'),
browserSync = require('browser-sync').create(),
del = require('del'),
watchSass = require("gulp-watch-sass");

gulp.task('styles', function() {
    return gulp.src('./theme.scss')
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(autoprefixer('since 2013'))
      .pipe(gulp.dest('.'))
      .pipe(rename({suffix: '.min'}))
      .pipe(cssnano())
      .pipe(gulp.dest('.'))
      .pipe(browserSync.stream())
      .pipe(notify({ message: 'Styles task complete' }));
  });

gulp.task('serve', function() {

    browserSync.init({
        proxy: "spitfire.test"
    });

    // Watch .scss files
    gulp.watch('./**/*.scss', gulp.task('styles'));

    gulp.watch('./**/*.*').on('change', browserSync.reload);
    
});

gulp.task('scripts', function() {
    return gulp.src(['assets/js/bootstrap.bundle.js','assets/js/jquery.matchHeight.js','assets/js/jarallax.js','assets/js/jarallax-element.js'])
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'))
      .pipe(concat('assets/js/scripts.js'))
      .pipe(gulp.dest('.'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('.'))
      .pipe(notify({ message: 'Scripts task complete' }));
});


gulp.task('watch', function() {
    
      // Watch .scss files
      gulp.watch('./**/*.scss', ['styles']);
    
});
