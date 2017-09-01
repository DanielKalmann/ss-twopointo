(function($) {
	/**
		Slime: Stopper
		Special move: Stops the ball movement
	*/
	
	$.extend($.player, {
		initiateSlimeStopper: function () {
			$.animations.ballStopSignCreate();
			player.specialPower = function() {		
				if(player.special_power >= 50 && player.offCooldown)
				{
					setTimeout(function () {
						player.offCooldown = true;
					}, 2000);
					
					value_x = ball.body.velocity.x - ball.body.velocity.x;
					value_y = ball.body.velocity.y - ball.body.velocity.y;
				
					if(player_info.player_number == 'player2') 
					{
						socket.emit('update ball velocity', { velocity_x: value_x, velocity_y: value_y, increment: false});
					}
					else 
					{
						ball.body.velocity.x = value_x;
						ball.body.velocity.y = value_y;
					}				
					ball.stopSign.start(true);
					player.special_power -= 50;
					player.offCooldown = false;
				}
			}
		}
	});
	
}(jQuery));