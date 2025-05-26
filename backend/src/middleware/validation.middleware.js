// src/middleware/validation.middleware.js

const AppError = require('../utils/AppError');

const validate = (DtoClass) => async (req, res, next) => {
    try{
    const dtoInstance = new DtoClass(req.body);
    const errors = dtoInstance.validate();
    console.log("length",errors);

    if (errors.length > 0) {
        console.log(errors.length,"errors length");
        // Concatenate all error messages for a single response
        //const errorMessage = errors.join('; ');
        //return next(new AppError(errorMessage, 400)); // 400 Bad Request
    }
    console.log("validate length check complete");
    // Optionally, if you want to ensure the DTO instance is used later
    req.validatedBody = dtoInstance;
    next();
}
catch(error){
    console.log("valmiderror");
    console.log(error.message);
}
};

module.exports = { validate };