//sending different error responses with different errors and status codes
class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode= statusCode;
        this.message = message;
    }
}
module.exports = ExpressError;