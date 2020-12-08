const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const marioModel = require('./models/marioChar');

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// your code goes here
app.get("/mario", async (req, res)=>{
    res.send(await marioModel.find());
});

app.get("/mario/:id", async (req, res)=>{
    const idToSend = req.params.id;
    try{
        const doc = await marioModel.findOne({_id: idToSend});
        if(doc === null){
            res.sendStatus(400);
        }else{
            res.send(doc);
        }
    }catch(error){
        res.status(400).send({message: error.message});
    }
});

app.post("/mario", async (req, res)=>{
    if(Object.keys(req.body).length < 2){
        res.status(400).send({message: 'either name or weight is missing'})
    }else{
        const obj = {
            name: req.body.name,
            weight: parseInt(req.body.weight)
        }
        const newChar = marioModel(obj)
        await newChar.save();
        res.status(201).send(obj);
    }
});

app.patch("/mario/:id", async (req, res)=>{
    const idToChange = req.params.id;
    let flag = false;
    try {
        if(await marioModel.findOne({_id:idToChange}) === null){
            res.sendStatus(400);
        }else{
            for(key in req.body){
                if(key === 'name'){
                    flag = true;
                    await marioModel.updateOne({_id: idToChange}, {"name": req.body[key]});
                }else if(key === 'weight'){
                    flag = true;
                    await marioModel.updateOne({_id: idToChange}, {"weight": parseInt(req.body[key])});
                }
            } 
            res.send(await marioModel.findOne({_id: idToChange}));
        }
        
    }catch(error){
        res.status(400).send({message: error.message});
    }
});

app.delete("/mario/:id", async (req, res)=>{
    const idToDelete = req.params.id;
    try {
        if(await marioModel.findOne({_id:idToDelete}) === null){
            res.sendStatus(400);
        }else{
            await marioModel.deleteOne({_id: idToDelete});
            res.status(200).send({message: 'character deleted'})
        }
    }catch(error){
        res.status(400).send({message: error.message});
    }
})

module.exports = app;