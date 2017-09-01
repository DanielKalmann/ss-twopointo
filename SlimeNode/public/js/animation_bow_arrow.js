(function ($) {
	$.animation_bow_arrow = $.animation_bow_arrow || {};
	$.extend($.animation_bow_arrow, {
		create: function (x, y) {
			var bow = game.add.sprite(x, y);
			bow.BowSprite = bow.addChild(game.make.sprite(x, y, 'bow'));
			bow.BowSprite.visible = false;
			bow.BowSprite.anchor.setTo(0.2, 0.8);
			bow.arrowPool = game.add.group();
			bow.alreadyCalculated = false;
			bow.BowSprite.anim = bow.BowSprite.animations.add("pullbow", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]);
			bow.resetKey = game.input.keyboard.addKey(Phaser.Keyboard.H)
			for (var i = 0; i < 3; i++) {
				var arrow = game.add.sprite(0, 0, 'arrow');
				bow.arrowPool.add(arrow);
				arrow.anchor.setTo(1, 0);
				game.physics.enable(arrow, Phaser.Physics.ARCADE);
				arrow.body.gravity.y = 980
				arrow.tracking = true;
				arrow.kill();
			}							
			bow.shootArrow = function () {
				bow.angle = 0;
				bow.BowSprite.visible = true;
				bow.BowSprite.anim.play();
				bow.BowSprite.anim.onComplete.add(function () {
					if (this.lastBulletShotAt === undefined) {
						this.lastBulletShotAt = 0;
					}
					if (this.game.time.now - this.lastBulletShotAt < 300) {
						return
					};
					this.lastBulletShotAt = this.game.time.now;
					var arrow = bow.arrowPool.getFirstDead();
					if (arrow === null || arrow === undefined) {
						return;
					}					
					arrow.revive();
					arrow.reset(player.direction == directions.LEFT  ? bow.world.x+10 : bow.world.x-30, bow.world.y-30);
					arrow.angle = (bow.calculateAngle() *-1);
					bow.angle = (bow.calculateAngle() *-1);
					arrow.checkWorldBounds = true;
					arrow.outOfBoundsKill = true;
					arrow.body.velocity.x = player.direction == directions.LEFT ? -Math.cos(arrow.rotation) * 1500 : Math.cos(arrow.rotation) * 1500;
					arrow.body.velocity.y = Math.sin(arrow.rotation) * 1500;
					setTimeout(function () { bow.BowSprite.visible = false }, 500);
				})
			}			
			bow.update = function () {
				bow.arrowPool.forEachAlive(function (arrow) {
					arrow.rotation = Math.atan2(arrow.body.velocity.y, arrow.body.velocity.x);
					console.log('hallo?');
					game.physics.arcade.collide(arrow, ball, bow.arrowBallCollision, null, this);
				}, this);

				if (special_move_btn.isDown) {
					bow.shootArrow();
					socket.emit('shootArrow'); 
				}
			}
			bow.calculateAngle = function () {
				var angle = null;
				var travelduration = (Math.sqrt(Math.pow(Math.abs(player.x - ball.x), 2) + Math.pow(Math.abs(player.y - ball.y), 2))) / 1500;
				var differencex = ball.body.velocity.x * travelduration;
				var differencey = ball.body.velocity.y * travelduration;							
				var tany = (game.height - (ball.y + differencey)) - (game.height - bow.world.y);
				var tanx = (bow.world.x - (ball.x + differencex));
				angle = (Math.atan(tany / tanx) * 57.2);
				if (ball.x > player.x) {
					angle = angle * -1;	
				}
				return angle;
			}
			bow.arrowBallCollision = function (arrow, ball) {
				arrow.kill();
				if (player.x > ball.x) {
					ball.body.velocity.x -= 100;
				} else {
					ball.body.velocity.x += 100;
				}
			}
			return bow;
		},
	})
} (jQuery));