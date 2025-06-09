const express = require ('express');
const path = require ('path');
const {connectDb, getDishes} = require('./connectdb');
const { ObjectId } = require('mongodb');



const app = express();
const port = process.env.PORT;

// To read json data from incoming requests.
app.use(express.json());
// To serve the index.html file in public folder
app.use(express.static(path.join(__dirname, "public")));

let dishes;

//Get the list of dishes
app.get("/api/dishes", async(req, res) => {
    
    const listOfDishes = await dishes.find().toArray();
    res.json(listOfDishes); //return the list of dishes.
    });

// GET /api/dishes/:name – Return a dish by name. Return 404 if it doesn't exist.
app.get("api/dishes/:name", async(req, res) => {
    const dish = await dishes.findOne({name: req.params.name});
    if (!dish ) return res.status(404).send("Dish does not exist.");
    res.json(dish);
});

// POST /api/dishes – Add a new dish. Return 201 if successful, or 409 if it already exists.
app.post("/api/dishes", async(req, res)=> {
    const existingDish = await dishes.findOne({name : req.body.name});
    if (existingDish) return res.status(409).send("Dish already exists.");

    const newDish = await dishes.insertOne(req.body); // add the dish to database.
    res.status(201).send(`${req.body.name} added.`);
});

// PUT /api/dishes/:id – Update an existing dish. Return 404 if it doesn't exist.
app.put("/api/dishes/:id", async(req, res)=>{
    const existingDish = await dishes.updateOne(
        {_id: new ObjectId(req.params.id)},
        {$set: req.body}
    );
    if (existingDish.matchedCount === 0)
        return res.status(404).send("Dish does not exist.");

    res.send("Dish updated.")
});

// DELETE /api/dishes/:id – Delete a dish. Return 404 if it doesn't exist.
app.delete("/api/dishes/:id", async(req, res) => {
    // dleteOne returns a result object {acknowledged: true, deletedCount: 1}

    const result = await dishes.deleteOne({_id: new ObjectId(req.params.id)})  
    if (result.deletedCount === 0) return res.status(404).send("Dish not found.")

    res.send(`Dish deleted successfully.`)
})

// app.get("/", (req, res)=> {
//     const filePath = path.join(__dirname, "public", "index.html");
//   console.log("Trying to send:", filePath);
//   res.sendFile(filePath);
//     // console.log("Homepage requested");
//     // res.sendFile(path.join(__dirname, "public", "index.html"))
// })

// Start ther server
connectDb().then(()=>{
    dishes = getDishes();
app.listen(port, () => {
    
    console.log(`Server is running at http://localhost:${port}`)
})
})