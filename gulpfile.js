'use strict';

var gulp = require('gulp'), 
	gp = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task('pug', function () {
	return gulp.src('src/pug/pages/*.pug')
		.pipe(gp.pug({
			pretty:true
		}))
		.pipe(gulp.dest('build'))
		.on('end', browserSync.reload);
});

gulp.task('sass', function () {
	return gulp.src('src/static/sass/*.sass')
		.pipe(gp.sourcemaps.init())
		.pipe(gp.sass())
		.pipe(gp.autoprefixer({
			browsers: ['last 8 versions'],
			cascade: false
        }))
        .on("error", gp.notify.onError({
	        title: "Error running something"
      	}))
		.pipe(gp.csso())
		.pipe(gp.sourcemaps.write())
		.pipe(gulp.dest('build/static/css/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('scripts:lib', function () {
	return gulp.src(['node_modules/jquery/dist/jquery.min.js', 
		'node_modules/slick-carousel/slick/slick.js'])
		.pipe(gp.concat('libs.min.js'))
		.pipe(gulp.dest('build/static/js/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('tinypng:dev', function () {
    return gulp.src('src/static/img/*.{png,jpg}')
        .pipe(gulp.dest('build/static/img/ '));
});

gulp.task('tinypng:build', function () {
    return gulp.src('src/static/img/*.{png,jpg}')
        .pipe(gp.tinypng('9PITDJuKCwQZPqfMGpUWRtDu9xJWhQor'))
        .pipe(gulp.dest('build/static/img/ '));
});

gulp.task('scripts', function () {
	return gulp.src('src/static/js/main.js')
		.pipe(gulp.dest('build/static/js/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('watch', function () {
	gulp.watch('src/pug/pages/**/*.pug', gulp.series('pug'));
	gulp.watch('src/static/sass/**/*.sass', gulp.series('sass'));
	gulp.watch('src/static/js/main.js', gulp.series('scripts'));
	gulp.watch('src/static/img/*', gulp.series('tinypng:dev'));
});

gulp.task('default', gulp.series(
	gulp.parallel('pug', 'sass', 'scripts:lib', 'scripts', 'tinypng:dev'),
	gulp.parallel('watch', 'serve')
));

gulp.task('build', gulp.series(
	gulp.parallel('pug', 'sass', 'scripts:lib', 'scripts', 'tinypng:build'),
	gulp.parallel('watch', 'serve')
));