ig.module( 
	'game.entities.explosion' 
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityExplosion = ig.Entity.extend({
	animSheet: new ig.AnimationSheet('media/explosion.png', 130, 120),
	size: {x:40, y:40},
	gravityFactor: 0,

	init: function(x, y, settings){
		this.parent(x, y, settings);
		this.addAnim('idle',.1,[0,1,2,3,4,5,6,7],true);
	},

	update: function(){
		if(this.currentAnim.loopCount === 1)
			this.kill();
		this.parent();
	},

	reset: function(x, y, settings){
		this.currentAnim.rewind();
		this.parent(x, y, settings);
	}
});

});