const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.srriw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        const database = client.db("eLearnDB");
        const coursesCollection = database.collection("courses");
        const reviewsCollection = database.collection("reviews");
        const ordersCollection = database.collection("orders");
        const usersCollection = database.collection("users");
       
        //GET Course
            app.get('/courses', async (req, res) => {
            const cursor = coursesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);            
        })
        //ADD Courses
            app.post("/courses", async(req,res) =>{
            const result = await coursesCollection.insertOne(req.body);
            console.log(result)
        }) 
        //Get Single Course            
            app.get("/courses/:id", async(req, res) =>{
            const result = await coursesCollection
            .find({_id: ObjectId(req.params.id)})
            .toArray();
            res.send(result[0])
        } )  
        //Update Course
        app.put('/courses/:id', async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            console.log(req.params.id);
            const options = { upsert: true };
            const result = await coursesCollection.updateOne(filter, {
              $set: {
                title: req.body.title,
                image: req.body.image,
                desc: req.body.desc,
                price: req.body.price
              },
            });
         
        //Delete Course
        app.delete("/courses/:id", async (req, res)=>{
            const result = await coursesCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        })    



            //Post Review
            app.post("/reviews", async(req,res) =>{
            const result = await reviewsCollection.insertOne(req.body);
            res.send(result)
        })  
          //  Get Review
          app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })  



          //Post Order
          app.post("/confirmOrder", async(req,res) =>{
            const result = await ordersCollection.insertOne(req.body);
            res.send(result)
        })  
            //User Order
        app.get("/myorder/:email", async (req, res) =>{
            const result = await ordersCollection
            .find({ email: req.params.email })
            .toArray();
            res.send(result);
        })   
 
    
            //  Post user
            app.post('/users', async (req, res) => {
                const user = req.body;
                const result = await usersCollection.insertOne(user);
                console.log(result);
                res.json(result);
            });
            //  Post convert  user to admin
            app.put('/users', async (req, res) => {
                const user = req.body;
                const filter = { email: user.email };
                const updateDoc = { $set: { role: 'admin' } };
                const result = await usersCollection.updateOne(filter, updateDoc);
                console.log(result);
                res.json(result);
            });

               //Get Admin
               app.get('/users/:email', async (req, res) => {
                const email = req.params.email;
                const query = { email: email };
                const user = await usersCollection.findOne(query);
                let isAdmin = false;
                if (user?.role === 'admin') {
                    isAdmin = true;
                }
                res.json({ admin: isAdmin });
            })    





            // res.send(result);
            console.log(result);
        });


     

   

        console.log('connected database')

    }
    finally{
        //await client.close();
    }

}

run().catch(console.dir)

app.get('/', (req, res)  =>{
    res.send('running e learning server')
})

app.listen(port, ()=>{
    console.log('running e learning server on port', port)
})