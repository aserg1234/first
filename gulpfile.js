const gulp = require('gulp');
const browserSync = require('browser-sync');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');//плагин переименовывает файлы после компиляции



// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});

//создаем задачу для наших шаблонщиков
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/template/index.pug')
    .pipe(pug({
      // Your options in here.
      pretty: true

    }))
    .pipe(gulp.dest('build'))
  });

  //создаем задачу для sass стилей
  gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')//где файл sass
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))//{outputStyle: 'compressed'}-сжимает код
      .pipe(rename('main.min.css'))//изм файл
      .pipe(gulp.dest('build/css'));//куда отправл готовые
  });

//создаем задачу создания спрайтов
gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprite.png',
      cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});

//задача по очистке build директории
gulp.task('clean', function del(cb){
    return rimraf('build', cb);
});


//задача для копирования шрифтов в папку build
gulp.task('copy:fonts', function (){
    return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});
//задача для копирования картинок в папку build
gulp.task('copy:images', function (){
    return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});
//задача объединяющая копир шрифтов и картинок
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

//watch задачи набл за изменениями и автоматом компилирующие
gulp.task('watch', function(){
    gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});

//задача что будет делаться по умолчанию
//если в терминале ввести команду gulp и нажать ввод, то выполнятся все 
//дефолтные команды
gulp.task('default', gulp.series(
    'clean', 
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')

));



