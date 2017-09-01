(function($) {
	/**
		Slime: Jumper
		Special move: Other slime is jumping constantly
	*/


	$.extend($.player, {
		initiateSlimeJumper: function() {
			player.specialPower = function() {
			
				if(player.special_power >= 50 && player.offCooldown)
				{
					setTimeout(function () {
						player.offCooldown = true;
					}, 7000);	

					socket.emit('constant jumping');
		
					player.special_power -= 50;
					player.offCooldown = false;
				}
			}
		}
	});	

}(jQuery));