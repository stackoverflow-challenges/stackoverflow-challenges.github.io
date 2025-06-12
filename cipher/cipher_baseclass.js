
!function () {

    let fileName = document.currentScript.src.split("/").slice(-1)[0];


    customElements.define("cipher-baseclass", class extends HTMLElement {

        // ======================================================== $$log
        $$log(...args) {
            // my fancy log function extracts the linenumber here (from ErrorStack)
            let label = args.shift();
            if (!label.includes("%c")) label = `%c ${label} %c `;
            console.log(`%c <${this.localName}> ${label}`, "font-size:75%", "background:green;color:white", "background:gold;color:black", ...args);
        }

        // ==================================================================== $$closestElement
        // crossing all shadowRoots up
        $$closestElement(
            selector = "",      // selector like in .closest()
            base = this,   // extra functionality to skip a parent
            __Closest = (el, found = el && el.closest(selector)) =>
                !el || el === document || el === window
                    ? null // standard .closest() returns null for non-found selectors also
                    : found
                        ? found // found a selector INside this element
                        : __Closest(el.getRootNode().host) // recursion!! break out to parent DOM
        ) {
            return __Closest(base);
        }

        // ======================================================== $$createElement - best helper function ever
        $$createElement(
        /* string */ tag,
        /* Object */ options = {},
        /* Node   */ element = document.createElement(tag) // create or use existing element
        ) {
            // this.$$log(`%c $$createElement %c <${tag}> `);
            const {
                prepend = [], // prepend at start
                append = [], // append at end
                classes = [], // set .classList
                styles = {}, // set .style
                attrs = {}, // set attributes
                ...props // catch remaining props, like listeners onclick, className, etc
            } = options;
            element.prepend(...prepend); // prepend children
            element.append(...append); // append children
            if (classes.length) element.classList.add(...classes); // add classes
            Object.keys(attrs).forEach(key => element.setAttribute(key, attrs[key])); // set attributes
            //Object.assign(element.style, styles); // assign style
            Object.entries(styles).forEach(([key, value]) => element.style.setProperty(key, value)); // read styles.entries then set styles
            return Object.assign(element, props); // assign remaining properties
        }

        // ==================================================================== connectedCallback
        connectedCallback() {
            this.$$log("connectedCallback")
            this.$$registerEventMethods({ scope: this }); // don't call again!
            if (this.$connectedCallback) this.$connectedCallback();
            setTimeout(() => {
                // execute after DOM was parsed
                if (this.$renderedCallback) this.$renderedCallback();
            }, 1);
        }

        // ======================================================== EVENTS

        // ======================================================== $$dispatch
        $$dispatch({
            name = (this.nodeName.replaceAll("-", "")),
            detail = {},
            scope = this
        }) {
            this.$$log(`%c dispatch ⏰ %c ${name} `, { scope: this });
            scope.dispatchEvent(
                new CustomEvent(name, {
                    bubbles: true,
                    composed: true, // Event crosses ALL shadowRoots
                    detail
                })
            )
        }
        // ==================================================================== $$removeEventListeners
        $$removeEventListeners() {
            this._listeners.map((x) => x());
        }
        // ==================================================================== $$registerEventMethods
        // for every Web Component register methodnames starting with: $event_
        $$registerEventMethods({ scope = this }) {
            this.$$getAllPropertyNames(scope).All // all methods names in prototype chain
                .filter(methodName => methodName.startsWith("$event"))
                .map(methodName => {
                    let eventbus = document; // at what element in the DOM the listener should be attached
                    let eventName = methodName.split("_")[1];
                    let $eventFunc = (evt) => {
                        this.$$log(`%c ⏰ %c ${eventName} `, { eventbus: eventbus.nodeName, scope: scope }, this._listeners);
                        scope[methodName].call(scope, evt); // call the function with correct scope (this)
                    }
                    eventbus.addEventListener(eventName, $eventFunc);
                    this._listeners = this._listeners || [];
                    this._listeners.push(() => eventbus.$removeEventListener(eventName, $eventFunc));
                    this.$$log(`%c register ⏰ %c ${eventName} `, { eventbus: eventbus.nodeName, scope: scope }, this._listeners);
                });
        } // $$registerEventMethods

        // ==================================================================== $$getAllPropertyNames
        // get all method names up the prototype chain
        $$getAllPropertyNames(obj) {
            let methods = { All: [] };
            let proto = Object.getPrototypeOf(obj);
            while (proto && proto.constructor && proto.constructor.name !== 'HTMLElement') {
                methods[proto.constructor.name] = methods[proto.constructor.name] || [];
                Object.getOwnPropertyNames(proto).map(key => {
                    try {
                        if (typeof proto[key] === 'function') {
                            methods[proto.constructor.name].push(key);
                            methods.All.push(key);
                        }
                    } catch (e) {
                        // prevent showing Illegal invocation Error of getter methods
                    }
                });
                proto = Object.getPrototypeOf(proto);
            }
            return methods; // { All: [...], [className]: [...] }
        }
    })

    console.log(`%c Loaded %c ${fileName} `, "font-size:75%", "background:blue", "")

}()