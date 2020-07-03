//The DB Unique index handles this now. No need for the extra query
/*Parse.Cloud.beforeSave("Contact", async (request) => {
    var object = request.object;
     
    if (object.isNew()){
        const query = new Parse.Query("Contact");
        query.equalTo("uuid",object.get("uuid"));
        const result = await query.first({useMasterKey: true});
        if (result != null){
            throw "Duplicate: Contact with this uuid already exists";
        }
    }
});
*/
