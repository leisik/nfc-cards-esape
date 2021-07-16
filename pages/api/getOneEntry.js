import { connectToDatabase } from "../../util/mongodb";
const database = process.env.NEXT_PUBLIC_DATABASE;

export default async (req, res) => {
    const { db } = await connectToDatabase();
    const users = db.collection(database);
    const wallet_addres = req.body.wallet_addres; //reads wallet address from a request

    if(wallet_addres !== '' && wallet_addres !== undefined) // prevents from blank requests
        {
            const result = await users.find({ "wallet_addres" : wallet_addres }).toArray(); //query to get quantity (number of drinks available) of the customer
            res.json(result); //sends the result back to index.js
        }
};
