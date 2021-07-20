require('./activity.js');
//require('./files.js');

// main.js
Parse.Cloud.define("ensureClassDefaultFields", async (request) =>  {

    const clp = {
        get: { requiresAuthentication: true },
        find: { requiresAuthentication: true },
        create: { requiresAuthentication: true },
        update: { requiresAuthentication: true },
        delete: { requiresAuthentication: true },
        addField: {},
        protectedFields: {}
    };
  
    const postSchema = new Parse.Schema('Post');
    await postSchema.get()
    .catch(error => {
        postSchema
          .addPointer('user', '_User')
          .addFile('image')
          .addFile('thumbnail')
          .addGeoPoint('location')
          .addString('caption')
          .setCLP(clp)
          .save()
          .then((result) => {
            console.log("***Success: Post class created with default fields. Ignore any previous errors about this class***");
          })
          .catch(error => console.log(error))
    });

    const activitySchema = new Parse.Schema('Activity');
    await activitySchema.get()
    .catch(error => {
        activitySchema
          .addPointer('fromUser', '_User')
          .addPointer('toUser', '_User')
          .addPointer('activity', 'Activity')
          .addPointer('post', 'Post')
          .addString('type')
          .setCLP(clp)
          .save().then((result) => {
            console.log("***Success: Activity class created with default fields. Ignore any previous errors about this class***");
            setUserClassLevelPermissions();
          })
          .catch(error => console.log(error));
    });
});

async function setUserClassLevelPermissions() {
    const userSchema = new Parse.Schema('_User');
    await userSchema.get();
    const clp = {
      get: { requiresAuthentication: true },
      find: { requiresAuthentication: true },
      create: { '*': true },
      update: { requiresAuthentication: true },
      delete: { requiresAuthentication: true },
      addField: {},
      protectedFields: {}
    };

    userSchema
        .addString('name')
        .addString('bio')
        .addObject('link')
        .addDate('profileImage')
        .addNumber('profileThumbnail')
        .setCLP(clp)
    await userSchema.update({useMasterKey: true});
}
