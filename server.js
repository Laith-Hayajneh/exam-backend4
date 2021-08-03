'use strict';
require('dotenv').config();
// server.use(cors());

const express = require("express");
const axios = require('axios');
const server = express();
const cors = require('cors');
const colorHandler = require('./module/colorHandler');

server.use(express.json());
server.use(cors());
const PORT = process.env.PORT
const mongoose = require('mongoose');
mongoose.connect('mongodb://laith:12345@cluster0-shard-00-00.rknst.mongodb.net:27017,cluster0-shard-00-01.rknst.mongodb.net:27017,cluster0-shard-00-02.rknst.mongodb.net:27017/color?ssl=true&replicaSet=atlas-dp8v9x-shard-0&authSource=admin&retryWrites=true&w=majorityt', { useNewUrlParser: true, useUnifiedTopology: true });


const ColorSchema = new mongoose.Schema({
    name: String,
    image: String
});

const OwnerSchema= new mongoose.Schema({
    email:String,
    color:[ColorSchema]
})

const myOwnerModal = mongoose.model('Owner', OwnerSchema);


function seedOwnerdata(){
    const laith =new myOwnerModal({
        email:"laithhayajneh98@gmail.com",
        color:[
            {
                name:'test1',
                image:'test2'
            },{
                name:'test3',
                image:'test4'
            }
        ]
    })
    laith.save();
}
// seedOwnerdata()




server.get('/getAPIData', colorHandler)


// server.get('/', (req, res) => {
//     res.status(200).send('home route')
// });




server.post('/getAPIData', addColorHandler);

function addColorHandler(req, res) {
    let email = req.query.email
    console.log('this is email', email);
    let { colorName, colorImage } = req.body
    console.log('req bodyyy', req.body);
    myOwnerModal.find({email:email},(error,items)=>{
        if (error) {
            res.status(500).send('cant find')
            
        }else{
            console.log('beffore add',items);
            items[0].color.push({
                name:colorName,
                image:colorImage
            })
            console.log('after push',items[0]);
            items[0].save();
            res.status(200).send(items[0].color)
        }
    })


}


server.get('/',emailHandler);
function emailHandler (req,res){
    let email=req.query.email;
    console.log('emaill hand ',email);
    console.log('emaill owner ',myOwnerModal)

    myOwnerModal.find({email:email},(error,items)=>{
        if (error) {
            res.status(500).send('cant find')
            
        }else{
            console.log('seeend',items[0].color)
            res.status(200).send(items[0].color)
        }
    })
}


server.delete('/:id',deleteHandler)


function deleteHandler(req,res){
    let colorId=req.params.id;
    let email =req.query.email

    myOwnerModal.find({email:email},(error,items)=>{
        if (error) {
            res.status(500).send('error')
            
        }else{
            let newColorArray=items[0].color.filter(idx=>{
                return idx._id.toString() !== colorId
            })
            items[0].color=newColorArray;
            items[0].save();
            res.status(200).send(items[0].color)
        }
    })
}

server.put('/:id',updateHandler)

function updateHandler(req,res){
    let id=req.params.id;
    let { colorName, colorImage } = req.body
    let email =req.query.email
myOwnerModal.findOne({email:email},(error,items)=>{
    if (error) {
        res.status(500).send('not')
        
    }else{
        items.color.map(color=>{
            if(color._id.toString() === id){
                color.name=colorName;
                color.image=colorImage;
                return coloro
            }else{
                return color
            }
        })
        items.save();
        res.status(400).send(items.color)
    }
})
}


server.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})
