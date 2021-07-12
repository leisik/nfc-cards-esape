import { connectToDatabase } from "../../util/mongodb";
const database = process.env.NEXT_PUBLIC_DATABASE;

export default async (req, res) => {
    const { db } = await connectToDatabase();
    const users = db.collection(database);
    const wallet_addres = req.body.wallet_addres; //reads wallet address from a request

    if(wallet_addres !== '' && wallet_addres !== undefined) // prevents from blank requests
        {
            const result = await users.find({ "wallet_addres" : wallet_addres }).toArray(); //query to get quantity (number of drinks available) of the customer
            if(result[0].quantity > 0 ) {
                const result2 = await users.updateOne(
                    { "wallet_addres" : wallet_addres },
                    { $inc: { quantity: -1 } } //decremets quantity by 1
                );
                console.log(`The user with the _id : ${result[0].wallet_addres} has used 1 drink.`);
                let tmpQn = result[0].quantity - 1; //temporary quantity
                tmpQn == 1 ? console.log("There is", tmpQn, "drink left") : console.log("There are", tmpQn, "drinks left");
            }
            res.json(result); //sends the result back to index.js
        }
};
