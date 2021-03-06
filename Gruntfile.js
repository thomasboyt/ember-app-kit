module.exports = function(grunt) {
  var config = {
    pkg: grunt.file.readJSON('package.json'),
    env: process.env,
    clean: ['tmp']
  };

  grunt.util._.extend(config, loadConfig('./tasks/options/'));

  grunt.initConfig(config);

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['build:debug']);
  grunt.registerTask('build',   [
                     'lock',
                     'clean',
                     // Uncomment this line and `npm install grunt-contrib-coffee --save-dev`
                     // for CoffeeScript support. See `tasks/options/coffee.js` for more details.
                     // 'coffee',
                     'copy:prepare',
                     'transpile',
                     'jshint',
                     'copy:stage',
                     'emberTemplates:compile',
                     // 'sass:app',
                     'concat',
                     'unlock' ]);

  grunt.registerTask('build:debug', "build a development friendly version of your app", [
                     'build',
                     'copy:vendor' ]);

  grunt.registerTask('build:dist', "build a production ready version of your app", [
                     'useminPrepare',
                     'build',
                     'uglify',
                     'rev',
                     'usemin' ]);

  grunt.registerTask('server',  ['build:debug', 'connect', 'watch']);
  grunt.registerTask('server:dist',  ['build:dist', 'connect:server:keepalive']);
};


// TODO: extract this out
function loadConfig(path) {
  var string = require('string');
  var glob = require('glob');
  var object = {};
  var key;

  glob.sync('*', {cwd: path}).forEach(function(option) {
    key = option.replace(/\.js$/,'');
    key = string(key).camelize().s;
    object[key] = require(path + option);
  });

  return object;
}

