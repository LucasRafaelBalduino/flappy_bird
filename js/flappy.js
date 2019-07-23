function novoElemento(tagName, className){
    const elem = document.createElement(tagName)
    elem.className = className
    return elem

}
// criando a barreira
function Barreira(reversa = false){
    this.elemento =  novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    // se for falso coloca primeiro borda depois o corpo
    this.elemento.appendChild(reversa ? corpo : borda)
    // se for verdadeiro eu coloco primeiro corpo depois a borda
    this.elemento.appendChild(reversa ? borda : corpo)
    // definindo a altura das barreiras
    this.setAltura =  altura => corpo.style.height = `${altura}px`
}

// definindo as posicoes das barreiras
function ParDeBarreiras(altura, abertura, x){
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior =  new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)
// definindo para as barreiras serem aleatorias
    this.sortearAbertura = () =>{
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)    
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}
//teste
//const b = new ParDeBarreiras(700, 200, 400)
//document.querySelector('[wm-flappy]').appendChild(b.elemento)

function Barreiras(altura, largura, abertura, espaco, notificarPonto){
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3
    this.animar = () =>{
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)


            if(par.getX() < par.getLargura()){
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio && par.getX() < meio
            if (cruzouOMeio) notificarPonto()
        })
    }

}

function Passaro(alturaJogo){
    let voando = false

    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () =>{
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if (novoY <= 0){
            this.setY(0)
        }else if (novoY >= alturaMaxima){
            this.setY(alturaMaxima)
        }else{
            //permite que o passaro nao saia do jogo
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo / 2)
}
/** 
 * teste
const barreiras = new Barreiras(700, 1200, 200, 400)
const passaro = new Passaro(700)
const areaDoJogo = document.querySelector('[wm-flappy]')

areaDoJogo.appendChild(passaro.elemento)
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
setInterval(() => {
    
    barreiras.animar()
    passaro.anima()

}, 20)*/



function Progresso(){
    this.elemento =  novoElemento('span', 'progresso')
    this.atualizarPontos = pontos =>{
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}
/** 
const barreiras = new Barreiras(700, 1200, 200, 400)
const passaro = new Passaro(700)
const areaDoJogo = document.querySelector('[wm-flappy]')

areaDoJogo.appendChild(passaro.elemento)
areaDoJogo.appendChild(new Progresso().elemento)
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
setInterval(() => {
    
    barreiras.animar()
    passaro.animar()

}, 20)*/
// 

// esta sendo basedo pelo lado esquerdo da tela
function estaoSobrePostos(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical

}
// funcao respostavel para verificar se o passaro colidiu com as barreiras
function colidir(passaro, barreiras){

    let colidir = false

    barreiras.pares.forEach(parDeBarreiras => {
        if(!colidir){
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento

            colidir = estaoSobrePostos(passaro.elemento, superior) || estaoSobrePostos(passaro.elemento, inferior)
        }
    })

    return colidir

}
 
function FlappyBird(){
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const prog = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 400,
        () => prog.atualizarPontos(++ pontos))
    const passaro =  new Passaro(altura)

    areaDoJogo.appendChild(prog.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento) )

    this.start = () => {
        //loop do jogo
        const temporizador = setInterval(() => {
    
            barreiras.animar()
            passaro.animar()
            
            if(colidir(passaro, barreiras)){
                clearInterval(temporizador)
            }
        
        }, 20)

    }

}
new FlappyBird().start()