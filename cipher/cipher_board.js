!function () {
    let fileName = document.currentScript.src.split("/").slice(-1)[0];

    customElements.whenDefined("cipher-baseclass").then(CIPHERBaseClass => {

        // -------------------------------------------------------- Letters as FEN notation
        const letterFEN = {
            // this is a condensed version of the official FEN notation. 
            // I am lazy, not a chess fanatic. The user does NOT see these FEN strings
            A: "3bb//P6P/6/r6r", B: "r4b/4P//4P/5b/4P//r", C: "r4k///////r4k", D: "r3b/3P//7b/7b//3P/r3b",
            E: "r4k///1k////r4k", F: "r4k///1k", G: "r4k////4k///r6b", H: "rP////7r",
            I: "3r///////4r", J: "6Pr///////k5rP", K: "rrP///2b/2b///", L: "//////1r/r",
            M: "2b2b/P6P//rPP2PPr", N: "b5Pr///////rP", O: "2brrb/P2PP2P//rP4Pr///P2PP2P/2brrb", P: "r4b/4P/7b//r5P/4P",
            Q: "2b4r/3P/b//1P5r/3P", R: "r//2P1P/3b3r/2P4P", S: "7r//7P/7P/r6r/P//r", T: "r2r/K",
            U: "rP4Pr////1P/b/4P/1P2rb", V: "rP4Pr/////P2PP2P/2b2b/1P4P", W: "rP4Pr//////P2rr2P/2b2b",
            X: "///3bb", Y: "////3bb/2PrrP", Z: "7q/7b/////P/q",
        };

        // ******************************************************************** define <chess-cipher-board>
        customElements.define("chess-cipher-board",
            // All Web Components by default extend from HTMLElement (its OOP! Web Components ARE HTML Elements)
            class extends CIPHERBaseClass {
                get isMainboard() {
                    return this.id == "MAINBOARD";
                }
                // ============================================================ constructor
                constructor() {
                    // -------------------------------------------------------- create shadowDOM fill with content
                    super() // sets AND returns 'this' scope
                        .attachShadow({ mode: "open" }) // sets AND retuns this.shadowRoot
                        .append( // not available in IE! Thus all (old) blogs still use appendChild (biggest loser function ever)
                            this.$$createElement("style", {
                                textContent:
                                    // yes, CSS-in-JS! Think IKEA, you want all assets and tools in one (Web Component) flatpack
                                    // (and do use the standard adoptedStyleSheets method for linking CSS stylesheets)
                                    `:host{}` +
                                    // <board-container> is NOT created with JavaScript, only used for layout
                                    `board-container{display:grid;grid:1fr/repeat(var(--columns,8),1fr);gap:5px}` +
                                    // 1 or more <chessmeister-board-letter> elements are created
                                    `chessmeister-board-letter{max-width:250px}`
                            }),
                            this.boardContainer = this.$$createElement("board-container", {
                                part: "container" // to style this shadow Part with global CSS
                            })
                        )
                }
                // ============================================================ connectedCallback
                // The connectedCallback is a default Web Components callback, triggered when the HTML tag is created in the DOM
                $connectedCallback() {
                    // Because Web Component developers use libraries... which provide an extra parsedCallback
                    // a lesser known Web Components fact is that the connectedCallback fires on the OPENING TAG
                    // that means its innerHTML (aka lightDOM) MIGHT not be parsed yet (when the Web Component is Defined BEFORE DOM is parsed)
                    // <chess-cipher-board>TREASURE</chess-cipher-board> COULD return an EMPTY this.innerHTML string
                    // a simple solution is to delay execution (wait till more DOM is parsed) (or load a 6KB Library and use its parsedCallback)
                    setTimeout(() => this.render());
                }
                // ============================================================ render
                render(word = this.innerHTML) {
                    this.innerHTML = word;
                    // -------------------------------------------------------- create board for each letter
                    // letter_boards array is used/referenced in another Method of this Web Component (this)
                    this.letter_boards =
                        word.split("") // split word to individual letters
                            .filter(Boolean)
                            .map(letter => {
                                const board = this.$$createElement("chessmeister-board-letter", {
                                    letter,
                                    fen: letterFEN[letter.toUpperCase()], // initial FEN on this board
                                    // assign click and mouse handler, addEventListener is over-rated
                                    onclick: (evt) => {
                                        this.eventDispatch(evt, "showletter", board);
                                        if (this.hasAttribute("input")) this.eventDispatch(evt, "letterinput", board);
                                    },
                                    onmouseenter: (evt) => {
                                        this.eventDispatch(evt, "showletter", board);
                                    }
                                });
                                board.toggleAttribute("showletter", this.hasAttribute("showletter"));
                                return board;
                            });
                    // -----------------------------------
                    const css_columnCount = this.getAttribute("columns") || Math.min(word.length, 8);
                    this.style.setProperty("--columns", css_columnCount);
                    this.$$log(`%c render %c "${word}" in ${word.length} boards `);
                    // -------------------------------------------------------- replace existing board in this.boardContainer
                    this.boardContainer.replaceChildren(...this.letter_boards); // spread Array; 1 or more <chessmeister-board-letter> Elements

                } // render
                // ============================================================ eventDispatch
                eventDispatch(evt, name, board) {
                    if (evt.ctrlKey) {
                        board.showletter();
                    } else {
                        this.$$dispatch({
                            name, detail: { ctrlKeyPressed: evt.ctrlKey, board }
                        });
                    }
                }
                // ============================================================ set FEN on one board
                set fen(value) {
                    // for now, be lazy, always target the first board eg. MAINBOARD
                    const firstBoard = this.letter_boards[0];
                    if (firstBoard) firstBoard.fen = value;
                }
                // ============================================================
                $event_showletter(evt) {
                    if (this.isMainboard) this.fen = evt.detail.board.fen;
                }
                // ============================================================
            }); // define <chess-cipher-board>
        // ******************************************************************** defined <chess-cipher-board>
    });

    console.log(`%c Loaded %c ${fileName} `, "font-size:75%", "background:blue", "")

    // watch my BlueSky profile for news of my upcoming Web Component course
    // https://bsky.app/profile/engelman.nl

}()