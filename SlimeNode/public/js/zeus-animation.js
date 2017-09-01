(function ($) {
	$.zeusAnimation = $.zeusAnimation || {};	
	$.extend($.zeusAnimation, {
		charges: undefined,
		readyForZap: undefined,
		position: undefined,
		createLightning: function (x, opponentObject) {
			var lightningBitmap = game.add.bitmapData(100, 400);
			var lightning = game.add.image(x, 80, lightningBitmap);
			lightning.anchor.setTo(0.5, 0);
			
			var startX = lightning.world.x - 50;
			var opponentstart = opponent.world.x - Math.abs(opponent.width / 2);
			var opponentend = opponent.world.x + Math.abs(opponent.width / 2);

			$.zeusAnimation.charges -= 1;

			var ctx = lightningBitmap.context;
			var width = lightningBitmap.width;
			var height = lightningBitmap.height;

			ctx.clearRect(0, 0, width, height);
			var x = width / 2;
			var y = 0;
			var segments = 20;
			
			var xarr = [width /2];
			var yarr = [0];
			
			if (!opponentObject) {
				for (var i = 0; i < segments; i++) {
					ctx.strokeStyle = 'rgb(255, 255, 255)';
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.moveTo(x, y);
					x += game.rnd.integerInRange(-30, 30);
					if (x <= 10) {
						x = 10
					};
					if (x >= width - 10) {
						x = width - 10;
					}
					y += game.rnd.integerInRange(20, height / segments);
					if (i == segments - 1 || y > height) {
						y = height;
					}
					ctx.lineTo(x, y);
					xarr.push(x);
					yarr.push(y);
					ctx.stroke();
					
					if (y >= height) {
						$.zeusAnimation.playLightning(lightning);
						$.zeusAnimation.setCharges();
						var result;		
						if ((startX + x > opponentstart) && (startX + x < opponentend)) {
							result = true;
							$.zeusAnimation.hit();
						} else {
							result = false;
						}
						return { result: result, x: xarr, y: yarr };
					}
				}
			} else {
				for (var i = 0; i < segments; i++) {
					ctx.strokeStyle = 'rgb(255, 255, 255)';
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.moveTo(opponentObject.x[i], opponentObject.y[i]);
					ctx.lineTo(opponentObject.x[i + 1], opponentObject.y[i + 1]);
					ctx.stroke();
					if (i > (segments.length - 2)) {
						break;
					}
				}
				if (opponentObject.result == true) {
					$.zeusAnimation.hit(true);
				}
				$.zeusAnimation.playLightning(lightning);
				$.zeusAnimation.setCharges(true);
			}
		},
		playLightning: function (lightning) {
			lightning.alpha = 1;
			game.add.tween(lightning)
						.to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
						.to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
						.to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
						.to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
						.to({ alpha: 0 }, 250, Phaser.Easing.Cubic.In)
						.start();
		},
		setCharges: function (onSelf) {
			if (onSelf) {
				var target = opponent;
			} else {
				var target = player;
			}	
			if (target.children) {
				target.removeChildren();
			}
			if (this.charges > 0) {
				for (var i = 0; i < this.charges; i++) {
					var child = target.addChild(game.add.sprite(0, 0, 'zeuscharge'));
					child.visible = true;
					child.anchor.setTo(0, 0);
					child.position.y = -40;
					child.position.x = 20 - (i * 25);
				}
			} else {
				$.zeusAnimation.resetAll(onSelf ? true : false);
			}
		},
		hit: function (onSelf) {
			if (!onSelf) {
				var target = opponent;
			} else {
				var target = player;
			}
			var explosionContainer = target.addChild(game.make.sprite(0, 0, 'explosion'));
			explosionContainer.anchor.setTo(0, 0);
			explosionContainer.position.x = -40;
			explosionContainer.position.y = -70;
			var explosion = explosionContainer.animations.add('playExplosion', [0, 1, 2, 3]);
			explosion.play(30, false, true);
			if (onSelf) {
				target.setDisabled(1500);
			}
		},
		resetAll: function (onSelf) {
			if (onSelf) {
				var target = player;
			} else {
				var target = opponent;
				player.special_power = 0; 
			}
			var tween = game.add.tween(target.zeusAnimation).to({ alpha: 1 }, 650, "Linear", true);
			tween.onComplete.add(function () {
				game.add.tween(target.zeusAnimation).to({ alpha: 0 }, 500, "Linear", true);
			});
		}
	});	
}(jQuery));