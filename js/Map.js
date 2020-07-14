import Food from './Food.js';

class Map {
    constructor ( setup ) {
        this.selector = setup.selector;
        this.DOM = null;
        this.time = Date.now();
        this.dt = 0;

        this.width = setup.width;
        this.height = setup.height;
        this.foodCount = 40;
        this.foodMinDistance = 40;
        this.food = [];

        this.init();
    }

    init() {
        const DOM = document.querySelector( this.selector );
        if ( !DOM ) {
            throw 'Provide selector for map.'
        }
        this.DOM = DOM;
        this.DOM.style.width = this.width + 'px';
        this.DOM.style.height = this.height + 'px';

        this.generateFood();

        window.requestAnimationFrame( () => this.step() );
    }

    step() {
        const time = Date.now();
        this.dt = (time - this.time) / 1000;
        this.time = time;

        // what should we update? or do we? 🤔
        this.growFood();

        window.requestAnimationFrame( () => this.step() );
    }

    growFood() {
        for ( let i=0; i<this.foodCount; i++ ) {
            this.food[i].grow( this.dt );
        }
    }

    generateFood() {
        let params = {};
        for ( let i=0; i<this.foodCount; i++ ) {
            const position = this.getPosition();
            params = {
                DOM: this.DOM,
                id: i,
                x: position.x,
                y: position.y
            }
            this.food.push( new Food( params ) );
        }
    }

    getPosition() {
        let x = 0,
            y = 0,
            valid = false,
            distance = 0;
        const foodCount = this.food.length;

        while ( !valid ) {
            valid = true;
            x = Math.round( Math.random() * this.width ),
            y = Math.round( Math.random() * this.height ),
            distance = 0;

            for ( let i=0; i<foodCount; i++ ) {
                const food = this.food[i];
                distance = Math.sqrt( (food.x - x) * (food.x - x) + (food.y - y) * (food.y - y) );
                if ( distance <= this.foodMinDistance ) {
                    valid = false;
                    break;
                }
            }
        }

        return {x: x, y: y};
    }
}

export default Map;