customElements.define("inject-cipher-board", class InjectCipherBoard extends HTMLElement {
    constructor() {
        const createElement = (tag, props = {}) => Object.assign(document.createElement(tag), props)
        super()
            .attachShadow({ mode: 'open' })
            .append(
                ...[
                    "https://chessmeister.github.io/elements.chessmeister.js",
                    "https://mark-down.github.io/element.js",
                    "../code-embed.github.io/element.js",
                    "cipher_baseclass.js",
                    "cipher_board.js",
                    "cipher_board_letter.js",
                    "cipher_board_word.js"
                ].forEach(src => createElement('script', { src })),
                createElement("style", {
                    textContent: ``
                }),
                createElement("div", {
                    textContent: ``
                }),
            )
    }
});
