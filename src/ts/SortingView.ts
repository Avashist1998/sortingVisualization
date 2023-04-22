export class SortingView extends HTMLElement {
	// We'll create our web component here
    	/**
	 * The class constructor object
	 */
    data: string;
    algo = "bubbleSort";
	constructor (data: string, algo: string) {

		super();
        this.data = data;
        this.algo = algo
        console.log(data, this.algo)
		console.log('Constructed', this);
	}

    static get observedAttributes() {
        return ['data'];
    }

    connectedCallback() {
        console.log("I am connecting");
        this.innerHTML = `<h1>Hello world</h1>`;
    }
}
