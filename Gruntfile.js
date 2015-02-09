module.exports = function (grunt) {
    grunt.initConfig({
        // clean dirs
        clean: ['src/assets/css/', 'dist/'],
        // compile sass files
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'src/assets/css/main.css': 'src/assets/sass/main.scss'
                }
            }
        },
        // minify images
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'assets/img/',
                    src: ['*.{png,jpg,gif}'],
                    dest: '/build/assets/img/'
                }]
            }
        },
        // assemble static pages
        assemble: {
            options: {
                data: 'src/data/*.yml',
                layoutdir: 'src/layouts/',
                layout: 'default.hbs',
                partials: 'src/partials/*.hbs',
                assets: 'src/assets/',
                flatten: true
            },
            pages: {
                src: ['src/emails/*.hbs'],
                dest: 'dist/'
            }
        },
        // inline css
        premailer: {
            html: {
                options: {
                    removeComments: true
                },
                files: [{
                    expand: true,
                    src: ['dist/*.html'],
                    dest: ''
                }]
            },
            txt: {
                options: {
                    mode: 'txt'
                },
                files: [{
                    expand: true,
                    src: ['dist/*.html'],
                    dest: '',
                    ext: '.txt'
                }]
            }
        },
        // static server
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: 'dist'
                }
            }
        },
        // watch for changes
        watch: {
            statp: {
                files: ['assets/img/*', 'src/assets/sass/*', 'src/emails/*', 'src/layouts/*', 'src/partials/*'],
                tasks: ['build'],
                options: {
                    livereload: true
                }
            }
        },
        mailgun: {
            mailer: {
                options: {
                    key: 'MAILGUN_KEY',              // Enter your Mailgun key
                    sender: grunt.option('from'),    //SENDER_MAIL
                    recipient: grunt.option('to'),   //RECEPIENT_MAIL
                    subject: grunt.option('subject') //MESSAGE_SUBJECT
                },
                src: ['dist/'+grunt.option('template')]
            }
        },
        // Amazon S3 and Cloudfront
        s3: {
            options: {
                accessKeyId: 'AWS_KEY', // change with your AWS key
                secretAccessKey: 'AWS_SECRET_KEY', // change with your AWS secret key
                bucket: 'NAME_OF_BUCKET' // change with your AWS bucket name

            },
            build: {
                cwd: 'src/assets/img/build',
                src: '**'
            }
        },
        // cdnfiy assets paths
        cdnify: {
            someTarget: {
                options: {
                base: 'URL_TO_PREPEND'  // the url to append eg http://cdn.site.com
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: '**/*.html',
                    dest: 'dist'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-premailer');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-aws');
    grunt.loadNpmTasks('grunt-cdnify');
    grunt.loadNpmTasks('grunt-mailgun');

    grunt.registerTask('build', ['clean','sass','assemble','premailer','newer:imagemin']);
    grunt.registerTask('dev', ['build', 'connect', 'watch']);
    grunt.registerTask('cdnifyd', ['build','s3','cdnify']);
    grunt.registerTask('send', ['mailgun']);

};
