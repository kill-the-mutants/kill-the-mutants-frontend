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

	init: function() {
		ig.input.bind(ig.KEY.SPACE, 'space');

		ig.EntityPool.enableFor(EntityPlayer);

		this.pitLength = (this.SCREEN_WIDTH * 1/2) + (this.SCREEN_WIDTH * 1/4);
	},

	spawnMutants: function(amount, successRate){
		var randPosY;
		var mutant;
		var cuttoff = Math.floor(amount*successRate);

		for(var i=0; i<amount; i++) {
			randPosY = Math.random() * this.SCREEN_HEIGHT;
			mutant = this.spawnEntity(EntityMutant, this.SCREEN_WIDTH - 100, this.SCREEN_HEIGHT - randPosY);
			mutant.vel.x = Math.random() * -100 - 100;

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
			randPosX = (Math.random() * ig.game.pitLength) + (ig.game.SCREEN_WIDTH - ig.game.pitLength)/2;
			fire = this.spawnEntity(EntityFire, randPosX, this.SCREEN_HEIGHT);
			fire.pos.y = this.SCREEN_HEIGHT - fire.size.y;

			this.fires.push(fire);
		}
	},

	startGame: function(entity) {
		this.player = this.spawnEntity(EntitySde, 10, 10);
		this.spawnMutants(20,.6);
		this.spawnFire(2000);
		this.state = this.GAME;
		$('#canvas').show();
	},

	endGame: function() {
		this.state = this.GAME_OVER;
	},

	startCoding: function() {
		this.state = this.CODE;

		for(fire of this.fires) {
			fire.kill();
		}

		for(mutant of this.mutants) {
			mutant.kill();
		}

		// wait until nice explosions are done
		// $('#canvas').delay(10000).hide();
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
				this.font.draw('Final Score: ' + this.score + '\nPress SPACE, L, or S to restart!', window.innerWidth/2, window.innerHeight/2, ig.Font.ALIGN.CENTER);
				break;
		}
	}
});

ig.main( '#canvas', MyGame, 60, window.innerWidth, window.innerHeight, 1 );

});
