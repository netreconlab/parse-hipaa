require('./main.ts');

Parse.Cloud.define('hello', function(req, res) {
  return 'Hi';
});
