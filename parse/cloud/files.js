const NodeClam = require('clamscan');

Parse.Cloud.beforeSaveFile(async (request) => {
    const { file, user } = request;
    const token = { sessionToken: user.getSessionToken() };

    const sessionQuery = new Parse.Query(Parse.Session);
    sessionQuery.equalTo('sessionToken', sessionToken);
    sessionQuery.include('user');

    const foundSession = await sessionQuery.first({
        sessionToken
    });
    
    if (!foundSession) {
      throw new Error('Invalid session token.');
    }

    if (user != foundSession.get('user')){
      throw new Error('This session does not belong to this user');
    }
    
    var isInfected;
    var virusFound;
    const fileData = await file.getData();
    
    try {
        // Get instance by resolving ClamScan promise object
        const clamscan = await new NodeClam().init({clamdscan: {
            socket: false, // Socket file for connecting via TCP
            host: false, // IP of host to connect to TCP interface
            port: false, // Port of host to use when connecting via TCP interface
            timeout: 60000, // Timeout for scanning files
            local_fallback: false, // Do no fail over to binary-method of scanning
            path: '/usr/bin/clamdscan', // Path to the clamdscan binary on your server
            config_file: null, // Specify config file if it's in an unusual place
            multiscan: true, // Scan using all available cores! Yay!
            reload_db: false, // If true, will re-load the DB on every call (slow)
            active: true, // If true, this module will consider using the clamdscan binary
            bypass_test: false, // Check to see if socket is available when applicable
        },});
        const {is_infected, viruses} = await clamscan.scan_stream(file);
        isInfected = is_infected;
        virusFound = viruses;
    } catch (err) {
        // Handle any errors raised by the code in the try block
        throw `Error scanning for virus or malware ${err}`;
    }
    if (isInfected) throw `********* Virus or malware was detected! This file was not uploaded. Viruses detected: ${virusFound}`;
    return file;
});

