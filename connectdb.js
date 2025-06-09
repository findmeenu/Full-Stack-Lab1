// To import .env file
require ('dotenv').config(); 

// Import MongoDB
const {MongoClient} = require ('mongodb')
const uri = process.env.MONGO_URI

const client = new MongoClient(uri);
let dishes;
async function connectDb() {
    try{
        // Wait to connect to DB
        await client.connect();
        // Select the database named Lab1
        const db = client.db("Lab1");
        // Creates the collection dishes inside Lab1
        dishes  = db.collection("dishes"); //Assign value to dishes variable

         console.log("Connection established with MongoDB.");
  } catch(err) {
    console.log("Error while connecting to MongoDB:", err);
  }
       
}



module.exports = {connectDb, getDishes: ()=> dishes};