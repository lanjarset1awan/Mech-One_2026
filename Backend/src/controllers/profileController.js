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

    try {
        // Fetch current user to find old file URLs
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        if (userError) throw userError;

        const uploadFile = async (file, dbColumn, fileExt) => {
            // Delete old file if exists
            const oldUrl = user[dbColumn];
            if (oldUrl) {
                const urlParts = oldUrl.split('/public/users/');
                if (urlParts.length > 1) {
                    const oldPath = urlParts[1];
                    await supabase.storage.from("users").remove([oldPath]);
                }
            }

            // Generate unique filename to bypass browser cache
            const uniqueName = `${dbColumn}_${Date.now()}.${fileExt}`;
            const filePath = `${userId}/${uniqueName}`;

            const { data, error } = await supabase.storage
                .from("users")
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true,
                });

            if (error) throw error;
            
            // Get public URL
            const { data: publicUrlData } = supabase.storage
                .from("users")
                .getPublicUrl(filePath);
                
            return publicUrlData.publicUrl;
        };

        const result = {};
        const updatesToDb = {};

        for (const file of files) {
            const dbColumn = file.fieldname;
            const fileExt = file.mimetype.split('/')[1] || 'jpg';
            const publicUrl = await uploadFile(file, dbColumn, fileExt);
            
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