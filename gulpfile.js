var gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
autoprefixer = require('gulp-autoprefixer'),
cssnano = require('gulp-cssnano'),
jshint = require('gulp-jshint'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
notify = require('gulp-notify'),
cache = require('gulp-cache'),
livereload = require('gulp-livereload'),
del = require('del'),
watchSass = require("gulp-watch-sass");

gulp.task('styles', function() {
    return sass('theme.scss', { style: 'expanded' })
      .pipe(autoprefixer('since 2013'))
      .pipe(gulp.dest(''))
      .pipe(rename({suffix: '.min'}))
      .pipe(cssnano())
      .pipe(gulp.dest(''))
      .pipe(notify({ message: 'Styles task complete' }));
  });


gulp.task('scripts', function() {
    return gulp.src(['assets/js/bootstrap.bundle.js','assets/js/jquery.matchHeight.js','assets/js/inc/jarallax.js','assets/js/inc/jarallax-element.js'])
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'))
      .pipe(concat('assets/js/scripts.js'))
      .pipe(gulp.dest(''))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(''))
      .pipe(notify({ message: 'Scripts task complete' }));
});


gulp.task('watch', function() {
    
      // Watch .scss files
      gulp.watch('./**/*.scss', ['styles']);
    
});
