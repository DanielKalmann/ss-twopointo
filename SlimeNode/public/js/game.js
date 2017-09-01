var socket = io();  // Server/socket connection

// Global vars
var game;
var ball;

var player;
var opponent;

var player_1;
var player_2;

var goal_player_1;
var goal_player_2;

var player_ids;
var player_1_id;
var player_2_id;

var player_info = {};
var player1_info = {};
var player2_info = {};

var goals_player_1;
var goals_player_2;
	
var score_limit;
var opponent;

var cursors;
var spacebar;
var special_move_btn;
var keyboard_left;
var keyboard_right;
var keyboard_up;

// End of global vars

// These sockets must be outside the game init, otherwise the sockets will be duplicated for each game.
socket.on("update goals", onUpdateGoals);
socket.on("move player", onMovePlayer);
socket.on("move ball", onMoveBall);
socket.on("update progressbar", onUpdateProgressBar);
socket.on("update ball velocity", onUpdateBallVelocity);
socket.on("update ball gravity", onUpdateBallGravity);
socket.on("update alpha", onUpdateAlpha);
socket.on("update scale", onUpdateScale);
socket.on("follow player", onFollowPlayer);
socket.on("constant jumping", onConstantJumping);
socket.on("no jumping", onNoJumpAllowed);
socket.on("stop ball", stopBall);
socket.on("play lover animation", playLoverAnimation);
socket.on("play mask animation", playMaskAnimation);
socket.on("start helicopter", startHelicopter);
socket.on("start speedy emitter", startSpeedyEmitter);
socket.on("create lightning", createLightning);
socket.on('start zeusAnimation', startZeusAnimation);
socket.on('set charges', setCharges);
socket.on('boxer start', boxerStart);
socket.on('gokuAnimation start', gokuStart);
socket.on('opponent missileTestStart', opponentMissileTestStart);


directions = {
	LEFT: 0,
	RIGHT: 1,
}

