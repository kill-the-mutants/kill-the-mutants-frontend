ig.module(
	'game.entities.fire'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityFire = ig.Entity.extend({
	animSheet: new ig.AnimationSheet('media/fire.png', 90, 100),
	size: {x:84, y:77},
	offset: {x:18, y:18},
	type: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.FIXED,
	gravityFactor: 0,

	init: function(x, y, settings){
		this.parent(x, y, settings);
		this.addAnim('idle',.1,[0,1,2],false);
		this.addAnim('plume',.2,[3,4,5,6,7,6,5,4,3],false);

		this.plumeTimer = new ig.Timer(Math.random() * 2);
	},

	update: function() {
		this.parent();

		//if time elapsed, spawn a plume or let it dwindle down
		if(this.plumeTimer.delta() >= 0){
			if(this.currentAnim === this.anims.idle) {
				this.currentAnim = this.anims.plume;
				this.plumeTimer.set(.2*9);
			} else {
				this.currentAnim = this.anims.idle;
				this.plumeTimer.set(Math.random() * 4);
			}
		}
	}
});

});
