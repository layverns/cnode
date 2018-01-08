const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const runSequence = require('run-sequence');

gulp.task('env:test', function () {
    process.env.NODE_ENV = 'test';
});

gulp.task('env:dev', function () {
    process.env.NODE_ENV = 'development';
});

gulp.task('env:prod', function () {
    process.env.NODE_ENV = 'production';
});

gulp.task('nodemon', function () {
    return nodemon({
        script: 'server.js',
        ext: 'js,html',
        verbose: true
    });
});

gulp.task('default', function (done) {
    runSequence('env:dev', 'nodemon', done);
});

gulp.task('prod', function (done) {
    runSequence('env:prod', 'nodemon', done);
});
