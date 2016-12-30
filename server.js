var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = new express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connection.on('error', function(err){
	if(err) {
		console.error(err);
	}
});

mongoose.connection.once('open', function() {
	console.log('Database connected');
	
	var FormSchema = new mongoose.Schema({
	name: String,
	lastname: String,
	email: String,
	age: Number,
	gender: String
});

var Form = mongoose.model("Form", FormSchema);
	
	app.post('/', function(req, res){
		var form = {
			name: req.body.name,
			lastname: req.body.lastname,
			email: req.body.email,
			age: Number(req.body.age),
			gender: req.body.gender
		};
		Form.create(form, function(err, result) {
			if(err){
				console.log(err);
			}else{
				console.log(result);
				res.status(201).json({messsage: "Web form submitted"});
			}
		});
		
	});
	app.post('/find', function(req, res){
		Form.findOne({name: req.body.name}, function(err, result) {
			if(err) {
				console.log(err);
			}
			else{
				res.status(200).json(result);
			}
		});
	});
	
});

mongoose.connect('mongodb://endi:endi@ds149258.mlab.com:49258/web-form').then(function() {
	app.listen(process.env.PORT || 7000);
});