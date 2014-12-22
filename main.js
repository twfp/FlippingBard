//init game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game');

//main game state
var main = {
    preload: function(){
        //set bg, load assets
        game.stage.backgroundColor = '#71c5cf';
        game.load.image('bard', 'assets/bard.png');
        game.load.image('pipe', 'assets/pipe.png');
    },

    create: function(){
        //set physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //init bard, add physics
        this.bard = this.game.add.sprite(100,245, 'bard');
        this.bard.anchor.setTo(0.5,0.5);
        game.physics.arcade.enable(this.bard);
        this.bard.body.angularDrag = 1414;
        this.bard.body.gravity.y = 1000;

        //map bard jump to spacebar
        var spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacebar.onDown.add(this.jump, this);

        //init pipes group, add physics
        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');

        //set pipe generation loop
        this.timer = game.time.events.loop(1500, this.addPipeColumn, this);

        //init score & label
        this.score = 0;
        this.scoreLabel = game.add.text(20, 20, this.score, {font: "30px Arial", fill: '#ffffff'});
    },

    update: function(){
        //if bard out of game area, restart game
        if(!this.bard.inWorld){
            this.restart();
        }

        //bard-pipe collision detection; restart game
        game.physics.arcade.overlap(this.bard, this.pipes, this.restart, null, this);

        //if bard is (angularly) slow, right him
        //this is so he's not flying around at an angle after multijumps
        if(this.bard.body.angularVelocity == 0){
            this.bard.angle = 0;
        }
    },

    //bard jump
    jump: function(){
        this.bard.body.velocity.y = -350;
        this.bard.body.angularVelocity = 2000;
    },

    //reset
    restart: function(){
        game.state.start('main');
    },

    //add a pipe segment
    addOnePipe: function(x, y){
        //get one pipe, set position, set movement
        var pipe = this.pipes.getFirstDead();
        pipe.reset(x, y);
        pipe.body.velocity.x = -200;

        //kill pipe when out of bounds
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    //add entire pipe column
    addPipeColumn: function(){
        //randomize hole position
        var holePos = Math.floor(Math.random() * 5) + 1;

        //build pipe
        for(var i=0; i<8; i++){
            if(i != holePos && i != holePos + 1){
                this.addOnePipe(400, i * 60 + 10);
            }
        }

        this.score++;
        this.scoreLabel.text = this.score;
    }
}

//add & start main state
game.state.add('main', main);
game.state.start('main');