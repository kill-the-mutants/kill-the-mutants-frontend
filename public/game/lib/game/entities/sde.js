ig.module(
	'game.entities.sde'
)
.requires(
	'impact.entity',
	'game.entities.player'
)
.defines(function(){

EntitySde = EntityPlayer.extend({

	animSheet: new ig.AnimationSheet('media/sde.png',100,159),
	size: {x: 100, y: 159},
	checkAgainst: ig.Entity.TYPE.A,
	maxVel: {x: 500, y: 500},

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		// 1	- play each frame for 1 second
		// [0]	- the animation consists of only frame 0
		// true	- stop the animation when it finishes(rather than looping)
		this.addAnim('idle', 1, [0], true);
	},

	check: function(other){
		// game over
		if(other instanceof EntityMutant){
			this.receiveDamage(1);
			ig.game.endGame();
		}
	}
});

});