// Initiate game
socket.on('start_game', function(data) {
	
	player_ids = Object.keys(data.players_in_room.sockets);
	player_1_id = player_ids[0];
	player_2_id = player_ids[1];
	
	player_info = data.players['/#' + socket.id];
	player1_info = data.players[player_1_id];
	player2_info = data.players[player_2_id];

    goals_player_1 = 0;
    goals_player_2 = 0;
	
	score_limit = player1_info.score_limit;
	
	$('.player-select').hide();
	$('.game-settings').hide();
	$('.score').show();
	$('.spectators').show();
	
	if(player_info.spectator)
	{
		$('.home-button').show();
		$('.chat').hide();
		$('.rooms-container').hide();
	}

	game = new Phaser.Game(800, 500, Phaser.CANVAS, 'slime-game', { preload: preload, create: create, update: update, render: render });


    function preload() 
    {
        game.stage.backgroundColor = '#444';

        // Assets
        game.load.image('slime-default', '/assets/slime-default.png');
        game.load.image('slime-speedy', '/assets/slime-speedy.png');
        game.load.image('slime-stopper', '/assets/slime-stopper.png');
        game.load.image('slime-ghost', '/assets/slime-ghost.png');
        game.load.image('slime-reverse', '/assets/slime-reverse.png');
        game.load.image('slime-water', '/assets/slime-water.png');
        game.load.image('slime-sponge', '/assets/slime-sponge.png');
        game.load.image('slime-lover', '/assets/slime-lover.png');
        game.load.image('slime-jumper', '/assets/slime-jumper.png');
        game.load.image('slime-weight', '/assets/slime-weight.png');
        game.load.image('slime-unicorn', '/assets/slime-unicorn.png');
		game.load.image('slime-gravity', '/assets/slime-gravity.png');
		game.load.image('slime-mask', '/assets/slime-mask.png');
		game.load.image('slime-zeus', '/assets/slime-zeus.png');
		game.load.image('slime-boxer', '/assets/slime-boxer.png');
		game.load.image('slime-goku', '/assets/slime-goku.png');
		
		game.load.spritesheet('bow', '/assets/test-ss.png', 103, 85, 28);
		game.load.image('arrow', '/assets/arrow.png');
		
        game.load.image('ball', '/assets/ball.png');
        game.load.image('goal', '/assets/goal.png');
        game.load.image('background-1', '/assets/bg.jpg');
		game.load.image('background-2', '/assets/bg-2.jpg');

		game.load.image('stop', '/assets/stop.png');
		game.load.image('heart', '/assets/heart.png');

		game.load.image('mask-player', '/assets/mask-player.png');
		game.load.image('mask-opponent', '/assets/mask-opponent.png');
		
		game.load.image('emitter011', '/assets/emitter01.png');
		game.load.spritesheet('emitter02', '/assets/emitterss02.png', 64, 64, 20);

		game.load.spritesheet('helicopter', '/assets/helicopterss.png', 35, 25, 5);
		game.load.image('cloud01', '/assets/cloud01.png');

		game.load.image('cloud02', '/assets/cloud02.png');
		game.load.spritesheet('explosion', '/assets/explosion.png', 128, 128, 4);
		game.load.image('zeuscharge', '/assets/zeuscharge.png');

		game.load.image('boxing-glove', '/assets/boxinglove.png');

		game.load.spritesheet('goku-hair', '/assets/goku-hair-ss.png', 174, 86, 2);
		game.load.image('charge-ball', '/assets/charge-ball.png');
		game.load.spritesheet('goku-emitter', '/assets/goku-emitter-ss.png', 45, 45, 35);
		game.load.image('goku-projectile', '/assets/goku-projectile.png');
    }

    function create() 
    {
		$('.score').show();
		$('.goals').text(goals_player_1 + ' : ' +  goals_player_2);
		$('.players-lobby').show();
		$('.player_1').html(player1_info.username);
		$('.player_2').html(player2_info.username);
		
		// Fixes laggy movement in Chrome
		game.forceSingleUpdate = true;
		
		game.add.tileSprite(0, 0, 1000, 600, player1_info.game_background);
        game.physics.startSystem(Phaser.Physics.ARCADE);
		
		progress_player_1 = game.add.graphics(-50, -450);
		progress_player_2 = game.add.graphics(850, -450);
		
		ball = game.add.sprite(game.world.centerX - 10, game.world.height - 350, 'ball');
		ball.anchor.setTo(.5,.5);
		ball.rotateTo = 'right';
		
		// Initiate correct players
		player_1 = $.player.create(1, 32, game.world.height - 150, player1_info.character);
		player_2 = $.player.create(2, 720, game.world.height - 150, player2_info.character);
		
		goal_player_1 = game.add.sprite(0, 353, 'goal');
		goal_player_2 = game.add.sprite(785, 353, 'goal');
		
		if(player_info.player_number == 'player1' || player_info.spectator)
		{
			player = player_1;
			opponent = player_2;
		}
		else
		{
			player = player_2;
			opponent = player_1;
		}
		
		player.inputEnabled = !player_info.spectator ? true : false;
		
		$.player.afterCreate(player, opponent);
		
		game.physics.enable([ball, goal_player_1, goal_player_2], Phaser.Physics.ARCADE);

        ball.body.gravity.y = 800;
        ball.body.collideWorldBounds = true; 
        ball.body.bounce.setTo(0.75, 1);    
		
        goal_player_1.body.immovable = true;
        goal_player_2.body.immovable = true;

        cursors = game.input.keyboard.createCursorKeys();
        spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        special_move_btn = game.input.keyboard.addKey(Phaser.Keyboard.E);
        keyboard_left = game.input.keyboard.addKey(Phaser.Keyboard.A);
        keyboard_right = game.input.keyboard.addKey(Phaser.Keyboard.D);
        keyboard_up = game.input.keyboard.addKey(Phaser.Keyboard.W);

        game.stage.disableVisibilityChange = true;

	}

    function update() 
    {
		if(!player_info.spectator)
		{
			// Disable or enable keyboard input for a player
			if(player.inputEnabled)
			{
				game.input.enabled = true;
			}
			else
			{
				game.input.enabled = false;
			}
		
		
			if(player.constantJumping)
			{
				player.jump();
			}
		
			// Fixes a bug with chat while playing game
			if($('.message').is(':focus'))
			{
				player.inputEnabled = false;
			}
			else
			{
				player.inputEnabled = true;
			}
			
			if(player.following)
			{
				player.inputEnabled = false;
				player.body.velocity.x = 0;
				
				if(player.x > opponent.x)
				{
					if(player.scale.x > 0)
					{
						player.scale.x *= -1;
						player.body.velocity.x = 0;
					}
					
					player.body.velocity.x -= 200;
				}
				else
				{
					if(player.scale.x < 0)
					{
						player.scale.x *= -1;
						player.body.velocity.x = 0;
					}
					
					player.body.velocity.x += 200;
				}
			}
			
			if(player_info.player_number == 'player1')
			{	
				game.physics.arcade.collide(ball, player_1, collisionAddSpeedToBall, null, this);
				game.physics.arcade.collide(ball, player_2, collisionAddSpeedToBall, null, this);

				game.physics.arcade.collide(ball, goal_player_1, collisionHandlerGoal1, null, this);
				game.physics.arcade.collide(ball, goal_player_2, collisionHandlerGoal2, null, this);
			}
			
			// Regenerate special power over time
			if(player.special_power < 100)
			{
				player.special_power += .1;
			}
			
			// Special move
			if(special_move_btn.isDown)
			{
				if(player.specialPower) 
				{
					player.specialPower();
				} 
			}
			
			updateLocalProgressBar();
			socket.emit('update progressbar', { player_number: player_info.player_number,  special_power: player.special_power});

			//  Reset the players velocity (movement)
			if(!player.following)
			{
				player.body.velocity.x = 0;
			}

			if(ball.body.velocity.y > 0)
			{
				ball.body.velocity.y = ball.body.velocity.y - 0.5;
			}
			else 
			{
				ball.body.velocity.y++;
			}


			if(player.inputEnabled)
			{
				if(cursors.left.isDown || keyboard_left.isDown)
				{
					player.moveLeft();
				}
				else if(cursors.right.isDown || keyboard_right.isDown)
				{
					player.moveRight();
				}

				//  Allow the player to jump if they are touching the ground.
				if (cursors.up.isDown || spacebar.isDown || keyboard_up.isDown) 
				{
					player.jump();         
				}
			}

			socket.emit('move player', { 
				player_number: player_info.player_number, 
				x: player.position.x, 
				y: player.position.y, 
				velocity_x: player.body.velocity.x, 
				velocity_y: player.body.velocity.y, 
				scale_x: player.scale.x,
				scale_y: player.scale.y
			});

			if(ball.body.velocity.y >= 1000)
			{
				ball.body.velocity.y = 200;
			}

			if(ball.position.y >= 500)
			{
				ball.body.velocity.y = -600;        
				ball.position.y = 400;        
			}

			if(player_info.player_number == 'player1')
			{
				socket.emit('move ball', { x: ball.x, y: ball.y, velocity_y: ball.body.velocity.y, velocity_x: ball.body.velocity.x});
			}
			
			// Ball animation
			if(ball.body.velocity.x != 0)
			{
				if(ball.rotateTo == 'right')
				{
					ball.body.rotation += 2;
				}
				else
				{
					ball.body.rotation -= 2;
				}
			}
		}
    }

    function render() 
    {

    }

    function collisionAddSpeedToBall(ball, player) 
    {
		var player_x = player.x;
		var ball_x = ball.x;
		
		var collision_x = player_x - ball_x;

        if(player.body.touching.left)
        {
			ball.body.velocity.x = -500;
			ball.rotateTo = 'left';
        }
        else if(player.body.touching.right)
        {
			ball.body.velocity.x = 500;
			ball.rotateTo = 'right';
        }
        else if(player.body.touching.up)
        {	
			// Simulate custom collision, add speed if ball hits top && on the left or top && on the right of the slime
			// The further the corner is hit, the more speed is added
			if(collision_x > 0)
			{
				var bonus_speed = (collision_x * 2) * -1;
				ball.body.velocity.x = -300 + bonus_speed;
				ball.rotateTo = 'left';
			}
			else
			{
				var bonus_speed = (collision_x * 2) * -1;
				ball.body.velocity.x = 300 + bonus_speed;
				ball.rotateTo = 'right';
			}
			
			ball.body.velocity.y = -500;
        }

    }

    function collisionHandlerGoal1(ball, goal_player_1) 
    {
		// If hit on the pole, no goal
        if(ball.y > 306 && ball.y < 360)
        {
			ball.body.velocity.y += -250;
        }
		else		
		{
			ball.position.x = game.world.centerX - 10;
			ball.position.y = game.world.height - 350;
			ball.body.velocity.y = 0;
			ball.body.velocity.x = 0;

			goals_player_2++;
			
            socket.emit('update goals', { goals_player_1: goals_player_1, goals_player_2: goals_player_2});
		}

    }

    function collisionHandlerGoal2(ball, goal_player_2) 
    {
		
		// If hit on the pole, no goal
        if(ball.y > 306 && ball.y < 360)
        {
			ball.body.velocity.y += -250;
		}
		else		
		{
			ball.position.x = game.world.centerX;
			ball.position.y = game.world.height - 350;   
			ball.body.velocity.y = 0;
			ball.body.velocity.x = 0; 
			
			goals_player_1++;

            socket.emit('update goals', { goals_player_1: goals_player_1, goals_player_2: goals_player_2 });
		} 

    }
	
	function updateLocalProgressBar()
	{
		if(player_info.player_number == 'player1')
		{
			progress = progress_player_1;
		}
		else
		{
			progress = progress_player_2;
		}
		
		progress.clear();
		progress.lineStyle(2, '0x000000');
		progress.beginFill('0x000000',1);
		progress.drawRoundedRect(100,500,200,27,10);
		progress.endFill();
		
		progress.beginFill('0x999999',1); //For drawing progress	
		progress.drawRoundedRect(101, 501 , player.special_power * 2, 25, 10);
	}
});

