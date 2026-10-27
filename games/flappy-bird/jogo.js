console.log('[DevSoutinho] Flappy Bird');
console.log('Inscreva-se no canal :D https://www.youtube.com/channel/UCzR2u5RWXWjUh7CwLSvbitA');

let frames = 0;
const som_HIT = new Audio();
som_HIT.src = 'data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA';

const sprites = new Image();
sprites.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAApoAAALSCAYAAAB9B3H+AAAJvmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZGM6Zm9ybWF0PSJpbWFnZS9wbmciCiAgIGV4aWY6Q29sb3JTcGFjZT0iNjU1MzUiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI2NjYiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI3MjIiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJHZW5lcmljIFJHQiBQcm9maWxlIgogICB0aWZmOkltYWdlTGVuZ3RoPSI3MjIiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iNjY2IgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB0aWZmOlJlc29sdXRpb25Vbml0PSIyIgogICB0aWZmOlhSZXNvbHV0aW9uPSI3Mi4wIgogICB0aWZmOllSZXNvbHV0aW9uPSI3Mi4wIgogICB4bXA6Q3JlYXRlRGF0ZT0iMjAxOS0wNC0xMVQyMjoyMTo1OCswMjowMCIKICAgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cykiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDMtMDJUMjM6MDM6MzItMDM6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTAzLTAyVDIzOjAzOjMyLTAzOjAwIgogICB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOmE1Y2VjZGI5LTcwMWEtMzQ0MC04MWE4LTMwOTM1YzAwNWNiOCIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4Njc0YjRlMC0zYmY4LTMzNDYtOWY4ZS0xOGM2OWRmMjdmM2MiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphNWNlY2RiOS03MDFhLTM0NDAtODFhOC0zMDkzNWMwMDVjYjgiPgogICA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPgogICAgPHJkZjpCYWc+CiAgICAgPHJkZjpsaT54bXAuZGlkOmE1Y2VjZGI5LTcwMWEtMzQ0MC04MWE4LTMwOTM1YzAwNWNiODwvcmRmOmxpPgogICAgPC9yZGY6QmFnPgogICA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHhtcE1NOmFjdGlvbj0iY3JlYXRlZCIKICAgICAgeG1wTU06aW5zdGFuY2VJRD0ieG1wLmlpZDphNWNlY2RiOS03MDFhLTM0NDAtODFhOC0zMDkzNWMwMDVjYjgiCiAgICAgIHhtcE1NOnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIKICAgICAgeG1wTU06d2hlbj0iMjAxOS0wNC0xMVQyMjoyMTo1OCswMjowMCIv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hFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgA6JpcBAAAHQ0lEQVQQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACEUmgAAhFBoAgAQQqEJAEAIhSYAACE2hr6Avl2898KjL35911uf3vw13duw5ytSSikdTk9PvI5y+Iu7f55/jnsfvX9P6IUAAASRaAIAEGLlEs1s4x3fG/oS5vLCF08b+hIAAOYi0QQAIMTKJpr/+HfPSSmldNmrzk8ppXTnEw9MfH7wwUMppZTOOu+MideL8viB51NKKb1m3wkTrwEAVoVEEwCAEApNAABCKDQBAAih0AQAIIRCEwCAEApNAABCKDQBAAih0AQAIIRCEwCAEApNAABCKDQBAAih0AQAIIRCEwCAEApNAABCKDQBAAixMfQFRDn44KGJ15e96vxOr7u684kHJo6TX9ecdV75zub1Pn7g+bmuAwBgLCSaAACEWNlE8/A1r9j8NT2dUkrprnTvQs47+3le0et1AAAMTaIJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwqvZcvPfCo0NfBKyrex+9f8/Q1wAAUY4b+gIAAFhNG39y8OKhrwHW1ul77h/6EgAgjEQTAIAQG3c+8cDEGwcfPLTrDmedd8bU9+1nP/vNvx8ArBKJJgAAITbyfyxL4mM/+63ifgCwiiSaAACE2FiWxMd+9lvF/QBglUk0AQAIseft/+bXrQwEA/nSf/qBlYEAWFkSTQAAQmzcdNbpQ18DrK0vpR8MfQkAEEaiCQBAiI0TLto39DXAGrtv6AsAgDASTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQig0AQAIodAEACCEQhMAgBAKTQAAQvx/31E8rM8fejIAAAAASUVORK5CYII=';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

