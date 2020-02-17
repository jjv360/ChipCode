import TWEEN from '@tweenjs/tween.js'

//
// Manages tweens
export default new class TweenManager {

    /** Listeners */
    listeners = []

    /** Constructor */
    constructor() {

        // Setup tween loop
        this.runLoop()

    }

    /** Runs the animation loop */
    runLoop = e => {

        // Do again
        requestAnimationFrame(this.runLoop)

        // Update tweens
        let allTweens = TWEEN.getAll()
        TWEEN.update()

        // If there were running tweens, notify listeners to update their render
        if (allTweens.length > 0)
            for (let listener of this.listeners)
                listener()

    }

    /** Add update listener */
    addListener(func) {
        this.listeners.push(func)
    }

    /** Remove listener */
    removeListener(func) {
        this.listeners = this.listeners.filter(l => l != func)
    }

    /** Animate property of object */
    animate(object, property, targetValue, duration = 100) {

        // Find existing tween if any
        let existingTween = TWEEN.getAll().find(t => t._object == object && t.isPlaying() && typeof t._valuesEnd[property] != 'undefined')
        if (existingTween) {

            // Just update this one
            existingTween._valuesEnd[property] = targetValue
            existingTween._duration = duration + (TWEEN.now() - existingTween._startTime)

        } else {

            // Create new tween
            new TWEEN.Tween(object).to({  [property]: targetValue  }, duration).start()

        }

    }

}