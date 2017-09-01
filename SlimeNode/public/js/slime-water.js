(function($) {
	/**
		Slime: Water
		Special move: Push the ball upwards
	*/
	
	$.extend($.player, {
		initiateSlimeWater: function () {
			$.animations.ballHelicopterCreate();
			player.specialPower = function() {
			
				if(player.special_power >= 1.5)
				{
					value_x = 0;
					value_y = -25;
				
					if(player_info.player_number == 'player2') 
					{
						socket.emit('update ball velocity', { velocity_x: value_x, velocity_y: value_y, increment: true});
					}
					else 
					{
						ball.body.velocity.y += value_y;
					}				
					ball.helicopter.start(true);
					player.special_power -= 1.5;
				}
			}
		}
	});		

}(jQuery));