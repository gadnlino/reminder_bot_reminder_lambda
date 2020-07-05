const func = require("./src/function.js");

exports.handler = async (event, context)=>{
    try{
        await func(event, context);
    }
    catch(e){
        throw e;
    }
};