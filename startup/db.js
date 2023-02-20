import mongoose from "mongoose";
import logger from "./logger.js";

const dblink =
    "mongodb://thawng:QwN1VRr3Vbxdjym1@ac-nyumi05-shard-00-00.tnlpjdi.mongodb.net:27017,ac-nyumi05-shard-00-01.tnlpjdi.mongodb.net:27017,ac-nyumi05-shard-00-02.tnlpjdi.mongodb.net:27017/?ssl=true&replicaSet=atlas-gknkjn-shard-0&authSource=admin&retryWrites=true&w=majority";
const url =
    "mongodb://thawng:Na078zCGi9uae6ky@ac-nyumi05-shard-00-00.tnlpjdi.mongodb.net:27017,ac-nyumi05-shard-00-01.tnlpjdi.mongodb.net:27017,ac-nyumi05-shard-00-02.tnlpjdi.mongodb.net:27017/?ssl=true&replicaSet=atlas-gknkjn-shard-0&authSource=admin&retryWrites=true&w=majority";
export default function () {
    mongoose
        .connect(url)
        .then(() => console.log("Connected to mongo atlas"))
        .catch((err) => console.log(err));
}
