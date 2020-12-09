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
        const doc = await marioModel.findById(idToSend);
        if(doc === null){
            res.sendStatus(400);
        }else{
            res.send(doc);
        }
    }catch(error){
        res.status(400).send({message: error.message});
    }
});

const isNullOrUndefined = val => val === null || val === undefined;

app.post("/mario", async (req, res)=>{
    const newMario = req.body;
    if(isNullOrUndefined(newMario.name) || isNullOrUndefined(newMario.weight)){
        res.status(400).send({message: 'either name or weight is missing'});
    }else{
        const newMarioDocument = new marioModel(newMario);
        await newMarioDocument.save();
        res.status(201).send(newMarioDocument);
    }
});

app.patch("/mario/:id", async (req, res)=>{
    const idToChange = req.params.id;
    const newMario = req.body;
    try {
        const existingMarioDoc = await marioModel.findById(idToChange);
        if(isNullOrUndefined(newMario.name) && isNullOrUndefined(newMario.weight)){
            res.status(400).send({message: "both name and weight is missing"})
        }else{
            if(!isNullOrUndefined(newMario.name)){
                existingMarioDoc.name = newMario.name;
            }
            if(!isNullOrUndefined(newMario.weight)){
                existingMarioDoc.weight = newMario.weight;
            }
            await existingMarioDoc.save();
            res.send(existingMarioDoc);
        }
        
    }catch(error){
        res.status(400).send({message: error.message});
    }
});

app.delete("/mario/:id", async (req, res)=>{
    const idToDelete = req.params.id;
    try {
        await marioModel.findById(idToDelete);
        await marioModel.deleteOne({_id: idToDelete});
        res.send({message: 'character deleted'})
    }catch(error){
        res.status(400).send({message: error.message});
    }
})

module.exports = app;