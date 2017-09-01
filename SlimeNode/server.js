var fs = require("fs");
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var exec = require('child_process').exec;
var sys = require('sys');


app.get('/', function(req, res) {
    fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});
app.get('/dev', function (req, res) {
    fs.readFile(__dirname + '/public/dev.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.use(express.static(__dirname + '/public'));

server.listen(port, function () {
  console.log('Updated : Server listening at port %d', port);
});

var publicRooms = {};
var rooms = {};
var roomsInGame = {};
var players = {};
var numClients = {};
var globalChat = [];

setEventHandlers();

function setEventHandlers () 
{
	io.sockets.on("connection", function(client) {
	
		console.log('Player has connected: ' + client.id)

		client.on("move player", onMovePlayer);
		client.on("move ball", onMoveBall);
		client.on("update progressbar", onUpdateProgressBar);
        client.on("update ball velocity", onUpdateBallVelocity);
		client.on("disconnect", onClientDisconnect);
		client.on("character_selected", onCharacterSelected);
		client.on("chat", onChat);
		client.on("update goals", onUpdateGoals);
		client.on("leave_room", onLeaveRoom);
		client.on("replay_match", onReplayMatch);
		client.on("player_ready", onPlayerReady);
		client.on("save_game_settings", onSaveGameSettings);
		
		// Get rooms
		client.emit('get_rooms', { rooms : rooms, numClients : numClients });
		client.emit('get_chat', { messages : globalChat });

		// Room handlers
		client.on("create_room", onCreateRoom);
		client.on("join_room", onJoinRoom);
		
		client.on("change_username", onChangeUsername);
		client.on("update alpha", onUpdateAlpha);
		client.on("follow player", onFollowPlayer);
		client.on("constant jumping", onConstantJumping);
		client.on("no jumping", onNoJumpAllowed);
		   		
		// Add client to player listt
		players[client.id] = { 
			id : client.id, 
			username : '', 
			player_number : '', 
			character : '', 
			game_background : '', 
			ready : 0,
			replay: 0,
			score_limit: 5,
		};
		
		client.join(publicRooms);

		players[client.id].username = 'user' + Math.floor(Math.random() * (999999 - 0 + 1) + 0);
		
		client.emit('get_username', { username : players[client.id].username });
		
		io.emit('online_players', { count : Object.keys(players).length, players : players });
		io.sockets.in(publicRooms).emit('player_joined', { username : players[client.id].username, lobby : false });
	});
};

function onChangeUsername(data)
{
	players[this.id].username = data.username;
	this.emit('get_username', { username : players[this.id].username });
	io.emit('online_players', { count : Object.keys(players).length, players : players });
}

function onUpdateAlpha(data) 
{
	this.broadcast.to(this.room).emit('update alpha', { player_number : data.player_number, alpha : data.alpha });
};

function onUpdateBallVelocity(data)
{
  this.broadcast.to(this.room).emit('update ball velocity', { velocity_x: data.velocity_x, velocity_y: data.velocity_y, increment: data.increment});
}

function onUpdateProgressBar(data)
{
  this.broadcast.to(this.room).emit('update progressbar', { player_number: data.player_number, special_power: data.special_power});
}

function onReplayMatch(data)
{
	players[this.id].replay = 1;
	
	var clients = io.sockets.adapter.rooms[this.room].sockets;
	var replay_count = 0;

	for (var socket_id in clients) {
		
		if(players[socket_id].replay)
		{
			replay_count++;
		}
	}
	
	if(replay_count == 2)
	{
		for (var socket_id in clients) {
			
			players[socket_id].character = '';
			players[socket_id].ready = 0;
			players[socket_id].replay = 0;
			players[socket_id].score_limit = 5;

		}

		// Replay match (back to character select)
		var player_ids = Object.keys(io.sockets.adapter.rooms[this.room].sockets);	
		var player_1_id = player_ids[0];
		var player1 = players[player_1_id];
		
		io.sockets.in(this.room).emit('select_characters', { player1 : player1 });	
	}
	else
	{
		io.sockets.in(this.room).emit('asking_for_replay', { username : players[this.id].username });	
	}

}

function onCreateRoom(data)
{
	if(!this.room)
	{
		if(!rooms[data.room_name])
		{
			// Set room on session of client
			this.room = data.room_name;

			// add room to the global list
			rooms[data.room_name] = data.room_name; 

			this.join(data.room_name);
			players[this.id].player_number = 'player1';
			
			// Choose a random ingame background
			var backgrounds = [
				'background-1',
				'background-2'
			];
			
			var total_backgrounds = backgrounds.length - 1;
			var random_number = Math.floor(Math.random() * (total_backgrounds - 0 + 1) + 0);
			
			players[this.id].game_background = backgrounds[random_number];

			numClients[this.room] = 1;
			
			this.leave(publicRooms);
			
			io.emit('get_rooms', { rooms : rooms, numClients : numClients });
		}
		else
		{
			this.emit('global_response', { message : 'Room with name <strong>' + data.room_name + '</strong> already exists', success : 0 });		
		}
	}
	else
	{
		this.emit('global_response', { message : 'Already in a room.', success : 0 });
	}
}

function onJoinRoom(data)
{
	if(!this.room)
	{
		if(!roomsInGame[data.room_name])
		{
			if(numClients[data.room_name] < 2)
			{
				this.join(data.room_name);
				this.room = data.room_name;
			
				this.leave(publicRooms);
				
				numClients[data.room_name]++;
				
				io.sockets.in(this.room).emit('player_joined', { username : players[this.id].username, lobby : true });	
			
				if(numClients[data.room_name] == 2)
				{
					players[this.id].player_number = 'player2';
					
					// Character select
					var player_ids = Object.keys(io.sockets.adapter.rooms[this.room].sockets);	
					var player_1_id = player_ids[0];
					var player1 = players[player_1_id];
					
					io.sockets.in(this.room).emit('select_characters', { player1 : player1 });	
					
					roomsInGame[data.room_name] = 1;
					io.emit('get_rooms', { rooms : rooms, numClients : numClients });	
				}
			}
			else
			{
				this.emit('global_response', { message : 'Room is full.', success : 0 });
			}
		}
		else
		{
			this.emit('global_response', { message : 'Room is ingame.', success : 0 });
		}
	}
	else
	{
		this.emit('global_response', { message : 'Already in a room.', success : 0 });
	}
}

function onChat(data)
{
	// If player is in a room, send chat message only in game lobby
	var chat_message = players[this.id].username + ': ' + data.message;
	
	if(this.room)
	{
		io.sockets.in(this.room).emit('chat', { message : chat_message});
	}
	else
	{
		globalChat.push(chat_message);
		io.sockets.in(publicRooms).emit('chat', { message : chat_message});
		
		
	}
}

function onUpdateGoals(data)
{
	io.sockets.in(this.room).emit('update goals', { goals_player_1 : data.goals_player_1, goals_player_2 : data.goals_player_2, score_limit : players[this.id].score_limit });
}


function onCharacterSelected(data)
{
	players[this.id].character = data.character;
	this.broadcast.to(this.room).emit('character_selected', { character: data.character, username : players[this.id].username });
}


function onPlayerReady(data)
{
	if(players[this.id].character)
	{
		players[this.id].ready = 1;
	
		var player_ids = Object.keys(io.sockets.adapter.rooms[this.room].sockets);	
	
		var player_1_id = player_ids[0];
		var player_2_id = player_ids[1];
		
		var player1_info = players[player_1_id];
		var player2_info = players[player_2_id];
		
		if(player2_info)
		{
			if(player1_info.ready && player2_info.ready)
			{			
				//Start game
				io.sockets.in(this.room).emit('start_game', { players: players, players_in_room: io.sockets.adapter.rooms[this.room] });
			}	
			else
			{
				io.sockets.in(this.room).emit('player_ready', { username : players[this.id].username });
			}
		}
		else
		{
			io.sockets.in(this.room).emit('global_response', { message : 'Need 1 more player to start the game.', success : 0 });
		}	
	}
	else
	{
		io.sockets.in(this.room).emit('global_response', { message : 'Select a character first.', success : 0 });
	}
}


function onMovePlayer(data) 
{
	this.broadcast.to(this.room).emit('move player', { 
		player_number: data.player_number, 
		x: data.x, 
		y: data.y, 
		velocity_x: data.velocity_x, 
		velocity_y: data.velocity_y,
		scale_x: data.scale_x,
		scale_y: data.scale_y
	});
};

function onSaveGameSettings(data)
{
	if(players[this.id].player_number == 'player1')
	{
		players[this.id].score_limit = data.score_limit;
		
		io.sockets.in(this.room).emit('update_game_settings', { score_limit : players[this.id].score_limit });
	}
}

function onFollowPlayer(data)
{
	// Sender always sends this, so no need for paramters, we know who it is :>
	this.broadcast.to(this.room).emit('follow player');
}

function onConstantJumping(data)
{
	// Sender always sends this, so no need for paramters, we know who it is :>
	this.broadcast.to(this.room).emit('constant jumping');
}

function onNoJumpAllowed(data)
{
	// Sender always sends this, so no need for paramters, we know who it is :>
	this.broadcast.to(this.room).emit('no jumping');
}

function onMoveBall(data) 
{
  // Broadcast updated position to connected socket clients
  this.broadcast.to(this.room).emit('move ball', { x: data.x, y: data.y, velocity_y: data.velocity_y, velocity_x: data.velocity_x});
};

function onLeaveRoom()
{
	leaveAndDeleteRoom(this, false);	
}

function leaveAndDeleteRoom(client, disconnect)
{
	var room = client.room;

	client.leave(room);
	client.room = '';
	players[client.id].player_number = '';
	players[client.id].character = '';
	players[client.id].game_background = '';
	players[client.id].ready = 0;
	players[client.id].replay = 0;
	players[client.id].score_limit = 5;
	
	io.sockets.in(room).emit('player_left', { username : players[client.id].username, lobby : true, ingame : roomsInGame[room] ? true : false  });	
			
	numClients[room]--;
	
	if(numClients[room] <= 0)
	{
		delete numClients[room];
		delete roomsInGame[room];
		delete rooms[room];
	}
	
	client.join(publicRooms);
	
	if(!disconnect)
	{
		io.sockets.in(publicRooms).emit('player_joined', { username : players[client.id].username, lobby : false });
	}
	
	io.emit('get_rooms', { rooms : rooms, numClients : numClients });
	client.emit('get_chat', { messages : globalChat });
}


function onClientDisconnect() 
{
	console.log('Player has disconnected: ' + this.id)

	var room = this.room;
	leaveAndDeleteRoom(this, true);
	
	io.sockets.in(publicRooms).emit('player_left', { username : players[this.id].username, lobby : false, ingame : roomsInGame[room] ? true : false  });	
	delete players[this.id]; 
			
		
	io.emit('get_rooms', { rooms : rooms, numClients : numClients });
	io.emit('online_players', { count : Object.keys(players).length, players : players });

};
