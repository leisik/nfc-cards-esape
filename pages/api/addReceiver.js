import { connectToDatabase } from "../../util/mongodb";
const User  = require("../../models/userModel");
const database = process.env.NEXT_PUBLIC_DATABASE;

export default async (req, res) => {
    //console.log(JSON.stringify(req.body))
    const { db } = await connectToDatabase();
    const users = db.collection(database);
    const email = req.body.email;
    const wallet_addres = req.body.wallet_addres;
    const status = req.body.status;
    const date = req.body.date;
    let newUser = new User({
        email,
        wallet_addres,
        status,
        date
    });
    if(wallet_addres !== '' && wallet_addres !== undefined) 
        {
            // const result = await users.insertOne(newUser);
            const result = await users.find({ "wallet_addres" : wallet_addres }).toArray();
            if(result[0].quantity > 0 ) {
                const result2 = await users.update(
                    { "wallet_addres" : wallet_addres },
                    { $inc: { quantity: -1 } }
                );
                console.log(`The user with the _id : ${result[0].wallet_addres} has used 1 drink.`);
                let tmpQn = result[0].quantity - 1; //temporary quantity
                tmpQn == 1 ? console.log("There is", tmpQn, "drink left") : console.log("There are", tmpQn, "drinks left");
            }
            res.json(result);
        }
    
    //res.json(result);
};
