const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
const port = process.env.PORT || 4000;
const cors = require('cors');

require('dotenv').config()
// middleware
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sia2vfl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        await client.connect();
        const fruitsCollection = client.db('fruits').collection('fruit');
        const soldFruitsCollection = client.db('soldFruits').collection('soldFruit');
        console.log('connecting to db fruits');

        // get all fruits for 
        app.get('/fruits',async(req, res) => {
            const query = req.query
            const cursor = fruitsCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
         }
        )
        // get one fruit for item details page
        app.get('/fruit/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id:ObjectId(id)}
            const result = await fruitsCollection.findOne(query)
            res.send(result)
        })

        // user buy fruits for my order page 
        app.get('/soldFruits/:email', async (req, res) => {
            const email = req.params.email
            const result = await soldFruitsCollection.find({userEmail:email}).toArray()
            res.send(result)
        })
         
        // insert one fruit for add item page
         app.post('/fruit', async(req, res) => {
            const data = req.body
            const result = await fruitsCollection.insertOne(data)
            res.send(result)
        })

        // user sold fruit post for buy now page 
         app.post('/sold', async(req, res) => {
            const data = req.body
            const result = await soldFruitsCollection.insertOne(data)
            res.send(result)
        })

        // update fruit for item details page
        app.put('/fruit/:id', async(req, res) => {
            const fruitId = req.params.id
            const filter = {_id:ObjectId(fruitId)}
            const data = req.body
            const options = { upsert: true };
            const updateDoc = { $set: {...data} };
            const result = await fruitsCollection.updateOne(filter, updateDoc, options);
            console.log(result)
            res.send(result);
        })

        // delete for mange item page
        app.delete('/fruit/:id', async (req, res) => {
            const fruitId = req.params.id
            const filter = {_id:ObjectId(fruitId)}
            const result = await fruitsCollection.deleteOne(filter) 
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(console.dir)


app.get('/',(req , res) => {
    res.send('Hello World ')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})