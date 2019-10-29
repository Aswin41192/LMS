const router = require('express').Router();
const user = require('../persistence/user');

router.get('/get',user.getAllUsers)
        .get('/find',user.findUser)
       .post('/save',user.saveUser)
       .put('/update',user.updateUser)
       .delete('/delete',user.deleteUser);

module.exports = router;