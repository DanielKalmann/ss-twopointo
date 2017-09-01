(function($) {	
	$.extend($.player, {
		initiateSlimeZeus: function () {
			player.specialPower = function () {
				if (player.special_power >= 60) {
					if (opponent.zeusAnimation.alpha == 0) {
						opponent.zeusAnimation.start();
					}
					if ($.zeusAnimation.charges > 0) {
						player.zap();
					}
				}
			}
		},
		opponentInitiateSlimeZeus: function (onSelf) {
			$.animations.playerZeusCreate(onSelf);
		}
	});	
}(jQuery));