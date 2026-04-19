import express from "express";
import cors from "cors"; // 1. Import library CORS
import helmet from "helmet";
import { rateLimit } from "express-rate-limit"
import { router } from "./src/routes/api.js";
import dotenv from "dotenv";

dotenv.config();
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	limit: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

const app = express();
app.use(express.json());
// 2. Gunakan Middleware CORS
// Opsi A: Izinkan semua origin (Cocok untuk development)
app.use(cors(), helmet(), limiter);

/* // Opsi B: Batasi hanya untuk domain tertentu (Lebih Aman untuk Produksi)
app.use(cors({
  origin: ['http://localhost:8080', 'https://domainanda.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
*/

// Set timezone global untuk proses Node.js
process.env.TZ = "Asia/Jakarta";

console.log(`Server Time: ${new Date().toString()}`);

app.use("/api", router );

const PORT = process.env.PORT || 3131;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});