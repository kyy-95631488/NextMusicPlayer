import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { email, subject, message } = await req.json();

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: "hendriansyahrizkysetiawan@gmail.com, " + email, 
            subject: subject,
            replyTo: email,
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                background-color: #e9f7ff;
                                margin: 0;
                                padding: 0;
                                color: #333;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #ffffff;
                                border-radius: 12px;
                                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                            }
                            h1 {
                                color: #007bff;
                                font-size: 28px;
                                margin-bottom: 20px;
                                text-align: center;
                            }
                            p {
                                font-size: 16px;
                                line-height: 1.6;
                                color: #555;
                            }
                            .message-box {
                                background-color: #f1faff;
                                border-left: 4px solid #007bff;
                                padding: 10px 20px;
                                margin: 20px 0;
                                border-radius: 4px;
                            }
                            .footer {
                                margin-top: 30px;
                                text-align: center;
                                font-size: 14px;
                                color: #777;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>${subject}</h1>
                            <p>Thank you for reaching out to us!</p>
                            <p><strong>New message submitted:</strong></p>
                            <div class="message-box">
                                <p>${message}</p>
                            </div>
                            <div class="footer">
                                <p>&copy; 2025 Hendriansyah-Portofolio. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `,
        };
        
        // Kirim email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message });
    }
}
