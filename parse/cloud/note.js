Parse.Cloud.beforeSave("Note", async (request) => {
    var object = request.object;
     
    if (object.isNew()){
        const query = new Parse.Query("Note");
        query.equalTo("uuid",object.get("uuid"));
        const result = await query.first({useMasterKey: true});
        if (result != null){
            throw "Duplicate: Note with this uuid already exists";
        }
    }
});
