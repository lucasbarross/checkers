class Input {

    constructor(){}

    onclick(event) {
    }

    /**
     * Associa os eventos no browser as funcoes da classe Input
     */
    applyEventHandlers() {
        document.addEventListener('onmousedown', this.onclick);
    };
}