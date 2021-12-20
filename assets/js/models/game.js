class Game {
  constructor(ctx) {
    this.ctx = ctx;

    this.background = new Background(ctx);
    this.player = new Player(ctx, 3);
    this.enemies = [
      /*firt line*/
      new Enemies(ctx, 8, 540),
      new Enemies(ctx, 64, 540),
      new Enemies(ctx, 120, 540),
      new Enemies(ctx, 175, 540),
      new Enemies(ctx, 229, 540),
      new Enemies(ctx, 282, 540),
      new Enemies(ctx, 336, 540),
      new Enemies(ctx, 390, 540),
      /*second line*/
      new Enemies(ctx, 8, 480),
      new Enemies(ctx, 64, 480),
      new Enemies(ctx, 120, 480),
      new Enemies(ctx, 175, 480),
      new Enemies(ctx, 229, 480),
      new Enemies(ctx, 282, 480),
      new Enemies(ctx, 336, 480),
      new Enemies(ctx, 390, 480),
      /*third line*/
      new Enemies(ctx, 8, 420),
      new Enemies(ctx, 64, 420),
      new Enemies(ctx, 120, 420),
      new Enemies(ctx, 175, 420),
      new Enemies(ctx, 229, 420),
      new Enemies(ctx, 282, 420),
      new Enemies(ctx, 336, 420),
      new Enemies(ctx, 390, 420),
    ];
    this.sound = new Audio("/assets/audio/Imperial-March(complete).mp3");
    this.sound.volume = 0.5;
    this.explosionSound = new Audio("/assets/audio/TIE-explode.mp3");
    this.explosionSound.volume = 0.5;

    // this.isPlayer = isPlayer;

    this.score = 0;

    this.intervalId = undefined;
    this.enemiesBulletsIntervalId = undefined;
  }

  start() {
    if (!this.intervalId) {
      this.sound.play()
      this.sound.currentTime = 0;
      this.intervalId = setInterval(() => {
        this.clear();
        this.draw();
        this.move();
        this.checkCollisions();
      }, 1000 / 60);
    }

    if (!this.enemiesBulletsIntervalId) {
      this.enemiesBulletsIntervalId = setInterval(() => {
        this.enemies[
          Math.floor(Math.random() * (this.enemies.length - 0))
        ]?.addLaserShot();
      }, Math.floor(Math.random() * (600 - 300) + 300));
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.height, this.ctx.canvas.width);
  }

  drawScore() {
    this.ctx.fillText(`Score: ${this.score}`, 100, 100);
  }

  draw() {
    this.background.draw();

    this.player.draw();
    this.enemies.forEach((enemies) => enemies.draw());

    if (this.player.life === 0) {
      if (!this.explosion) {
        this.explosion = new Explosion(this.ctx, this.player.x, this.player.y);
      }
      this.explosion.draw();
    }
  }

  move() {
    if (!this.explosion) {
      this.background.move();
      this.player.move();
      this.enemies.forEach((enemy, index) => {
        enemy.move();
        if (index < this.enemies.length / 3) {
          if (enemy.y > this.ctx.canvas.height / 2 + 120) {
            enemy.y -= 0.5;
          }
        }
        if (
          index >= this.enemies.length / 3 &&
          index < (this.enemies.length * 2) / 3
        ) {
          if (enemy.y > this.ctx.canvas.height / 2 + 60) {
            enemy.y -= 0.5;
          }
        }
        if (index >= (this.enemies.length * 2) / 3) {
          if (enemy.y > this.ctx.canvas.height / 2) {
            enemy.y -= 0.5;
          }
        }
      });
    }

    if (this.explosion) {
      this.explosion.move(this.gameOver);
    }

    // if (this.enemies.length === 12) {

    // }
  }

  setUpListeners(event) {
    this.player.setUpListeners(event);
  }

  checkCollisions() {
    this.enemies.forEach((enemy, idx) => {
      this.player.laserShots.forEach((laser, laserIdx) => {
        if (laser.collidesWith(enemy)) {
          this.enemies.splice(idx, 1);
          this.player.laserShots.splice(laserIdx, 1);
          this.explosionSound.currentTime = 0.1;
          this.explosionSound.play();

          this.score++;
          console.log("Score: ", this.score);
        }
        if (this.enemies.length === 0) {
          this.gameOver(true);
          this.sound.volume = 0;
        }
      });

      enemy.laserShots.forEach((laser, laserIdx) => {
        if (laser.collidesWith(this.player)) {
          enemy.laserShots.splice(laserIdx, 1);
          if (this.player.life > 0) {
            this.player.life--;
          }

          console.log(this.player.life);
        }
      });
    });
  }

  gameOver = (winCase = false) => {
    console.log("game over");
    clearInterval(this.intervalId);
    this.ctx.save();

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "#FFE81F";
    this.ctx.textAlign = "center";
    this.ctx.font = "bold 35px sans-serif";
    if (!winCase) {
      this.ctx.fillText(
        `Ooh... you lose!`,
        this.ctx.canvas.width / 2,
        this.ctx.canvas.height / 2
      );
      this.ctx.fillText(
        `You score is ${this.score}`,
        this.ctx.canvas.width / 2,
        this.ctx.canvas.height / 2 + 50
      );
    } else {
      this.ctx.fillText(
        `You Win! \n You score is ${this.score}`,
        this.ctx.canvas.width / 2,
        this.ctx.canvas.height / 2
      );
      this.ctx.fillText(
        `You score is ${this.score}`,
        this.ctx.canvas.width / 2,
        this.ctx.canvas.height / 2 + 50
      );
    }

    this.ctx.restore();
  };
}
