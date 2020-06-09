var express = require('express');
const router = require('./routes');
var api = express();

api.use(express.json())
api.use('/grades', router);


api.listen(3000, () => {
});
