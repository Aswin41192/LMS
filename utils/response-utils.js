let utils = {};

utils.makeFailureResponse = (message)=> {
    return { "success" : false, "message":message };
} 

utils.makeSuccessResponse = (object) => {
    return {"success":true, "response":object}
}

utils.validateFilter = (filter)=>{
    return filter && filter.length>0;
}

module.exports = utils;