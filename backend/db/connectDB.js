import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const usersCollection=conn.connection.db.collection("users");
        const indexes=await usersCollection.indexes();
        const badIndexNames=["responses_1","wishlist_1","orders_1","addedProducts_1","acceptedDeals_1","pastDeals_1"];

        for(const indexName of badIndexNames){
            const matchedIndex=indexes.find((index)=>index.name===indexName);
            if(matchedIndex){
                try{
                    await usersCollection.dropIndex(indexName);
                    console.log(`Dropped invalid index: users.${indexName}`);
                }
                catch(dropError){
                    console.log(`Warning: could not drop users.${indexName} - ${dropError.message}`);
                }
            }
        }
    }
    catch(error){
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;