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
        zoom: 1

    }

    /** Render UI */
    render = e => <Hammer options={{ domEvents: true }} onPanStart={this.onPanStart} onPan={this.onPan} direction="DIRECTION_ALL">

        {/* Second div needed to catch whatever Hammer is doing to prevent `ref` from working */}
        <div style={Object.assign({ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }, this.props.style)}>
            <div ref={ref => this.container = ref} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>

                {/* Container used for zooming and scrolling */}
                <div style={{ transform: `translate(${this.state.offsetX}px, ${this.state.offsetY}px)` }}>

                    {/* Render each component */}
                    {this.props.chip.components.map(component => 
                        <UIComponent key={component.uuid} component={component} />
                    )}

                </div>

                {/* <svg width={this.state.width} height={this.state.height}>

                    // {/* Container used for zooming and scrolling /}
                    <g transform={`translate(${this.state.offsetX} ${this.state.offsetY})`}>

                        Render each component
                        {this.props.chip.components.map(component => 
                            <UIComponent key={component.uuid} component={component} x={component.x} y={component.y} />
                        )}

                    </g>

                </svg> */}

                {/* Render stage */}
                {/* <Stage onMount={app => this.app = app} width={this.state.width} height={this.state.height} options={{ autoDensity: true, antialias: true, resolution: window.devicePixelRatio || 1, transparent: true }}> */}

                    {/* Container used for zooming and scrolling */}
                    {/* <Container position={[this.state.offsetX, this.state.offsetY]}> */}

                        {/* Render each component
                        {this.props.chip.components.map(component => 
                            <UIComponent key={component.uuid} component={component} position={[component.x, component.y]} />
                        )} */}

                    {/* </Container> */}

                {/* </Stage> */}
                {/* <canvas ref={ref => this.canvas = ref} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} /> */}

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

        // Create PIXI app
        // this.app = new PIXI.Application({ view: this.canvas, autoDensity: true, antialias: true, resolution: window.devicePixelRatio || 1, transparent: true })

        // let graphics = new PIXI.Graphics()
        // graphics.beginFill(0xDE3249)
        // graphics.drawRect(0, 0, 200, 200)
        // graphics.endFill()

        // this.app.stage.addChild(graphics)

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
        // if (!this.canvas) return
        let rect = this.container.getBoundingClientRect()
        this.setState({ width: Math.floor(rect.width), height: Math.floor(rect.height) })
        // this.canvas.width = rect.width * (window.devicePixelRatio || 1)
        // this.canvas.height = rect.height * (window.devicePixelRatio || 1)

        // // Repaint the canvas
        // this.draw()

    }

    /** Called on pan start */
    onPanStart = e => {
        console.log(e.target)

        // Check if panning a child node
        this.panningChild = true
        let node = e.target
        while (node && node != document.body) {
            if (node.className == 'graph-component') return
            node = node.parentNode
        }
        
        // Store start index
        this.panningChild = false
        this.panStartX = this.state.offsetX
        this.panStartY = this.state.offsetY

    }

    /** Called on pan move, each frame it moved */
    onPan = e => {

        // Stop if panning the child
        if (this.panningChild)
            return
        
        // Move camera
        this.setState({ offsetX: this.panStartX + e.deltaX, offsetY: this.panStartY + e.deltaY })

    }

    /** Draw the canvas content */
    draw = e => {

        // Reset transformation
        // this.ctx.setTransform(1, 0, 0, 1, 0, 0)

        // // Clear the canvas
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // // Translate for HiDPI screens
        // let canvasWidth = this.canvas.width / (window.devicePixelRatio || 1)
        // let canvasHeight = this.canvas.height / (window.devicePixelRatio || 1)
        // this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)

        // // Move the camera based on offset
        // this.ctx.translate(this.offset.x, this.offset.y)

        // // Apply zoom level
        // this.ctx.scale(this.zoom, this.zoom)

        // // Draw components
        // for (let component of this.props.chip.components) {

            // // Count all inputs
            // let chip = ChipDB.find(component.chip)
            // let inputsCount = chip.inputs.length
            // if (chip.overflowInputsAllowed)
            //     inputsCount += component.overflowInputs?.length || 0

            // // Count all inputs
            // let outputsCount = chip.outputs.length
            // if (chip.overflowOutputsAllowed)
            //     outputsCount += component.overflowOutputs?.length || 0

            // // Draw body
            // let x = component.x
            // let y = component.y
            // let width = 320
            // let height = 80 + Math.max(inputsCount, outputsCount) * 40
        //     this.ctx.save()
        //     this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
        //     this.ctx.shadowBlur = 12
        //     this.ctx.shadowOffsetX = 0
        //     this.ctx.shadowOffsetY = 2
        //     this.ctx.fillStyle = '#444'
        //     roundRect(this.ctx, x, y, width, height, 5, true, false)
        //     // this.ctx.strokeStyle = '#222'
        //     // this.ctx.lineWidth = 1
        //     // this.ctx.strokeRect(x, y, width, height)
        //     this.ctx.restore()

        //     // Draw chip title
        //     this.ctx.textBaseline = "top"
        //     this.ctx.font = 'bold 17px "Helvetica Neue", Helvetica, Arial'
        //     this.ctx.fillStyle = '#888'
        //     this.ctx.fillText(chip.name, x + 10, y + 10, width - 20)

        //     // Draw left side connections
        //     let index = 0
        //     for (let connection of chip.inputs)
        //         drawConnectionHole(this.ctx, x + 10, y + 80 + 20 * index++, connection.type, true, connection.name, false)

        //     // Draw right side connections
        //     index = 0
        //     for (let connection of chip.outputs)
        //         drawConnectionHole(this.ctx, x + width - 10, y + 80 + 20 * index++, connection.type, false, connection.name, false)

        // }

    }

}

