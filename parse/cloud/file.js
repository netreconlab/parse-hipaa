const NodeClam = require('clamscan');
const {Readable} = require('stream');
const webRequest = require('request');

Parse.Cloud.beforeSave(Parse.File, async (request) => {
    const { file, user } = request;
    try {
        const fileData = Buffer.from(await file.getData(), 'base64').toString();
        // Get instance by resolving ClamScan promise object
        const clamscan = await new NodeClam().init({
            clamdscan: {
                host: 'scan', // IP of host to connect to TCP interface
                port: 3310,
            }
        });
        const stream = new Readable();
        stream.push(fileData);
        stream.push(null);
        const { isInfected, viruses } = await clamscan.scanStream(stream);
        if (isInfected) {
            throw `********* Virus or malware detected! This file was not uploaded. Viruses detected: (${viruses.join(',')}) *********`;
        } 
        return file;
    } catch(error) {
        // Handle any errors raised by the code in the try block
        throw `Error scanning for virus or malware ${error}`;
    }
});

Parse.Cloud.define("setTestSchema", async (request) =>  {
    const { params, headers, log } = request;
    const clp = {
        get: { requiresAuthentication: true },
        find: { requiresAuthentication: true },
        create: { requiresAuthentication: true },
        update: { requiresAuthentication: true },
        delete: { requiresAuthentication: true },
        addField: {},
        protectedFields: {}
    };
    const testSchema = new Parse.Schema('Test');
    try {
        await testSchema.get();
    } catch {
        try {
            await testSchema.addFile('textFile')
                .setCLP(clp)
                .save();        
                console.log("*** Success: Test class created with default fields. Ignore any previous errors about this class ***");
        } catch(error) {
            throw error;
        }
    }
});

Parse.Cloud.job("testSaveFile", async (request) =>  {
    const { params, headers, log, message } = request;
    const normal_file_url = 'https://github.com/netreconlab/parse-hipaa/blob/main/README.md';
    await Parse.Cloud.run("setTestSchema");
    const object = new Parse.Object('Test');
    const file = new Parse.File("README.md", { uri: normal_file_url });
    object.set('textFile', file);
    try {
        await object.save(null, { useMasterKey: true });
        message("Saved file");
    } catch(error) { 
        throw error; 
    }
});

Parse.Cloud.job("testDontSaveUnauthenticatedFile", async (request) =>  {
    const { params, headers, log, message } = request;
    const normal_file_url = 'https://github.com/netreconlab/parse-hipaa/blob/main/README.md';
    await Parse.Cloud.run("setTestSchema");
    const object = new Parse.Object('Test');
    const file = new Parse.File("README.md", { uri: normal_file_url });
    object.set('textFile', file);
    try {
        await object.save();
        message("Saved file");
    } catch(error) { 
        throw error;
    }
});

Parse.Cloud.job("testDontSaveVirusFile", async (request) =>  {
    const { params, headers, log, message } = request;
    const fake_virus_url = 'https://secure.eicar.org/eicar.com';
    await Parse.Cloud.run("setTestSchema");
    const object = new Parse.Object('Test');
    const file = new Parse.File("eicar.com", { uri: fake_virus_url });
    object.set('textFile', file);
    try {
        await object.save(null, { useMasterKey: true });
        message("Saved file");
    } catch(error) { 
        throw error; 
    }
});
