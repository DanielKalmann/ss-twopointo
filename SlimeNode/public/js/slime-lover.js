(function($) {
	/**
		Slime: Lover
		Special move: Other slime is moving towards plays
	*/
	
	$.extend($.player, {
		initiateSlimeLover: function() {
			player.specialPower = function() {
			
				if(player.special_power >= 50 && player.offCooldown)
				{
					setTimeout(function () {
						player.offCooldown = true;
					}, 5000);	

					socket.emit('follow player');
					socket.emit('play lover animation');
					
					player.special_power -= 50;
					player.offCooldown = false;
					opponent.loverAnimation.start();
				}
			}
		},
		opponentInitiateSlimeLover: function (onSelf) {
			$.animations.playerLoverCreate(onSelf);
		}
	});
}(jQuery));