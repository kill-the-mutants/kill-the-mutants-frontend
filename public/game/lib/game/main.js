ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
	'impact.entity',
	'impact.image',
	'impact.entity-pool',
	// 'impact.debug.debug',
	'game.entities.player',
	'game.entities.sde',
	'game.entities.mutant',
	'game.entities.fire',
	'game.entities.explosion'
)
.defines(function(){

MyGame = ig.Game.extend({

	// Load a font
	font: new ig.Font( 'media/score.font.png' ),
	clearColor: null,
	gravity: 400,

	state: 0,
	CODING: 0,
	GAME: 1,
	GAME_OVER: 2,

	SCREEN_WIDTH: window.innerWidth,
	SCREEN_HEIGHT: window.innerHeight,

	mutants: [],
	fires: [],
	sde: null,
	killCount: 0,
	mutantCount: 20,

	init: function() {
		ig.input.bind(ig.KEY.SPACE, 'space');

		ig.EntityPool.enableFor(EntityPlayer);

		this.pitLength = (this.SCREEN_WIDTH * 1/2) + (this.SCREEN_WIDTH * 1/4);

		window.addEventListener('resize', this.resize, false);
	},

	spawnMutants: function(amount, successRate){
		var randPosY;
		var mutant;
		var cuttoff = Math.floor(amount*successRate);

		for(var i=0; i<amount; i++) {
			randPosY = Math.random() * this.SCREEN_HEIGHT*3/4;
			mutant = this.spawnEntity(EntityMutant, this.SCREEN_WIDTH, this.SCREEN_HEIGHT - randPosY);
			mutant.pos.x = this.SCREEN_WIDTH + mutant.size.x*2;
			mutant.vel.x = Math.random() * -100 - 100;

			mutant.willDie = false;
			if(i >= cuttoff) {
				mutant.willDie = true;
			}

			this.mutants.push(mutant);
		}
	},

	spawnFire: function(amount){
		var randPosX;
		var fire;

		for(var i=0; i<amount; i++) {
			// randomly add to the center of the screen
			randPosX = (Math.random() * this.pitLength) + (this.SCREEN_WIDTH - this.pitLength)/2;
			fire = this.spawnEntity(EntityFire, randPosX, this.SCREEN_HEIGHT);
			fire.pos.y = this.SCREEN_HEIGHT - fire.size.y;

			this.fires.push(fire);
		}
	},

	startGame: function(score) {
		this.mutants = [];
		this.killCount = 0;
		var successRate = (100-score)/100;
		this.score = score;
		this.sde = this.spawnEntity(EntitySde, 10, -10);
		this.sde.pos.y = 0 - this.sde.size.y;
		this.spawnMutants(this.mutantCount, successRate);
		this.spawnFire(20);
		this.state = this.GAME;
		$('#canvas').show();
	},

	endGame: function() {
		this.state = this.GAME_OVER;
	},

	startCoding: function() {
		this.state = this.CODE;

		if(this.sde)								{ this.sde.kill(); }
		for(fire of this.fires)			{ fire.kill(); }
		for(mutant of this.mutants) { mutant.kill(); }

		// wait until nice explosions are done
		$('#canvas').delay(800).queue(function (next) {
	    $(this).hide();
	    next();
	  });
	},

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

		switch(this.state){
			case this.CODING:
				if(ig.input.state("space")) this.startGame();
				break;
			case this.GAME:
				if(this.killCount >= this.mutantCount) this.endGame();
				break;
			case this.GAME_OVER:
				if(ig.input.state("space")) this.startCoding();
				break;
		}
	},

	drawBox: function(color,alpha,x1,y1,x2,y2) {
      ig.system.context.fillStyle = color;
      var prevAlpha = ig.system.context.globalAlpha;
      ig.system.context.globalAlpha = alpha;
      ig.system.context.fillRect(x1,y1,x2,y2);
      ig.system.context.globalAlpha = prevAlpha;
  },

	draw: function() {
		// clear the previous drawing
		ig.system.context.clearRect( 0 ,0, ig.system.realWidth, ig.system.realHeight );

		// draw all entities and backgroundMaps
		this.parent();

		// HUD
		switch(this.state) {
			case this.GAME_OVER:
				this.font.draw('You killed ' + Math.floor(this.score) + '% of the total mutants!\nPress SPACE to try again!', window.innerWidth/2, window.innerHeight/2, ig.Font.ALIGN.CENTER);
				break;
		}
	},

	resize: function() {
		// update entities based on old sizes
		for(fire of ig.game.fires) {
			fire.resize(ig.game.SCREEN_WIDTH, ig.game.SCREEN_HEIGHT, window.innerWidth, window.innerHeight);
		}
		for(mutant of ig.game.mutants) {
			mutant.resize(ig.game.SCREEN_WIDTH, ig.game.SCREEN_HEIGHT, window.innerWidth, window.innerHeight);
		}

		// update screen size
		ig.game.SCREEN_WIDTH = window.innerWidth;
		ig.game.SCREEN_HEIGHT = window.innerHeight;
		ig.system.resize(ig.game.SCREEN_WIDTH, ig.game.SCREEN_HEIGHT, 1);

		// update variables based on new sizes
		this.pitLength = (ig.game.SCREEN_WIDTH * 1/2) + (ig.game.SCREEN_WIDTH * 1/4);
	},

	removeFromArray: function(obj, array){
		var i = array.indexOf(obj);
		if(i != -1) array.splice(i,1);
	},
});

ig.main( '#canvas', MyGame, 60, window.innerWidth, window.innerHeight, 1 );

});
