const express = require('express')          //step 1.1: import express
const app = express()                       //step 1.2: create app by express dotenv
const port = process.env.PORT || 5000       //step 1.3: create port
const cors = require('cors')                //step 1.4: import cors
require('dotenv').config()                  //step 1.5: import dotenv      
const jwt = require('jsonwebtoken');

//middleware
app.use(cors())                             //step 2.1: use cors middle ware
app.use(express.json())                     //step 2.2: use express.json() middle ware


//                                         // step 3.1: copy the connect code and paste
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kqiwx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
//                                        //step 3.2: delete connect coder from client.connect to end


//                                        //step 4.1: create a async function named run
//                                        //step 4.1: call the function end
async function run() {
  try {
    await client.connect()
    const serviceCollection = client.db("geniusCar").collection("service")
    const orderCollection = client.db("geniusCar").collection("orders")

    //auth 
    app.post('/login', async (req, res) => {
      const user = req.body
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
      res.send({ accessToken })
    })



    //                                        // step 5:find all data( service) 
    app.get('/service', async (req, res) => {// step 5.1: app.get for find, set a route where get ,async req,res
      const query = {}                       // step 5.2 : for find all data query will empty object
      const cursor = serviceCollection.find(query) // step 5.3: create cursor database.find(query)
      const services = await cursor.toArray()      // steps create data(services) from await cursor.toArray()
      res.send(services)                            // and then send the data res.send
    })

    //                                                 //step 6: find a data get( service)
    app.get('/service/:id', async (req, res) => {// step 6.1: app.get for find, set a route where get ,async req,res
      const id = req.params.id                   // step 6.2: get id from req.params
      const query = { _id: ObjectId(id) }        // step 6.3: create query for one {_id:ObjectId(id)}
      const service = await serviceCollection.findOne(query) //step 6.4: get one database.findOne(query)
      res.send(service)                                       //step 6.5: res.send the data

    })

    //                                              // step 7: post a data or create a data
    app.post('/service', async (req, res) => { // step 7.1: app.post , set route from where get , async
      const newService = req.body              //step 7.2: get that from req.body and create  newData
      const result = await serviceCollection.insertOne(newService) //step 7.3: insert that await database.insertOne(newData)
      res.send(result)                                             // step 7.4: send data


    })
    //post order
    app.post('/orders', async (req, res) => {
      const orders = req.body
      const result = await orderCollection.insertOne(orders)
      res.send(result)
    })
    //get order
    app.get('/orders', async (req, res) => {
      const email = req.query.email
      const query = { email: email }
      const cursor = orderCollection.find(query)
      const orders = await cursor.toArray()
      res.send(orders)
    })


    //                                                          // step 8:Delete a data 
    app.delete('/service/:id', async (req, res) => { // step 8.1: app.delete
      const id = req.params.id                        //step 8.2: get id from params
      const query = { _id: ObjectId(id) }            // step 8.3: create a query {_id: ObjectId(id)}
      const result = await serviceCollection.deleteOne(query) // step 8.4: create result and await deleteOne
      res.send(result)                                          //step 8.5: send result

    })
  }
  finally {

  }
}


//
app.get('/', (req, res) => {
  res.send('running genius server')
})

//
app.listen(port, () => {                                  // step 1.5: app.listen(port, ()=>{ console.log(port)})
  console.log('listening', port);
})

run().catch(console.dir)