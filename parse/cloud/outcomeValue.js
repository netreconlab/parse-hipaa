//Because of way ParseCareKit handles this class, comment out this check
/*
Parse.Cloud.beforeSave("OutcomeValue", async (request) => {
    var object = request.object;
     
    if (object.isNew()){
        const query = new Parse.Query("OutcomeValue");
        query.equalTo("uuid",object.get("uuid"));
        const result = await query.first({useMasterKey: true})
        if (result != null){
            throw "Duplicate: OutcomeValue with this uuid already exists";
        }
    }
});
*/
