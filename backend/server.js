import express  from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import {sql} from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { aj } from "./lib/arcjet.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet()); // for security
app.use(morgan("dev")); //Log the request

// apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested:1 // specifies that each request consumes 1 token
        });
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                res.status(429).json({success: false, message: "Too Many Requests"});
                console.log(decision.reason)
            }else if(decision.reason.isBot()){
                res.status(403).json({success: false, message: "Bot detected access denied! "});
            } else{
                res.status(403).json({error: "Forbidden"})
            }
            return;
        }
        // check for spoofed bots
        if(decision.reason.isSpoofedBot()){
            res.status(403).json({error: "Spoofed bot detected access denied! "});
            return;
        }
        next();
    } catch (error) {
        console.log("Arcjet error", error)
        next(error);
    }
})

app.use("/api/products", productRoutes);

async function initDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY, 
            name VARCHAR(255) NOT NULL, 
            image VARCHAR(255) NOT NULL, 
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
        console.log("Database initialized successfully")
    } catch (error) {
        console.log("Error initDB", error)
    }
}

initDB().then(() =>{
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`)
    })
})