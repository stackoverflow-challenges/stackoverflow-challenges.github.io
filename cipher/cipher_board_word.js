!function () {
    let fileName = document.currentScript.src.split("/").slice(-1)[0];

    customElements.whenDefined("cipher-baseclass").then(CIPHERBaseClass => {
        // ********************************************************************  define <eight-letter-words>
        // it is so much fun creating your own HTML tags, here is one more; makes for clean HTML
        customElements.define("eight-letter-words", class extends CIPHERBaseClass {
            $connectedCallback() {
                setTimeout(() => { // wait till words in lightDOM are parsed by the browser
                    this.$$log("connectedCallback")
                    // hardwired to another DOM element, its like glueing LEGOs together
                    // see usage of Events below
                    const element_letterword = document.getElementById("LETTERWORD");
                    // -------------------------------------------------------- process innerHTML to words Array
                    const words =
                        this.innerHTML
                            .split(",")
                            .map(word => this.$$createElement("button", {
                                type: "button",
                                textContent: word,
                                onclick: (evt) => {
                                    this.input.value = word;
                                    element_letterword.toggleAttribute("showletter", evt.ctrlKey);
                                    element_letterword.render(word);
                                }
                            }));
                    // -------------------------------------------------------- replace innerHTML with content
                    this.replaceWith(
                        ...words, // see for yourself what happens without ... (spread words)
                        // -------------------------------------------------------- add input for user
                        // Add input for user to enter a word
                        this.input = this.$$createElement("input", {
                            placeholder: "enter a word",
                            oninput: function () {
                                element_letterword.innerHTML = this.value;
                                element_letterword.render();
                            }
                        })
                    );
                    this.$$dispatch({ name: "foo" })
                });
            }
            // ================================================================
            // better way of inter-element communication: listen for Events
            // that way it doesn't matter a Web Component exists in the DOM or not
            // The BaseClass connectedCallback finds these $event_ methods
            $event_letterinput(evt) {
                this.$$log(`%c ⏰ %c ${evt.type} `, evt.detail);
                this.input.value += evt.detail.board.letter;
                this.input.oninput();
            }
        });
        // ********************************************************************  defined <eight-letter-words>
    });

    console.log(`%c Loaded %c ${fileName} `, "font-size:75%", "background:blue", "")

    // watch my BlueSky profile for news of my upcoming Web Component course
    // https://bsky.app/profile/engelman.nl

}()