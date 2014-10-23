module.exports = function(grunt) {

    var jsResources = grunt.file.readJSON('./theme/resources.json');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            options: {
                includePaths: ['bower_components/foundation/scss']
            },
            dist: {
                files: {
                    'public/dist/css/app.css': 'theme/scss/app.scss'
                }
            }
        },

        uglify: {
            options: {
                mangle: false,
                preserveComments: false,
                compress: true,
                beautify: true
            },
            target: {
                files: {
                    'public/dist/js/app-vendors.min.js': jsResources.vendors,
                    'public/dist/js/app-footer.min.js': jsResources.footer,
                    'public/dist/js/app-header.min.js': jsResources.header
                }
            }
        },

        watch: {
            grunt: {
                files: ['Gruntfile.js']
            },

            sass: {
                files: ['theme/scss/**/*.scss', 'bower_components/foundation/scss/**/*.scss'],
                tasks: ['sass']
            },

            uglify: {
                files: ['theme/resources.json', 'theme/js/**/*.js'],
                tasks: ['uglify']
            }
        }

    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', ['sass', 'uglify']);
    grunt.registerTask('default', ['build', 'watch']);
};
