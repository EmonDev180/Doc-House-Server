require('dotenv').config();
const  cookieParser = require('cookie-parser')

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

// middlewere 
//fnw8WU6kpz5D4OJS
//DoctorHouseDB
app.use(cors());
app.use(express.json())
//  


const uri = "mongodb+srv://DoctorHouseDB:fnw8WU6kpz5D4OJS@cluster0.stvj7tw.mongodb.net/?appName=Cluster0";
// const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.stvj7tw.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection


    const userCollection = client.db('DoctorHouseDB').collection('users')


    const doctorCollection = client.db('DoctorHouseDB').collection('doctorList')

    const expartCollection = client.db('DoctorHouseDB').collection('expartDoc');
    const bookingCollection = client.db('DoctorHouseDB').collection('bookings')
    const slotsCollection = client.db('DoctorHouseDB').collection('slots')


    // expartcollection

    app.get('/expartDoc',async(req,res) => {
      const result = await expartCollection.find().toArray();

      res.send(result)

    })

    app.get('/expartDoc/:id',async(req,res) => {

      const id = req.params.id;

      const query = {_id: new ObjectId(id)}


      const result = await expartCollection.find(query).toArray();

      res.send(result)

    })




    //user realated db                             

    app.get('/users',async(req,res)=> {

      const result = await userCollection.find().toArray();

      res.send(result)


    })

    app.post('/users',async(req,res) => {

      const user = req.body;

      const result = await userCollection.insertOne(user)

      res.send(result)

    })

    app.delete('/users/:id',async(req,res) => {
      const id = req.params.id;

      console.log(id)

      const query = {_id: new ObjectId(id)}

      const result = await userCollection.deleteOne(query)

      res.send(result)
    })


    app.patch('/users/:id',async(req,res) => {

      const id = req.params.id;

      const filter = {_id: new ObjectId(id)}

      const updatedDoc = {
        $set:{
          role:"admin"
        }

      }


      const result = await userCollection.updateOne(filter,updatedDoc);

      res.send(result)

    })


    // admin cheak


    app.get('/users/admin/:email',async(req,res) => {
      const email = req.params.email;

      const query = {email:email};
      const user = await userCollection.findOne(query)

     console.log(user)

      let admin = false;

      if(user){
        admin = user?.role === 'admin';
      }
      res.send({admin})
    })

    // doctor 




    app.post('/doctorList',async(req,res) => {
      const doctorList = req.body;
      console.log(doctorList)

      const result = await doctorCollection.insertOne(doctorList);

      res.send(result)
    })



    app.get('/doctorList',async(req,res) => {

      const result = await doctorCollection.find().toArray();

      res.send(result)
    })

    app.delete('/doctorList/:id',async(req,res) => {

      const id = req.params.id;

   

      const query = {_id: new ObjectId(id)}

      const result = await doctorCollection.deleteOne(query)

      res.send(result)

    })


    // booking collection

    app.post('/bookings',async(req,res) => {
     
      const booking = req.body;

      const result = await bookingCollection.insertOne(booking);

      res.send(result)
    })

    app.get('/bookings',async(req,res) => {

      const email = req.query.email


      const query = {email: email}

      const result = await bookingCollection.find(query).toArray();

      res.send(result)

    })


  // slots collection 


  app.get('/slots',async(req,res) => {

    const result = await slotsCollection.find().toArray()

    res.send(result);
    
  })







    // stars or analyties

    app.get('/dashBoard-stats',async(req,res) => {

      const users = await userCollection.estimatedDocumentCount();
      const bookings =  await bookingCollection.estimatedDocumentCount();
      const doctor = await doctorCollection.estimatedDocumentCount()

      res.send({
        users,
        bookings,
        doctor
      })

    })


 






    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res) => {
    res.send('doctor is comming')
})

app.listen(port,() => {

    console.log(`Doctor server is running on port${port}`)

})

