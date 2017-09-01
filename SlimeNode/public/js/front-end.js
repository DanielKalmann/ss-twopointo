$(function() {

	var selected = false;

	socket.on('online_players', function(data) {

		$('.online-players span').fadeOut(300, function() {
			$(this).html(data.count);
		}).fadeIn(300);
		
		$('.player-nicknames').html('');
		
		$.each(data.players, function(id, player) {
			$('.player-nicknames').append('<span>' + player.username + '</span>');
		});
	});  	
	
	
	socket.on('get_username', function(data) {
		$('.current-name b').html(data.username);
	});  
	
	socket.on('get_chat', function(data) {
		$('.chat_messages').empty();
		
		$.each(data.messages, function(index, message) {
			$('.chat_messages').prepend('<li>' + message + '</li>');
		});
	});  
	
	$('.create_room').submit(function() {
		if($('.room_name').val() != '')
		{
			socket.emit('create_room', { room_name : $('.room_name').val() });

			$('.chat-title').html('Lobby Chatroom');
			$('.home-button-below-chat').fadeIn();
			
			$('.room_name').val('') ;
		}
		else
		{
			alert('Geef een naam op, eihoofd >:|');
			$('.room_name').val('eihoofd');
		}
		
		return false;
	});

	$('body').on('click', '.join_room', function() {
		socket.emit('join_room', { room_name : $(this).attr('room') });
		
		return false;
	});	

	$('body').on('click', '.spectate_room', function() {
		socket.emit('spectate_room', { room_name : $(this).attr('room') });

		return false;
	});	
	
	socket.on('global_response', function(data) {
		if(!data.success)
		{
			$('.errors').html(data.message).fadeIn(500).delay(2000).fadeOut(500);
		}
		else
		{
			//$('a[character="' + data.character + '"]').animate({ opacity : .5 });
			
		}
	});  


	socket.on('get_rooms', function(data) {
		$('.rooms').empty();
	
		$.each(data.rooms, function(room) {
			if(data.numClients[room] == 2)
			{
				$('.rooms').append('<li>' + room + ' <a href="#" class="spectate_room btn btn-primary"" room="' + room + '">Spectate</a><i>' + data.numClients[room] + '/2 spelers</i></li>');
			}
			else
			{
				$('.rooms').append('<li>' + room + ' <a href="#" class="join_room btn btn-primary"" room="' + room + '">Join</a><i>' + data.numClients[room] + '/2 spelers</i></li>');
			
			}
		});
	});        
	
	$('.home-button').click(function() {
		socket.emit('leave_room');
	
		$('.rooms-container').fadeIn();
		$('.score').hide();
		$('.player-select').hide();
		$('.home-button').hide();
		$('.winner').hide();
		$('.players-lobby').hide();
		$('.game-settings-save').hide();
		$('canvas').remove();
		$('.chat-title').html('Chatroom');
		$('.play-again-container').hide();
		$('.spectators').hide();
		
		$('.player-select ul li a').css({ opacity : 1 });
		$('.opponent-selected').remove();
		$('.your-selection').remove();
		
		selected = false;
	
		return false;
	});
	
	socket.on('player_ready', function(data) {	
		$('.chat_messages').prepend('<li style="color: green">' + data.username + ' is ready.</li>');
	});  
	
	$('.ready-button').on('click', function() {
		if(selected)
		{
			$(this).addClass('disabled');
			$(this).html('Wachten op de tegenstander.');
			
			socket.emit('player_ready');
		
		}
		else
		{
			alert('Je hebt nog geen slime gekozen.');
		}
		
		return false;
	
	});
	
	$('.player-select ul li a').on('click', function() {


		$('.your-selection').parent().css({ opacity : 1 });
		$('.your-selection').remove();

		$(this).animate({ opacity : .2 }, 300).append('<span class="your-selection">Your selection</span>');
		socket.emit('character_selected', { character : $(this).attr('character') });
		
		selected = true;
		
		return false;
	});
	
	socket.on('character_selected', function(data) {	
		$('.opponent-selected').parent().css({ opacity : 1 });
		$('.opponent-selected').remove();	
		
		$('a[character="' + data.character + '"]').animate({ opacity : .2 }, 300).append('<span class="opponent-selected">Selected by: ' + data.username + '</span>');
	});  
	
	socket.on('select_characters', function(data) {
		if(typeof(game) != "undefined")
		{
			console.log(game);
			//game.destroy();
			//Phaser.Game.destroy;
			//console.log(game);
		
		}
		$('.game-settings-save').hide();
		$('.chat-title').html('Lobby Chatroom');
		$('.play-again').html('Speel nog een keer');
		$('.ready-button').html('Ready up');
		
		$('.spectators').hide();
		$('.spectators span').html(0);
		$('.home-button').hide();
		$('.home-button-below-chat').fadeIn();
		$('.game-settings').fadeIn();
		
		$('.score').hide();
		$('.winner').hide();
		$('.players-lobby').hide();
		$('canvas').remove();
		$('.play-again-container').hide();
		$('.play-again').removeClass('disabled');
		$('.ready-button').removeClass('disabled');
		
		$('.player-select ul li a').css({ opacity : 1 });
		$('.opponent-selected').remove();
		$('.your-selection').remove();
		
		$('.rooms-container').hide();
		$('.player-select').fadeIn();
		
		// Show game settings form
		if(data.player1.id == ('/#' + socket.id))
		{
			$('.game-settings-save').fadeIn();
		}
		
		$('.score-limit-visual span').html(data.player1.score_limit);
		
		selected = false;
	});  
	
	socket.on('update spectators', function(data) {
		$('.spectators span').html(data.spectators);
	});  
	
	
		
	socket.on('update_game_settings', function(data) {
		$('.score-limit-visual span').html(data.score_limit);
	});  
	
	
	function sendChatMessage()
	{
		if($('.message').val() != '')
		{
			socket.emit('chat', { message : $('.message').val() });
			$('.message').val('');	
		}
		else
		{
			alert('Bericht is leeg, derptiederppp');
		}
	}
	
	$('.edit_username').submit(function(e) {
		if($('.username').val() != '')
		{
			socket.emit('change_username', { username : $('.username').val() });
		}
		return false;
	});
	
	$('.game-settings-save').submit(function(e) {
		if($('.score-limit').val() != '' && $.isNumeric($('.score-limit').val()))
		{

			socket.emit('save_game_settings', { score_limit : $('.score-limit').val() });
		}
		
		return false;
	});
	
	$(document).keypress(function(e) {
		if(e.which == 13) {
			if($('.message').is(':focus'))
			{
				sendChatMessage();
				return false;
		
			}
		}
	});		

	$('.send_message').submit(function(e) {
		sendChatMessage();
		return false;
	});
	
	
	$('.play-again').on('click', function() {
		$(this).addClass('disabled');
		$(this).html('Wachten op de tegenstander.');
		
		socket.emit('replay_match');
		return false;
	});
	
	socket.on('player_left', function(data) {
		
		if(data.lobby && !data.ingame)
		{
			$('.rooms-container').show();
			$('.player-select').hide();		
			
			$('.player-select ul li a').css({ opacity : 1 });
			$('.opponent-selected').remove();
		}
		
		var text = data.lobby ? 'lobby' : 'application';
		
		$('.chat_messages').prepend('<li style="color: red">' + data.username + ' left the ' + text + '.</li>');
	});  
	
	socket.on('player_joined', function(data) {
		var text = data.lobby ? 'lobby' : 'chat';
		
		$('.chat_messages').prepend('<li style="color: green">' + data.username + ' joined the ' + text + '.</li>');
	});  
	
	socket.on('asking_for_replay', function(data) {

		$('.chat_messages').prepend('<li style="color: orange">' + data.username + ' wants to replay the game.</li>');
	});  
	
	socket.on('chat', function(data) {
		$('.chat_messages').prepend('<li>' + data.message + '</li>');
	});  
 	
});