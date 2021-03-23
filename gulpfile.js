var gulp = require('gulp'),
sass = require('gulp-dart-sass'),
autoprefixer = require('gulp-autoprefixer'),
jshint = require('gulp-jshint'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
notify = require('gulp-notify'),
cache = require('gulp-cache'),
browserSync = require('browser-sync').create(),
del = require('del'),
watchSass = require("gulp-watch-sass"),
cleanCSS = require('gulp-clean-css');

gulp.task('process-styles', function () {
	var postcss = require('gulp-postcss');
	var assets  = require('postcss-assets');
   
	return gulp.src(['./theme.css','theme.min.css'])
	  .pipe(postcss([assets({
		loadPaths: ['inc/bootstrap-icons/','assets/images/']
	  })]))
	  .pipe(gulp.dest('.'));
  });

gulp.task('compile-styles', function() {
    return gulp.src('./theme.scss')
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(autoprefixer('last 2 versions'))
      .pipe(gulp.dest('.'))
      .pipe(rename({suffix: '.min'}))
      .pipe(cleanCSS('level: 2'))
      .pipe(gulp.dest('.'))
      .pipe(browserSync.stream())
      .pipe(notify({ message: 'Styles task complete' }));
  });

gulp.task('styles', gulp.series('compile-styles', 'process-styles'));

gulp.task('serve', function() {

    browserSync.init({
        proxy: "method.test:8080"
    });

    // Watch .scss files
    gulp.watch(['./**/*.scss', '!./node_modules/', '!./.git/'], gulp.series('compile-styles', 'process-styles'));

    gulp.watch(['./**/*.*', '!./node_modules/', '!./.git/']).on('change', browserSync.reload);
    
});

gulp.task('scripts', function() {
    return gulp.src(['inc/bootstrap/js/bootstrap.bundle.js','inc/matchHeight/jquery.matchHeight.js','inc/jarallax/jarallax.js'])
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
      gulp.watch(['./**/*.scss', '!./node_modules/', '!./.git/'], gulp.series('compile-styles', 'process-styles'));
    
});
