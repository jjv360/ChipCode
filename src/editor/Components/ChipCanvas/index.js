import React from 'react'
import Hammer from 'react-hammerjs'
import TweenManager from '../../../shared/TweenManager'
import ChipDB from '../../../shared/ChipDB'
// import * as PIXI from 'pixi.js'
// import { install } from '@pixi/unsafe-eval'
// import { Stage, Sprite, PixiComponent, Container } from '@inlet/react-pixi'

// Apply the patch to PIXI
// install(PIXI)

//
// This component renders the chipcode canvas.
export default class ChipCanvas extends React.PureComponent {

    /** State vars */
    state = {
        width: 800,
        height: 600,

        /* Camera vars */
        offsetX: 0,
        offsetY: 0,
        zoom: 1,

    }

    /** Interaction vars */
    dragTargetType = null // 'base' (panning) | 'component' (moving component) | 'slot' (create connection)
    dragTarget = null
    dragStartX = 0
    dragStartY = 0
    dragFromSlotSide = ''
    dragFromSlotIndex = 0

    /** Render UI */
    render = e => <Hammer options={{ domEvents: true }} onPanStart={this.onPanStart} onPan={this.onPan} onPanEnd={this.onPanEnd} direction="DIRECTION_ALL">

        {/* Second div needed to catch whatever Hammer is doing to prevent `ref` from working */}
        <div style={Object.assign({ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }, this.props.style)}>
            <div data-type='base' ref={ref => this.container = ref} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>

                {/* Container used for zooming and scrolling */}
                <div style={{ transform: `translate(${this.state.offsetX}px, ${this.state.offsetY}px)` }}>

                    {/* Render each component */}
                    {this.props.chip.components.map(component => 
                        <UIComponent key={component.uuid} chip={this.props.chip} component={component} style={{ transform: `translate(${component.x}px, ${component.y}px)` }} />
                    )}

                    {/* Render each connection */}
                    {this.props.chip.connections.map(connection => 
                        <UIConnection key={connection.uuid} chip={this.props.chip} connection={connection} />
                    )}

                    {/* Render currently drawing connection */}


                </div>

            </div>
        </div>

    </Hammer>

    /** Called on component mount */
    componentDidMount() {

        // Listen for window size changes
        window.addEventListener('resize', this.onResize)
        this.onResize()

        // Listen for animation changes
        // TweenManager.addListener(this.draw)

    }

    /** Called on component unmount */
    componentWillUnmount() {

        // Stop listening for window size changes
        window.removeEventListener('resize', this.onResize)

        // Stop listening for animation changes
        TweenManager.removeListener(this.draw)

    }

    /** Called on window resize */
    onResize = e => {

        // Set the canvas's buffer size to match the actual size
        let rect = this.container.getBoundingClientRect()
        this.setState({ width: Math.floor(rect.width), height: Math.floor(rect.height) })

    }

    /** Called on pan start */
    onPanStart = e => {

        // Check what is being panned
        this.dragTargetType = null
        let node = e.target
        while (node && node != document.body) {

            // Found a pan target
            if (node.dataset.type) {
                this.dragTargetType = node.dataset.type
                break
            }

            // Keep looking up the chain
            node = node.parentNode

        }

        // Check what to do
        if (this.dragTargetType == 'base') {

            // Panning the graph itself
            this.dragStartX = this.state.offsetX
            this.dragStartY = this.state.offsetY

        } else if (this.dragTargetType == 'component') {

            // Moving a component
            this.dragTarget = this.props.chip.components.find(c => c.uuid == node.dataset.uuid)
            this.dragStartX = this.dragTarget.x
            this.dragStartY = this.dragTarget.y

        } else if (this.dragTargetType == 'slot') {

            // Creating a connection, find slot source
            this.dragTargetComponent = this.props.chip.components.find(c => c.uuid == node.dataset.componentUuid)
            this.dragTargetChip = ChipDB.find(this.dragTargetComponent.chip)
            this.dragTargetSlot = this.dragTargetChip.slots.find(c => c.uuid == node.dataset.uuid)
            this.dragFromSlotSide = node.dataset.slotSide
            this.dragFromSlotIndex = node.dataset.slotIndex
            this.dragStartX = this.dragTarget.x + (this.dragFromSlideSide == 'left' ? 20 : 320 - 20)
            this.dragStartY = this.dragTarget.y + 20 + 20 * this.dragFromSlotIndex

        }

        console.log(this.dragTargetType)

    }

    /** Called on pan move, each frame it moved */
    onPan = e => {

        // Check what to do
        if (this.dragTargetType == 'base') {
        
            // Move camera
            this.setState({ offsetX: this.dragStartX + e.deltaX, offsetY: this.dragStartY + e.deltaY })

        } else if (this.dragTargetType == 'component') {
        
            // Move component
            this.dragTarget.x = this.dragStartX + e.deltaX
            this.dragTarget.y = this.dragStartY + e.deltaY
            this.forceUpdate()

        }

    }