// End of initiate game


/** 
	Functions outside scope, so they wont get initiated twice if someone is playing a new match
*/
function playLoverAnimation() {
	if (player.loverAnimation) {
		player.loverAnimation.start();
	}
}

function opponentMissileTestStart() {
	if (opponent.missileTest) {
		opponent.missileTest.start(true);		
	}	
}

function gokuStart() {
	if (opponent.gokuAnimation) {
		opponent.gokuAnimation.start();	
	}	
}

function boxerStart() {
	if (opponent.boxingGlove) {
		opponent.boxingGlove.start();		
	}	
}

function setCharges() {
	if (player.zeusAnimation) {
		player.zeusAnimation.setCharges();
	}
}

function startZeusAnimation() {
	if (player.zeusAnimation) {
		player.zeusAnimation.start();
	}
}

function playMaskAnimation() {
	if (player.maskAnimation) {
		player.maskAnimation.start();	
	}	
}

function startSpeedyEmitter() {
	ball.speedyEmitter.startEmitter(false);
}

function onUpdateGoals(data) {
	
	if(data.goals_player_1 == data.score_limit)
	{
		gameFinished(player1_info.username);			
	}	
	
	if(data.goals_player_2 == data.score_limit)
	{
		gameFinished(player2_info.username);
	}
	
	$('.goals').text(data.goals_player_1 + ' : ' +  data.goals_player_2);
}

