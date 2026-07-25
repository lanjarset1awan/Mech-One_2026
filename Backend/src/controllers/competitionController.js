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
            .select("status, competition_type, registrations, proposal_title, team_name, university, member_1, member_2, member_3, member_4, member_5, payment_proof_url")
            .eq("user_id", userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is 'No rows found'
            return res.status(400).json({ error: error.message });
        }

        if (!data) {
            return res.json({ registered: false });
        }

        let paymentProofFullUrl = data.payment_proof_url;
        if (paymentProofFullUrl && !paymentProofFullUrl.startsWith("http")) {
            const { data: publicUrlData } = supabase.storage
                .from("payment")
                .getPublicUrl(paymentProofFullUrl);
            paymentProofFullUrl = publicUrlData ? publicUrlData.publicUrl : paymentProofFullUrl;
        }

        let proposalFullUrl = data.registrations;
        if (proposalFullUrl && !proposalFullUrl.startsWith("http")) {
            const { data: publicUrlData } = supabase.storage
                .from("submition")
                .getPublicUrl(proposalFullUrl);
            proposalFullUrl = publicUrlData ? publicUrlData.publicUrl : proposalFullUrl;
        }

        res.json({ 
            registered: true, 
            status: data.status, 
            type: data.competition_type,
            registrations: proposalFullUrl,
            proposal_title: data.proposal_title,
            team_name: data.team_name,
            university: data.university,
            member_1: data.member_1,
            member_2: data.member_2,
            member_3: data.member_3,
            member_4: data.member_4,
            member_5: data.member_5,
            payment_proof_url: paymentProofFullUrl
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateRegistration = async (req, res) => {
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
        const { data: existing, error: fetchErr } = await supabase
            .from("registrations")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (fetchErr || !existing) {
            return res.status(400).json({ error: "Anda belum terdaftar di kompetisi apa pun." });
        }

        const currentCompType = existing.competition_type || competition_type;

        if (currentCompType === "SEM") {
            if (!team_name || !university || !member_1) {
                return res.status(400).json({ error: "Nama Lengkap, Perguruan Tinggi, dan Nama Peserta wajib diisi." });
            }
        } else {
            if (!team_name || !university || !member_1 || !member_2 || !member_3) {
                return res.status(400).json({ error: "Nama Tim, Perguruan Tinggi, Ketua, Anggota 2, dan Anggota 3 wajib diisi." });
            }
        }

        let paymentProofPath = existing.payment_proof_url;
        const file = req.file;

        if (file) {
            if (!file.mimetype.startsWith("image/")) {
                return res.status(400).json({ error: "Format file bukti pembayaran harus gambar (JPG, PNG)!" });
            }
            if (file.size > 500 * 1024) {
                return res.status(400).json({ error: "Ukuran file bukti pembayaran maksimal 500 KB!" });
            }

            if (existing.payment_proof_url) {
                await supabase.storage.from("payment").remove([existing.payment_proof_url]);
            }

            const originalName = file.originalname || "image.png";
            const fileExt = originalName.split(".").pop();
            const uniqueName = `payment_proof_${Date.now()}.${fileExt}`;
            const filePath = `${userId}/${uniqueName}`;

            const { data: upload, error: uploadErr } = await supabase.storage
                .from("payment")
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true,
                });

            if (uploadErr) return res.status(500).json({ error: uploadErr.message });

            paymentProofPath = upload.path;
        }

        const updatePayload = {
            team_name,
            university,
            member_1,
            member_2: currentCompType === "SEM" ? null : member_2,
            member_3: currentCompType === "SEM" ? null : member_3,
            member_4: (currentCompType === "SEM" || currentCompType === "BPC") ? null : member_4,
            member_5: (currentCompType === "SEM" || currentCompType === "BPC") ? null : member_5,
            payment_proof_url: paymentProofPath,
        };

        const { data, error: dbError } = await supabase
            .from("registrations")
            .update(updatePayload)
            .eq("user_id", userId)
            .select();

        if (dbError) return res.status(400).json({ error: dbError.message });

        res.json({ success: true, data });
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
            .select("id, competition_type, registrations")
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

        let proposalPath = reg.registrations;

        if (file) {
            const originalName = file.originalname || "proposal.pdf";
            const fileExt = originalName.split(".").pop().toLowerCase();
            const allowedExts = ["pdf", "zip", "rar", "7z"];

            if (!allowedExts.includes(fileExt)) {
                return res.status(400).json({ error: "Format berkas tidak didukung! Format yang diperbolehkan: PDF, ZIP, RAR." });
            }

            if (file.size > 5 * 1024 * 1024) { // 5 MB
                return res.status(400).json({ error: "Ukuran file proposal maksimal 5 MB." });
            }

            const uniqueName = `proposal_${Date.now()}.${fileExt}`;
            const filePath = `${userId}/${uniqueName}`;

            const { data: upload, error: uploadError } = await supabase.storage
                .from("submition")
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true,
                });

            if (uploadError) return res.status(500).json({ error: uploadError.message });
            proposalPath = upload.path;
        } else if (!proposalPath) {
            return res.status(400).json({ error: "Silakan pilih berkas proposal terlebih dahulu." });
        }

        const { error: dbError } = await supabase
            .from("registrations")
            .update({ 
                registrations: proposalPath,
                proposal_title: proposal_title
            })
            .eq("user_id", userId);

        if (dbError) return res.status(400).json({ error: dbError.message });

        res.json({ success: true, path: proposalPath, proposal_title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};