(function($) {	
	$.extend($.player, {
		initiateSlimeMask: function () {
			player.specialPower = function () {
				if(player.special_power >= 40 && player.offCooldown)
				{
					setTimeout(function () {
						player.offCooldown = true;
					}, 6000);
					
					player.special_power -= 40;
					player.offCooldown = false;
					opponent.maskAnimation.start();
					socket.emit('play mask animation');
				}
			}
		},
		opponentInitiateSlimeMask: function (onSelf) {
			$.animations.opponentMaskCreate(onSelf);	
		}
	});
}(jQuery));