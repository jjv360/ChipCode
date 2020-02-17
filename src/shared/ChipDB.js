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
            uuid: '6b5a33f5-46da-4957-9b1e-06d56e62356f',
            name: 'Entry',
            description: "Start logic flow",
            slots: [
                { uuid: 'ef0210a6-57e9-414f-bfd1-3596d4850bbe', output: true, type: 'logic' }
            ]
        })

        this.chips.push({
            id: 'exit',
            uuid: '134075a7-25a2-4f00-bca2-2a0dfb71a5d4',
            name: 'Exit',
            description: "Return a value",
            slots: [
                { uuid: '814776ba-145e-42b0-bb8c-0fdca70a6e05', input: true, type: 'logic' }
            ]
        })

        this.chips.push({
            id: 'alert',
            uuid: 'e2692500-7050-4eae-b749-e77904f8a1ea',
            name: 'Alert',
            description: "Display text",
            slots: [
                { uuid: '5a417e8a-8cce-499e-a05f-b72bdaa00664', input: true, type: 'logic' },
                { uuid: '7083f1b0-4793-482e-a467-e816f1516327', input: true, type: 'text', name: 'Text', description: "The text to display" },
                { uuid: '82898a47-3b0b-4381-9f73-d5be9eedef61', output: true, type: 'logic' }
            ],
            native: {
                javascript: 'alert(<#1:String:Escaped#>)'
            }
        })

        this.chips.push({
            id: 'log',
            uuid: 'ed62f2df-2c81-4f47-b93a-c5606d53e22a',
            name: 'Output Text',
            description: "Print text to the console log",
            slots: [
                { uuid: '9e54caa3-c338-4168-bbff-f35bbda898b5', input: true, type: 'logic' },
                { uuid: '9ab42120-980b-42a6-ae84-35939fcffbbf', input: true, type: 'text', name: 'Text', description: "The text to print" },
                { uuid: 'ba2e2d50-ce0f-43c7-99d6-00461b269b21', output: true, type: 'logic' }
            ],
            native: {
                javascript: 'console.log(<#1:String:Escaped#>)'
            }
        })

        // this.chips.push({
        //     id: 'variable.set',
        //     name: 'Set Variable',
        //     description: "Set contents of variable",
        //     inputs: [
        //         { type: 'logic' },
        //         { type: 'text', name: 'Text', description: "The text to print" }
        //     ],
        //     outputs: [
        //         { type: 'logic' }
        //     ],
        //     native: {
        //         javascript: 'console.log(<#1:String:Escaped#>)'
        //     }
        // })

    }

    /** Find the specific chip */
    find(id) {
        return this.chips.find(c => c.id == id)
    }

}