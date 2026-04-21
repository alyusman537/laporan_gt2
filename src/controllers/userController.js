import { LibsqlError } from "@libsql/client"
import { userService } from "../services/userService.js";

export const userController = {
    all: async (req, res) => {
        try {
            const users = await userService.all();
            res.status(200).json(users);
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({success: false, message: `libSQL Error: ${error.code} - ${error.message}`});
                // Example codes: "URL_INVALID", "SERVER_ERROR", "SQL_ERROR"
            } else {
                res.status(500).json({success: false, message: `An unexpected error occurred: ${error}`});
            }
        }
    },
    byId: async (req, res) => {
        try {
            const {id} = req.params
            const users = await userService.byId(id);
            res.status(200).json(users);
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({success: false, message: `libSQL Error: ${error.code} - ${error.message}`});
                // Example codes: "URL_INVALID", "SERVER_ERROR", "SQL_ERROR"
            } else {
                res.status(500).json({success: false, message: `An unexpected error occurred: ${error}`});
            }
        }
    },
}