function createLightning(data) {
	$.zeusAnimation.createLightning($.zeusAnimation.position, { result: data.result, x: data.x, y: data.y })		
}

function onMovePlayer(data) {
		
	if(player && opponent)
	{
		if(!player_info.spectator)
		{
			opponent.body.velocity.y = data.velocity_y;
			opponent.body.velocity.x = data.velocity_x;
			opponent.y = data.y;
			opponent.x = data.x;
			opponent.scale.x = data.scale_x;
			opponent.scale.y = data.scale_y;
		}
		else
		{
			if(data.player_number == 'player1')
			{
				player.body.velocity.y = data.velocity_y;
				player.body.velocity.x = data.velocity_x;
				player.y = data.y;
				player.x = data.x;
				player.scale.x = data.scale_x;
				player.scale.y = data.scale_y;	
			}
			else
			{
				opponent.body.velocity.y = data.velocity_y;
				opponent.body.velocity.x = data.velocity_x;
				opponent.y = data.y;
				opponent.x = data.x;
				opponent.scale.x = data.scale_x;
				opponent.scale.y = data.scale_y;	
			}
		}
	}

}

function onMoveBall(data) {

	if(ball)
	{
		// Update ball position
		ball.x = data.x;
		ball.y = data.y;
		ball.body.velocity.y = data.velocity_y;
		ball.body.velocity.x = data.velocity_x;
	}

}
	
