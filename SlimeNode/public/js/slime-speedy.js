(function($) {
	/**
		Slime: Speedy
		Special move: Increase ball movement in the current direction
	*/
	
	$.extend($.player, {
		initiateSlimeSpeedy: function () {
			$.emitters.createBallSpeedyEmitter();
			player.specialPower = function() {

				if(player.special_power >= 2)
				{
					ball.speedyEmitter.startEmitter(true);
					// If no velocity detected on ball, leave the ball untouched
					if(ball.body.velocity.x != 0) {

						if(ball.body.velocity.x > 0) 
						{
							value = 12.5;
						}
						else
						{
							value = -12.5;
						}
					}
					else
					{
						value = 0;
					}
					
					if(player_info.player_number == 'player2') 
					{
						socket.emit('update ball velocity', { velocity_x: value, velocity_y: 0, increment: true});
					}
					else 
					{
						ball.body.velocity.x += value;
					}				
					
					player.special_power -= 2;
				}
			}
		}
	});
	
}(jQuery));