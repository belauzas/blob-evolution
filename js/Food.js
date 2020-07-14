class Food {
    constructor ( setup ) {
        this.parentDOM = setup.DOM;
        this.DOM = null;

        this.id = setup.id;
        this.x = setup.x;
        this.y = setup.y;
        this.stateTime = {
            offspring: 2,               // seconds
            young: 2,
            edible: 5,
            poison: 5,
            empty: 4
        }
        this.state = 'offspring';
        this.time = 0;

        this.init();
    }

    init() {
        if ( !this.parentDOM ) {
            return;
        }

        this.render();
    }

    render() {
        const HTML = `<div id="food_${this.id}" class="food"
                            style="top: ${this.y}px; left: ${this.x}px;"
                            data-state="${this.state}"></div>`;

        this.parentDOM.insertAdjacentHTML('beforeend', HTML);
        this.DOM = this.parentDOM.querySelector('#food_'+this.id);
    }

    grow( dt ) {
        this.time += dt;
        console.log( this.state, this.time );
        if ( this.time > this.stateTime[ this.state ] ) {
            this.time -= this.stateTime[ this.state ];
            switch ( this.state ) {
                case 'offspring':
                    this.state = 'young';
                    break;

                case 'young':
                    this.state = 'edible';
                    break

                case 'edible':
                    this.state = 'poison';
                    break

                case 'poison':
                    this.state = 'empty';
                    break

                case 'empty':
                    this.state = 'offspring';
                    break
            }

            this.DOM.dataset.state = this.state;
        }
    }
}

export default Food;