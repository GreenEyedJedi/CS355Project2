// Module dependencies

var express    = require('express'),
    mysql      = require('mysql'),
    http       = require('http'),
    path       = require('path'),
    connect    = require('connect');

// Application initialization

var connection = mysql.createConnection({
        host     : 'cwolf.cs.sonoma.edu',
        user     : 'abrownlie',
        password : '3820042',
    });
    
var app = express();
var server = http.createServer(app);

connection.query('USE abrownlie', function (err) {
	if (err) throw err;
});
	
// Configuration

app.use(connect.urlencoded());
app.use(connect.json());
app.use(express.static(__dirname + '/public'));
//app.use(express.static('images'));

// Main route sends our HTML file

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

app.get('/public/Harper.jpg', function(req, res) {
	res.sendfile(__dirname + '/public/Harper.jpg');
});

app.get('/public/Davis.jpeg', function(req, res) {
	res.sendfile(__dirname + '/public/Davis.jpeg');
});

app.get('/public/style.css', function(req, res) {
	res.sendfile(__dirname + '/public/style.css');
});

app.get('/public/Pineda.jpg', function(req, res) {
	res.sendfile(__dirname + '/public/Pineda.jpg');
});

app.get('/public/mlbstats.png', function(req, res) {
	res.sendfile(__dirname + '/public/mlbstats.png');
});

app.get('/index.html', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/master.html', function(req, res) {
	res.sendfile(__dirname + '/master.html');
});

app.get('/batting.html', function(req, res) {
  res.sendfile(__dirname + '/batting.html');
});

app.get('/pitching.html', function(req, res) {
  res.sendfile(__dirname + '/pitching.html');
});

app.get('/fielding.html', function(req, res) {
	res.sendfile(__dirname + '/fielding.html');
});

app.get('/about.html', function(req, res) {
	res.sendfile(__dirname + '/about.html');
});

//Master Table
app.get('/Master', function(req, res){
	connection.query("SELECT * FROM Master", function (err, rows){
		if (err) console.log(err);
		res.send(rows);
	});
});

//Batting Table
app.get('/Batting', function(req, res){
	connection.query("SELECT * FROM Batting;", function(err, rows){
		if (err) console.log(err);
		res.send(rows);
	});
});

//Pitching Table
app.get('/Pitching', function(req, res){
	connection.query("SELECT * FROM Pitching", function(err, rows){
		if (err) console.log(err);
		res.send(rows);
	});
});

//Fielding Table
app.get('/Fielding', function(req, res){
	connection.query("SELECT * FROM Fielding", function(err, rows){
		if (err) console.log(err);
		res.send(rows);
	});
});

//POST

app.post('/Master', function(req, res){
	var data = req.body;
	var mode = data["!nativeeditor_status"];
    var PlayerID = data.gr_id;
    var tid = PlayerID;
	
	//var PlayerID = Master.PlayerID;
	var TeamID = Master.TeamID;
	var First_Name = Master.First_Name;
	var Last_Name = Master.Last_Name;
	var Position = Master.Position;
	var Height = Master.Height;
	var Weight = Master.Weight;
	var Bats = Master.Bats;
	var Throws = Master.Throws;
	var College = Master.College;
	
	function update_response(err, result){
		if (err){
			console.log(err);
			mode = "error";
		}
		else if (mode == "inserted")
			tid = result.insertId;
			
		res.setHeader("Content-Type", "text/xml");
		res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
    }

    if (mode == "updated")
		connection.query("UPDATE Master SET First_Name = ?, Last_Name = ?, TeamID = ?, Position = ?, Height = ?, Weight = ?, Bats = ?, Throws = ?, College = ? WHERE PlayerID = ?", [First_Name, Last_Name, TeamID, Position, Height, Weight, Bats, Throws, College, PlayerID], update_response);
		
	else if (mode == "inserted")
		connection.query("INSERT INTO Master(First_Name, Last_Name, TeamID, Position, Height, Weight, Bats, Throws, College) VALUES(?,?,?,?,?,?,?,?,?)", [First_Name, Last_Name, TeamID, Position, Height, Weight, Bats, Throws, College], update_response);
		
	else if (mode == "deleted")
		connection.query("DELETE FROM Master WHERE PlayerID = ?", [PlayerID], update_response);
		
	else
		res.send("Not supported operation");
});

// Static Content Directory

app.use(express.static(path.join(__dirname, 'public')));


// Begin listening
server.listen(8001);
console.log("Express server listening on port %s", server.address().port);
