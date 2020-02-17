import uuidv4 from 'uuid/v4'

//
// Represents a Chip, which is an executable function. Chipcs can contain other chips, and even be an entire program.
//
// Every chip contains a set of chips inside, which create the logic of that chip. Some chips are built-ins, like the entry, exit, conditions, loops, etc.
export default class Chip {

    /** Chip identifier */
    id = ''

    /** Unique code for this chip */
    uuid = uuidv4()
    
    /** User displayable name, eg. "Alert" */
    name = ''

    /** User displayable description, eg. "Displays an alert box to the user." */
    description = ''

    /** List of components within this chip */
    components = []

    /** List of connections within this chip */
    connections = []

    /** List of slots on this chip, connectable by other chips when using this chip */
    slots = []

    /** Constructor */
    constructor() {

        // Ensure the entry chips exist
        if (!this.components.find(c => c.chip == 'entry')) this.createComponent({ chip: 'entry' })

    }

    /** @private Create component */
    createComponent(fields) {

        // Set default fields
        let obj = Object.assign({

            // Instance ID
            uuid: uuidv4(),

            // Chip ID
            chip: '',

            // Position in graph
            x: 0,
            y: 0

        }, fields)

        // Add it
        this.components.push(obj)

    }

    /** Connect one slot to another */
    connect(sourceComponent, sourceComponentSlot, destinationComponent, destinationComponentSlot) {

        // Safety check
        if (sourceComponentSlot.uuid == destinationComponentSlot.uuid)
            throw new Error("Can't connect to self.")

        // Swap around if the order doesn't make sense
        if (sourceComponentSlot.input) {
            let tmpComponent = sourceComponent
            let tmpComponentSlot = sourceComponentSlot
            sourceComponent = destinationComponent
            sourceComponentSlot = destinationComponentSlot
            destinationComponent = tmpComponent
            destinationComponentSlot = tmpComponentSlot
        }

        // Remove any existing connection from the source/destination slots (only one allowed)
        this.connections = this.connections.filter(c => c.sourceComponentSlot != sourceComponentSlot.uuid)
        this.connections = this.connections.filter(c => c.destinationComponentSlot != destinationComponentSlot.uuid)

        // Add it
        this.connections.push({
            uuid: uuidv4(),
            sourceComponent: sourceComponent.uuid,
            sourceComponentSlot: sourceComponentSlot.uuid,
            destinationComponent: destinationComponent.uuid,
            destinationComponentSlot: destinationComponentSlot.uuid
        })

    }

    /** Add component to this chip */
    add(chip) {

        // Validate
        if (chip.id == 'entry' && this.components.find(c => c.chip == 'entry')) throw new Error("You can only have one Entry component per chip.")

        // Add component
        this.createComponent({
            chip: chip.id
        })

    }

}