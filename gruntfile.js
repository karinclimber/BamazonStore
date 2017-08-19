// Gruntfile.js

module.exports = (grunt) => {
    grunt.initConfig({
      execute: {
        target: {
          src: ['bamazonCustomer.js']
        }
      },
      watch: {
        scripts: {
          files: ['bamazonCustomer.js'],
          tasks: ['execute'],
        },
      }
    });
  
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-execute');
  };