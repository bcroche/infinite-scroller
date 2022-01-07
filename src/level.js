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
export default class Level extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'level' });
  }

  

  addStandarBG()
  {
    this.sky= this.add.image(0,0,'sky').setOrigin(0,0);
    this.mountains= this.add.image(0,0,'mountains').setOrigin(0,0);    
  }


  // No acaba de funcionar bien, se va quedando en negro
  addStandarScrollBG()
  {
    const {width, height} = this.scale;
    this.sky= this.add.tileSprite(0,0, width, height,'sky').setOrigin(0,0).setScrollFactor(0.1, 0);
    this.mountains= this.add.tileSprite(0,0, width, height,'mountains').setOrigin(0,0).setScrollFactor(0.1, 0);    
  }

  // Este es el que va bien. Si se quiere que no haya Parallax, se pone el ratio a 1
  addParallaxBG()
  {
    const {width, height} = this.scale;
    this.backgrounds = [];
    // Añadimos los fondos
    this.backgrounds.push(
      {
        ratioX: 0.1,
        sprite: this.add.tileSprite(0,0, width, height,  'sky')
            .setOrigin(0,0)
            .setScrollFactor(0, 0)

      }
    );    
    this.backgrounds.push(
      {
        ratioX: 0.5,
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
  testSpritePlayer()
  {
    
    this.guy = this.physics.add.sprite(100, 450, 'guy')
        .setScale(0.1, 0.1)
        .setCollideWorldBounds(true);
  }


  /**
   * Creación de los elementos de la escena principal de juego
   */
  create() {
    const {width, height} = this.scale;

    this.parallaxEnabled= true;
    
    
    this.stars = 10;
    this.bases = this.add.group();

    //this.addStandarScrollBG();
    this.addParallaxBG();


    // Establecemos los limites del mundo. El ancho lo ponemos a infinito. El alto a la dimensión del gráfico menos 10
    this.physics.world.setBounds(
              0, 0, // x, y
              Number.MAX_SAFE_INTEGER, height - 10 // width, height
              )
      

    this.player = new Player(this, 200, 300);
    
    //this.testSpritePlayer();


    this.configCameraForScroll();

   
  }

  

  /**
   * Genera una estrella en una de las bases del escenario
   * @param {Array<Base>} from Lista de bases sobre las que se puede crear una estrella
   * Si es null, entonces se crea aleatoriamente sobre cualquiera de las bases existentes
   */
  spawn(from = null) {
    Phaser.Math.RND.pick(from || this.bases.children.entries).spawn();
  }

  /**
   * Método que se ejecuta al coger una estrella. Se pasa la base
   * sobre la que estaba la estrella cogida para evitar repeticiones
   * @param {Base} base La base sobre la que estaba la estrella que se ha cogido
   */
  starPickt (base) {
    this.player.point();
      if (this.player.score == this.stars) {
        this.scene.start('end');
      }
      else {
        let s = this.bases.children.entries;
        this.spawn(s.filter(o => o !== base));

      }
  }


  update()
  {
    if (!this.parallaxEnabled)
    {
      this.sky.tilePositionX= this.cameras.main.scrollX ;
      this.mountains.tilePositionX= this.cameras.main.scrollX ;

    } 
    else
    {
      for (let i= 0; i< this.backgrounds.length; ++i)
      {
        const bg= this.backgrounds[i];
        bg.sprite.tilePositionX= this.cameras.main.scrollX * bg.ratioX;
        //bg.sprite.tilePositionX= this.cameras.main.scrollX * bg.ratioX;
      }
    }
  }
}