import supabase from "../config/supabase.js";

export const registerCompetition = async (req, res) => {
    const userId = req.user.id;

    const {
        team_name,
        university,
        member_1,
        member_2,
        member_3,
        member_4,
        member_5,
        competition_type,
    } = req.body;

    try {
        // Check if user already registered
        const { data: existing } = await supabase
            .from("registrations")
            .select("id")
            .eq("user_id", userId)
            .single();
            
        if (existing) {
            return res.status(400).json({ error: "User already registered for a competition." });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        
        // TODO: Saat ini limit 10 MB. Ubah ke 5 MB nanti jika diperlukan (5 * 1024 * 1024)
        if (file.size > 10 * 1024 * 1024) {
            return res.status(400).json({ error: "Ukuran file proposal maksimal 10 MB!" });
        }

        const { data: upload, error } = await supabase.storage
            .from("registrations")
            .upload(`${userId}/team.pdf`, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

        if (error) return res.status(500).json({ error: error.message });

        const pdfPath = upload.path;

        const { data, error: dbError } = await supabase
            .from("registrations")
            .insert([
                {
                    user_id: userId,
                    team_name,
                    university,
                    member_1,
                    member_2,
                    member_3,
                    member_4,
                    member_5,
                    competition_type,
                    supporting_document_pdf: pdfPath,
                },
            ]);

        if (dbError) return res.status(400).json({ error: dbError.message });

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const checkRegistrationStatus = async (req, res) => {
    const userId = req.user.id;
    try {
        const { data, error } = await supabase
            .from("registrations")
            .select("status, competition_type")
            .eq("user_id", userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is 'No rows found'
            return res.status(400).json({ error: error.message });
        }

        if (!data) {
            return res.json({ registered: false });
        }

        res.json({ registered: true, status: data.status, type: data.competition_type });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};