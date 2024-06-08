const express = require("express");
const app = express();

const port : number = 8080;


app.get('/', (req : any, res: any) => {
    res.json({hello: "world"});
})

app.get('/login', (req : any, res : any) => {
    
})


app.listen(port, () => {
    console.log(`Listening on port ${port} 🩵`)
})

export {};