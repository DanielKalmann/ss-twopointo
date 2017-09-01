(function($) {
	/**
		Slime: Ghost
		Special move: Hides the opponent
	*/
	
	$.extend($.player, {
		initiateSlimeGhost: function() {
			player.specialPower = function() {
			
				if(player.special_power >= 50 && player.offCooldown)
				{
					setTimeout(function () {
						player.offCooldown = true;
					}, 3000);
					
					opponent.alpha = 0;
			
					socket.emit('update alpha', { player_number : player_info.player_number, alpha : 0 });

					setTimeout(function(){
						opponent.alpha = 1;

						socket.emit('update alpha', { player_number : player_info.player_number, alpha : 1 });

					}, 3000);
					
					player.special_power -= 50;
					player.offCooldown = false;
				}
			}
		}
	});

}(jQuery));