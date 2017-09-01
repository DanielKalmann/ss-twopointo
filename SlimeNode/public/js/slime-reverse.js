 (function($) {
	/**
		Slime: Reverse
		Special move: Reverse the ball movement
	*/

	$.extend($.player, {
		initiateSlimeReverse: function () {	
			$.animations.playerReverseCreate();
			player.specialPower = function() {			
				if(player.special_power >= 5)
				{
					var frequency = 50;
					if (player.missileTest.lastFired == (undefined || null)) player.missileTest.lastFired = 0;
					if (game.time.now - player.missileTest.lastFired < frequency) return;
					player.missileTest.lastFired = game.time.now;									
					
					
					player.initialPower = function () {
						value_x = (ball.body.velocity.x) * -1;
						value_y = (ball.body.velocity.y);
						
						socket.emit('update ball velocity', { velocity_x: value_x, velocity_y: value_y, increment: false });
						ball.body.velocity.x = value_x;
						
						player.special_power -= 5;
					}

					player.missileTest.start();
					socket.emit('opponent missileTestStart');

				}
			}
		},
		opponentInitiateSlimeReverse: function (onSelf) {
			$.animations.playerReverseCreate(onSelf);
		}
	});	

}(jQuery));
