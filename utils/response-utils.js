let utils = {};

utils.makeFailureResponse = (message)=> {
    return { "success" : false, "message":message };
} 

utils.makeSuccessResponse = (object) => {
    return {"success":true, "response":object}
}

module.exports = utils;