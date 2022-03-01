require('./patient.js');
require('./contact.js');
require('./carePlan.js');
require('./task.js');
require('./outcome.js');
require('./outcomeValue.js');
require('./note.js');
// require('./files.js');
const ParseAuditor = require('../node_modules/parse-auditor/src/index.js');

Parse.Cloud.define("ensureClassDefaultFieldsForParseCareKit", async (request) =>  {

    const clp = {
        get: { requiresAuthentication: true },
        find: { requiresAuthentication: true },
        create: { requiresAuthentication: true },
        update: { requiresAuthentication: true },
        delete: { requiresAuthentication: true },
        addField: { },
        protectedFields: { }
    };

    const patientSchema = new Parse.Schema('Patient');
    try {
      await patientSchema.get();
    } catch(error) {
      try {
        await patientSchema
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
        .addArray('allergies')
        .addString('groupIdentifier')
        .addArray('tags')
        .addString('source')
        .addString('asset')
        .addArray('notes')
        .addString('remoteID')
        .addObject('userInfo')
        .addObject('schemaVersion')
        .addArray('previousVersionUUIDs')
        .addArray('nextVersionUUIDs')
        .setCLP(clp)
        .save();
        console.log("***Success: Patient class created with default fields. Ignore any previous errors about this class***");
      } catch(error) { console.log(error); }
    }
    
    const carePlanSchema = new Parse.Schema('CarePlan');
    try {
      await carePlanSchema.get();
    } catch(error) {
      try {
        await carePlanSchema
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
        .addArray('previousVersionUUIDs')
        .addArray('nextVersionUUIDs')
        .setCLP(clp)
        .save();
        console.log("***Success: CarePlan class created with default fields. Ignore any previous errors about this class***");
      } catch(error) { console.log(error); }
    }
    
    const contactSchema = new Parse.Schema('Contact');
    try {
      await contactSchema.get();
    } catch(error) {
      try {
        await contactSchema
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
        .addArray('previousVersionUUIDs')
        .addArray('nextVersionUUIDs')
        .setCLP(clp)
        .save();
        console.log("***Success: Contact class created with default fields. Ignore any previous errors about this class***");
      } catch(error) { console.log(error); }
    }

    const taskSchema = new Parse.Schema('Task');
    try {
      await taskSchema.get();
    }catch(error) {
      try {
        await taskSchema
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
        .addArray('previousVersionUUIDs')
        .addArray('nextVersionUUIDs')
        .setCLP(clp)
        .save();
        console.log("***Success: Task class created with default fields. Ignore any previous errors about this class***");
      } catch(error) { console.log(error); }
    }

    const healthKitTaskSchema = new Parse.Schema('HealthKitTask');
    try {
      await healthKitTaskSchema.get();
    }catch(error) {
      try {
        await healthKitTaskSchema
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
        .addObject('healthKitLinkage')
        .addArray('previousVersionUUIDs')
        .addArray('nextVersionUUIDs')
        .setCLP(clp)
        .save();
        console.log("***Success: HealthKitTask class created with default fields. Ignore any previous errors about this class***");
      } catch(error) { console.log(error); }
    }

    const outcomeSchema = new Parse.Schema('Outcome');
    try {
      await outcomeSchema.get();
    } catch(error) {
      try {
        await outcomeSchema
        .addString('entityId')
        .addDate('createdDate')
        .addDate('updatedDate')
        .addDate('effectiveDate')
        .addDate('deletedDate')
        .addNumber('logicalClock')
        .addObject('timezone')
        .addDate('startDate')
        .addDate('endDate')
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
        .addArray('previousVersionUUIDs')
        .addArray('nextVersionUUIDs')
        .setCLP(clp)
        .save();
        console.log("***Success: Outcome class created with default fields. Ignore any previous errors about this class***");
      } catch(error) { console.log(error); }
    }

    const healthKitOutcomeSchema = new Parse.Schema('HealthKitOutcome');
    try {
      await healthKitOutcomeSchema.get();
    } catch(error) {
      try {
        await healthKitOutcomeSchema
        .addString('entityId')
        .addDate('createdDate')
        .addDate('updatedDate')
        .addDate('effectiveDate')
        .addDate('deletedDate')
        .addNumber('logicalClock')
        .addObject('timezone')
        .addDate('startDate')
        .addDate('endDate')
        .addNumber('taskOccurrenceIndex')
        .addArray('values')
        .addString('taskUUID')
        .addPointer('task', 'HealthKitTask')
        .addString('groupIdentifier')
        .addArray('tags')
        .addString('source')
        .addString('asset')
        .addArray('notes')
        .addString('remoteID')
        .addObject('userInfo')
        .addBoolean('isOwnedByApp')
        .addObject('schemaVersion')
        .addArray('previousVersionUUIDs')
        .addArray('nextVersionUUIDs')
        .setCLP(clp)
        .save();
        console.log("***Success: Outcome class created with default fields. Ignore any previous errors about this class***");
      } catch(error) { console.log(error); }
    }
    
    const clockSchema = new Parse.Schema('Clock');
    try {
      await clockSchema.get();
    } catch(error) {
      try {
        await clockSchema
        .addString('uuid')
        .addString('vector')
        .setCLP(clp)
        .save();
        console.log("***Success: Clock class created with default fields. Ignore any previous errors about this class***");
      } catch(error) { console.log(error); }
    }
});

