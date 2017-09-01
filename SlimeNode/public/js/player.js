(function($) {
	$.player = {};	
	$.extend($.player, {
		// Init player
		create: function(player_number_local, position_x, position_y, character) {
		
			// Player 
			player = game.add.sprite(position_x, position_y, character);

			game.physics.enable(player, Phaser.Physics.ARCADE);
			player.body.gravity.y = 400;
			player.body.collideWorldBounds = true;
			player.body.bounce.y = 0.2;
			player.body.immovable = true; 
			player.anchor.setTo(.5,.5);			
			
			// Init custom parameters
			player.special_power = 0;
			player.offCooldown = true;
			player.inputEnabled = true;
			player.following = false;
			player.constantJumping = false;
			player.jumpAllowed = true;	
			
			if(player_number_local == 2) {				
				// Rotate player 2 & player 2 progressbar
				player.scale.x = -1;
				progress_player_2.scale.x = -1;	
			}
			
			// Init special powers
			switch(character)
			{
				case 'slime-default':
					$.player.initiateSlimeDefault();
					break;
				
				case 'slime-speedy':
					$.player.initiateSlimeSpeedy();
					break;
				
				case 'slime-stopper':
					$.player.initiateSlimeStopper();
					break;
				
				case 'slime-ghost':
					$.player.initiateSlimeGhost();
					break;
					
				case 'slime-reverse':
					$.player.initiateSlimeReverse();
					break;
					
				case 'slime-water':
					$.player.initiateSlimeWater();
					break;
					
				case 'slime-sponge':
					$.player.initiateSlimeSponge();
					break;
					
				case 'slime-lover':
					$.player.initiateSlimeLover();
					break;
					
				case 'slime-jumper':
					$.player.initiateSlimeJumper();
					break;
					
				case 'slime-weight':
					$.player.initiateSlimeWeight();
					break;
					
				case 'slime-unicorn':
					$.player.initiateSlimeUnicorn();
					break;
					
				case 'slime-gravity':
					$.player.initiateSlimeGravity();
					break;
				case 'slime-mask':
					$.player.initiateSlimeMask();
					break;
				case 'slime-zeus':
					$.player.initiateSlimeZeus();
					break;
				case 'slime-boxer':
					$.player.initiateSlimeBoxer();
					break;
				case 'slime-goku':
					$.player.initiateSlimeGoku();
					break;
			}	
			
			// Move left
			player.moveLeft = function() {
			
				if(player.scale.x > 0)
				{
					player.scale.x *= -1;
				}
				
				player.body.velocity.x -= 250;
			}
			
			// Move right
			player.moveRight = function() {

				if(player.scale.x < 0)
				{
					player.scale.x *= -1;
				}
				
				//  Move to the right		
				player.body.velocity.x = 250;	
			}	
			
			player.jump = function () {
				if (player.body.blocked.down && player.jumpAllowed) {
					player.body.velocity.y = -300;
				}
			}
			
			player.setDisabled = function (duration) {
				player.body.velocity.x = 0;
				player.body.velocity.y = 0;				
				
				if (!player.moveRight.copied) {
					copyMoveRight = player.moveRight;
				}
				if (!player.moveLeft.copied) {
					copyMoveLeft = player.moveLeft;
				}
				if (!player.jump.copied) {
					copyJump = player.jump;
				}
				
				if (!player.specialPower.copied) {
					copyPower = player.specialPower;	
				}
				
				player.moveRight = function () { return };
				player.moveRight.copied = true;
				player.moveLeft = function () { return };
				player.moveLeft.copied = true; 
				player.jump = function () { return };
				player.jump.copied = true;
				player.specialPower = function () { return };
				player.specialPower.copied = true;

				setTimeout(function () {
					player.moveRight = copyMoveRight;
					player.moveRight.copied = false;
					player.moveLeft = copyMoveLeft;
					player.moveLeft.copied = false; 
					player.jump = copyJump;
					player.jump.copied = false;
					player.specialPower = copyPower;
					player.specialPower.copied = false;
				}, duration);
			}
			return player;


		},
		afterCreate: function (player, opponent) {
			console.log(player);
			console.log(opponent);
			switch (opponent.key) {		
				case 'slime-lover':
					$.player.opponentInitiateSlimeLover(true);
					break;
				case 'slime-mask':
					$.player.opponentInitiateSlimeMask(true);
					break;
				case 'slime-zeus':
					$.player.opponentInitiateSlimeZeus(true);
					break;
				case 'slime-boxer':
					$.player.opponentInitiateSlimeBoxer(true);
					break;
				case 'slime-goku':
					$.player.opponentInitiateSlimeGoku(true);
					break;
				case 'slime-reverse':
					$.player.opponentInitiateSlimeReverse(true);
					break;
			}
			switch (player.key) {
				case 'slime-lover':
					$.player.opponentInitiateSlimeLover(false);
					break;
				case 'slime-mask':
					$.player.opponentInitiateSlimeMask(false);
					break;
				case 'slime-zeus':
					$.player.opponentInitiateSlimeZeus(false);
					break;
				//case 'slime-boxer':
				//	$.player.opponentInitiateSlimeBoxer(true);
				//	break;
			}	
		}
	});
}(jQuery));