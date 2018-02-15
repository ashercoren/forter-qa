const express   = require('express');
const http      = require('http');
const bot       = require('./server/bot.js')(require('./server/data'));
const app       = express();
const port      = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static(`${__dirname}/client`)); 		// statics

const server = http.createServer(app);

require(`./server/routes.js`)(app,server);						// routes

server.listen(port, () => {
  console.log('Listening on %d', server.address().port);
});
