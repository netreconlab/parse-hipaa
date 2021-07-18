require('./activity.js');
//require('./files.js');
//const ParseAuditor = require('../node_modules/parse-auditor/src/index.js');

// main.js
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
        .addObject('timezone')
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
        .addObject('timezone')
        .addObject('name')
        .addString('sex')
        .addDate('birthday')
        .addString('allergies')
        .addString('groupIdentifier')
        .addArray('tags')
        .addString('source')
        .addString('asset')
        .addArray('notes')
        .addString('remoteID')
        .addObject('userInfo')
        .addObject('schemaVersion')
        .addString('previousVersionUUID')
        .addPointer('previousVersion', 'Patient')
        .addString('nextVersionUUID')
        .addPointer('nextVersion', 'Patient')
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
        .addObject('timezone')
        .addString('title')
        .addString('patientUUID')
        .addPointer('patient', 'Patient')
        .addString('groupIdentifier')
        .addArray('tags')
        .addString('source')
        .addString('asset')
        .addArray('notes')
        .addString('remoteID')
        .addObject('userInfo')
        .addObject('schemaVersion')
        .addString('previousVersionUUID')
        .addPointer('previousVersion', 'CarePlan')
        .addString('nextVersionUUID')
        .addPointer('nextVersion', 'CarePlan')
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
        .addObject('timezone')
        .addObject('name')
        .addString('title')
        .addString('role')
        .addString('organization')
        .addString('category')
        .addArray('emailAddresses')
        .addArray('messagingNumbers')
        .addArray('otherContactInfo')
        .addArray('phoneNumbers')
        .addObject('address')
        .addString('carePlanUUID')
        .addPointer('carePlan', 'CarePlan')
        .addString('groupIdentifier')
        .addArray('tags')
        .addString('source')
        .addString('asset')
        .addArray('notes')
        .addString('remoteID')
        .addObject('userInfo')
        .addObject('schemaVersion')
        .addString('previousVersionUUID')
        .addPointer('previousVersion', 'Contact')
        .addString('nextVersionUUID')
        .addPointer('nextVersion', 'Contact')
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
        .addObject('timezone')
        .addNumber('index')
        .addString('kind')
        .addString('units')
        .addString('type')
        .addObject('value')
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
        .addObject('timezone')
        .addString('title')
        .addString('instructions')
        .addBoolean('impactsAdherence')
        .addObject('schedule')
        .addArray('elements')
        .addString('carePlanUUID')
        .addPointer('carePlan', 'CarePlan')
        .addString('groupIdentifier')
        .addArray('tags')
        .addString('source')
        .addString('asset')
        .addArray('notes')
        .addString('remoteID')
        .addObject('userInfo')
        .addObject('schemaVersion')
        .addString('previousVersionUUID')
        .addPointer('previousVersion', 'Task')
        .addString('nextVersionUUID')
        .addPointer('nextVersion', 'Task')
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
        .addObject('timezone')
        .addDate('date')
        .addNumber('taskOccurrenceIndex')
        .addArray('values')
        .addString('taskUUID')
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
    
    const clockSchema = new Parse.Schema('Clock');
    await clockSchema.get()
    .catch(error => {
        clockSchema.addString('uuid')
        .addString('vector')
        .setCLP(clp)
        .save()
        .then((result) => {
          console.log("***Success: Clock class created with default fields. Ignore any previous errors about this class***");
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
/*
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
    ParseAuditor(['_User', '_Role', '_Installaiton', '_Audience', 'Clock', 'Patient', 'CarePlan', 'Contact', 'Task', 'Outcome', 'OutcomeValue', 'Note'], ['_User', '_Role', 'Clock', 'Patient', 'CarePlan', 'Contact', 'Task', 'Outcome', 'OutcomeValue', 'Note'], { classPostfix: '_Audit', useMasterKey: true, clp: auditCLP });
});
*/
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
