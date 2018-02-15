module.exports = (app,server) => {

  const data = require('./data');

  const WebSocket = require('ws');
  const wss = new WebSocket.Server({server});

	app.get(`/`, (req, res) => {
		res.sendfile('./public/index.html');
	});

  app.post('/question', (req,res) => {
    data.addQuestion(req.body);
    res.send();
  });

  app.post('/question/:id/answer', (req,res) => {
    data.addAnswer(req.params.id,req.body);
    res.send();
  });

	app.get(`/data`, (req, res) => {
		res.json(data.getQuestions());
	});

  data.addListener(change=> {
    wss.broadcast("new-data");
  });

  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  wss.on('connection', ws => {
    console.log("connected");

    ws.on('message', message => {
      console.log('received: %s', message);
    });

    ws.on('error', (error) => console.log(`errored: ${error}`));
  });
};