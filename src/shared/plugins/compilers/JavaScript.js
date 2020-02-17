//
// Compiles the chip into an executable JavaScript function.
export default class JavaScriptCompiler {

    // Plugin info
    id = 'compiler-js'
    name = 'Compiler: JavaScript'
    description = 'Compiles a chip into an executable function.'
    version = 1

    // Compiler info
    compilerInfo = {
        extension: '.js',
        language: 'javascript'
    }

    // Compile the specified chip
    async compile(ctx, chip, name) {

        // Done
        return `function ${name}() { alert('here') }`

    }

}