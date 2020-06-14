Parse.Cloud.beforeSave("Outcome", async (request) => {
    var object = request.object;
     
    if (object.isNew()){
        const query = new Parse.Query("Outcome");
        query.equalTo("uuid",object.get("uuid"));
        const result = await query.first({useMasterKey: true});
        if (result != null){
            throw "Duplicate: Outcome with this uuid already exists";
        }
    }
});
