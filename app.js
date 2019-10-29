const express = require('express');
const app = express();
const env = require('dotenv');
const UserRoute = require('./routes/user-route');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

env.config();
const PORT = process.env.PORT?process.env.PORT:3000;

console.log('DB URL '+process.env.db);

 mongoose.connect(process.env.db,{ useNewUrlParser: true,useUnifiedTopology: true })
            .then(() => console.log('You are now connected to Mongo!'))
            .catch(err => console.error('Something went wrong', err))

    
app.use(express.json());
app.use('/api/users', UserRoute);

app.listen(PORT,(req,res)=>console.log(`Server started @ ${PORT}`));