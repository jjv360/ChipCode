import React from 'react'
import ReactDOM from 'react-dom'
import { ipcRenderer } from 'electron'

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

    render = e => <center>

        {/* App icon */}
        <img src={require('./icon.svg')} style={{ height: 128, marginTop: 40 }}/>

        {/* Title */}
        <div style={{ fontSize: 21, fontWeight: 'bold', marginTop: 40 }}>ChipCode</div>
        <div style={{ fontSize: 11, marginTop: 5, marginBottom: 40 }}>Version {require('../../package.json').version}</div>

        {/* New project button */}
        <div onClick={this.onNew} style={{ display: 'flex', alignItems: 'center', margin: '0px 40px', borderTop: '1px solid rgba(0, 0, 0, 0.1)', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
            <div style={{ width: 64, height: 64, background: `url(${require('./plus.svg')}) center/32px no-repeat` }}/>
            <div style={{ fontSize: 15, color: '#111', fontWeight: 'bold' }}>New project</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '0px 40px', /*borderTop: '1px solid rgba(0, 0, 0, 0.1)',*/ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
            <div style={{ width: 64, height: 64, background: `url(${require('./folder.svg')}) center/32px no-repeat` }}/>
            <div style={{ fontSize: 15, color: '#111', fontWeight: 'bold' }}>Open project</div>
        </div>

    </center>

    /** Called when the user clicks the New button */
    onNew = e => {

        // Send request to main process to open a new window
        ipcRenderer.send('open-window', { id: 'editor' })

        // Close us
        window.close()

    }

}