require('./patient.js');
require('./contact.js');
require('./carePlan.js');
require('./task.js');
require('./outcome.js');
require('./outcomeValue.js');
require('./note.js');

Parse.Cloud.define("ensureClassDefaultFieldsForParseCareKit", async (request) =>  {
    
    const patientSchema = new Parse.Schema('Patient');
    await patientSchema.get()
    .catch(error => {
        patientSchema.addString('uuid')
        .addString('entityId')
        .addNumber('logicalClock')
        .save({useMasterKey: true}).then((result) => {
          console.log("Patient class created and saved default fields");
         })
        .catch(error => console.log(error));
    });
    
    const carePlanSchema = new Parse.Schema('CarePlan');
    await carePlanSchema.get()
    .catch(error => {
        carePlanSchema.addString('uuid')
        .addString('entityId')
        .addNumber('logicalClock')
        .save({useMasterKey: true})
        .then((result) => {
          console.log("CarePlan class created and saved default fields");
         })
        .catch(error => console.log(error));
    });
    
    const contactSchema = new Parse.Schema('Contact');
    await contactSchema.get()
    .catch(error => {
        contactSchema.addString('uuid')
        .addString('entityId')
        .addNumber('logicalClock')
        .save({useMasterKey: true})
        .then((result) => {
          console.log("Contact class created and saved default fields");
        })
        .catch(error => console.log(error));
    });
    
    const taskSchema = new Parse.Schema('Task');
    await taskSchema.get()
    .catch(error => {
        taskSchema.addString('uuid')
        .addString('entityId')
        .addNumber('logicalClock')
        .save({useMasterKey: true})
        .then((result) => {
          console.log("Task class created and saved default fields");
         })
         .catch(error => console.log(error))
    });
    
    const outcomeSchema = new Parse.Schema('Outcome');
    await outcomeSchema.get()
    .catch(error => {
        outcomeSchema.addString('uuid')
        .addString('entityId')
        .addNumber('logicalClock')
        .save({useMasterKey: true})
        .then((result) => {
          console.log("Outcome class created and saved default fields");
        })
        .catch(error => console.log(error))
    });
    
    const outcomeValueSchema = new Parse.Schema('OutcomeValue');
    await outcomeValueSchema.get()
    .catch(error => {
        outcomeValueSchema.addString('uuid')
        .addString('entityId')
        .addNumber('logicalClock')
        .save({useMasterKey: true})
        .then((result) => {
          console.log("OutcomeValue class created and saved default fields");
        })
        .catch(error => console.log(error))
    });
    
    const noteSchema = new Parse.Schema('Note');
    await noteSchema.get()
    .catch(error => {
        noteSchema.addString('uuid')
        .addString('entityId')
        .addNumber('logicalClock')
        .save({useMasterKey: true})
        .then((result) => {
          console.log("Note class created and saved default fields");
        })
        .catch(error => console.log(error))
    });
});

Parse.Cloud.run('ensureClassDefaultFieldsForParseCareKit'); //Run function when server first starts up

Parse.Cloud.job("testRejectingDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('Task');
    object.set('uuid', "112");
    object.save({useMasterKey: true}).then((result) => {
      message("Saved task");
      log("Saved task " + result)
    })
    .catch(error => message(error));
});
