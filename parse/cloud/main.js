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
        .addDate('effectiveDate')
        .addDate('deletedDate')
        .addPointer('next', 'Patient')
        .save({useMasterKey: true}).then((result) => {
          console.log("***Success: Patient class created with default fields. Ignore any previous errors about this class***");
         })
        .catch(error => console.log(error));
    });
    
    const carePlanSchema = new Parse.Schema('CarePlan');
    await carePlanSchema.get()
    .catch(error => {
        carePlanSchema.addString('uuid')
        .addString('entityId')
        .addNumber('logicalClock')
        .addDate('effectiveDate')
        .addDate('deletedDate')
        .addPointer('next', 'CarePlan')
        .save({useMasterKey: true})
        .then((result) => {
          console.log("***Success: CarePlan class created with default fields. Ignore any previous errors about this class***");
         })
        .catch(error => console.log(error));
    });
    
    const contactSchema = new Parse.Schema('Contact');
    await contactSchema.get()
    .catch(error => {
        contactSchema.addString('uuid')
        .addString('entityId')
        .addNumber('logicalClock')
        .addDate('effectiveDate')
        .addDate('deletedDate')
        .addPointer('next', 'Contact')
        .save({useMasterKey: true})
        .then((result) => {
          console.log("***Success: Contact class created with default fields. Ignore any previous errors about this class***");
        })
        .catch(error => console.log(error));
    });
    
    const taskSchema = new Parse.Schema('Task');
    await taskSchema.get()
    .catch(error => {
        taskSchema.addString('uuid')
        .addString('entityId')
        .addNumber('logicalClock')
        .addDate('effectiveDate')
        .addDate('deletedDate')
        .addPointer('next', 'Task')
        .save({useMasterKey: true})
        .then((result) => {
          console.log("***Success: Task class created with default fields. Ignore any previous errors about this class***");
         })
         .catch(error => console.log(error))
    });
    
    const outcomeSchema = new Parse.Schema('Outcome');
    await outcomeSchema.get()
    .catch(error => {
        outcomeSchema.addString('uuid')
        .addString('entityId')
        .addNumber('logicalClock')
        .addDate('deletedDate')
        .save({useMasterKey: true})
        .then((result) => {
          console.log("***Success: Outcome class created with default fields. Ignore any previous errors about this class***");
        })
        .catch(error => console.log(error))
    });
    
    const outcomeValueSchema = new Parse.Schema('OutcomeValue');
    await outcomeValueSchema.get()
    .catch(error => {
        outcomeValueSchema.addString('uuid')
        .addNumber('logicalClock')
        .save({useMasterKey: true})
        .then((result) => {
          console.log("***Success: OutcomeValue class created with default fields. Ignore any previous errors about this class***");
        })
        .catch(error => console.log(error))
    });
    
    const noteSchema = new Parse.Schema('Note');
    await noteSchema.get()
    .catch(error => {
        noteSchema.addString('uuid')
        .addNumber('logicalClock')
        .save({useMasterKey: true})
        .then((result) => {
          console.log("***Success: Note class created with default fields. Ignore any previous errors about this class***");
        })
        .catch(error => console.log(error))
    });
    
    const knowledgeVectorSchema = new Parse.Schema('KnowledgeVector');
    await knowledgeVectorSchema.get()
    .catch(error => {
        knowledgeVectorSchema.addString('uuid')
        .save({useMasterKey: true})
        .then((result) => {
          console.log("***Success: KnowledgeVector class created with default fields. Ignore any previous errors about this class***");
        })
        .catch(error => console.log(error))
    });
});


Parse.Cloud.job("testPatientRejectDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('Patient');
    object.set('uuid', "112");
    object.save({useMasterKey: true}).then((result) => {
      message("Saved patient");
    })
    .catch(error => message(error));
});

Parse.Cloud.job("testCarePlanRejectDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('CarePlan');
    object.set('uuid', "112");
    object.save({useMasterKey: true}).then((result) => {
      message("Saved carePlan");
    })
    .catch(error => message(error));
});

Parse.Cloud.job("testContactRejectDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('Contact');
    object.set('uuid', "112");
    object.save({useMasterKey: true}).then((result) => {
      message("Saved contact");
    })
    .catch(error => message(error));
});

Parse.Cloud.job("testTaskRejectDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('Task');
    object.set('uuid', "112");
    object.save({useMasterKey: true}).then((result) => {
      message("Saved task");
    })
    .catch(error => message(error));
});

Parse.Cloud.job("testOutcomeRejectDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('Outcome');
    object.set('uuid', "112");
    object.save({useMasterKey: true}).then((result) => {
      message("Saved outcome");
    })
    .catch(error => message(error));
});

Parse.Cloud.job("testOutcomeValueRejectDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('OutcomeValue');
    object.set('uuid', "112");
    object.save({useMasterKey: true}).then((result) => {
      message("Saved outcomeValue");
    })
    .catch(error => message(error));
});

Parse.Cloud.job("testNoteRejectDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('Note');
    object.set('uuid', "112");
    object.save({useMasterKey: true}).then((result) => {
      message("Saved note");
    })
    .catch(error => message(error));
});
