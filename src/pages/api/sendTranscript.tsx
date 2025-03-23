import { createTransport } from "nodemailer";
import axios from "axios";

const API_KEY = "d457c0e6-3913-4137-86d2-6f7340261ba7"; // VAPI Key
const SENDER_EMAIL = "main.hackbuddy@gmail.com";
const SENDER_PASSWORD = "your-app-password"; // Use an App Password instead of the real password

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { call_id, email } = req.body;

    if (!call_id || !email) {
        return res.status(400).json({ error: "Missing call_id or email parameter" });
    }

    try {
        // 1️⃣ Fetch the call transcript from VAPI
        const response = await axios.get(`https://api.vapi.ai/calls/${call_id}`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
        });

        const transcript = response.data?.analysis?.summary;
        if (!transcript) {
            return res.status(404).json({ error: "Transcript not found" });
        }

        // 2️⃣ Configure Nodemailer for sending email
        const transporter = createTransport({
            service: "Gmail",
            auth: {
                user: SENDER_EMAIL,
                pass: SENDER_PASSWORD,
            },
        });

        const mailOptions = {
            from: SENDER_EMAIL,
            to: email,
            subject: `Call Transcript for ${call_id}`,
            text: `Hello,\n\nHere is the transcript of the call:\n\n${transcript}`,
        };

        // 3️⃣ Send the email
        const info = await transporter.sendMail(mailOptions);

        return res.status(200).json({ status: "success", messageId: info.messageId });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
