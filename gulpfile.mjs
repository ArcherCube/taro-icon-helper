import gulp from 'gulp';
import babel from 'gulp-babel';

const sourcePath = 'src';
const outputPath = './dist';

const build = () => {
  return gulp
    .src([`${sourcePath}/**/*.ts`, `${sourcePath}/**/*.js`, `!${sourcePath}/type/**]`])
    .pipe(
      babel({
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' }, modules: false }],
          ['@babel/preset-typescript', { ignore: ['**/*.d.ts', 'node_modules/**/*.ts', '**/*.js'] }],
        ],
        plugins: [['add-import-extension', { extension: 'js' }]],
      }),
    )
    .pipe(gulp.dest(outputPath));
};

export default gulp.series(build);
