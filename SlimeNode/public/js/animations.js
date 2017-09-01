(function ($) {
	$.animations = $.animations || {};
	$.extend($.animations, {
		
		//## FOR BALL
		ballStopSignCreate: function () {
			//BALL STOP ANIMATION
			if (ball) {
				//STOPSIGN FOR SLIME STOPPER
				ball.stopSign = ball.addChild(game.make.sprite(0, 0, 'stop'));
				ball.stopSign.anchor.setTo(0.5, 0.5);
				ball.stopSign.visible = false;
				
				ball.stopSign.start = function (needsToSocket) {
					if (needsToSocket) {
						socket.emit('stop ball');
					}
					ball.stopSign.visible = true;
					ball.stopSign.alpha = 1;
					ball.angle = 0;
					var firsttween = game.add.tween(ball.stopSign).to({ alpha: 1 }, 200, "Linear", true);
					firsttween.onComplete.add(function () {
						var secondtween = game.add.tween(ball.stopSign).to({ alpha: 0 }, 200, "Linear", true);
						secondtween.onComplete.add(function () {
							ball.stopSign.visible = false;
						})
					});
				}

			} else {
				console.log('ball not found');
			}
		},
		
		ballHelicopterCreate: function () {
			if (ball) {
				ball.helicopter = game.add.sprite(0, 0, 'helicopter');
				ball.helicopter.anim = ball.helicopter.animations.add('playHelicopter', [0, 1, 2, 3, 4]);
			    ball.helicopter.anchor.setTo(0.5, 1);
				ball.helicopter.scale.x = 2;
				ball.helicopter.scale.y = 2;
				ball.helicopter.visible = false;
				
				$.emitters.createBallHelicopterEmitter();
								
				ball.helicopter.update = function () {
					this.x = ball.body.x + (ball.width / 2);
					this.y = ball.body.y;
				}
				ball.helicopter.start = function (needsToSocket) {
					if (needsToSocket) {
						socket.emit('start helicopter');
					}
					ball.helicopter.anim.play(null, true);
					ball.helicopterEmitter.startEmitter();
					ball.helicopter.visible = true;
					setTimeout(function () {
						ball.helicopter.visible = false;
						ball.helicopterEmitter.stopEmitter();
					}, 500);
				}
			}
		},
		
		//## FOR BOTH
		
		playerBoxerCreate: function (onSelf) {
			if (!onSelf) {
				var target = player;
			} else {
				var target = opponent;	
			}
			//var target = player;
			target.boxingGlove = target.addChild(game.make.sprite(0, 0, 'boxing-glove'));
			target.boxingGlove.anchor.setTo(0, 0.5);
			target.boxingGlove.alpha = 0;
			target.halo = target.addChild(game.add.sprite());
			target.halo.position.setTo(0, 20);
			game.physics.enable(target.halo, Phaser.Physics.ARCADE);
			target.halo.body.setSize(100, 50);
			if (!onSelf || onSelf) {
				target.update = function () {
					if (target.scale.x > 0) {
						target.halo.anchor.setTo(0, 1);
					} else {
						target.halo.anchor.setTo(1, 1);
					}
					target.isInRange = false;
					game.physics.arcade.overlap(target.halo, onSelf ? player: opponent, function () { target.isInRange = true });
				}
			}
			target.boxingGlove.start = function () {
				var tween = game.add.tween(target.boxingGlove).to({ alpha: 1 }, 100, "Linear", true);
				tween.onComplete.add(function () {
					var followuptween = game.add.tween(target.boxingGlove.position).to({ x: 50 }, 150, "Linear", true);
					followuptween.onComplete.add(function () {
						if (target.isInRange) {
							if (target.boxingGlove.lasthit == undefined) target.boxingGlove.lasthit = 0;
							if (game.time.now - target.boxingGlove.lasthit < 400) return;
							target.boxingGlove.lasthit = game.time.now;
							if (onSelf) {
								player.setDisabled(3000);
							}
						}
						game.add.tween(target.boxingGlove.position).to({ x: 0 }, 250, "Linear", true);
						game.add.tween(target.boxingGlove).to({ alpha: 0 }, 150, "Linear", true, 350);
					});
				})
			}
		},
		
		playerGokuCreate: function (onSelf) {
			if (!onSelf) {
				var target = player;
			} else {
				var target = opponent;
			}
			//var target = player;
			target.createFrames = function () {
				var array = [];
				for (var i = 0; i < 35; i++) {
					array.push(i);
				}
				return array
			}
			target.gokuAnimation = {};
			target.gokuAnimation.gokuHair = target.addChild(game.make.sprite(0, 0, 'goku-hair'));
			target.gokuAnimation.gokuHair.anchor.setTo(1, 0);
			target.gokuAnimation.gokuHair.scale.setTo(-.4, .4);
			target.gokuAnimation.gokuHair.position.y = -40;
			target.gokuAnimation.hairChange = target.gokuAnimation.gokuHair.animations.add('changehair', [0, 1]);
			target.gokuAnimation.hairChangeBack = target.gokuAnimation.gokuHair.animations.add('changehairback', [0]);
			target.chargeBall = target.addChild(game.make.sprite(0, 0, 'charge-ball'));
			target.chargeBall.alpha = 0;
			target.chargeBall.position.x = 45; //45
			target.chargeBall.position.y = -17; //-21
			target.chargeBallAnimationContainer = target.chargeBall.addChild(game.make.sprite(0, 0, 'goku-emitter'));
			target.chargeBallAnimationContainer.anchor.setTo(0.25, 0.2);
			target.projectile = game.add.sprite(target.world.x, target.world.y, 'goku-projectile');
			game.physics.enable(target.projectile, Phaser.Physics.ARCADE);
			target.projectile.alpha = 0;
			target.projectile.body.gravity.y = 0;
			//game.physics.arcade.overlap(target.halo, onSelf ? player: opponent, function () { target.isInRange = true });
			var arr = target.createFrames();
			target.chargeBallAnimation = target.chargeBallAnimationContainer.animations.add('cb-ani', arr);
			target.gokuAnimation.start = function () {
				target.gokuAnimation.hairChange.play('changehair', null, false, false);
				target.chargeBall.alpha = 1;
				target.chargeBallAnimation.play(30, true, false);
				var tween = game.add.tween(target.chargeBall.scale).to({ x: 1.4, y: 1.4 }, 800, "Linear", true);
				tween.onComplete.add(function () {
					setTimeout(function () {
						target.projectile.x = target.chargeBall.world.x;
						target.projectile.y = target.chargeBall.world.y;
						target.projectile.body.velocity.x = target.scale.x < 0 ? -1200 : 1200;
						game.add.tween(target.projectile).to({ alpha: 1 }, 100, "Linear", true);
						target.projectile.body.velocity.y = 0;
						setTimeout(function () {
							target.chargeBallAnimation.stop();
							target.chargeBall.alpha = 0;
							target.gokuAnimation.hairChangeBack.play(null, false, false);
						}, 250);
					}, 500);
				});
			}
			target.projectile.update = function () {
				game.physics.arcade.overlap(target.projectile, onSelf ? player: opponent, function () {
					if (target.projectile.lasthit == undefined) target.projectile.lasthit = 0;
					if (game.time.now - target.projectile.lasthit < 100) return;
					target.projectile.lasthit = game.time.now;
					if (onSelf) {
						player.setDisabled(3000);
					}
				});
			}
		},


		//playerBaseballCreate: function (onSelf) {
		//	//if (onSelf) {
		//	//	var target = player;
		//	//} else {
		//	//	var target = opponent;	
		//	//}
		//	var target = player;
		//	target.baseballAnimation = target.addChild(game.make.sprite(0, 0, 'baseballss'));
		//	target.halo = target.addChild(game.add.sprite());
		//	target.halo.position.setTo(0, 0);
		//	game.physics.enable(target.halo, Phaser.Physics.ARCADE);
		//	target.halo.body.setSize(125, 75);			
		//	target.update = function () {
		//		if (player.scale.x > 0) {
		//			target.halo.anchor.setTo(0, 1);
		//		} else {
		//			target.halo.anchor.setTo(1, 1);
		//		}
		//		target.isInRange = false;
		//		game.physics.arcade.overlap(target.halo, ball, function () { target.isInRange = true });
					
		//	}			 
		//	target.baseballAnimation.alpha = 0;
		//	target.baseballAnimation.position.y = -30;
		//	target.baseballAnimation.position.x = -30;
		//	target.baseballAnimation.start = function () {
		//		if (this.alive == false) {
		//			this.revive();	
		//		}
		//		var swing = target.baseballAnimation.animations.add('playSwing', [5, 4, 3, 2]);
		//		target.baseballAnimation.alpha = 1;
		//		swing.onComplete.add(nextFunction, this);
		//		setTimeout(function () {
		//			swing.play(15, false, true)
		//		}, 5);
		//		function nextFunction() {
		//			var swing2 = target.baseballAnimation.animations.add('playSwing1', [1, 0]);
		//			if (target.isInRange) {
		//				console.log("FULL HIT");
		//				swing2.play(15, false, true);
		//				ball.body.velocity.x = -1200;
		//				//ball.body.velocity.y = 100;
		//			} else {
		//				swing2.play(15, false, true);
		//			}
		//		}
		//	}
		//},
		playerReverseCreate: function (onSelf) {
			if (onSelf) {
				var target = opponent;
				debugger;
			} else {
				var target = player;	
			}
			target.missileTest = game.add.sprite(0, 0, 'emitter011');
			target.missileTest.visible = false;
			target.missileTest.scale.x = 2;
			target.missileTest.scale.y = 2;
			game.physics.enable(target.missileTest, Phaser.Physics.ARCADE);
		
			target.missileTest.start = function () {
				if (this.alive == false) {
					this.revive();
				}
				this.visible = true;
				if (!onSelf) {
					target.missileTest.events.onKilled.add(target.initialPower, this);
				}
				this.x = target.x;
				this.y = target.y;
			}

			target.missileTest.update = function () {
				var targetAngle = game.math.angleBetween(this.body.x + this.width/2, this.body.y + this.height / 2, ball.body.x + ball.width/2, ball.body.y + ball.height);
				this.rotation = targetAngle;
				this.body.velocity.x = Math.cos(this.rotation) * 1500;
				this.body.velocity.y = Math.sin(this.rotation) * 1500;
				game.physics.arcade.overlap(target.missileTest, ball, killOnOverlap, null, this);
				function killOnOverlap(m, b) {
					m.kill();
				}
			}
		},
		
		playerZeusCreate: function (onSelf) {
			if (onSelf) {
				var target = player;	
			} else {
				
				var target = opponent;		
			}
			var animationObject = $.zeusAnimation;
			target.zeusAnimation = game.add.sprite(0, 0, 'cloud02');
			target.zeusAnimation.alpha = 0;
			target.zeusAnimation.readyForZap = false;
			target.zeusAnimation.isOkTo = true;
			target.zeusAnimation.start = function () {
				if (!onSelf) {
					socket.emit('start zeusAnimation');	
				}
				this.x = target.x - this.width / 2;
				animationObject.position = target.world.x;
				this.y = 40;
				var tween = game.add.tween(this).to({ alpha: 1 }, 500, "Linear", true);
				tween.onComplete.add(function () {
					animationObject.charges = 3;
					animationObject.setCharges(onSelf);
				});
			};

			player.zap = function () {
				if (animationObject.lastZapped === undefined) animationObject.lastZapped = 0;
				if (game.time.now - animationObject.lastZapped < 500) return;
				animationObject.lastZapped = game.time.now;
				var result = animationObject.createLightning(animationObject.position);
				socket.emit('create lightning', { result: result.result, xarr: result.x, yarr: result.y });
			}			
			target.zeusAnimation.setCharges = function () {
				animationObject.setCharges(onSelf);
			}			
		},

		playerLoverCreate: function (onSelf) {
			if (onSelf) {
				var target = player;
			} else {
				var target = opponent;
			}
			target.loverAnimation = target.addChild(game.make.sprite(0, 0, 'heart'));
			target.loverAnimation.anchor.setTo(0.5, 0);
			target.loverAnimation.visible = false;
			target.loverAnimation.start = function () {
				var i = 0;				
				var xarr = [75, 20, -60, -20, 30];
				var yarr = [-50, -20, -30, -20, -40];
				var anglearr = [-30, 15, -50, 35, 0];
				function setAnimData() {
					target.loverAnimation.position.x = xarr[i];
					target.loverAnimation.position.y = yarr[i];
					target.loverAnimation.angle = anglearr[i];
					target.loverAnimation.visible = true;
					var tween = game.add.tween(target.loverAnimation).to({ visible: false }, 500, "Linear", true);
					if (i < yarr.length) {
						i++;
						tween.onComplete.add(setAnimData, this);
					}
				}
				if (i == 0) {
					setAnimData();
				}
				//target.loverAnimation.visible = true;
				//game.add.tween(target.loverAnimation).to({ visible: false }, 2000, "Linear", true);
			}
		},
		opponentMaskCreate: function (onSelf) {
			if (onSelf) {
				var target = player;
				target.maskAnimation = target.addChild(game.make.sprite(0, 0, 'mask-opponent'));
				target.maskAnimation.anchor.setTo(0.51, 0.72);
			} else {
				var target = opponent;
				target.maskAnimation = target.addChild(game.make.sprite(0, 0, 'mask-player'));
				target.maskAnimation.anchor.setTo(0.51, 0.72);
			}
			target.maskAnimation.visible = false;
			target.maskAnimation.start = function () {
				target.maskAnimation.visible = true;
				setTimeout(function () { 
					target.maskAnimation.visible = false;
				}, 4000)
			}
		}
	})
})(jQuery);