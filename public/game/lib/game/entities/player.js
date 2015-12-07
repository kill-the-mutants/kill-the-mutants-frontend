ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	health: 1,
	maxVel: {x: 500, y: 500},
	grounded: false,

	init: function(x, y, settings){
		this.parent(x, y, settings);
	},

	checkBounds: function(){
		// check player bounds
		// bottom
		if(this.pos.y + this.size.y > ig.game.SCREEN_HEIGHT){
			this.grounded = true;
			this.pos.y = ig.game.SCREEN_HEIGHT - this.size.y;
			this.vel.y = 0;
		} else {
			this.grounded = false;
		}
	},

	update: function() {
		this.parent();
		this.checkBounds();
	},

	resize: function(OLD_SCREEN_WIDTH, OLD_SCREEN_HEIGHT, NEW_SCREEN_WIDTH, NEW_SCREEN_HEIGHT) {
		this.pos.x = (this.pos.x / OLD_SCREEN_WIDTH) * NEW_SCREEN_WIDTH;
		this.pos.y = (this.pos.y / OLD_SCREEN_HEIGHT) * NEW_SCREEN_HEIGHT;
	}
});

});
