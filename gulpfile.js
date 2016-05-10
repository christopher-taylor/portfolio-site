var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer =require('gulp-autoprefixer');

/*
    DEV TASKS
*/
gulp.task('sass', function(){
  return gulp.src('src/scss/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('autoprefixer', function () {
  return gulp.src('src/css/**/*.css')
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    }
  })
});


gulp.task('watch', function(){
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/css/**/*.css', ['autoprefixer']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('default', function(callback){
  runSequence('prep-css', ['browserSync', 'watch'],
    callback
  )
})



/*
    BUILD TASKS
*/

gulp.task('prep-css', function(){
  return gulp.src('src/scss/**/*.scss')
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(gulp.dest('src/css'))
  // runSequence('sass', 'autoprefixer', 'minifyCSS', callback)
});

gulp.task('useref', function(){
  return gulp.src('src/**/*.html')
    .pipe(useref())

    // Only minify if its js
    .pipe(gulpIf('*.js', uglify()))

    // Only minify css
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
  return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
    interlaced: true
  })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function(){
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function(){
  return del.sync('dist');
})

gulp.task('build', function (callback) {
  runSequence('clean:dist', 'prep-css',
    ['useref', 'images', 'fonts'],
    callback
  )
})
