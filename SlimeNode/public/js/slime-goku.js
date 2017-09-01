(function($) {	
	$.extend($.player, {
		initiateSlimeGoku: function () {
			$.animations.playerGokuCreate();
			player.specialPower = function () {
				if (player.special_power >= 1) {
					player.gokuAnimation.start();
					socket.emit('gokuAnimation start');
				}
			}
		},
		opponentInitiateSlimeGoku: function (onSelf) {
			$.animations.playerGokuCreate(onSelf);
		}
	});	
}(jQuery));