function onUpdateProgressBar(data)
{
	if(data.player_number == 'player1')
	{
		progress = progress_player_1;
	}
	else
	{
		progress = progress_player_2;
	}
	
	if(progress)
	{
		progress.clear();
		progress.lineStyle(2, '0x000000');
		progress.beginFill('0x000000',1);
		progress.drawRoundedRect(100,500,200,27,10);
		progress.endFill();
		
		progress.beginFill('0x999999',1); //For drawing progress	
		progress.drawRoundedRect(101, 501 , data.special_power * 2, 25, 10);		
	}

}
	
function onUpdateBallVelocity(data)
{
	if(ball)
	{
		if(data.increment)
		{
			ball.body.velocity.x += data.velocity_x;
			ball.body.velocity.y += data.velocity_y;
		}
		else
		{
			ball.body.velocity.x = data.velocity_x;
			ball.body.velocity.y = data.velocity_y;
		}
	}
}
	
function onUpdateBallGravity(data)
{
	if(ball)
	{
		if(data.increment)
		{
			ball.body.gravity.y += data.gravity;
		}
		else
		{
			ball.body.gravity.y = data.gravity;
		}
	}
}
	
function onUpdateAlpha(data)
{
	if(data.player_number == 'player1')
	{
		player_2.alpha = data.alpha;
	}
	else
	{
		player_1.alpha = data.alpha;
	}
}

function stopBall() {
	ball.stopSign.start(false);
}
function onUpdateScale(data)
{
	if(data.multiply)
	{
		player.scale.x *= data.value;	
		player.scale.y *= data.value;	
	
	}
	else
	{
		player.scale.x /= data.value;	
		player.scale.y /= data.value;	
	
	}
}

function startHelicopter() {
	ball.helicopter.start(false);	
}

function onFollowPlayer(data)
{
	player.following = true;
	
	setTimeout(function () {
		player.inputEnabled = true;
		player.following = false;
	}, 2500);			
}

function onConstantJumping(data)
{
	player.constantJumping = true;
	
	setTimeout(function () {
		player.constantJumping = false;
	}, 3500);			
}

function onNoJumpAllowed()
{
	player.jumpAllowed = false;
	
	setTimeout(function () {
		player.jumpAllowed = true;
	}, 3500);
}

function gameFinished(username)
{		
	//$('.score').hide();
	$('.winner').html(username + ' winner!').fadeIn();
	$('.home-button').fadeIn();
	
	if(!player_info.spectator)
	{
		$('.play-again-container').fadeIn();
	}

	game.input.enabled = false;
	game.paused = true;	
}
