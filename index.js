const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors');

// middleware
app.use(express.json());
app.use(cors());

//  user name ashrafulAlam
// password MqGUhF1cXTl2qfj4



const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
const uri = "mongodb+srv://ashrafulAlam:MqGUhF1cXTl2qfj4@cluster0.sia2vfl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        await client.connect();
        const fruitsCollection = client.db('fruits').collection('fruit');
        console.log('connecting to db fruits');

        //  get api
        app.get('/fruits',async(req, res) => {
            const query = req.query
            const cursor = fruitsCollection.find(query)
            const result = await cursor.toArray()
            console.log(result)
            res.send(result)
         }
        )
        // create/post api
         app.post('/fruit', async(req, res) => {
            const data = req.body
            const result = await fruitsCollection.insertOne(data)
            res.send(result)
        })

        // update api
        app.put('/fruit/:id', async(req, res) => {
            const fruitId = req.params.id
            const filter = {_id:ObjectId(fruitId)}
            const data = req.body
            const options = { upsert: true };
            const updateDoc = { $set: {...data} };
            const result = await fruitsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // delete api
        app.delete('/fruit/:id', async (req, res) => {
            const fruitId = req.params.id
            const filter = {_id:ObjectId(fruitId)}
            const result = await fruitsCollection.deleteOne(filter) 
            console.log(result)
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