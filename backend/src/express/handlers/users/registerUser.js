const operations = require('../../../mongoose/controllers/UserOperations');
const validateNewUser = require('../../../joi/validateRegister')


//Meta data for visual studio code
/** @type {import("express").RequestHandler} */
async function createUser(req, res) {

    const { error } = validateNewUser(req.body);
    console.log(req.body, 'create user function req.body');

    if (error)
        return res.status(400).json(error.details[0].message);

    const userFromDb = await operations.createAUserInMongoDb(req.body)
    console.log(userFromDb, 'userFromDb before status500');
    if (!userFromDb) {
        return res.status(500).json("General error. user not saved")
    }
    res.json(userFromDb)
}

module.exports = createUser;