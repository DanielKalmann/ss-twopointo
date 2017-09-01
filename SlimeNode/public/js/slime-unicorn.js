(function($) {
	/**
		Slime: Unicorn
		Special move: Flying
	*/

	$.extend($.player, {
		initiateSlimeUnicorn: function() {
			player.specialPower = function() {
			
				if(player.special_power >= 1)
				{
					player.body.velocity.y -= 20;
					player.special_power -= 1;
				}
			}
		}
	});	

}(jQuery));