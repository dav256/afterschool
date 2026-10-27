//=============================================================================
// PONG
//=============================================================================

Pong = {

  Defaults: {
    width:        640,   // logical canvas width (browser will scale to physical canvas size - which is controlled by @media css queries)
    height:       480,   // logical canvas height (ditto)
    wallWidth:    12,
    paddleWidth:  12,
    paddleHeight: 60,
    paddleSpeed:  2,     // should be able to cross court vertically   in 2 seconds
    ballSpeed:    4,     // should be able to cross court horizontally in 4 seconds, at starting speed ...
    ballAccel:    8,     // ... but accelerate as time passes
    ballRadius:   5,
    sound:        true
  },

  Colors: {
    walls:           'white',
    ball:            'white',
    score:           'white',
    footprint:       '#333',
    predictionGuess: 'yellow',
    predictionExact: 'red'
  },

  Images: [
    "data:image/png;base64,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",
    "data:image/png;base64,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",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAeCAYAAAG6fhusAAAAB3RJTUUH2QgeETodIhj3zQAAAAlwSFlzAAASdAAAEnQB3mYfeAAAAARnQU1BAACxjwv8YQUAAAKPSURBVHja7ZqhTgNBEEBLUxIEAhIkAsEHIBCICiQCgYCkgo9AguYDKvkAPqAWFAJRUVHBB1QgIEEiKiqW2TCXDMfs7szutUfCvORyd7M7szOzt3tzhU6nCdw3UzgGjNxzJzW0oMqNeNcM1B0Sl+Nc7QYM9KrrNQAvH9oObPm5mlE5sM9NrepZqSe/egDrDnBnRjZpO2H/BeF8VOcB1aNzTPWozq/BcFcKPW37ZLBZyJhmMBcZbFEz0gsZA9EZlz1uW7nhPITdZb3W78e2SpcK8B6NzDD+MtxyTfWpZKFlnWpr2hdPtxMhc2Vug9qnto3ZIWjbVqVHipg8Qju/NINw6sMx5mYn1pZKsG2DhmEYKyH20qzqd668LnmBp2wKyvmP4uBSMnx/9QMBBNtKfQHuVcHRzzJFcD2HP/cwwQXbYr4IZ+5SG1xudfKJ5ZKTtsUcx/MbHLuRBOysKjj/7TwLBBdsi/mS6iemNDg6G9q2hM1rOIalwd1Gdq/obkmuB5o2ic1YUhuZVcMwDMMwjD8C1lxTbTtXqzFwehWvjvxJWTBeqV6unxz+8+eO84Ox8xIao3TiooWptHDV9kMmUjulek3mBcQH1QQq4h1Lx+5KO7bEBRyHENBoRXpt89ioNe7zMXYvtSPpB6crvB2m7DShl5OXxFa5qbBzVD5bkcBWOXF4P0TRlWYCtHo1ku8bZrwBilQr3SVqiGzanjiUjVB8rlk5uXo5eUHZHhxz910gJVfbUkFHPMdwnJKn0t+f4PU8J1BNPxBN6JJYtl6Bn/4vBr5S9P9mdSiw84ymxMWJ1MEN97O0f6rd+8SEyu8Uoc8ITt7DJzmUsFw9CWI/Sbv/WftFkN9paAzDMAzD+G98AW3jrxgTadAHAAAAAElFTkSuQmCC"
  ],

  Levels: [
    {aiReaction: 0.2, aiError:  40}, // 0:  ai is losing by 8
    {aiReaction: 0.3, aiError:  50}, // 1:  ai is losing by 7
    {aiReaction: 0.4, aiError:  60}, // 2:  ai is losing by 6
    {aiReaction: 0.5, aiError:  70}, // 3:  ai is losing by 5
    {aiReaction: 0.6, aiError:  80}, // 4:  ai is losing by 4
    {aiReaction: 0.7, aiError:  90}, // 5:  ai is losing by 3
    {aiReaction: 0.8, aiError: 100}, // 6:  ai is losing by 2
    {aiReaction: 0.9, aiError: 110}, // 7:  ai is losing by 1
    {aiReaction: 1.0, aiError: 120}, // 8:  tie
    {aiReaction: 1.1, aiError: 130}, // 9:  ai is winning by 1
    {aiReaction: 1.2, aiError: 140}, // 10: ai is winning by 2
    {aiReaction: 1.3, aiError: 150}, // 11: ai is winning by 3
    {aiReaction: 1.4, aiError: 160}, // 12: ai is winning by 4
    {aiReaction: 1.5, aiError: 170}, // 13: ai is winning by 5
    {aiReaction: 1.6, aiError: 180}, // 14: ai is winning by 6
    {aiReaction: 1.7, aiError: 190}, // 15: ai is winning by 7
    {aiReaction: 1.8, aiError: 200}  // 16: ai is winning by 8
  ],

  //-----------------------------------------------------------------------------

  initialize: function(runner, cfg) {
    Game.loadImages(Pong.Images, function(images) {
      this.cfg         = cfg;
      this.runner      = runner;
      this.width       = runner.width;
      this.height      = runner.height;
      this.images      = images;
      this.playing     = false;
      this.scores      = [0, 0];
      this.menu        = Object.construct(Pong.Menu,   this);
      this.court       = Object.construct(Pong.Court,  this);
      this.leftPaddle  = Object.construct(Pong.Paddle, this);
      this.rightPaddle = Object.construct(Pong.Paddle, this, true);
      this.ball        = Object.construct(Pong.Ball,   this);
      this.sounds      = Object.construct(Pong.Sounds, this);
      this.runner.start();
    }.bind(this));
  },

  startDemo:         function() { this.start(0); },
  startSinglePlayer: function() { this.start(1); },
  startDoublePlayer: function() { this.start(2); },

  start: function(numPlayers) {
    if (!this.playing) {
      this.scores = [0, 0];
      this.playing = true;
      this.leftPaddle.setAuto(numPlayers < 1, this.level(0));
      this.rightPaddle.setAuto(numPlayers < 2, this.level(1));
      this.ball.reset();
      this.runner.hideCursor();
    }
  },

  stop: function(ask) {
    if (this.playing) {
      if (!ask || this.runner.confirm('Abandon game in progress ?')) {
        this.playing = false;
        this.leftPaddle.setAuto(false);
        this.rightPaddle.setAuto(false);
        this.runner.showCursor();
      }
    }
  },

  level: function(playerNo) {
    return 8 + (this.scores[playerNo] - this.scores[playerNo ? 0 : 1]);
  },

  goal: function(playerNo) {
    this.sounds.goal();
    this.scores[playerNo] += 1;
    if (this.scores[playerNo] == 9) {
      this.menu.declareWinner(playerNo);
      this.stop();
    }
    else {
      this.ball.reset(playerNo);
      this.leftPaddle.setLevel(this.level(0));
      this.rightPaddle.setLevel(this.level(1));
    }
  },

  update: function(dt) {
    this.leftPaddle.update(dt, this.ball);
    this.rightPaddle.update(dt, this.ball);
    if (this.playing) {
      var dx = this.ball.dx;
      var dy = this.ball.dy;
      this.ball.update(dt, this.leftPaddle, this.rightPaddle);
      if (this.ball.dx < 0 && dx > 0)
        this.sounds.ping();
      else if (this.ball.dx > 0 && dx < 0)
        this.sounds.pong();
      else if (this.ball.dy * dy < 0)
        this.sounds.wall();

      if (this.ball.left > this.width)
        this.goal(0);
      else if (this.ball.right < 0)
        this.goal(1);
    }
  },

  draw: function(ctx) {
    this.court.draw(ctx, this.scores[0], this.scores[1]);
    this.leftPaddle.draw(ctx);
    this.rightPaddle.draw(ctx);
    if (this.playing)
      this.ball.draw(ctx);
    else
      this.menu.draw(ctx);
  },

  onkeydown: function(keyCode) {
    switch(keyCode) {
      case Game.KEY.ZERO: this.startDemo();            break;
      case Game.KEY.ONE:  this.startSinglePlayer();    break;
      case Game.KEY.TWO:  this.startDoublePlayer();    break;
      case Game.KEY.ESC:  this.stop(true);             break;
      case Game.KEY.Q:    if (!this.leftPaddle.auto)  this.leftPaddle.moveUp();    break;
      case Game.KEY.A:    if (!this.leftPaddle.auto)  this.leftPaddle.moveDown();  break;
      case Game.KEY.P:    if (!this.rightPaddle.auto) this.rightPaddle.moveUp();   break;
      case Game.KEY.L:    if (!this.rightPaddle.auto) this.rightPaddle.moveDown(); break;
    }
  },

  onkeyup: function(keyCode) {
    switch(keyCode) {
      case Game.KEY.Q: if (!this.leftPaddle.auto)  this.leftPaddle.stopMovingUp();    break;
      case Game.KEY.A: if (!this.leftPaddle.auto)  this.leftPaddle.stopMovingDown();  break;
      case Game.KEY.P: if (!this.rightPaddle.auto) this.rightPaddle.stopMovingUp();   break;
      case Game.KEY.L: if (!this.rightPaddle.auto) this.rightPaddle.stopMovingDown(); break;
    }
  },

  showStats:       function(on) { this.cfg.stats = on; },
  showFootprints:  function(on) { this.cfg.footprints = on; this.ball.footprints = []; },
  showPredictions: function(on) { this.cfg.predictions = on; },
  enableSound:     function(on) { this.cfg.sound = on; },

  //=============================================================================
  // MENU
  //=============================================================================

  Menu: {

    initialize: function(pong) {
      var press1 = pong.images["data:image/png;base64,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"];
      var press2 = pong.images["data:image/png;base64,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"];
      var winner = pong.images["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAeCAYAAAG6fhusAAAAB3RJTUUH2QgeETodIhj3zQAAAAlwSFlzAAASdAAAEnQB3mYfeAAAAARnQU1BAACxjwv8YQUAAAKPSURBVHja7ZqhTgNBEEBLUxIEAhIkAsEHIBCICiQCgYCkgo9AguYDKvkAPqAWFAJRUVHBB1QgIEEiKiqW2TCXDMfs7szutUfCvORyd7M7szOzt3tzhU6nCdw3UzgGjNxzJzW0oMqNeNcM1B0Sl+Nc7QYM9KrrNQAvH9oObPm5mlE5sM9NrepZqSe/egDrDnBnRjZpO2H/BeF8VOcB1aNzTPWozq/BcFcKPW37ZLBZyJhmMBcZbFEz0gsZA9EZlz1uW7nhPITdZb3W78e2SpcK8B6NzDD+MtxyTfWpZKFlnWpr2hdPtxMhc2Vug9qnto3ZIWjbVqVHipg8Qju/NINw6sMx5mYn1pZKsG2DhmEYKyH20qzqd668LnmBp2wKyvmP4uBSMnx/9QMBBNtKfQHuVcHRzzJFcD2HP/cwwQXbYr4IZ+5SG1xudfKJ5ZKTtsUcx/MbHLuRBOysKjj/7TwLBBdsi/mS6iemNDg6G9q2hM1rOIalwd1Gdq/obkmuB5o2ic1YUhuZVcMwDMMwjD8C1lxTbTtXqzFwehWvjvxJWTBeqV6unxz+8+eO84Ox8xIao3TiooWptHDV9kMmUjulek3mBcQH1QQq4h1Lx+5KO7bEBRyHENBoRXpt89ioNe7zMXYvtSPpB6crvB2m7DShl5OXxFa5qbBzVD5bkcBWOXF4P0TRlWYCtHo1ku8bZrwBilQr3SVqiGzanjiUjVB8rlk5uXo5eUHZHhxz910gJVfbUkFHPMdwnJKn0t+f4PU8J1BNPxBN6JJYtl6Bn/4vBr5S9P9mdSiw84ymxMWJ1MEN97O0f6rd+8SEyu8Uoc8ITt7DJzmUsFw9CWI/Sbv/WftFkN9paAzDMAzD+G98AW3jrxgTadAHAAAAAElFTkSuQmCC"];
      this.press1  = { image: press1, x: 10,                                                 y: pong.cfg.wallWidth     };
      this.press2  = { image: press2, x: (pong.width - press2.width - 10),                   y: pong.cfg.wallWidth     };
      this.winner1 = { image: winner, x: (pong.width/2) - winner.width - pong.cfg.wallWidth, y: 6 * pong.cfg.wallWidth };
      this.winner2 = { image: winner, x: (pong.width/2)                + pong.cfg.wallWidth, y: 6 * pong.cfg.wallWidth };
    },

    declareWinner: function(playerNo) {
      this.winner = playerNo;
    },

    draw: function(ctx) {
      ctx.drawImage(this.press1.image, this.press1.x, this.press1.y);
      ctx.drawImage(this.press2.image, this.press2.x, this.press2.y);
      if (this.winner == 0)
        ctx.drawImage(this.winner1.image, this.winner1.x, this.winner1.y);
      else if (this.winner == 1)
        ctx.drawImage(this.winner2.image, this.winner2.x, this.winner2.y);
    }

  },

  //=============================================================================
  // SOUNDS
  //=============================================================================

  Sounds: {

    initialize: function(pong) {
      this.game      = pong;
      this.supported = Game.ua.hasAudio;
      if (this.supported) {
        this.files = {
          ping: Game.createAudio("data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA"),
          pong: Game.createAudio("data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA"),
          wall: Game.createAudio("data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA"),
          goal: Game.createAudio("data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA")
        };
      }
    },

    play: function(name) {
      if (this.supported && this.game.cfg.sound && this.files[name])
        this.files[name].play();
    },

    ping: function() { this.play('ping'); },
    pong: function() { this.play('pong'); },
    wall: function() { /*this.play('wall');*/ },
    goal: function() { /*this.play('goal');*/ }

  },

  //=============================================================================
  // COURT
  //=============================================================================

  Court: {

    initialize: function(pong) {
      var w  = pong.width;
      var h  = pong.height;
      var ww = pong.cfg.wallWidth;

      this.ww    = ww;
      this.walls = [];
      this.walls.push({x: 0, y: 0,      width: w, height: ww});
      this.walls.push({x: 0, y: h - ww, width: w, height: ww});
      var nMax = (h / (ww*2));
      for(var n = 0 ; n < nMax ; n++) { // draw dashed halfway line
        this.walls.push({x: (w / 2) - (ww / 2), 
                         y: (ww / 2) + (ww * 2 * n), 
                         width: ww, height: ww});
      }

      var sw = 3*ww;
      var sh = 4*ww;
      this.score1 = {x: 0.5 + (w/2) - 1.5*ww - sw, y: 2*ww, w: sw, h: sh};
      this.score2 = {x: 0.5 + (w/2) + 1.5*ww,      y: 2*ww, w: sw, h: sh};
    },

    draw: function(ctx, scorePlayer1, scorePlayer2) {
      ctx.fillStyle = Pong.Colors.walls;
      for(var n = 0 ; n < this.walls.length ; n++)
        ctx.fillRect(this.walls[n].x, this.walls[n].y, this.walls[n].width, this.walls[n].height);
      this.drawDigit(ctx, scorePlayer1, this.score1.x, this.score1.y, this.score1.w, this.score1.h);
      this.drawDigit(ctx, scorePlayer2, this.score2.x, this.score2.y, this.score2.w, this.score2.h);
    },

    drawDigit: function(ctx, n, x, y, w, h) {
      ctx.fillStyle = Pong.Colors.score;
      var dw = dh = this.ww*4/5;
      var blocks = Pong.Court.DIGITS[n];
      if (blocks[0])
        ctx.fillRect(x, y, w, dh);
      if (blocks[1])
        ctx.fillRect(x, y, dw, h/2);
      if (blocks[2])
        ctx.fillRect(x+w-dw, y, dw, h/2);
      if (blocks[3])
        ctx.fillRect(x, y + h/2 - dh/2, w, dh);
      if (blocks[4])
        ctx.fillRect(x, y + h/2, dw, h/2);
      if (blocks[5])
        ctx.fillRect(x+w-dw, y + h/2, dw, h/2);
      if (blocks[6])
        ctx.fillRect(x, y+h-dh, w, dh);
    },

    DIGITS: [
      [1, 1, 1, 0, 1, 1, 1], // 0
      [0, 0, 1, 0, 0, 1, 0], // 1
      [1, 0, 1, 1, 1, 0, 1], // 2
      [1, 0, 1, 1, 0, 1, 1], // 3
      [0, 1, 1, 1, 0, 1, 0], // 4
      [1, 1, 0, 1, 0, 1, 1], // 5
      [1, 1, 0, 1, 1, 1, 1], // 6
      [1, 0, 1, 0, 0, 1, 0], // 7
      [1, 1, 1, 1, 1, 1, 1], // 8
      [1, 1, 1, 1, 0, 1, 0]  // 9
    ]

  },

  //=============================================================================
  // PADDLE
  //=============================================================================

  Paddle: {

    initialize: function(pong, rhs) {
      this.pong   = pong;
      this.width  = pong.cfg.paddleWidth;
      this.height = pong.cfg.paddleHeight;
      this.minY   = pong.cfg.wallWidth;
      this.maxY   = pong.height - pong.cfg.wallWidth - this.height;
      this.speed  = (this.maxY - this.minY) / pong.cfg.paddleSpeed;
      this.setpos(rhs ? pong.width - this.width : 0, this.minY + (this.maxY - this.minY)/2);
      this.setdir(0);
    },

    setpos: function(x, y) {
      this.x      = x;
      this.y      = y;
      this.left   = this.x;
      this.right  = this.left + this.width;
      this.top    = this.y;
      this.bottom = this.y + this.height;
    },

    setdir: function(dy) {
      this.up   = (dy < 0 ? -dy : 0);
      this.down = (dy > 0 ?  dy : 0);
    },

    setAuto: function(on, level) {
      if (on && !this.auto) {
        this.auto = true;
        this.setLevel(level);
      }
      else if (!on && this.auto) {
        this.auto = false;
        this.setdir(0);
      }
    },

    setLevel: function(level) {
      if (this.auto)
        this.level = Pong.Levels[level];
    },

    update: function(dt, ball) {
      if (this.auto)
        this.ai(dt, ball);

      var amount = this.down - this.up;
      if (amount != 0) {
        var y = this.y + (amount * dt * this.speed);
        if (y < this.minY)
          y = this.minY;
        else if (y > this.maxY)
          y = this.maxY;
        this.setpos(this.x, y);
      }
    },

    ai: function(dt, ball) {
      if (((ball.x < this.left) && (ball.dx < 0)) ||
          ((ball.x > this.right) && (ball.dx > 0))) {
        this.stopMovingUp();
        this.stopMovingDown();
        return;
      }

      this.predict(ball, dt);

      if (this.prediction) {
        if (this.prediction.y < (this.top + this.height/2 - 5)) {
          this.stopMovingDown();
          this.moveUp();
        }
        else if (this.prediction.y > (this.bottom - this.height/2 + 5)) {
          this.stopMovingUp();
          this.moveDown();
        }
        else {
          this.stopMovingUp();
          this.stopMovingDown();
        }
      }
    },

    predict: function(ball, dt) {
      // only re-predict if the ball changed direction, or its been some amount of time since last prediction
      if (this.prediction &&
          ((this.prediction.dx * ball.dx) > 0) &&
          ((this.prediction.dy * ball.dy) > 0) &&
          (this.prediction.since < this.level.aiReaction)) {
        this.prediction.since += dt;
        return;
      }

      var pt  = Pong.Helper.ballIntercept(ball, {left: this.left, right: this.right, top: -10000, bottom: 10000}, ball.dx * 10, ball.dy * 10);
      if (pt) {
        var t = this.minY + ball.radius;
        var b = this.maxY + this.height - ball.radius;

        while ((pt.y < t) || (pt.y > b)) {
          if (pt.y < t) {
            pt.y = t + (t - pt.y);
          }
          else if (pt.y > b) {
            pt.y = t + (b - t) - (pt.y - b);
          }
        }
        this.prediction = pt;
      }
      else {
        this.prediction = null;
      }

      if (this.prediction) {
        this.prediction.since = 0;
        this.prediction.dx = ball.dx;
        this.prediction.dy = ball.dy;
        this.prediction.radius = ball.radius;
        this.prediction.exactX = this.prediction.x;
        this.prediction.exactY = this.prediction.y;
        var closeness = (ball.dx < 0 ? ball.x - this.right : this.left - ball.x) / this.pong.width;
        var error = this.level.aiError * closeness;
        this.prediction.y = this.prediction.y + Game.random(-error, error);
      }
    },

    draw: function(ctx) {
      ctx.fillStyle = Pong.Colors.walls;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      if (this.prediction && this.pong.cfg.predictions) {
        ctx.strokeStyle = Pong.Colors.predictionExact;
        ctx.strokeRect(this.prediction.x - this.prediction.radius, this.prediction.exactY - this.prediction.radius, this.prediction.radius*2, this.prediction.radius*2);
        ctx.strokeStyle = Pong.Colors.predictionGuess;
        ctx.strokeRect(this.prediction.x - this.prediction.radius, this.prediction.y - this.prediction.radius, this.prediction.radius*2, this.prediction.radius*2);
      }
    },

    moveUp:         function() { this.up   = 1; },
    moveDown:       function() { this.down = 1; },
    stopMovingUp:   function() { this.up   = 0; },
    stopMovingDown: function() { this.down = 0; }

  },

  //=============================================================================
  // BALL
  //=============================================================================

  Ball: {

    initialize: function(pong) {
      this.pong    = pong;
      this.radius  = pong.cfg.ballRadius;
      this.minX    = this.radius;
      this.maxX    = pong.width - this.radius;
      this.minY    = pong.cfg.wallWidth + this.radius;
      this.maxY    = pong.height - pong.cfg.wallWidth - this.radius;
      this.speed   = (this.maxX - this.minX) / pong.cfg.ballSpeed;
      this.accel   = pong.cfg.ballAccel;
    },

    reset: function(playerNo) {
      this.footprints = [];
      this.setpos(playerNo == 1 ?   this.maxX : this.minX,  Game.random(this.minY, this.maxY));
      this.setdir(playerNo == 1 ? -this.speed : this.speed, this.speed);
    },

    setpos: function(x, y) {
      this.x      = x;
      this.y      = y;
      this.left   = this.x - this.radius;
      this.top    = this.y - this.radius;
      this.right  = this.x + this.radius;
      this.bottom = this.y + this.radius;
    },

    setdir: function(dx, dy) {
      this.dxChanged = ((this.dx < 0) != (dx < 0)); // did horizontal direction change
      this.dyChanged = ((this.dy < 0) != (dy < 0)); // did vertical direction change
      this.dx = dx;
      this.dy = dy;
    },

    footprint: function() {
      if (this.pong.cfg.footprints) {
        if (!this.footprintCount || this.dxChanged || this.dyChanged) {
          this.footprints.push({x: this.x, y: this.y});
          if (this.footprints.length > 50)
            this.footprints.shift();
          this.footprintCount = 5;
        }
        else {
          this.footprintCount--;
        }
      }
    },

    update: function(dt, leftPaddle, rightPaddle) {

      pos = Pong.Helper.accelerate(this.x, this.y, this.dx, this.dy, this.accel, dt);

      if ((pos.dy > 0) && (pos.y > this.maxY)) {
        pos.y = this.maxY;
        pos.dy = -pos.dy;
      }
      else if ((pos.dy < 0) && (pos.y < this.minY)) {
        pos.y = this.minY;
        pos.dy = -pos.dy;
      }

      var paddle = (pos.dx < 0) ? leftPaddle : rightPaddle;
      var pt     = Pong.Helper.ballIntercept(this, paddle, pos.nx, pos.ny);

      if (pt) {
        switch(pt.d) {
          case 'left':
          case 'right':
            pos.x = pt.x;
            pos.dx = -pos.dx;
            break;
          case 'top':
          case 'bottom':
            pos.y = pt.y;
            pos.dy = -pos.dy;
            break;
        }

        // add/remove spin based on paddle direction
        if (paddle.up)
          pos.dy = pos.dy * (pos.dy < 0 ? 0.5 : 1.5);
        else if (paddle.down)
          pos.dy = pos.dy * (pos.dy > 0 ? 0.5 : 1.5);
      }

      this.setpos(pos.x,  pos.y);
      this.setdir(pos.dx, pos.dy);
      this.footprint();
    },

    draw: function(ctx) {
      var w = h = this.radius * 2;
      ctx.fillStyle = Pong.Colors.ball;
      ctx.fillRect(this.x - this.radius, this.y - this.radius, w, h);
      if (this.pong.cfg.footprints) {
        var max = this.footprints.length;
        ctx.strokeStyle = Pong.Colors.footprint;
        for(var n = 0 ; n < max ; n++)
          ctx.strokeRect(this.footprints[n].x - this.radius, this.footprints[n].y - this.radius, w, h);
      }
    }

  },

  //=============================================================================
  // HELPER
  //=============================================================================

  Helper: {

    accelerate: function(x, y, dx, dy, accel, dt) {
      var x2  = x + (dt * dx) + (accel * dt * dt * 0.5);
      var y2  = y + (dt * dy) + (accel * dt * dt * 0.5);
      var dx2 = dx + (accel * dt) * (dx > 0 ? 1 : -1);
      var dy2 = dy + (accel * dt) * (dy > 0 ? 1 : -1);
      return { nx: (x2-x), ny: (y2-y), x: x2, y: y2, dx: dx2, dy: dy2 };
    },

    intercept: function(x1, y1, x2, y2, x3, y3, x4, y4, d) {
      var denom = ((y4-y3) * (x2-x1)) - ((x4-x3) * (y2-y1));
      if (denom != 0) {
        var ua = (((x4-x3) * (y1-y3)) - ((y4-y3) * (x1-x3))) / denom;
        if ((ua >= 0) && (ua <= 1)) {
          var ub = (((x2-x1) * (y1-y3)) - ((y2-y1) * (x1-x3))) / denom;
          if ((ub >= 0) && (ub <= 1)) {
            var x = x1 + (ua * (x2-x1));
            var y = y1 + (ua * (y2-y1));
            return { x: x, y: y, d: d};
          }
        }
      }
      return null;
    },

    ballIntercept: function(ball, rect, nx, ny) {
      var pt;
      if (nx < 0) {
        pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                   rect.right  + ball.radius, 
                                   rect.top    - ball.radius, 
                                   rect.right  + ball.radius, 
                                   rect.bottom + ball.radius, 
                                   "right");
      }
      else if (nx > 0) {
        pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                   rect.left   - ball.radius, 
                                   rect.top    - ball.radius, 
                                   rect.left   - ball.radius, 
                                   rect.bottom + ball.radius,
                                   "left");
      }
      if (!pt) {
        if (ny < 0) {
          pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                     rect.left   - ball.radius, 
                                     rect.bottom + ball.radius, 
                                     rect.right  + ball.radius, 
                                     rect.bottom + ball.radius,
                                     "bottom");
        }
        else if (ny > 0) {
          pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                     rect.left   - ball.radius, 
                                     rect.top    - ball.radius, 
                                     rect.right  + ball.radius, 
                                     rect.top    - ball.radius,
                                     "top");
        }
      }
      return pt;
    }

  }

  //=============================================================================

}; // Pong