    /** Called on pan complete */
    onPanEnd = e => {

        if (this.dragTargetType == 'slot') {
        
            // Find destination slot
            let destinationComponent = null
            let destinationChip = null
            let destinationSlot = null
            let node = e.target
            while (node && node != document.body) {

                // Found a pan target
                if (node.dataset.type == 'slot' && node.dataset.slotSide != this.dragFromSlotSide) {
                    destinationComponent = this.props.chip.components.find(c => c.uuid == node.dataset.componentUuid)
                    destinationChip = ChipDB.find(destinationComponent.chip)
                    destinationSlot = destinationChip.slots.find(s => s.uuid == node.dataset.uuid)
                    break
                }

                // Keep looking up the chain
                node = node.parentNode

            }

            // Stop if not found
            if (!destinationComponent)
                return console.warn('Dropped connection target, but no slot found here.')

            // Connect it!
            console.log(`Creating connection: From ${this.dragTargetChip.name} slot ${this.dragTargetSlot.name} to ${destinationChip.name} slot ${destinationSlot.name}`)

            // Add connection
            this.props.chip.connect(this.dragTargetComponent, this.dragTargetSlot, destinationComponent, destinationSlot)
            this.forceUpdate()

        }

    }

}

//
// Represents a Chip rendered on the graph
class UIComponent extends React.PureComponent {

    render() {

        // Count all inputs
        let chip = ChipDB.find(this.props.component.chip)
        let inputs = chip.slots.filter(s => s.input)
        let inputsCount = inputs.length
        // if (chip.overflowInputsAllowed)
        //     inputsCount += this.props.component.overflowInputs?.length || 0

        // Count all inputs
        let outputs = chip.slots.filter(s => s.output)
        let outputsCount = outputs.length
        // if (chip.overflowOutputsAllowed)
        //     outputsCount += this.props.component.overflowOutputs?.length || 0

        // Draw body
        let width = 320
        let height = 20 + Math.max(inputsCount, outputsCount) * 20
        // return <Hammer options={{ domEvents: true }} onPanStart={this.onPanStart} onPan={this.onPan} direction="DIRECTION_ALL">
        return <div data-type="component" data-uuid={this.props.component.uuid} style={Object.assign({ boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.2)', position: 'absolute', width, height, backgroundColor: '#111112', borderRadius: 6, overflow: 'hidden' }, this.props.style)}>

            {/* Title */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 20, padding: '3px 6px', boxSizing: 'border-box', backgroundColor: '#bf5900', fontSize: 12, textOverflow: 'ellipsis' }}>
                <font style={{ color: 'rgba(255, 255, 255, 1.0)', fontWeight: 'bold' }}>{chip.name}</font>
                <font style={{ color: 'rgba(255, 255, 255, 0.5)' }}> - {chip.description}</font>
            </div>

            {/* Left components */}
            {inputs.map((slot, idx) =>
                <div data-type='slot' data-uuid={slot.uuid} data-slot-index={idx} data-slot-side='left' data-component-uuid={this.props.component.uuid} key={idx} style={{ position: 'absolute', top: 20 + 20*idx, left: 0, display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: 10, height: 10, boxSizing: 'border-box', backgroundColor: this.props.chip.connections.find(conn => conn.destinationComponentSlot == slot.uuid) ? 'white' : 'black', borderRadius: 5, border: '2px solid #AAA', margin: 5 }} />
                    <div style={{ color: '#888', fontSize: 12 }}>{slot.name}</div>
                </div>
            )}

            {/* Right components */}
            {outputs.map((slot, idx) =>
                <div data-type='slot' data-uuid={slot.uuid} data-slot-index={idx} data-slot-side='right' data-component-uuid={this.props.component.uuid} key={idx} style={{ position: 'absolute', top: 20 + 20*idx, right: 0, height: 20, display: 'flex', alignItems: 'center' }}>
                    <div style={{ color: '#888', fontSize: 12 }}>{slot.name}</div>
                    <div style={{ width: 10, height: 10, boxSizing: 'border-box', backgroundColor: this.props.chip.connections.find(conn => conn.sourceComponentSlot == slot.uuid) ? 'white' : 'black', borderRadius: 5, border: '2px solid #AAA', margin: 5 }} />
                </div>
            )}

        </div>
        // </Hammer>

    }

}

const UIConnection = props => {

    // Get positions
    let fromComponent = props.chip.components.find(component => component.uuid == props.connection.sourceComponent)
    let fromChip = ChipDB.find(fromComponent.chip)
    let fromSlotIndex = fromChip.slots.filter(slot => slot.output).findIndex(slot => slot.uuid == props.connection.sourceComponentSlot)
    let fromX = fromComponent.x + 320 - 10
    let fromY = fromComponent.y + 20 + 20 * fromSlotIndex + 10
    let toComponent = props.chip.components.find(component => component.uuid == props.connection.destinationComponent)
    let toChip = ChipDB.find(toComponent.chip)
    let toSlotIndex = toChip.slots.filter(slot => slot.input).findIndex(slot => slot.uuid == props.connection.destinationComponentSlot)
    let toX = toComponent.x + 10
    let toY = toComponent.y + 20 + 20 * toSlotIndex + 10

    // Find svg bounds
    let startX = Math.min(fromX, toX)
    let startY = Math.min(fromY, toY)
    let endX = Math.max(fromX, toX)
    let endY = Math.max(fromY, toY)
    let width = endX - startX
    let height = endY - startY

    console.log('line from', fromComponent, fromSlotIndex, toComponent, toSlotIndex)

    // Draw it
    return <svg style={{ position: 'absolute', transform: `translate(${startX-2}px, ${startY-2}px)`, width: width+4, height: height+4, pointerEvents: 'none' }} viewBox={`-2 -2 ${width+4} ${height+4}`}>
        <line x1={fromX < toX ? 0 : width} y1={fromY < toY ? 0 : height} x2={fromX < toX ? width : 0} y2={fromY < toY ? height : 0} style={{ stroke: "white", strokeWidth: 2 }} />
    </svg>

}