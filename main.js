//init game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game');

//main game state
var main = {
    preload: function(){
        //set bg, load assets
        game.stage.backgroundColor = '#71c5cf';
        game.load.image('bard', 'assets/bard.png');
        game.load.image('segment', 'assets/segment.png');
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

        //init columns as groups of segments, add physics
        this.columnA = game.add.group();
        this.columnA.enableBody = true;
        this.columnA.createMultiple(6, 'segment');

        this.columnB = game.add.group();
        this.columnB.enableBody = true;
        this.columnB.createMultiple(6, 'segment');

        //init columns group
        this.columns = game.add.group();
        this.columns.add(this.columnA);
        this.columns.add(this.columnB);

        //set pipe generation loop
        this.timer = game.time.events.loop(1500, this.addColumn, this);

        //init score & label
        this.score = 0;
        this.scoreLabel = game.add.text(20, 20, "Yon Columnes Passed: 0", {font: "30px Arial", fill: '#ffffff'});
    },

    update: function(){
        //if bard out of game area, restart game
        if(!this.bard.inWorld){
            this.restart();
        }

        //bard-column collision detection; restart game
        game.physics.arcade.overlap(this.bard, this.segments, this.restart, null, this);

        //if bard is (angularly) slow, right him
        //this is so he's not flying around at an angle after multijumps
        if(this.bard.body.angularVelocity == 0){
            this.bard.angle = 0;
        }

        //if bard passes column, increment score
        //if(this.bard.body.position.x == )
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

    //add a column segment
    addSegment: function(x, y){
        //get one segment, set position, set movement
        var segment = this.segments.getFirstDead();
        segment.reset(x, y);
        segment.body.velocity.x = -200;

        //kill segment when out of bounds
        segment.checkWorldBounds = true;
        segment.outOfBoundsKill = true;
    },

    //add entire column
    addColumn: function(){
        //randomize hole position
        var holePos = Math.floor(Math.random() * 5) + 1;

        var column = this.columns.getFirstDead();

        //build column
        for(var i=0; i<8; i++){
            if(i != holePos && i != holePos + 1){
                this.addSegment(400, i * 60 + 10);
            }
        }

        this.score++;
        this.scoreLabel.text = this.score;
    }
}

//add & start main state
game.state.add('main', main);
game.state.start('main');