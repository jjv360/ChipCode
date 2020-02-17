import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Chip from '../shared/Chip'
import ChipCanvas from './Components/ChipCanvas'
import ChipDB from '../shared/ChipDB'
import Plugins from '../shared/plugins/Plugins'

//
// On startup
window.addEventListener('DOMContentLoaded', function() {

    // Create document element
    let elem = document.createElement('div')
    document.body.appendChild(elem)

    // Render React app
    ReactDOM.render(<App />, elem)

})

class App extends React.PureComponent {

    /** Main chip */
    rootChip = new Chip()

    /** State vars */
    state = {

        /** Currently editing chip, null uses the root chip. */
        chip: null

    }

    render = e => <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>

        {/* Menu bar */}
        <Menu>
            <MenuItem title="File" />
            <MenuItem title="Edit" />
            <MenuItem title="Help" />
            <div style={{ flex: '1 1 auto' }} />
            <MenuButton icon={require('./play.svg')} onClick={this.play} />
        </Menu>

        {/* Center content area */}
        <div style={{ flex: '1 1 0px', minWidth: 1, minHeight: 1, position: 'relative' }}>

            {/* Canvas */}
            <ChipCanvas chip={this.state.chip || this.rootChip} style={{ position: 'absolute', top: 0, left: 320, width: 'calc(100% - 320px)', height: '100%' }} />

            {/* Drawer container area */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: 320, height: '100%', overflowX: 'hidden', overflowY: 'auto', backgroundColor: '#333'/*'rgba(51, 51, 51, 0.9)'*/, boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)' }}>

                {ChipDB.chips.map(chip => <div key={chip.id} onClick={e => this.addComponent(chip)} style={{ margin: 10, padding: 10, borderRadius: 2, boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.5)', backgroundColor: '#3f4147' }}>
                    <div style={{ fontSize: 14, fontWeight: 'bold', color: '#EEE' }}>{chip.name}</div>
                    <div style={{ fontSize: 12, color: '#AAA', marginTop: 10 }}>{chip.description}</div>
                </div>)}

            </div>

        </div>

        {/* Status bar */}
        <div style={{ flex: '0 0 1px', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', zIndex: 2 }}>
            <div style={{ padding: '6px 6px', fontSize: 11, color: '#AAA' }}>ChipCode version {require('../../package.json').version} loaded</div>
        </div>

    </div>

    /** Add the specified component to this chip */
    addComponent(component) {

        // Check if can be added
        let currentChip = this.state.chip || this.rootChip
        try {
            currentChip.add(component)
        } catch (err) {
            alert('Unable to add component: ' + err.message)
        }

    }

    /** User wants to execute this chip. */
    play = async e => {

        // Compile JavaScript
        let code = await Plugins.compiler('javascript').compile(null, this.rootChip, 'main')

        // Attach preload code to it
        code = `
        
            // Request an alert
            function alert() {
                postMessage([0, 'alert', ...arguments])
            }

            // User code
            ${code}

            // Execute user's function
            main()
        
        `

        // Execute it as a web worker
        let blob = new Blob([code])
        let worker = new Worker(URL.createObjectURL(blob))
        worker.onmessage = e => {

            // Check what they want
            let responseID = e.data[0]
            let name = e.data[1]
            if (name == 'alert') {
                alert(e.data[2])
            }

        }

    }

}

const Menu = props => <div style={{ flex: '0 0 1px', display: 'flex', backgroundColor: '#333', zIndex: 2 }}>{props.children}</div>
const MenuItem = props => {
 
    const [ hovering, setHover ] = useState(false)
    return <div style={{ 
        padding: '8px 16px', 
        color: '#AAA', 
        fontSize: 13,
        backgroundColor: hovering ? '#444' : 'transparent'
    }}
    onMouseOver={e => setHover(true)}
    onMouseOut={e => setHover(false)}>
        {props.title}
    </div>

}

const MenuButton = props => {
 
    const [ hovering, setHover ] = useState(false)
    return <div style={{ 
        padding: '8px 16px', 
        color: '#AAA', 
        fontSize: 13,
        backgroundColor: hovering ? '#444' : 'transparent',
        width: '50',
        background: `url(${props.icon}) center/16px no-repeat`
    }}
    onClick={props.onClick}
    onMouseOver={e => setHover(true)}
    onMouseOut={e => setHover(false)} />

}

class Drawer extends React.PureComponent {

    state = {
        open: true
    }

    render = e => <div style={{ borderRadius: 8, height: this.state.open ? 'auto' : '30px', transition: 'height 0.3s', overflow: 'hidden', marginBottom: 20, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(50, 50, 50, 1)', height: 30 }} onClick={this.toggleOpen}>
            <div style={{ padding: '0px 16px', color: '#AAA', fontSize: 13, fontWeight: 'bold' }}>{this.props.title}</div>
        </div>

        {/* Content */}
        <div style={{ minHeight: 60, backgroundColor: 'rgba(40, 40, 40, 1)' }}>{this.props.children}</div>

    </div>

    /** Called when the user clicks the header */
    toggleOpen = e => {
        this.setState({ open: !this.state.open })
    }

}