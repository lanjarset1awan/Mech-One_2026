import supabase from "../config/supabase.js";

export const getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { major, gender, batch, whatsapp_number } = req.body;
    try {
        const { data, error } = await supabase
            .from("users")
            .update({ major, gender, batch, whatsapp_number })
            .eq("id", userId)
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const uploadProfileDocs = async (req, res) => {
    const userId = req.user.id;
    const files = req.files;

    const uploadFile = async (file, name) => {
        const { data, error } = await supabase.storage
            .from("users")
            .upload(`${userId}/${name}`, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

        if (error) throw error;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from("users")
            .getPublicUrl(`${userId}/${name}`);
            
        return publicUrlData.publicUrl;
    };

    try {
        const result = {};
        const updatesToDb = {};

        for (const file of files) {
            // Map the fieldname from the frontend to the DB column name
            // Assuming frontend fieldnames match the DB columns minus the _url part, or exactly match it.
            // Let's assume frontend sends exactly the column name (e.g., student_card_url).
            const dbColumn = file.fieldname;
            const fileExt = file.mimetype.split('/')[1] || 'jpg';
            const publicUrl = await uploadFile(file, `${dbColumn}.${fileExt}`);
            
            result[dbColumn] = publicUrl;
            updatesToDb[dbColumn] = publicUrl;
        }
        
        // Update the user's row in the database with the new URLs
        if (Object.keys(updatesToDb).length > 0) {
             const { error: dbError } = await supabase
                .from("users")
                .update(updatesToDb)
                .eq("id", userId);
                
             if (dbError) throw dbError;
        }

        res.json({ success: true, files: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};