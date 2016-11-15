const gulp         = require('gulp');
const uglify       = require('gulp-uglify');
const imagemin     = require('gulp-imagemin');
const babel        = require('gulp-babel');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS     = require('gulp-clean-css');
const htmlmin      = require('gulp-htmlmin');

gulp.task('default', ['build', 'watch']);

gulp.task('build', ['html', 'js', 'css', 'images']);

gulp.task('watch', () => {
  gulp.watch('resources/scripts/*.js', ['js']);
  gulp.watch('resources/scss/**/*.scss', ['css']);
  gulp.watch('resources/html/**/*.html', ['html']);
});

gulp.task('images', () => {
  gulp.src('public/img/*')
      .pipe(imagemin())
      .pipe(gulp.dest('public/img/'));
});

gulp.task('js', () => {
  gulp.src('resources/scripts/**/*.js')
      .pipe(babel({ presets: ['es2015'] }))
      .pipe(uglify())
      .pipe(gulp.dest('public/js/'));
});

gulp.task('css', () => {
  gulp.src('resources/scss/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie 6-8'] }))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('public/css/'));
});

gulp.task('html', () => {
  gulp.src('resources/html/**/*.html')
      .pipe(htmlmin({ collapseWhitespace: true, collapseInlineTagWhitespace: true, minifyCSS: true, minifyJS: true, removeComments: true }))
      .pipe(gulp.dest('public/'));
});
