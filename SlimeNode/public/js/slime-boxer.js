(function($) {	
	$.extend($.player, {
		initiateSlimeBoxer: function () {
			$.animations.playerBoxerCreate();
			player.specialPower = function () {
				if (player.special_power >= 20) {
					player.boxingGlove.start();
					socket.emit('boxer start');
				}
			}
		},
		opponentInitiateSlimeBoxer: function (onSelf) {
			$.animations.playerBoxerCreate(onSelf);
		}
	});	
}(jQuery));