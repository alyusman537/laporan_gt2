import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { router } from "./src/routes/api.js";

// Set timezone
process.env.TZ = "Asia/Jakarta";

const app = express();

// --- 1. Konfigurasi Middleware ---

// Keamanan Header (Paling atas)
app.use(helmet()); 

// Konfigurasi CORS
// Catatan: Anda memanggil app.use(cors()) dua kali di kode lama. Cukup sekali saja.
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Parser JSON (Penting sebelum masuk ke Router)
app.use(express.json()); 

// Rate Limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 Menit
    limit: 50,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        success: false,
        message: "Terlalu banyak permintaan, silakan coba lagi nanti."
    }
});
app.use(limiter);

// --- 2. Logging & Debug ---
console.log(`Server Timezone: ${process.env.TZ}`);
console.log(`Current Time: ${new Date().toLocaleString('id-ID')}`);

// --- 3. Routes ---
app.use("/api", router);

// --- 4. Server Listener ---
const PORT = process.env.PORT || 3131;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    
    // Validasi Environment Variables
    const requiredEnv = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
    requiredEnv.forEach(envVar => {
        if (!process.env[envVar]) {
            console.warn(`⚠️ PERINGATAN: ${envVar} belum disetel di .env!`);
        }
    });
});