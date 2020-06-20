Parse.Cloud.beforeSave("Task", async (request) => {
    var object = request.object;
     
    if (object.isNew()){
        const query = new Parse.Query("Task");
        query.equalTo("uuid",object.get("uuid"));
        const result = await query.first({useMasterKey: true})
        if (result != null){
            throw "Duplicate: Task with this uuid already exists";
        }
    }
});