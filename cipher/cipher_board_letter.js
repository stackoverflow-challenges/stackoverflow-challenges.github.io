!function () {
    let fileName = document.currentScript.src.split("/").slice(-1)[0];

    customElements.whenDefined("cipher-baseclass").then(CIPHERBaseClass => {
        // Helper function to apply mixins
        // JavaScript does not support multiple inheritance directly.
        // You can use mixins to combine functionality from multiple classes.
        function MIXIN(BaseClass, ...Mixins) {
            class Mixed extends BaseClass { }
            for (const Mixin of Mixins) {
                Object.getOwnPropertyNames(Mixin.prototype).forEach(name => {
                    const standardCallbacks = [
                        "constructor",
                        "connectedCallback",
                        "disconnectedCallback",
                        "adoptedCallback",
                        "attributeChangedCallback"
                    ];
                    if (!standardCallbacks.includes(name)) {
                        console.log(`%c ${fileName} %c MIXIN %c ${name}`, "font-size:75%", "background:firebrick", "")
                        Object.defineProperty(
                            Mixed.prototype,
                            name,
                            Object.getOwnPropertyDescriptor(Mixin.prototype, name)
                        );
                    }
                });
            }
            return Mixed;
        }
        // ********************************************************************  define <chessmeister-board-letter>
        // its OOP, we can only extend something that already exists, wait for <chessmeister-board> to be defined
        customElements.whenDefined("chessmeister-board").then(() => {
            customElements.define("chessmeister-board-letter",
                // All Web Components by default extend from HTMLElement. Its OOP! other Web Components ARE HTML Elements
                // Note we need the original <chessmeister-board> here thus can't extend from CIPHERBaseClass here, 

                // Here, we extend from the 2020 original <chessmeister-board> and mix in CIPHERBaseClass.
                class extends MIXIN(customElements.get("chessmeister-board"), CIPHERBaseClass) {

                    // ==================================================== connectedCallback
                    // The connectedCallback is a default Web Components callback, triggered when the HTML tag is created in the DOM
                    connectedCallback() {
                        // requestAnimationFrame(() => {
                        super.connectedCallback(); // call <chessmeister-board>.connectedCallback
                        // ----------------------------------------------------
                        if (this.hasAttribute("showletter")) this.showletter();
                        // ----------------------------------------------------
                        this.part = "letter"; // make global CSS styling possible
                        // })
                    }
                    // ==================================================== get/set fen
                    // overload <chessmeister-board> get/set fen to add a bit extra code
                    get fen() {
                        return super.fen; // from <chessmeister-board>
                    }
                    set fen(value) {
                        setTimeout(() => {
                            super.fen = value;
                            // ChessMeister was developed a bit crude (in 2020) Should have used more Events
                            // FEN can be set as property when board is NOT in the DOM yet
                            // make sure board and pieces exist in the DOM then disable ChessMeister CSS & interactions
                            // always remove the colors <chessmeister-board> puts on Chess Pieces (indicating attack/defend states)
                            const boardPieces = this.shadowRoot.querySelectorAll(`img[is],[piece="none"]`);
                            boardPieces.forEach(piece => {
                                piece.style.filter = "none";
                                piece.style.pointerEvents = "none";
                            })
                        });
                    }
                    // ==================================================== showletter decoded on board
                    showletter() {
                        setTimeout(() => { // make sure board is completely initiated
                        // preferable the Web Component should emit an Event for this
                        // but we are dealing with a Web Component from 2020 here

                        // all back pieces and all squares defended by black pieces
                            const selector = `[is*="black-"],[protectorsblack]`;
                            const blackPiecesAndProtectedSquares = this.shadowRoot.querySelectorAll(selector);
                            blackPiecesAndProtectedSquares.forEach(square =>
                                square.style.backgroundColor = "darkred");
                        })
                    }
                }); // <chess-board-letter>
            // ********************************************************************  defined <chessmeister-board-letter>

        }) // whenDefined <chessmeister-board>

    }); // whenDefined <cipher-baseclass>

    console.log(`%c Loaded %c ${fileName} `, "font-size:75%", "background:blue", "")
    // watch my BlueSky profile for news of my upcoming Web Component course
    // https://bsky.app/profile/engelman.nl

}()