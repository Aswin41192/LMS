const router = require('express').Router();
const user = require('../persistence/user');

router.get('/get', user.getAllUsers)
        .get('/find', user.findUser)
        .post('/save', user.saveUser)
        .post('/validate', user.validate)
        .put('/update', user.updateUser)
        .delete('/delete/:id', user.deleteUser);

module.exports = router;