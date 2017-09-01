var game;

var player_1;
var player_2;

var player_ids;
var player_1_id;
var player_2_id;

var player_info = {};
var player1_info = {};
var player2_info = {};

var goals_player_1;
var goals_player_2;

var score_limit;

player1_info.character = 'slime-sponge';
player2_info.character = 'slime-sponge';
player_info.player_number = 'player1';

// Initiate game

game = new Phaser.Game(800, 500, Phaser.CANVAS, 'slime-game', { preload: preload, create: create, update: update, render: render });

function preload() {
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
	game.load.image('slime-mask', '/assets/slime-mask.png');
	
	game.load.image('ball', '/assets/ball.png');
	game.load.image('goal', '/assets/goal.png');
	game.load.image('background-1', '/assets/bg.jpg');
	game.load.image('background-2', '/assets/bg-2.jpg');
	
	game.load.image('fire1', '/assets/fire1.png');
	game.load.image('fire2', '/assets/fire2.png');
	game.load.image('fire3', '/assets/fire3.png');
	
	game.load.spritesheet('bow', '/assets/test-ss.png', 103, 85, 28);
	game.load.image('arrow', '/assets/arrow.png');
	game.load.image('stop', '/assets/stop.png');
	game.load.image('mask-player', '/assets/mask-player.png');
	game.load.image('mask-opponent', '/assets/mask-opponent.png');
	//game.load.image('bow-static', '/assets/bow.png', , 75);	
}

goals_player_1 = 0;
goals_player_2 = 0;

score_limit = 5;

function create() {
	$('.score').show();
	$('.goals').text(goals_player_1 + ' : ' + goals_player_2);
	
	// Fixes laggy movement in Chrome
	game.forceSingleUpdate = true;
	
	game.add.tileSprite(0, 0, 1000, 600, 'background-2');
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
	
	if(player_info.player_number == 'player1')
	{
		player = player_1;
		opponent = player_2;
	}
	else {
		player = player_2;
		opponent = player_1;
	}	
	
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
	if(player.constantJumping)
	{
		$.player.jump();
	}

	// Fixes a bug with chat while playing game
	if ($('.message').is(':focus')) {
		game.input.enabled = false;
	}
	else {
		game.input.enabled = true;
	}
	
	game.input.enabled = player.inputEnabled;
	
	if (player.following) {
		//game.add.tween(player).to( { x: opponent.x }, 400, Phaser.Easing.Linear.None, true);
		
		if (player.x > opponent.x) {
			if (player.scale.x > 0) {
				player.scale.x *= -1;
			}
			
			player.body.velocity.x -= 10;
		}
		else {
			if (player.scale.x < 0) {
				player.scale.x *= -1;
			}
			
			player.body.velocity.x += 10;
		}
	}
	
	if(ball.rotateTo == 'right')
	{
		ball.body.rotation += 2;
	}
	else
	{
		ball.body.rotation -= 2;
	}
	
	game.physics.arcade.collide(ball, player_1, collisionAddSpeedToBall, null, this);
	game.physics.arcade.collide(ball, player_2, collisionAddSpeedToBall, null, this);
	
	game.physics.arcade.collide(ball, goal_player_1, collisionHandlerGoal1, null, this);
	game.physics.arcade.collide(ball, goal_player_2, collisionHandlerGoal2, null, this);
	
	
	// Regenerate special power over time
	if (player.special_power < 100) {
		player.special_power += .1;
	}
	
	// Special move
	if(special_move_btn.isDown)
	{
		if(player.specialPower) 
		{
			player.specialPower(player, opponent, 'player 1', ball);
				console.log(player.specialPower);
		} 
	}
	
	updateLocalProgressBar('player_1', player.special_power);
	
	//  Reset the players velocity (movement)
	if (!player.following) {
		player.body.velocity.x = 0;
	}
	
	if (ball.body.velocity.y > 0) {
		ball.body.velocity.y = ball.body.velocity.y - 0.5;
	}
	else {
		ball.body.velocity.y++;
	}
	
	if (cursors.left.isDown || keyboard_left.isDown) {
		
		player.moveLeft();

	}
	else if (cursors.right.isDown || keyboard_right.isDown) {
		player.moveRight();
	}
	
	//  Allow the player to jump if they are touching the ground.
	if (cursors.up.isDown || spacebar.isDown || keyboard_up.isDown) {
		player.jump();
	}
	
	if (ball.body.velocity.y >= 1000) {
		ball.body.velocity.y = 200;
	}
	
	if (ball.position.y >= 500) {
		ball.body.velocity.y = -600;
		ball.position.y = 400;
	}
}


function render() 
{

}

function collisionAddSpeedToBall(ball, player) {
	var player_x = player.x;
	var ball_x = ball.x;
	
	var collision_x = player_x - ball_x;

	if(player.body.touching.left)
	{
		ball.rotateTo = 'left';
		ball.body.velocity.x = -500;
	}
	else if(player.body.touching.right)
	{
		ball.rotateTo = 'right';
		ball.body.velocity.x = 500;
	}
	else if (player.body.touching.up) {
		// Simulate custom collision, add speed if ball hits top && on the left or top && on the right of the slime
		// The further the corner is hit, the more speed is added
		if (collision_x > 0) {
			var bonus_speed = (collision_x * 2) * -1;
			ball.body.velocity.x = -300 + bonus_speed;
			ball.rotateTo = 'left';
		}
		else {
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
	if (ball.y > 306 && ball.y < 360) {
		ball.body.velocity.y += -400;
	}
	else {
		ball.position.x = game.world.centerX - 10;
		ball.position.y = game.world.height - 350;
		ball.body.velocity.y = 0;
		ball.body.velocity.x = 0;
		
		goals_player_2++;
		
		/*
		if(goals_player_2 == score_limit)
		{
			gameFinished(player2_info.username);			
		}
		
		$('.goals').text(goals_player_1 + ' : ' +  goals_player_2);
		*/
		
	}

}

function collisionHandlerGoal2(ball, goal_player_2) {
	
	// If hit on the pole, no goal
	if (ball.y > 306 && ball.y < 360) {
		ball.body.velocity.y += -400;
	}
	else {
		ball.position.x = game.world.centerX;
		ball.position.y = game.world.height - 350;
		ball.body.velocity.y = 0;
		ball.body.velocity.x = 0;
		
		goals_player_1++;
	}

}

function updateLocalProgressBar(player_number, special_power) {
	
	progress = progress_player_1;
	
	progress.clear();
	progress.lineStyle(2, '0x000000');
	progress.beginFill('0x000000', 1);
	progress.drawRoundedRect(100, 500, 200, 27, 10);
	progress.endFill();
	
	progress.beginFill('0x999999', 1); //For drawing progress	
	progress.drawRoundedRect(101, 501 , special_power * 2, 25, 10);
}

// End of initiate game

