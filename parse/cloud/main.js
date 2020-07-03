require('./patient.js');
require('./contact.js');
require('./carePlan.js');
require('./task.js');
require('./outcome.js');
require('./outcomeValue.js');
require('./note.js');
require('./files.js');
const ParseAuditor = require('../node_modules/parse-auditor/src/index.js');

Parse.Cloud.define("ensureClassDefaultFieldsForParseCareKit", async (request) =>  {

    const clp = {
        get: { requiresAuthentication: true },
        find: { requiresAuthentication: true },
        create: { requiresAuthentication: true },
        update: { requiresAuthentication: true },
        delete: { requiresAuthentication: true },
        addField: {},
        protectedFields: {}
    };
        
    const noteSchema = new Parse.Schema('Note');
    await noteSchema.get()
    .catch(error => {
        noteSchema.addString('uuid')
        .addDate('createdDate')
        .addDate('updatedDate')
        .addNumber('logicalClock')
        .addString('timezone')
        .addString('content')
        .addString('title')
        .addString('author')
        .addString('groupIdentifier')
        .addArray('tags')
        .addString('source')
        .addString('asset')
        .addArray('notes')
        .addString('remoteID')
        .addObject('userInfo')
        .addObject('schemaVersion')
        .setCLP(clp)
        .save()
        .then((result) => {
          console.log("***Success: Note class created with default fields. Ignore any previous errors about this class***");
        })
        .catch(error => console.log(error))
    });
    
    const patientSchema = new Parse.Schema('Patient');
    await patientSchema.get()
    .catch(error => {
        patientSchema.addString('uuid')
        .addString('entityId')
        .addDate('createdDate')
        .addDate('updatedDate')
        .addDate('deletedDate')
        .addDate('effectiveDate')
        .addNumber('logicalClock')
        .addString('timezone')
        .addObject('name')
        .addString('sex')
        .addDate('birthday')
        .addString('alergies')
        .addString('groupIdentifier')
        .addArray('tags')
        .addString('source')
        .addString('asset')
        .addArray('notes')
        .addString('remoteID')
        .addObject('userInfo')
        .addObject('schemaVersion')
        .addString('previousVersionUUIDString')
        .addPointer('previous', 'Patient')
        .addString('nextVersionUUIDString')
        .addPointer('next', 'Patient')
        .setCLP(clp)
        .save().then((result) => {
          console.log("***Success: Patient class created with default fields. Ignore any previous errors about this class***");
         })
        .catch(error => console.log(error));
    });
    
    const carePlanSchema = new Parse.Schema('CarePlan');
    await carePlanSchema.get()
    .catch(error => {
        carePlanSchema.addString('uuid')
        .addString('entityId')
        .addDate('createdDate')
        .addDate('updatedDate')
        .addDate('deletedDate')
        .addDate('effectiveDate')
        .addNumber('logicalClock')
        .addString('timezone')
        .addString('title')
        .addString('patientUUIDString')
        .addPointer('patient', 'Patient')
        .addString('groupIdentifier')
        .addArray('tags')
        .addString('source')
        .addString('asset')
        .addArray('notes')
        .addString('remoteID')
        .addObject('userInfo')
        .addObject('schemaVersion')
        .addString('previousVersionUUIDString')
        .addPointer('previous', 'CarePlan')
        .addString('nextVersionUUIDString')
        .addPointer('next', 'CarePlan')
        .setCLP(clp)
        .save()
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
        .addDate('createdDate')
        .addDate('updatedDate')
        .addDate('deletedDate')
        .addDate('effectiveDate')
        .addNumber('logicalClock')
        .addString('timezone')
        .addObject('name')
        .addString('title')
        .addString('role')
        .addString('organization')
        .addString('category')
        .addArray('emailAddressesArray')
        .addArray('messagingNumbersArray')
        .addArray('otherContactInfoArray')
        .addArray('phoneNumbersArray')
        .addObject('address')
        .addString('carePlanUUIDString')
        .addPointer('carePlan', 'CarePlan')
        .addString('groupIdentifier')
        .addArray('tags')
        .addString('source')
        .addString('asset')
        .addArray('notes')
        .addString('remoteID')
        .addObject('userInfo')
        .addObject('schemaVersion')
        .addString('previousVersionUUIDString')
        .addPointer('previous', 'Contact')
        .addString('nextVersionUUIDString')
        .addPointer('next', 'Contact')
        .setCLP(clp)
        .save()
        .then((result) => {
          console.log("***Success: Contact class created with default fields. Ignore any previous errors about this class***");
        })
        .catch(error => console.log(error));
    });
    
    const outcomeValueSchema = new Parse.Schema('OutcomeValue');
    await outcomeValueSchema.get()
    .catch(error => {
        outcomeValueSchema.addString('uuid')
        .addDate('createdDate')
        .addDate('updatedDate')
        .addNumber('logicalClock')
        .addString('timezone')
        .addNumber('index')
        .addString('kind')
        .addString('units')
        .addString('typeString')
        .addString('textValue')
        .addObject('binaryValue')
        .addBoolean('booleanValue')
        .addNumber('integerValue')
        .addNumber('doubleValue')
        .addDate('dateValue')
        .addString('groupIdentifier')
        .addArray('tags')
        .addString('source')
        .addString('asset')
        .addArray('notes')
        .addString('remoteID')
        .addObject('userInfo')
        .addObject('schemaVersion')
        .setCLP(clp)
        .save()
        .then((result) => {
          console.log("***Success: OutcomeValue class created with default fields. Ignore any previous errors about this class***");
        })
        .catch(error => console.log(error))
    });
    
    const scheduleElementSchema = new Parse.Schema('ScheduleElement');
    await scheduleElementSchema.get()
    .catch(error => {
        scheduleElementSchema.addNumber('logicalClock')
        .addDate('start')
        .addDate('end')
        .addObject('interval')
        .addString('text')
        .addArray('targetValues')
        .addArray('elements')
        .setCLP(clp)
        .save()
        .then((result) => {
          console.log("***Success: ScheduleElement class created with default fields. Ignore any previous errors about this class***");
        })
        .catch(error => console.log(error))
    });
    
    const taskSchema = new Parse.Schema('Task');
    await taskSchema.get()
    .catch(error => {
        taskSchema.addString('uuid')
        .addString('entityId')
        .addDate('createdDate')
        .addDate('updatedDate')
        .addDate('deletedDate')
        .addDate('effectiveDate')
        .addNumber('logicalClock')
        .addString('timezone')
        .addString('title')
        .addString('instructions')
        .addBoolean('impactsAdherence')
        .addArray('elements')
        .addString('carePlanUUIDString')
        .addPointer('carePlan', 'CarePlan')
        .addString('groupIdentifier')
        .addArray('tags')
        .addString('source')
        .addString('asset')
        .addArray('notes')
        .addString('remoteID')
        .addObject('userInfo')
        .addObject('schemaVersion')
        .addString('previousVersionUUIDString')
        .addPointer('previous', 'Task')
        .addString('nextVersionUUIDString')
        .addPointer('next', 'Task')
        .setCLP(clp)
        .save()
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
        .addDate('createdDate')
        .addDate('updatedDate')
        .addDate('deletedDate')
        .addNumber('logicalClock')
        .addString('timezone')
        .addDate('date')
        .addNumber('taskOccurrenceIndex')
        .addArray('values')
        .addString('taskUUIDString')
        .addPointer('task', 'Task')
        .addString('groupIdentifier')
        .addArray('tags')
        .addString('source')
        .addString('asset')
        .addArray('notes')
        .addString('remoteID')
        .addObject('userInfo')
        .addObject('schemaVersion')
        .setCLP(clp)
        .save()
        .then((result) => {
          console.log("***Success: Outcome class created with default fields. Ignore any previous errors about this class***");
        })
        .catch(error => console.log(error))
    });
    
    const knowledgeVectorSchema = new Parse.Schema('KnowledgeVector');
    await knowledgeVectorSchema.get()
    .catch(error => {
        knowledgeVectorSchema.addString('uuid')
        .addString('vector')
        .setCLP(clp)
        .save()
        .then((result) => {
          console.log("***Success: KnowledgeVector class created with default fields. Ignore any previous errors about this class***");
        })
        .catch(error => console.log(error))
    });
});

Parse.Cloud.define("setUserClassLevelPermissions", async (request) =>  {
    const userSchema = new Parse.Schema('_User');
    await userSchema.get();
    userSchema.setCLP({
      get: { requiresAuthentication: true },
      find: { requiresAuthentication: true },
      create: { '*': true },
      update: { requiresAuthentication: true },
      delete: { requiresAuthentication: true },
      addField: {},
      protectedFields: {}
    });
    await userSchema.update({useMasterKey: true});
});

Parse.Cloud.define("setAuditClassLevelPermissions", async (request) =>  {
    const auditCLP = {
      get: { requiresAuthentication: true },
      find: { requiresAuthentication: true },
      create: {},
      update: { requiresAuthentication: true },
      delete: { requiresAuthentication: true },
      addField: {},
      protectedFields: {}
    };
    ParseAuditor(['_User', '_Role', 'Patient', 'CarePlan', 'Contact', 'Task', 'ScheduleElement', 'Outcome', 'OutcomeValue', 'Note'], [], { useMasterKey: true, clp: auditCLP });
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

/*
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
*/
