import mongoose from 'mongoose';

const Connection = async (username, password) => {
    const URL = `mongodb://${username}:${password}@ac-htce0lu-shard-00-00.gcj8st5.mongodb.net:27017,ac-htce0lu-shard-00-01.gcj8st5.mongodb.net:27017,ac-htce0lu-shard-00-02.gcj8st5.mongodb.net:27017/?ssl=true&replicaSet=atlas-1060ge-shard-0&authSource=admin&retryWrites=true&w=majority&appName=blo`;
    try {
        await mongoose.connect(URL, { useNewUrlParser: true })
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting to the database ', error);
    }
};

export default Connection;