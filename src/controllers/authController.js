import jwt from 'jsonwebtoken';
import { LibsqlError } from "@libsql/client";
import { userService } from "../services/userService.js";
import { passwordBcrypt } from '../utils/passwordBcrypt.js';

export const authController = {
    login: async (req, res) => {
        try {
            const { username, password, role } = req.body;
            const user = await userService.byUsername(username, String(role).toLocaleLowerCase());
            if (!user) {
                res.status(400).json({ success: false, message: "Username yang anda masukkan belum terdaftar." });
            }
            if(!passwordBcrypt.banding(password, user.password)) {
                res.status(400).json({ success: false, message: "Password yang anda masukkan salah." });
            }

            // Masukkan role ke dalam token JWT
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET || 'sidogiri_secret_key',
                { expiresIn: '1d' }
            );

            res.status(200).json({ 
                token:token,
                role: user.role,
                nama: user.nama
            });
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({success: false, message: `libSQL Error: ${error.code} - ${error.message}`});
                // Example codes: "URL_INVALID", "SERVER_ERROR", "SQL_ERROR"
            } else {
                res.status(500).json({success: false, message: `An unexpected error occurred: ${error}`});
            }
        }
    }
}