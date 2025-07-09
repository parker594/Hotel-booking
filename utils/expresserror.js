class expresserror extends Error{
    constructor(statuscode,message){
        super(message);
        this.statuscode=statuscode;
        this.message=message;
    }
}
module.exports=expresserror;