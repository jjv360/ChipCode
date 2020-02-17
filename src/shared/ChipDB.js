//
// Fetches information about chips
export default new class ChipDB {

    /** Collection of all known chips */
    chips = []

    /** Constructor */
    constructor() {

        // Add built-in chips
        this.chips.push({
            id: 'entry',
            name: 'Entry',
            description: "Start logic flow",
            inputs: [],
            outputs: [
                { type: 'logic' }
            ],
            overflowOutputsAllowed: true
        })

        this.chips.push({
            id: 'exit',
            name: 'Exit',
            description: "Return a value",
            inputs: [
                { type: 'logic' }
            ],
            overflowInputsAllowed: true,
            outputs: []
        })

        this.chips.push({
            id: 'alert',
            name: 'Alert',
            description: "Display text",
            inputs: [
                { type: 'logic' },
                { type: 'text', name: 'Text', description: "The text to display" }
            ],
            outputs: [
                { type: 'logic' }
            ],
            native: {
                javascript: 'alert(<#1:String:Escaped#>)'
            }
        })

        this.chips.push({
            id: 'log',
            name: 'Output Text',
            description: "Print text to the console log",
            inputs: [
                { type: 'logic' },
                { type: 'text', name: 'Text', description: "The text to print" }
            ],
            outputs: [
                { type: 'logic' }
            ],
            native: {
                javascript: 'console.log(<#1:String:Escaped#>)'
            }
        })

    }

    /** Find the specific chip */
    find(id) {
        return this.chips.find(c => c.id == id)
    }

}