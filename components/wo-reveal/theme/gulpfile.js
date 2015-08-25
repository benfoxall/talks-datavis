
var gulp = require('gulp');
var sass = require('gulp-sass');
 
gulp.task('sass', function () {
  gulp.src('./source/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./'));
});
 
gulp.task('watch', function () {
  gulp.watch('./source/*.scss', ['sass']);
});


gulp.task('default', ['sass']);
