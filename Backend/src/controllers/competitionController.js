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
        if (competition_type === "SEM") {
            if (!team_name || !university || !member_1) {
                return res.status(400).json({ error: "Full Name, University, and Participant Name are required." });
            }
        } else {
            if (!team_name || !university || !member_1 || !member_2 || !member_3) {
                return res.status(400).json({ error: "Team Name, University, Leader, Member 2, and Member 3 are required." });
            }
        }

        if (competition_type !== "MDC" && competition_type !== "BPC" && competition_type !== "SEM") {
            return res.status(400).json({ error: "Invalid competition type." });
        }

        if (competition_type === "BPC" && (member_4 || member_5)) {
            return res.status(400).json({ error: "BPC competition can only have exactly 3 members. Member 4 and 5 must be empty." });
        }

        if (competition_type === "SEM" && (member_2 || member_3 || member_4 || member_5)) {
            return res.status(400).json({ error: "Seminar registration can only have 1 participant. Other members must be empty." });
        }

        // Check if user already registered
        const { data: existing } = await supabase
            .from("registrations")
            .select("id")
            .eq("user_id", userId)
            .single();
            
        if (existing) {
            return res.status(400).json({ error: "User already registered for a competition." });
        }

        let paymentProofPath = null;
        if (competition_type !== "SEM") {
            const file = req.file;
            if (!file) {
                return res.status(400).json({ error: "No payment proof uploaded." });
            }
            
            if (!file.mimetype.startsWith("image/")) {
                return res.status(400).json({ error: "Format file harus gambar (JPG, PNG)!" });
            }
            
            if (file.size > 500 * 1024) {
                return res.status(400).json({ error: "Ukuran file bukti pembayaran maksimal 500 KB!" });
            }

            const originalName = file.originalname || "image.png";
            const fileExt = originalName.split(".").pop();
            const uniqueName = `payment_proof_${Date.now()}.${fileExt}`;
            const filePath = `${userId}/${uniqueName}`;

            const { data: upload, error } = await supabase.storage
                .from("payment")
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true,
                });

            if (error) return res.status(500).json({ error: error.message });

            paymentProofPath = upload.path;
        }

        const { data, error: dbError } = await supabase
            .from("registrations")
            .insert([
                {
                    user_id: userId,
                    team_name,
                    university,
                    member_1,
                    member_2: competition_type === "SEM" ? null : member_2,
                    member_3: competition_type === "SEM" ? null : member_3,
                    member_4: (competition_type === "SEM" || competition_type === "BPC") ? null : member_4,
                    member_5: (competition_type === "SEM" || competition_type === "BPC") ? null : member_5,
                    competition_type,
                    payment_proof_url: paymentProofPath,
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
            .select("status, competition_type, registrations, proposal_title")
            .eq("user_id", userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is 'No rows found'
            return res.status(400).json({ error: error.message });
        }

        if (!data) {
            return res.json({ registered: false });
        }

        res.json({ 
            registered: true, 
            status: data.status, 
            type: data.competition_type,
            registrations: data.registrations,
            proposal_title: data.proposal_title
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const uploadProposal = async (req, res) => {
    const userId = req.user.id;
    const file = req.file;
    const { proposal_title } = req.body;

    try {
        // Check if registration exists
        const { data: reg, error: regError } = await supabase
            .from("registrations")
            .select("id, competition_type")
            .eq("user_id", userId)
            .single();

        if (regError || !reg) {
            return res.status(400).json({ error: "You are not registered for any competition yet." });
        }

        if (reg.competition_type === "SEM") {
            return res.status(400).json({ error: "Seminar participants do not need to submit a proposal." });
        }

        if (!proposal_title || proposal_title.trim() === "") {
            return res.status(400).json({ error: "Proposal title is required." });
        }

        if (!file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        if (file.mimetype !== "application/pdf") {
            return res.status(400).json({ error: "Only PDF files are allowed!" });
        }

        if (file.size > 500 * 1024) { // 500 KB
            return res.status(400).json({ error: "Proposal size must not exceed 500 KB." });
        }

        const originalName = file.originalname || "proposal.pdf";
        const fileExt = originalName.split(".").pop();
        const uniqueName = `proposal_${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${uniqueName}`;

        const { data: upload, error: uploadError } = await supabase.storage
            .from("submition")
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

        if (uploadError) return res.status(500).json({ error: uploadError.message });

        const { error: dbError } = await supabase
            .from("registrations")
            .update({ 
                registrations: upload.path,
                proposal_title: proposal_title
            })
            .eq("user_id", userId);

        if (dbError) return res.status(400).json({ error: dbError.message });

        res.json({ success: true, path: upload.path, proposal_title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};