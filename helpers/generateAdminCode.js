const { getAdminByCode } = require("../dbConnnection/repositry.js/user-repo")
const { generateRandomString } = require("./generateRandomString")

async function generateAdminCode(){
    var adminCode = await generateRandomString(6)
    var flag = true
    var safeFlag = 0
    while(flag){
        let admin = await getAdminByCode({adminCode})
        if (!admin){
            flag = false
        }else if (safeFlag > 3){
            flag = false
            return next(new ErrorHandler(SomethingWentWrong, 500));
        }else {
            adminCode = await generateRandomString(6)
            safeFlag++
        }
    }
    return adminCode
}


module.exports = {
    generateAdminCode
}