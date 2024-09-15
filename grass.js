import * as THREE from 'three';


class GrassField extends THREE.Group{
    constructor(){
        super()
        console.log("Grass")

        this.axesHelper = new THREE.AxesHelper(1)
        this.add(this.axesHelper)

      
    }

    
}

export { GrassField }