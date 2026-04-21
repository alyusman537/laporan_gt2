import bcrypt from "bcryptjs";

export const passwordBcrypt = {
    enkrip: (passwordText) => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(passwordText, salt);
    },
    banding: (passwordText, passwordHash) => {
        return bcrypt.compareSync(passwordText, passwordHash)
    }
}