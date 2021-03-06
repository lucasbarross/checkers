class Game {
    constructor() {
        
        this.RED = 1;
        this.BLACK = 2;
        this.REDKING = 11;
        this.BLACKKING = 22;
        this.EMPTY = 0;

        this.redCount = 12;
        this.blackCount = 12;

        this.redKingCount = 0;
        this.blackKingCount = 0;
        
        this.currentTurn = this.RED;
        this.restart();
    }    
    
    getState() {
        return this.state;
    }

    getEnumerators() {
        return {
            RED: this.RED,
            BLACK: this.BLACK,
            REDKING: this.REDKING,
            BLACKKING: this.BLACKKING,
            EMPTY: this.EMPTY
        }
    }

    passTurn() {
        this.currentTurn = this.currentTurn === this.RED ? this.BLACK : this.RED;
    }

    getPositionValue (x, y) {
        if (x < 0 || y < 0 || y >= this.state.length || x >= this.state[0].length)
            return

        return this.state[y][x]
    }

    /**
     * Move uma peça
     * @param {Float} x0 posicao X inicial
     * @param {Number} y0 posicao Y inicial
     * @param {Number} x posicao X final
     * @param {Number} y posicao Y final
     */
    move (x0, y0, x, y) {
        if (this.isInvalidMove(x0, y0, x, y))
            return
        
        const hasEatten = this.hasEatten(x0, y0, x, y);

        if (hasEatten) {
            this.eatPiece(x0, y0, x, y)
            this.verifyEnd();            
        }

        let aux = this.state[y0][x0]
        this.state[y0][x0] = this.state[y][x]
        this.state[y][x] = aux;
        
        const canEatAfterMove = this.possibleNextPositions(x, y).find((pos) => { return pos.eat });

        this.isKing();

        if(!(hasEatten && canEatAfterMove)) {
            this.passTurn();
        }
    }

    // checa se foi obtida dama depois de cada jogada
    isKing() {      
        
        // checa dama vermelha  
        let redCT = 0;
        let a = 0;
        for (let x = 0; x < 8; x++ ){
            if (this.state[a][x] == 1){                
                this.state[a][x] = 11;
                redCT++;
            }
        }

        redCT += this.redKingCount;

        if (redCT > this.redKingCount){
            alert("RED KING!!!");
            this.redKingCount = redCT;
        }       

        // checa dama preta
        let blackCT = 0;
        let b = 7;
        for (let x = 0;x < 8;x++){
            if (this.state[7][x] == 2){                
                this.state[b][x] = 22; 
                blackCT++;                
            }
        }

        blackCT += this.blackKingCount;

        if (blackCT > this.blackKingCount){
            alert("BLACK KING!!!");
            this.blackKingCount = this.blackCount;
        }        
    }


    verifyEnd = () => {
        if (this.blackCount == 0) {
            alert('JOGADOR 1 VENCEU')
        }
        else if (this.redCount == 0) {
            alert('JOGADOR 2 VENCEU')
        }
    }

    eatPiece(x0, y0, x, y) {
        let diffY = y - y0
        let diffX = x - x0
        diffX > 0 ? diffX -= 1 : diffX += 1
        diffY > 0 ? diffY -= 1 : diffY += 1
        let piece = this.getPositionValue(x0, y0)
        piece == 1 ? this.blackCount -= 1 : this.redCount -= 1
        this.state[diffY + y0][diffX + x0] = 0
    }

    hasEatten(x0, y0, x, y) {
        const possibleNextPos = this.possibleNextPositions(x0, y0, true);
        const nextPos = possibleNextPos.find((pos) => { return pos.x == x && pos.y == y });
        return nextPos.eat;
    }
    
    /**
     * Checa se o movimento requerido é inválido
     * @param {Number} x0 
     * @param {Number} y0 
     * @param {Number} x 
     * @param {Number} y 
     */
    isInvalidMove(x0, y0, x, y) {
        const isNotEmpty = (this.state[y][x] != 0);
        
        const nextPositions = this.possibleNextPositions(x0, y0);

        const isPossibleNextPosition = nextPositions.find((pos) => pos.x == x && pos.y == y);

        return isNotEmpty || !isPossibleNextPosition;
    }

    /**
     * Checa as possíveis próximas posições da peça selecionada
     * @param {Number} x 
     * @param {Number} y 
     */
    possibleNextPositions (x, y) {
        const piece = this.getPositionValue(x, y);
        let hasEat = false;
        const cMod = piece == this.BLACK ? 1 : -1;

        //O código abaixo lida com o cálculo para perceber: se tem como comer alguma peça, 
        //é obrigatorio ao jogador comer aquela peça (ele nao pode ir pra outra posicao possivel)
        let nextPositions = [-1, +1].map(rMod => {
            let curr = this.getPositionValue(x + rMod, y + cMod);
            if (curr === 0) {
                return ({ x: x + rMod, y: y + cMod, eat: false});
            } else if (curr != piece && this.getPositionValue(x + 2 * rMod, y + 2 * cMod) == 0) {
                hasEat = true;
                
                return ({ x: x + 2 * rMod, y: y + 2 * cMod, eat: true });
            }
        })
        
        return nextPositions.filter(pos => pos && (!hasEat || pos.eat));

        // return nextPositions;
    }   
    
    restart() {
        /**
         * Estado padrao do jogo, 2 representam peças pretas, 1 representa peças vermelhas e 0
         * representa espaços sem nenhuma peça.
         */
        this.state = [
            [0, 2, 0, 2, 0, 2, 0, 2], 
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]
        ]        
    }
}