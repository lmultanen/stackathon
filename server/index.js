const app = require('./app')
const port = 3000

function init() {
    app.listen(port, () => 
        console.log('listening on http://localhost:3000\n')
    )
}

init()