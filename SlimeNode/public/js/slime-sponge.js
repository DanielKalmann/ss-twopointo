(function($) {	
	$.extend($.player, {
		initiateSlimeSponge: function() {
			player.specialPower = function() {
			
				if(player.special_power >= 50 && player.offCooldown)
				{
					setTimeout(function () {
						player.offCooldown = true;
					}, 8000);

					player.scale.x *= 2;	
					player.scale.y *= 2;	
					
					socket.emit('update scale', { value : 2, multiply : 0 });

					setTimeout(function(){
						player.scale.x /= 2;	
						player.scale.y /= 2;	
						
						socket.emit('update scale', { value : 2, multiply : 1 });	
						
					}, 4000);
					
					player.special_power -= 50;
					player.offCooldown = false;
				}
			}
		}
	});
}(jQuery));