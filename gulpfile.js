var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    bulkSass = require('gulp-sass-bulk-import'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpif = require('gulp-if');

const sourcesPath = './src';
const assetsPath = './dist';

let env = 'development';

function scripts () {
  return gulp.src(sourcesPath + '/js/app.js')
    .pipe(webpackStream({
      output: {
        filename: 'app.min.js',
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              presets: ['@babel/preset-env']
            }
          },
        ]
      },
      mode: env,
    }))
    .pipe(gulp.dest(assetsPath + '/js/'))
};

function styles (done) {
  sassStream = gulp.src(sourcesPath + '/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(bulkSass())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({ basename: 'app', suffix: '.min'}))
    .pipe(gulpif(env === 'development', sourcemaps.write()))
    .pipe(gulp.dest(assetsPath + '/css'));
  done();
};


gulp.task('watch',function(done){
  gulp.watch(sourcesPath + '/js/**/*.js', gulp.series(scripts));
  gulp.watch(sourcesPath + '/sass/**/*.scss', gulp.series(styles));
  done();
});

gulp.task('build', function (done) {
  env = 'production';
  (gulp.series(scripts, styles)());
  done();
});

gulp.task('build:dev', function (done) {
  (gulp.series(scripts, styles)());
  done();
});
