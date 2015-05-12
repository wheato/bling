/**
 * Simply Grunt.js
 */

module.exports = function (grunt) {

  // Grunt Init
  grunt.initConfig({

    // Read package.json
    pkg: grunt.file.readJSON('package.json'),

    less: {
      development: {
        options: {
          // compress: true,
          // cleancss: true,
          optimization: 2,
          sourceMap: true,
          sourceMapFilename: "less/app.css.map",
          sourceMapURL: "../less/app.css.map",
          sourceMapBasepath: "less/"
        },
        files: {
          // target.css file: source.less file
          "css/app-less.css": "less/app.less"
        }
      }
    },

    cssmin: {
      options: {
        report: 'gzip'
      },
      min: {
        files: [
          {
            expand: true,
            cwd: 'publish/css',
            src: ['*.css', '!*.min.css'],
            dest: 'publish/css',
            ext: '.css'
          }
        ]
      }
    },

    // Auto Sprite
    sprite: {
      options: {
          // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
          imagepath: 'asset/',
          // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
          spritedest: 'publish/img/',
          // 替换后的背景路径，默认 ../images/
          spritepath: '../img/',
          // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
          padding: 0,
          // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
          newsprite: false,
          // 给雪碧图追加时间戳，默认不追加
          spritestamp: false,
          // 在CSS文件末尾追加时间戳，默认不追加
          cssstamp: false,
          // 默认使用二叉树最优排列算法
          algorithm: 'binary-tree',
          // 默认使用`pngsmith`图像处理引擎
          engine: 'pngsmith'
      },
      autoSprite: {
          files: [{
              //启用动态扩展
              expand: true,
              // css文件源的文件夹
              cwd: 'css',
              // 匹配规则
              src: ['*.css'],
              //导出css和sprite的路径地址
              dest: 'publish/css/',
              // 导出的css名
              ext: '.css'
          }]
      }
    },

    pngmin: {
      compile: {
        options: {
          ext: '.png',  // 后缀名
          force: true,  // 生成优化后的图片覆盖原始图片
          iebug: false  // 为 IE6 优化图片，如需要可设置`true`
          //quality: [60, 80]
        },
        files: [
          {
              src: ['publish/img/*.png'],
              dest: 'publish/img/'
          }
        ]
      }
    },

    //Js uglify
    uglify: {
      options: {
        mangle: {
          except: ['require', 'exports', 'module']
        },
        compress: {
          drop_console: true
        }
      },
      minjs: {
        files: [{
            expand: true,
            cwd: 'js',
            src: '**/*.js',
            dest: 'publish/js'
        }]
      }
    },

    //Copy Files
    copy: {
      htmldev: {
          files: [
              {expand: true, cwd: 'htmldev/img', src: ['**'], dest: 'img/'},
              {expand: true, cwd: 'htmldev/css', src: ['**'], dest: 'css/'}
          ]
      },
      css: {
          files: [
              {expand: true, cwd: 'css/', src: ['**'], dest: 'publish/css/'}
          ]
      },
      images:{
        files: [
            {expand: true, cwd: 'img/', src: ['**'], dest: 'publish/img/'}
        ]
      },
      html:{
        files: [
            {expand: true, cwd: 'html/', src: ['**'], dest: 'publish/html/'}
        ]
      },
      js:{
        files: [
            {expand: true, cwd: 'js/', src: ['**'], dest: 'publish/js/'}
        ]
      }
    },

    // 实时上传测试服务器
    http_upload: {
      wapstatic: {
        options: {
            url: 'http://ued.wsd.com/receiver/receiver.php',
            method: 'POST',
            to: '/data/wapstatic/<%= pkg.author.name %>/<%= pkg.name %>/'
        },
        // src: 'publish/html/**',
        src: 'publish/**',
        option: 'file'
      }
    },

    // 上传文件到CDN
    cdn_uploader: {
      publish: {
          options:{
              remote_path: '<%= pkg.cdnDir %>',
              version: 'v1',
              cdnDomain: 'http://3gimg.qq.com/mig-web',
              url: 'http://super.kf0309.3g.qq.com/qm/upload',
              username: '<%= pkg.author.name %>',
              isUploadCss: true,
              dir: 'publish/',
              imgHash: false
          },
          files: {
              src:['publish/html/**', 'publish/css/**', 'publish/js/**', 'publish/img/**']
          }
      }
    },

    compress: {
      pub: {
        options: {
          mode: 'zip',
          archive: 'publish/html/html.zip'
        },
        expand: true,
        cwd: 'publish/html/',
        src: ['*.html']
      }
    },

    watch: {
      less: {
        // Which files to watch (all .less files recursively in the less directory)
        files: ['less/**/*.less'],
        tasks: ['tocss'],
        options: {
          spawn: false
        }
      }
    }

  })//Grunt Init End

  //Load Npm Task
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-css-sprite');
  grunt.loadNpmTasks('grunt-pngmin');
  grunt.loadNpmTasks('grunt-http-upload2');
  grunt.loadNpmTasks('grunt-cdn-uploader');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('htmldev', [
    'copy:htmldev'
  ]);

  grunt.registerTask('tocss', [
    'less'
  ]);

  grunt.registerTask('devless', [
    'less',
    'watch:less'
  ]);

  grunt.registerTask('devtest', [
    'sprite',
    'copy:html',
    'copy:images',
    'copy:js',
    'pngmin',
    'http_upload:wapstatic'
  ]);

  grunt.registerTask('dev', [
    'sprite',
    'cssmin',
    'copy:html',
    'copy:images',
    'uglify:minjs',
    'pngmin',
    'http_upload:wapstatic'
  ]);

  grunt.registerTask('pub', [
    'cdn_uploader',
    'compress:pub'
  ]);
}