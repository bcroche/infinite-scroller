import Platform from './platform.js';
import Player from './player.js';

/**
 * Escena principal del juego. La escena se compone de una serie de plataformas 
 * sobre las que se sitúan las bases en las podrán aparecer las estrellas. 
 * El juego comienza generando aleatoriamente una base sobre la que generar una estrella. 
 * Cada vez que el jugador recoge la estrella, aparece una nueva en otra base.
 * El juego termina cuando el jugador ha recogido 10 estrellas.
 * @extends Phaser.Scene
 */
export default class Parallax extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'parallax' });
  }

  

  addStandarBG()
  {
    this.sky= this.add.image(0,0,'sky').setOrigin(0,0);
    this.mountains= this.add.image(0,0,'mountains').setOrigin(0,0);    
  }


  // No acaba de funcionar bien, se va quedando en negro
  addStandarScrollBG() 
  {
    const { width, height } = this.scale;
    this.sky = this.add.tileSprite(0, 0, width, height, 'sky').setOrigin(0, 0).setScrollFactor(0, 0);
    this.mountains = this.add.tileSprite(0, 0, width, height, 'mountains').setOrigin(0, 0).setScrollFactor(0, 0);
  }

  // Este es el que va bien. Si se quiere que no haya Parallax, se pone el ratio a 1
  addParallaxBG()
  {
    const {width, height} = this.scale;
    this.backgrounds = [];
    // Añadimos los fondos
    this.backgrounds.push(
      {
        ratioX: 0.1, //movimiento en horizontal
        sprite: this.add.tileSprite(0,0, width, height,  'sky')
            .setOrigin(0,0)
            .setScrollFactor(0, 0)

      }
    );    
    this.backgrounds.push(
      {
        ratioX: 0.5, //movimiento en horizontal
        sprite: this.add.tileSprite(0,100, width, height, 'mountains')
                  .setOrigin(0,0)
                  .setScrollFactor(0, 0)
      }
      );

  }


  //Configuración de la camara principal  
  configCameraForScroll() {

    //Para que siga al jugador
    this.cameras.main.startFollow(this.player);

    //Para que no se salga de los límites del mundo
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, this.scale.height);
  }



  // Test create simple sprite 
  testSpritePlayer(posX)
  {
    console.log("creando guy");
    this.guy = this.physics.add.sprite(posX, this.scale.height, 'guy')
        .setScale(0.1, 0.1)
        .setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.guy);//, this.collisionCallback);  
    this.guy.body.setVelocityX = -5;
  }


  /**
   * Creación de los elementos de la escena principal de juego
   */
  create() {
    const {width, height} = this.scale;

    this.parallaxEnabled= true;

    if (this.parallaxEnabled)
      this.addParallaxBG();
    else
      this.addStandarScrollBG();
    


    // Establecemos los limites del mundo. El ancho lo ponemos a infinito. El alto a la dimensión del gráfico menos 10
    this.physics.world.setBounds(
              0, 0, // x, y
              Number.MAX_SAFE_INTEGER, height - 10 // width, height
              )
      

    this.player = new Player(this, 200, 300);
    
    


    this.configCameraForScroll();

   this.obstacleInProgress = false;
  }

  getRandomTime(min, max) 
  {
    let num = Math.random();
    return Math.floor((num + min) * max);
  }


  update()
  {
    if (!this.parallaxEnabled)
    {
      this.sky.tilePositionX= this.cameras.main.scrollX ; //multiplicar por ratio para parallax rápido
      this.mountains.tilePositionX= this.cameras.main.scrollX ;

    } 
    else
    {
      for (let i= 0; i< this.backgrounds.length; ++i)
      {
        const bg= this.backgrounds[i];
        bg.sprite.tilePositionX= this.cameras.main.scrollX * bg.ratioX;
      }
    }

    if (!this.obstacleInProgress)
    {
      this.obstacleInProgress = true;
      const myTimeout = setTimeout(this.createObstacle, this.getRandomTime(2000, 4000));
    }
      

    //if (this.cameras.main.scrollX % 500 === 0)
      
  }

  createObstacle()
  {
    this.testSpritePlayer(this.cameras.main.scrollX + 800);
    this.obstacleInProgress = false;
  }
}