Parse.Cloud.define("setParseClassLevelPermissions", async (request) =>  {
    const userSchema = new Parse.Schema('_User');
    await userSchema.get();
    userSchema.setCLP({
      get: { requiresAuthentication: true },
      find: { requiresAuthentication: true },
      create: { '*': true },
      update: { requiresAuthentication: true },
      delete: { requiresAuthentication: true },
      addField: { requiresAuthentication: true },
      protectedFields: { }
    });
    await userSchema.update({ useMasterKey: true });
    // Can uncomment out below once the respective Schema's are created.
    /*
    try {
      const installationSchema = new Parse.Schema('_Installation');
      await installationSchema.get();
      installationSchema.setCLP({
        get: { requiresAuthentication: true },
        find: { requiresAuthentication: true },
        create: { requiresAuthentication: true },
        update: { requiresAuthentication: true },
        delete: { requiresAuthentication: true },
        addField: { requiresAuthentication: true },
        protectedFields: { }
      });
      await installationSchema.update({ useMasterKey: true });
    } catch(error) { console.log(error); }

    try {
      const sessionSchema = new Parse.Schema('_Session');
      await sessionSchema.get();
      sessionSchema.setCLP({
        get: { requiresAuthentication: true },
        find: { requiresAuthentication: true },
        create: { '*': true },
        update: { requiresAuthentication: true },
        delete: { requiresAuthentication: true },
        addField: { },
        protectedFields: { }
      });
      await sessionSchema.update({ useMasterKey: true });
    } catch(error) { console.log(error); }

    try {
      const roleSchema = new Parse.Schema('_Role');
      await roleSchema.get();
      roleSchema.setCLP({
        get: { requiresAuthentication: true },
        find: { requiresAuthentication: true },
        create: { requiresAuthentication: true },
        update: { requiresAuthentication: true },
        delete: { requiresAuthentication: true },
        addField: { requiresAuthentication: true },
        protectedFields: { }
      });
      await roleSchema.update({ useMasterKey: true });
    } catch(error) { console.log(error); }

    try {
      const audienceSchema = new Parse.Schema('_Audience');
      await audienceSchema.get();
      audienceSchema.setCLP({
        get: { requiresAuthentication: true },
        find: { requiresAuthentication: true },
        create: { requiresAuthentication: true },
        update: { requiresAuthentication: true },
        delete: { requiresAuthentication: true },
        addField: { requiresAuthentication: true },
        protectedFields: { }
      });
      await audienceSchema.update({ useMasterKey: true });
    } catch(error) { console.log(error); }
    */
});

Parse.Cloud.define("setAuditClassLevelPermissions", async (request) =>  {
    const auditCLP = {
      get: { requiresAuthentication: true },
      find: { requiresAuthentication: true },
      create: { },
      update: { requiresAuthentication: true },
      delete: { requiresAuthentication: true },
      addField: { },
      protectedFields: { }
    };
    // Don't audit '_Role' as it doesn't work.
    const modifiedClasses = ['_User', '_Installation', '_Audience', 'Clock', 'Patient', 'CarePlan', 'Contact', 'Task', 'HealthKitTask', 'Outcome', 'HealthKitOutcome'];
    const accessedClasses = ['_User', '_Installation', '_Audience', 'Clock', 'Patient', 'CarePlan', 'Contact', 'Task', 'HealthKitTask', 'Outcome', 'HealthKitOutcome'];
    ParseAuditor(modifiedClasses, accessedClasses, { classPostfix: '_Audit', useMasterKey: true, clp: auditCLP });
});

Parse.Cloud.job("testPatientRejectDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('Patient');
    object.set('objectId', "112");
    object.save({ useMasterKey: true }).then((result) => {
      message("Saved patient");
    })
    .catch(error => message(error));
});

Parse.Cloud.job("testCarePlanRejectDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('CarePlan');
    object.set('objectId', "112");
    object.save({ useMasterKey: true }).then((result) => {
      message("Saved carePlan");
    })
    .catch(error => message(error));
});

Parse.Cloud.job("testContactRejectDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('Contact');
    object.set('objectId', "112");
    object.save({ useMasterKey: true }).then((result) => {
      message("Saved contact");
    })
    .catch(error => message(error));
});

Parse.Cloud.job("testTaskRejectDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('Task');
    object.set('objectId', "112");
    object.save({ useMasterKey: true }).then((result) => {
      message("Saved task");
    })
    .catch(error => message(error));
});

Parse.Cloud.job("testOutcomeRejectDuplicates", (request) =>  {
    const { params, headers, log, message } = request;
    
    const object = new Parse.Object('Outcome');
    object.set('objectId', "112");
    object.save({ useMasterKey: true }).then((result) => {
      message("Saved outcome");
    })
    .catch(error => message(error));
});
