 (function($) {
	/**
		Slime: Reverse
		Special move: Increases the gravity of the ball
	*/

	$.extend($.player, {
		initiateSlimeGravity:  function() {
			player.specialPower = function() {
			
				if(player.special_power >= 50 && player.offCooldown)
				{
					setTimeout(function () {
						player.offCooldown = true;
					}, 2000);

					if(player_info.player_number == 'player2') 
					{
						socket.emit('update ball gravity', { gravity: 1600, increment: false});
					}
					else 
					{
						ball.body.gravity.y = 1600;
					}
			
					// After 3 seconds back to normal
					setTimeout(function () {
						if(player_info.player_number == 'player2') 
						{
							socket.emit('update ball gravity', { gravity: 800, increment: false});
						}
						else 
						{
							ball.body.gravity.y = 800;
						}
					}, 3000);					

					player.special_power -= 50;
					player.offCooldown = false;
				}
			}
		}
	});	

}(jQuery));
