var gulp = require('gulp');
	scss = require('gulp-scss');
	sass = require('gulp-sass');
	browserSync = require('browser-sync');
	concat      = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify      = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия файлов)
    cssnano     = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename      = require('gulp-rename'); // Подключаем библиотеку для переименования
    del         = require('del'); // Подключаем библиотеку для удаления файлов и папок
    imagemin    = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant    = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
    cache       = require('gulp-cache'); // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer');


gulp.task('scss-main', function(){
    return gulp.src('app/scss/main.scss') // Берем все scss файлы из папки scss и дочерних, если таковые будут
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('scss-libs', function(){
    return gulp.src('app/scss/libs.scss') // Берем все scss файлы из папки scss и дочерних, если таковые будут
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('scss', ['scss-main', 'scss-libs'], function() {

})

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});


gulp.task('scripts-main', function() {
    return gulp.src('main.js')
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/js')) // Выгружаем в папку app/js
        .pipe(browserSync.reload({stream:true}));
});


gulp.task('scripts-libs', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
        ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('scripts', ['scripts-libs', 'scripts-main'], function() {

})

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});


gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});


gulp.task('build', ['scss', 'scripts'], function() {

})

gulp.task('build:prod', ['clean', 'img','build'], function() {
 	gulp.src('app/css/**/*') // Берем все scss файлы из папки scss и дочерних, если таковые будут
        .pipe(gulp.dest('dist/css'));

    gulp.src('app/js/**/*') // Берем все scss файлы из папки scss и дочерних, если таковые будут
    	.pipe(gulp.dest('dist/js'))

    gulp.src('app/*.html') // Берем все scss файлы из папки scss и дочерних, если таковые будут
    	.pipe(gulp.dest('dist/'))
})

gulp.task('watch', ['browser-sync', 'build'], function() {
    gulp.watch('app/scss/**/*.scss', ['scss']); // Наблюдение за scss файлами в папке scss

    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', ['scripts']); // Наблюдение за JS файлами в папке js
});