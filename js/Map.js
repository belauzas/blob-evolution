import Food from './Food.js';
import Animal from './Animal.js';

class Map {
    constructor ( setup ) {
        this.selector = setup.selector;
        this.DOM = null;
        this.time = Date.now();
        this.dt = 0;

        this.width = setup.width;
        this.height = setup.height;
        this.foodCount = 100;
        this.foodMinDistance = 40;
        this.food = [];
        this.animalsCount = 50;
        this.lastAnimalID = 0;
        this.animals = [];

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
        this.generateAnimals();

        window.requestAnimationFrame( () => this.step() );
    }

    step() {
        const time = Date.now();
        this.dt = (time - this.time) / 1000;
        this.time = time;

        // what should we update? or do we? 🤔
        this.growFood();
        this.animateAnimals();

        window.requestAnimationFrame( () => this.step() );
    }

    animateAnimals() {
        this.animalsMove();
        this.animalsEat();
        this.animalsAlive();
    }

    animalsMove() {
        for ( let i=0; i<this.animalsCount; i++ ) {
            this.animals[i].move( this.dt );
        }
    }

    animalsEat() {
        // detect which animal wants to eat which food
        for ( let a=0; a<this.animalsCount; a++ ) {
            const an = this.animals[a];
            for ( let f=0; f<this.foodCount; f++ ) {
                const fo = this.food[f];
                const dist = Math.sqrt( (an.x - fo.x) * (an.x - fo.x) + (an.y - fo.y) * (an.y - fo.y) );
                if ( dist < an.distanceToFood ) {
                    this.food[f].whoWantsToEatMe.push( an.id );
                }
            }
        }

        // let animals eat
        for ( let f=0; f<this.foodCount; f++ ) {
            if ( this.food[f].state !== 'edible' ) {
                this.food[f].whoWantsToEatMe = [];
                continue;
            }

            const count = this.food[f].whoWantsToEatMe.length;
            // if single animal per food - eat
            if ( count === 1 ) {
                const animalID = this.food[f].whoWantsToEatMe[0];
                for ( let a=0; a<this.animalsCount; a++ ) {
                    if ( this.animals[a].id === animalID ) {
                        this.animals[a].eat( this.food[f].energy );
                        break;
                    }
                }
                this.food[f].state = 'offspring';
                this.food[f].time = 0;
                this.food[f].whoWantsToEatMe = [];
            }

            // multiple animals - split equaly
            if ( count > 1 ) {
                for ( let fa=0; fa<count; fa++ ) {
                    const animalID = this.food[f].whoWantsToEatMe[fa];
                    for ( let a=0; a<this.animalsCount; a++ ) {
                        if ( this.animals[a].id === animalID ) {
                            this.animals[a].eat( this.food[f].energy / count );
                            break;
                        }
                    }
                    this.food[f].state = 'offspring';
                    this.food[f].time = 0;
                    this.food[f].whoWantsToEatMe = [];
                }
            }
        }
    }

    animalsAlive() {
        for ( let i=0; i<this.animalsCount; i++ ) {
            this.animals[i].live( this.dt );
        }
    }

    killAnimal( animalID ) {
        console.log('kill:', animalID);
        this.animals = this.animals.filter( animal => animal.id !== animalID );
        this.animalsCount = this.animals.length;
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

    generateAnimals() {
        const count = this.animalsCount;
        for ( let i=0; i<count; i++ ) {
            this.generateSingleAnimal();
        }
    }

    generateSingleAnimal() {
        const position = this.getPosition();
        const params = {
            parent: this,
            id: this.lastAnimalID,
            x: position.x,
            y: position.y
        }
        this.animals.push( new Animal( params ) );
        this.animalsCount = this.animals.length;
        this.lastAnimalID++;
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