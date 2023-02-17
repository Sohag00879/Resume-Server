const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}))

// mongoose
// .connect('mongodb://127.0.0.1:27017/testProductDb')
// .then(()=> console.log('db is connected'))
// .catch((error)=>{
//     console.log('db is not connected');
//     console.log(error);
//     process.exit(1);
// });

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true //ata korlam field required kore rakhar jnno
    },
    
    phone : {
        type: Number,
        require: true
    },
    home: {
        type : String,
        require: true
    }
});

const user = mongoose.model('Users', usersSchema);

const connectDb = async () =>{
    try{
        await mongoose
        .connect('mongodb+srv://sohag879:K6xJcSKIplerbLDS@cluster0.9m1rtxw.mongodb.net/UserInfo?retryWrites=true&w=majority');
        console.log('db is connect');
    }
    catch(error){
        console.log('db is not connect');
        console.log(error.message);
    }
}

app.post('/users',async (req,res)=>{
    try{
        const name = req.body.name;
        const phone = req.body.phone;
        const home = req.body.home;

        const newUser = new user({
            name,
            phone,
            home
        });
        const userData = await newUser.save();
        res.status(201).send(userData);
    }catch(error){
        res.status(500).send({message:error.message});
    }
})

app.get('/',(req,res) =>{
    res.send('this is home page')
});

app.get('/users',async(req,res)=>{
    try{
        const users = await user.find();
        if(users){
            res.status(200).send(users);
        }
        else{
            res.status(404).send({
                success: false,
                message:'product not found'
            });
        }
    }catch(error){
        res.status(500).send({message:error.message})
    }
})

app.get('/users/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        const User = await user.findOne({_id: id}); //here 1 mane holo true
        res.send(User);
        if(User){
            
            res.status(200).send({
                success : true,
                message : "return single product",
                data : User
            });
        }
        else{
            res.status(404).send({
                success: false,
                message:'products not found'
            });
        }
    }catch(error){
        res.status(500).send({message:error.message})
    }
});


//delete

app.delete('/users/:id',async(req,res)=>{
    
    try{
        const id = req.params.id;
        const DeleteUser = await user.findByIdAndDelete({_id: id});
        if(DeleteUser){
            
            res.status(200).send({
                success : true,
                message : "deleted single product",
                data : User
            });
        }
        else{
            res.status(404).send({
                success: false,
                message:'products was not deleted with this id'
            });
        }
    }catch(error){
        res.status(500).send({message:error.message})
    }
})

app.listen(port,async () =>{
    console.log(`server is running is port ${3000}`);
    await connectDb();
});

