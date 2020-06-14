Parse.Cloud.beforeSave("Patient", async (request) => {
    var object = request.object;
     
    if (object.isNew()){
        const query = new Parse.Query("Patient");
        query.equalTo("uuid",object.get("uuid"));
        const result = await query.first({useMasterKey: true})
        if (result != null){
            throw "Duplicate: Patient with this uuid already exists";
        }
    }
});
