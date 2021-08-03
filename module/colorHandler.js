'use strict';

const axios=require("axios");
 const colorHandler=(req,res)=>{
console.log('color handler from back')
    let color;
    let url= 'https://ltuc-asac-api.herokuapp.com/allColorData';

    axios.get(url).then(response=>{
        color=response.data;
        let colorArray=color.map(obj=>{
            return new AllColor (obj);
        })
        res.status(200).send(colorArray)
    })
}
class AllColor {
    constructor(obj){
        this.name=obj.title;
        this.image=obj.imageUrl
    }
}
module.exports=colorHandler