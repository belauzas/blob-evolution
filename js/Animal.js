class Animal {
    constructor( setup ) {
        this.parent = setup.parent;
        this.DOM = null;

        this.id = setup.id;
        this.x = setup.x;
        this.y = setup.y;
        this.angle = Math.random() * 360;   // deg
        this.alive = true;
        this.energy = 200;
        this.energyPasiveUsage = 10;
        this.energyMoving = 15;
        this.speed = 490;                    // px/s
        this.distanceToFood = 70;

        this.init();
    }

    init() {
        if ( !this.parent.DOM ) {
            return;
        }

        this.render();
    }

    render() {
        const HTML = `<div id="animal_${this.id}" class="animal"
                            style="top: ${this.y}px; left: ${this.x}px;"
                            data-energy="${Math.round(this.energy)}"></div>`;

        this.parent.DOM.insertAdjacentHTML('beforeend', HTML);
        this.DOM = this.parent.DOM.querySelector('#animal_'+this.id);
    }

    move( dt ) {
        if ( !this.alive ) {
            return;
        }

        const dx = (Math.random() - 0.5) * this.speed * dt,
            dy = (Math.random() - 0.5) * this.speed * dt;
        this.x += dx;
        this.y += dy;

        if ( this.x < 0 ) this.x = 0;
        if ( this.x > this.parent.width ) this.x = this.parent.width;
        if ( this.y < 0 ) this.y = 0;
        if ( this.y > this.parent.height ) this.y = this.parent.height;

        // teleportation
        // if ( this.x < 0 ||
        //      this.x > this.parent.width ||
        //      this.y < 0 ||
        //      this.y > this.parent.height ) {
        //     this.x = this.parent.width / 2;
        //     this.y = this.parent.height / 2;
        // }

        this.DOM.style.top = this.y + 'px';
        this.DOM.style.left = this.x + 'px';
        this.DOM.setAttribute('data-energy', Math.round(this.energy))
    }

    eat( energy ) {
        this.energy += energy;
        if ( this.energy > 1000 ) {
            this.parent.generateSingleAnimal();
            console.log('HAPPY BIRTHDAY!!!!');
            this.energy -= 100;
        }
    }

    live( dt ) {
        const de = (this.energyMoving + this.energyMoving) * dt;
        this.energy -= de;
        if ( this.energy <= 0 ) {
            this.DOM.remove();
            this.parent.killAnimal( this.id );
        }
    }
}

export default Animal;