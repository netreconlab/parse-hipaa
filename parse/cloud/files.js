const NodeClam = require('clamscan');
const {PassThrough} = require('stream');
const webRequest = require('request');

Parse.Cloud.beforeSaveFile(async (request) => {
    const { file, user } = request;
    
    var isInfected;
    var virusesFound;
    const fileData = await file.getData();
    try {
        // Get instance by resolving ClamScan promise object
        const clamscan = await new NodeClam().init({
            clamdscan: {
                host: 'scan', // IP of host to connect to TCP interface
                port: 3310,
            }
        });
        var stream = new PassThrough();
        console.log('1111');
        stream.write(fileData);
        stream.end();
        const {is_infected, viruses} = await clamscan.scan_stream(stream);
        isInfected = is_infected;
        virusesFound = viruses;
    } catch (err) {
        // Handle any errors raised by the code in the try block
        throw `Error scanning for virus or malware ${err}`;
    }
    if (isInfected === true) {
        throw `********* Virus or malware was detected! This file was not uploaded. Viruses detected: (${virusesFound.join('')})`;
    } else if (isInfected === null) {
        throw `Couldn't scan file for virus, not saving...`
    }
    file.da
    return file;
});

Parse.Cloud.define("setTestSchema", async (request) =>  {
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
    await testSchema.get()
    .catch(error => {
        testSchema.addFile('textFile')
        .setCLP(clp)
        .save()
        .then((result) => {
          console.log("***Success: ScheduleElement class created with default fields. Ignore any previous errors about this class***");
        })
        .catch(error => console.log(error))
    });
});


Parse.Cloud.job("testSaveFile", async (request) =>  {
    const { params, headers, log, message } = request;
    const normal_file_url = 'https://raw.githubusercontent.com/kylefarris/clamscan/sockets/README.md';
    await Parse.Cloud.run("setTestSchema");
    const object = new Parse.Object('Test');
    var file = new Parse.File("README.md", {uri: normal_file_url});
    console.log(file);
    object.set('textFile', file);
    object.save(null,{useMasterKey: true}).then((result) => {
      console.log("Saved file");
    })
    .catch(error => console.log(error));
});

Parse.Cloud.job("testDontSaveUnauthenticatedFile", async (request) =>  {
    const { params, headers, log, message } = request;
    const normal_file_url = 'https://raw.githubusercontent.com/kylefarris/clamscan/sockets/README.md';
    await Parse.Cloud.run("setTestSchema");
    const object = new Parse.Object('Test');
    var file = new Parse.File("README.md", {uri: normal_file_url});
    object.set('textFile', file);
    object.save().then((result) => {
        console.log("Saved file");
    })
    .catch(error => console.log(error));
});

Parse.Cloud.job("testDontSaveVirusFile", async (request) =>  {
    const { params, headers, log, message } = request;
    const fake_virus_url = 'https://secure.eicar.org/eicar_com.txt';
    await Parse.Cloud.run("setTestSchema");
    const object = new Parse.Object('Test');
    var file = new Parse.File("eicar_com.txt", {uri: fake_virus_url});
    object.set('textFile', file);
    object.save(null,{useMasterKey: true}).then((result) => {
        console.log("Saved file");
    })
    .catch(error => console.log(error));
});
