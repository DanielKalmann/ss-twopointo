(function($) {
	/**
		Slime: Weight
		Special move: Other slime can't jump
	*/
	
	$.extend($.player, {
		initiateSlimeWeight: function() {
			player.specialPower = function() {
			
				if(player.special_power >= 50 && player.offCooldown)
				{
					setTimeout(function () {
						player.offCooldown = true;
					}, 7000);	

					socket.emit('no jumping');
					
					player.special_power -= 50;
					player.offCooldown = false;
				}
			}
		}
	});		

}(jQuery));