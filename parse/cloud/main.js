require('./patient.js');
require('./contact.js');
require('./carePlan.js');
require('./task.js');
require('./outcome.js');
require('./outcomeValue.js');
require('./note.js');

// main.js
Parse.Cloud.define('hello', async (request) => {
  console.log('From client: ' + JSON.stringify(request));
  return 'Hello world!';
});

Parse.Cloud.define("testCloudCode", async(request) => {
  console.log('From client: ' + JSON.stringify(request)); 
  return request.params.argument1;
});

Parse.Cloud.define("testCloudCodeError", async(request) => {
  console.log('From client: ' + JSON.stringify(request)); 
  throw new Parse.Error(3000, "cloud has an error on purpose.");
});

Parse.Cloud.beforeSave("GameScore", async(request) => {
  console.log('From client context: ' + JSON.stringify(request.context)); 
});

Parse.Cloud.job("testPatientRejectDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('Patient');
    object.set('uuid', "112");
    object.save({useMasterKey: true}).then((result) => {
      message("Saved patient");
    })
    .catch(error => message(error));
<<<<<<< HEAD
});
=======
});
>>>>>>> 47b5723f9bf8f67686dafc01312bb40a298fa9c8
