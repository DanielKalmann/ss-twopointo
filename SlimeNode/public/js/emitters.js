(function ($) {
	$.emitters = $.emitters || {};
	$.extend($.emitters, {
		//INIT
		createBallSpeedyEmitter: function () {
			ball.speedyEmitter = game.add.emitter(0, 0, 15);
			ball.speedyEmitter.makeParticles('emitter02', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
			ball.speedyEmitter.minParticleScale = 0.5;
			ball.speedyEmitter.maxParticleScale = 0.6;
			ball.speedyEmitter.setAlpha(0.7, 0.9);
			
			ball.speedyEmitter.start(false, 150, 51);
			
			ball.speedyEmitter.hasEmitted = false;
			ball.speedyEmitter.on = false;
			ball.speedyEmitter.startEmitter = function (needsToSocket) {
				if (needsToSocket) {
					socket.emit('start speedy emitter');
				}
				if (this.hasEmitted == false) {
					this.hasEmitted = true;
					ball.speedyEmitter.on = true;
					setTimeout(function () {
						ball.speedyEmitter.stopEmitter();
					}, 500);
				}
			}
			ball.speedyEmitter.stopEmitter = function () {
				this.on = false;
				ball.speedyEmitter.hasEmitted = false;
			}
			ball.speedyEmitter.update = function () {
				if (this.on == true) {
					var frequency = 75;
					if (this.lastEmitted == (undefined || null)) this.lastEmitted = 0;
					if (game.time.now - this.lastEmitted < frequency) return;
					this.lastEmitted = game.time.now;
					this.x = ball.x + (ball.width / 2);
					this.y = ball.y + (ball.height / 2);
					var positiveX = ball.body.velocity.x > 0;
					var positiveY = ball.body.velocity.y > 0;
					if (positiveX) {
						this.setXSpeed(0, ball.body.velocity.x - 15);
					} else {
						this.setXSpeed(0, ball.body.velocity.x + 15);
					}
					if (positiveY) {
						this.setYSpeed(0, ball.body.velocity.y - 15);
					} else {
						this.setYSpeed(0, ball.body.velocity.y + 15);
					}
					this.emitParticle();
				}
			}
		},
		
		createBallHelicopterEmitter: function () {
			if (ball.helicopter) {
				ball.helicopterEmitter = game.add.emitter(0, 0, 3);
				ball.helicopterEmitter.makeParticles('cloud01');
				ball.helicopterEmitter.start(false, 450, 51);
				
				ball.helicopterEmitter.minParticleScale = 1.1;
				ball.helicopterEmitter.maxParticleScale = 1.3;
			} else {
				console.log('ball.helicopter not found');
			}
			
			ball.helicopterEmitter.hasEmitted = false;
			ball.helicopterEmitter.on = false;
			ball.helicopterEmitter.startEmitter = function () {
				if (this.hasEmitted == false) {
					if (this.alive == false) {
						this.revive();
					}
					this.hasEmitted = true;
					ball.helicopterEmitter.on = true;
				}
			}
			ball.helicopterEmitter.stopEmitter = function () {
				ball.helicopterEmitter.forEachExists(function (p) {
					p.kill();
				});
				this.kill();
				ball.helicopterEmitter.hasEmitted = false;
			}
			ball.helicopterEmitter.update = function () {
				if (this.on == true) {
					var frequency = 250;
					if (this.lastEmitted == (undefined || null)) this.lastEmitted = 0;
					if (game.time.now - this.lastEmitted < frequency) return;
					this.lastEmitted = game.time.now;
					this.x = ball.helicopter.x;
					this.y = ball.helicopter.y - ball.helicopter.height;
					this.setXSpeed(0, 0);
					this.emitParticle();
				}
			}
		},
		
		////createGokuEmitter: function () {
		//	var emitter = game.add.emitter(0, 0);
		//	emitter.makeParticles('emitter-goku');
		//	emitter.start(false, 5000, 13000);
		//	emitter.hasEmitted = false;
		//	emitter.on = false;
		//	emitter.width = 200;
		//	emitter.height = 200;
		//	emitter.scaleData = [1, 0.9, 0.8, 0.7, .6, .5, .4];
			
		//	emitter.startEmitting = function () {
		//		if (this.hasEmitted == false) {
		//			if (!this.alive) {
		//				this.revive();
		//			}
		//		}
		//		this.hasEmitted = true;
		//		this.on = true;
		//	}
		//	emitter.stopEmitter = function () {
		//		this.forEachExists(function (p) {
		//			p.kill();
		//		});
		//		this.kill();
		//		this.hasEmitted = false;
		//	}
		//	emitter.update = function () {
		//		if (this.on == true) {
		//			var frequency = 5000;
		//			if (this.lastEmitted == (undefined || null)) this.lastEmitted = 0;
		//			if (game.time.now - this.lastEmitted < frequency) return;
		//			this.lastEmitted = game.time.now;
		//			this.x = player.chargeBall.world.x;
		//			this.y = player.chargeBall.world.y;
		//			this.setXSpeed(100, 300);
		//			this.emitParticle();
		//			this.forEachExists(function (p) {
		//				game.add.tween(p).to({ x: player.chargeBall.world.x }, 5000, "Linear", true);
		//			});
		//		}
		//	}
		//	return emitter;
		//}
		//create: function (game, player, ball) {
		//	var emitter = game.add.emitter(game.world.centerX, game.world.centerY, 50);
		//	//console.log($.ball);			
		//	emitter.makeParticles(['fire1', 'fire2', 'fire3']);
		//	emitter.setXSpeed(0, 0);
		//	emitter.setYSpeed(200, -200);
		//	emitter.bringToTop = false;
		//	emitter.setRotation(0, 0);
		//	emitter.start(true);
		//	emitter.on = false;
		//	emitter.updateOnce = true;
		//	emitter.hasUpdatedOnce = false;

		//	//Start function (gets called on player, specialmove is down);			
		//	emitter.startEmitter = function (game, ball) {
		//		var emitter = this;
		//		var duration = 5000;
		//		//TODO: reset to "true" ( Used for testing )
		//		emitter.on = true;
		//		setTimeout(function () { emitter.stopEmitter() }, 2000);
		//	};
			
		//	emitter.stopEmitter = function () {
		//		var emitter = this;
		//		emitter.on = false;
		//		emitter.hasUpdatedOnce = false;
		//		emitter.forEachAlive(emitter.killAllParticles, this);
		//	};
			
		//	emitter.killAllParticles = function (particle) {
		//		particle.kill();
		//	}
			
		//	//Update function ( Refreshes every frame ). Possible to add more params 
		//	emitter.updateEmitter = function (game, ball) {
		//		var emitter = this;				
		//		if (emitter.updateOnce == true) {
		//			if (emitter.hasUpdatedOnce != true) {
		//				emitter.hasUpdatedOnce = true;
		//				emitter.x = ball.x
		//				emitter.y = ball.y
		//				emitter.forEachAlive(tryFunction, this)
		//				function tryFunction(particle) {
		//					game.add.tween(particle).to({ x: '+300' }, 2000, Phaser.Easing.Linear.None, true);
		//				}
		//			}
		//		} else {					
		//			var height = game.world.height;
		//			var ballheight = ball.y;					
		//			emitter.x = ball.x;
		//			emitter.y = ball.y;					
		//			emitter.setXSpeed(-1 * ball.body.velocity.x, -1 * ball.body.velocity.x - 50);
		//		}
		//	}
		//	return emitter;
		//}
	});
}(jQuery));