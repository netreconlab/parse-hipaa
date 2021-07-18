Parse.Cloud.beforeSave('Activity', async (request) => {
    var fromUser = request.object.get('fromUser');
    var toUser = request.object.get('toUser');
    var activityType = request.object.get('type');
    var currentAccess = request.object.getACL();
      
    var currentUser = request.user;
    var currentUserToken = currentUser.getSessionToken(); // get session token from request.user
                           
    //All activities should have a currentUser and a fromUser
    if(!currentUser || !fromUser) {
        console.log(activityType + ' *****ACTIVITY_TYPE\n');
        console.log(fromUser.id + ' *****FROM_USER\n');
        console.log(toUser.id + ' *****TO_USER\n');
        throw 'An Activity should have a valid information.';
    }
                      
    switch(activityType) {

    case 'follow':
        //Make sure the the user posting this activity is the using receiving the message
        if (currentUser.id === toUser.id){
            throw 'Cannot follow yourself.';
        }
            
        var query = new Parse.Query('Activity');
        query.equalTo('toUser', toUser);
        query.equalTo('fromUser', fromUser);
        query.equalTo('type', 'follow')
        
        const results = await query.first({ sessionToken: currentUserToken});
        if (results != null){
            throw 'Cannot follow a user you are already following.';
        } else{
            //If to user doesn't have write access, give them write access
            if (!currentAccess.getWriteAccess(toUser) || !currentAccess.getWriteAccess(fromUser)){
                currentAccess.setPublicReadAccess(true)
                currentAccess.setWriteAccess(toUser, true);
                currentAccess.setWriteAccess(fromUser, true);
                request.object.setACL(currentAccess);
                request.object.save(null,{ sessionToken: currentUserToken });
                console.log('CloudCode function beforeSave modified Activity with objectId ' + request.object.id);
            }
        }
        break;
   
    default:
        break;
    }
});
