import User from "../models/users.models.js";

export const findUserByToken = async (req, res, next) => {
    try {
        const token = req.body?.token || req.query?.token || req.headers.authorization;  // read from body

        
        if (!token) {
            return res.status(401).json({ error: "Token required" });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        req.user = user;
        next();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