// [Chao]
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;

      // console.log('[chao.x]', chao.x);
      // console.log('[repeteEm]',repeteEm);
      // console.log('[movimentacao]', movimentacao % repeteEm);
      
      chao.x = movimentacao % repeteEm;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );
  
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );
    },
  };
  return chao;
}

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if(flappyBirdY >= chaoY) {
    return true;
  }

  return false;
}

function criaFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula() {
      console.log('devo pular');
      console.log('[antes]', flappyBird.velocidade);
      flappyBird.velocidade =  - flappyBird.pulo;
      console.log('[depois]', flappyBird.velocidade);
    },
    gravidade: 0.25,
    velocidade: 0,
    atualiza() {
      if(fazColisao(flappyBird, globais.chao)) {
        console.log('Fez colisao');
        som_HIT.play();

        mudaParaTela(Telas.GAME_OVER);
        return;
      }
  
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    movimentos: [
      { spriteX: 0, spriteY: 0, }, // asa pra cima
      { spriteX: 0, spriteY: 26, }, // asa no meio 
      { spriteX: 0, spriteY: 52, }, // asa pra baixo
      { spriteX: 0, spriteY: 26, }, // asa no meio 
    ],
    frameAtual: 0,
    atualizaOFrameAtual() {     
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;
      // console.log('passouOIntervalo', passouOIntervalo)

      if(passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao
      }
        // console.log('[incremento]', incremento);
        // console.log('[baseRepeticao]',baseRepeticao);
        // console.log('[frame]', incremento % baseRepeticao);
    },
    desenha() {
      flappyBird.atualizaOFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

      contexto.drawImage(
        sprites,
        spriteX, spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    }
  }
  return flappyBird;  
}


/// [mensagemGetReady]
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.h
    );
  }
}

// [mensagemGameOver]
const mensagemGameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGameOver.sX, mensagemGameOver.sY,
      mensagemGameOver.w, mensagemGameOver.h,
      mensagemGameOver.x, mensagemGameOver.y,
      mensagemGameOver.w, mensagemGameOver.h
    );
  }
}

// 
// [Canos]
// 

function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    desenha() {
      canos.pares.forEach(function(par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;
  
        const canoCeuX = par.x;
        const canoCeuY = yRandom; 

        // [Cano do Céu]
        contexto.drawImage(
          sprites, 
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )
        
        // [Cano do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom; 
        contexto.drawImage(
          sprites, 
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },
    temColisaoComOFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
      
      if((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
        if(cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }

        if(peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }
      return false;
    },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if(passou100Frames) {
        console.log('Passou 100 frames');
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }



      canos.pares.forEach(function(par) {
        par.x = par.x - 2;

        if(canos.temColisaoComOFlappyBird(par)) {
          console.log('Você perdeu!')
          som_HIT.play();
          mudaParaTela(Telas.GAME_OVER);
        }

        if(par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });

    }
  }

  return canos;
}

function criaPlacar() {
  const placar = {
    pontuacao: 0,
    desenha() {
      contexto.font = '35px "VT323"';
      contexto.textAlign = 'right';
      contexto.fillStyle = 'white';
      contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);      
    },
    atualiza() {
      const intervaloDeFrames = 20;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if(passouOIntervalo) {
        placar.pontuacao = placar.pontuacao + 1;
      }
    }
  }
  return placar;
}


// 
// [Telas]
// 
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.flappyBird.desenha();
      
      globais.chao.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    }
  }
};

Telas.JOGO = {
  inicializa() {
    globais.placar = criaPlacar();
  },
  desenha() {
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
    globais.placar.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
    globais.placar.atualiza();
  }
};

Telas.GAME_OVER = {
  desenha() {
    mensagemGameOver.desenha();
  },
  atualiza() {
    
  },
  click() {
    mudaParaTela(Telas.INICIO);
  }
}

function loop() {

  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1;
  requestAnimationFrame(loop);
}


window.addEventListener('click', function() {
  if(telaAtiva.click) {
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();