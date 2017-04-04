var gulp = require('gulp')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var cleanCSS = require('gulp-clean-css')
var size = require('gulp-size')

gulp.task('minify-js', function () {
  return gulp.src('app/assets/javascripts/**/*.js')
  .pipe(rename('script.min.js'))
  .pipe(uglify())
  .pipe(size())
  .pipe(gulp.dest('public/js'))
})

gulp.task('minify-css', function () {
  return gulp.src('app/assets/stylesheets/*.css')
  .pipe(cleanCSS())
  .pipe(gulp.dest('public/css'))
})

gulp.task('default', [ 'minify-js' ])