/** Draws a connection hole centered at the specified position */
function drawConnectionHole(ctx, x, y, type, leftSide, name, connected) {

    // Check types
    if (type == 'logic') {

        // Draw logic hole
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI, false)
        ctx.fillStyle = 'black'
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#FFF'
        ctx.stroke()

    } else {

        // Draw unknown connection hole
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI, false)
        ctx.fillStyle = 'black'
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#278f31'
        ctx.stroke()

    }

}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius.
 * From: https://stackoverflow.com/a/3368118/1008736
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
  
}

// const Rectangle = PixiComponent('Rectangle', {
//     create: props => new PIXI.Graphics(),
//     applyProps: (instance, _, props) => {
//       const { x, y, width, height, fill } = props
  
//       instance.clear()
//       instance.beginFill(fill)
//       instance.drawRect(x, y, width, height)
//       instance.endFill()
//     },
// })

// const RoundedRectangle = PixiComponent('RoundedRectangle', {
//     create: props => new PIXI.Graphics(),
//     applyProps: (instance, _, props) => {
//       const { x, y, width, height, radius, fill } = props
  
//       instance.clear()
//       instance.beginFill(fill)
//       instance.drawRoundedRect(x, y, width, height, radius)
//       instance.endFill()

//     },
// })

//
// Represents a Chip rendered on the graph
class UIComponent extends React.PureComponent {

    render() {

        // Count all inputs
        let chip = ChipDB.find(this.props.component.chip)
        let inputsCount = chip.inputs.length
        if (chip.overflowInputsAllowed)
            inputsCount += this.props.component.overflowInputs?.length || 0

        // Count all inputs
        let outputsCount = chip.outputs.length
        if (chip.overflowOutputsAllowed)
            outputsCount += this.props.component.overflowOutputs?.length || 0

        // Draw body
        let width = 320
        let height = 20 + Math.max(inputsCount, outputsCount) * 40
        return <Hammer options={{ domEvents: true }} onPanStart={this.onPanStart} onPan={this.onPan} direction="DIRECTION_ALL">
            <div className="graph-component" style={{ transform: `translate(${this.props.component.x}px, ${this.props.component.y}px)`, boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.2)', position: 'absolute', width, height, backgroundColor: '#111112', borderRadius: 6, overflow: 'hidden' }}>

                {/* Title */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 20, padding: '3px 6px', boxSizing: 'border-box', backgroundColor: '#bf5900', fontSize: 12, textOverflow: 'ellipsis' }}>
                    <font style={{ color: 'rgba(255, 255, 255, 1.0)', fontWeight: 'bold' }}>{chip.name}</font>
                    <font style={{ color: 'rgba(255, 255, 255, 0.5)' }}> - {chip.description}</font>
                </div>

                {/* Left components */}
                {chip.inputs.concat(this.props.component.overflowInputs).map((connection, idx) =>
                    <div key={idx} style={{ position: 'absolute', top: 20 + 20*idx, left: 0, display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 10, height: 10, boxSizing: 'border-box', backgroundColor: 'black', borderRadius: 5, border: '2px solid #AAA', margin: 5 }} />
                        <div style={{ color: '#888', fontSize: 12 }}>{connection.name}</div>
                    </div>
                )}

                {/* Right components */}
                {chip.outputs.concat(this.props.component.overflowOutputs).map((connection, idx) =>
                    <div key={idx} style={{ position: 'absolute', top: 20 + 20*idx, right: 0, height: 20, display: 'flex', alignItems: 'center' }}>
                        <div style={{ color: '#888', fontSize: 12 }}>{connection.name}</div>
                        <div style={{ width: 10, height: 10, boxSizing: 'border-box', backgroundColor: 'black', borderRadius: 5, border: '2px solid #AAA', margin: 5 }} />
                    </div>
                )}

            </div>
        </Hammer>

    }

    /** Called on pan start */
    onPanStart = e => {
        e.srcEvent.stopPropagation()
        
        // Store start index
        this.panStartX = this.props.component.x
        this.panStartY = this.props.component.y

    }

    /** Called on pan move, each frame it moved */
    onPan = e => {
        e.srcEvent.stopPropagation()
        
        // Move component
        this.props.component.x = this.panStartX + e.deltaX
        this.props.component.y = this.panStartY + e.deltaY
        this.forceUpdate()

    }

}