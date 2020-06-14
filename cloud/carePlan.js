Parse.Cloud.beforeSave("CarePlan", async (request) => {
    var object = request.object;
     
    if (object.isNew()){
        const query = new Parse.Query("CarePlan");
        query.equalTo("uuid",object.get("uuid"));
        const result = await query.first({useMasterKey: true});
        if (result != null){
            throw "Duplicate: CarePlan with this uuid already exists";
        }
    }
});
