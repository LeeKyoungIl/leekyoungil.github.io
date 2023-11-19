var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass')(require('sass'));
var postcss     = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cp          = require('child_process');
var pug         = require('gulp-pug');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', gulp.series('jekyll-build', function (done) {
    browserSync.reload();
    done();
}));



gulp.task('sass', function () {
    return gulp.src('assets/css/main.scss')
        .pipe(sass({
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.stream())
        .pipe(gulp.dest('assets/css'));
});

gulp.task('browser-sync', gulp.series('sass', 'jekyll-build', function(done) {
    browserSync.init({
        server: {
            baseDir: '_site'
        },
        port: 4000,
        notify: false
    });
    done();
}));

gulp.task('pug', function(){
    return gulp.src('_pugfiles/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('_includes'));
});

gulp.task('watch', function () {
    gulp.watch('assets/css/**', gulp.series('sass'));
    gulp.watch([
        'assets/js/**',
        'index.html',
        '_layouts/*.html',
        '_includes/*'
    ], gulp.series('jekyll-rebuild'));
    gulp.watch('_pugfiles/*.pug', gulp.series('pug'));
});

gulp.task('default', gulp.series('browser-sync', 'watch'));
