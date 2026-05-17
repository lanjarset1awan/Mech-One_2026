import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../config/supabase.js";

export const register = async (req, res) => {
    const { email, password, full_name } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
        .from("users")
        .insert([{ email, password_hash: hashed, full_name }])
        .select();

    if (error) return res.status(400).json(error);

    res.json(data);
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const { data } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (!data) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, data.password_hash);

    if (!valid) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
        { id: data.id, email: data.email },
        process.env.JWT_SECRET
    );

    res.json({ token });
};