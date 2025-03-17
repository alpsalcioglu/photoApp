import mongoose from "mongoose";

const conn = () => {
    mongoose.connect(process.env.DB_URI, {
        dbName: "photoApp_db"
    }).then(()=>{
        console.log("Database Succesfully Connected!");
    }).catch((err)=>{
        console.log(`Database Connection Failed: ${err}`);
    });
};

export default conn;