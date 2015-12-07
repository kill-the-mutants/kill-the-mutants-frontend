ig.module(
	'game.entities.mutant'
)
.requires(
	'impact.entity',
	'game.entities.player'
)
.defines(function(){

EntityMutant = EntityPlayer.extend({

	animSheet: new ig.AnimationSheet('media/mutant.png',100,145),
	size: {x: 100, y: 145},
	offset: {x: 5, y: 10},
	type: ig.Entity.TYPE.A,

	// predetermine the mutant's fate
	deathLocation: -100,

	init: function(x, y, settings){
		this.parent(x, y, settings);

		this.willDie = false;

		// 1	- play each frame for 1 second
		// [0]	- the animation consists of only fram 0
		// true	- stop the animation when it finishes(rather than looping)
		this.addAnim('idle', 1, [0], true);
	},

	checkBounds: function() {
		this.parent();
		// right
		if(this.pos.x < - this.size.x * 2) { //make sure they are off the screen
			this.receiveDamage(1);
		}
	},

	update: function() {
		this.parent();

		// set death location if not set (and supposed to die)
		if(this.willDie && this.deathLocation === -100) {
			// NOTE: pit is centered
			this.deathLocation = (Math.random() * ig.game.pitLength) + (ig.game.SCREEN_WIDTH - ig.game.pitLength)/2;
		}

		// if they are going to die, explode!
		if(this.willDie && this.pos.x <= this.deathLocation) {
			this.receiveDamage(1);
		}

		if(this.grounded) {
			this.vel.y = -300;
		}
	},

	kill: function() {
		ig.game.spawnEntity(EntityExplosion, this.pos.x, this.pos.y);
		ig.game.killCount++;
		this.parent();
	}
});

});
