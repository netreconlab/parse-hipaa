const NodeClam = require('clamscan');

Parse.Cloud.beforeSaveFile(async (request) => {
    const { file, user } = request;
    
    var isInfected;
    var virusFound;
    const fileData = await file.getData();
    
    try {
        // Get instance by resolving ClamScan promise object
        const clamscan = await new NodeClam().init({
            clamdscan: {
                host: 'scan', // IP of host to connect to TCP interface
                port: 3310,
            }
        });
        const {is_infected, viruses} = await clamscan.scan_stream(fileData);
        isInfected = is_infected;
        virusFound = viruses;
    } catch (err) {
        // Handle any errors raised by the code in the try block
        throw `Error scanning for virus or malware ${err}`;
    }
    if (isInfected) throw `********* Virus or malware was detected! This file was not uploaded. Viruses detected: ${virusFound}`;
    return file;
});

