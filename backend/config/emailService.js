import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendReportEmail = async (toEmail, reportTitle, reportData) => {
    try {
        // Convert base64 to buffer for attachment
        let attachment = null;
        if (reportData.fileUrl && reportData.fileUrl.startsWith('data:')) {
            const matches = reportData.fileUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                attachment = {
                    filename: reportData.fileName || 'report.' + (reportData.fileType || 'jpg'),
                    content: Buffer.from(matches[2], 'base64'),
                    contentType: matches[1]
                };
            }
        }

        const mailOptions = {
            from: `"HealthMate" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `🏥 HealthMate: Medical Report - ${reportTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header with Logo -->
                    <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                        <h1 style="color: white; margin: 0; font-size: 32px;">🏥 HealthMate</h1>
                        <p style="color: white; margin: 5px 0 0; font-size: 16px;">Your AI-Powered Health Assistant</p>
                    </div>
                    
                    <!-- Report Preview Section -->
                    <div style="margin-bottom: 30px; text-align: center;">
                        <h2 style="color: #374151; margin-bottom: 15px;">📄 Report Preview</h2>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 2px dashed #2563eb;">
                            <p style="color: #2563eb; font-weight: 600; margin-bottom: 10px;">
                                ${reportData.fileType === 'pdf' ? '📄 PDF Document' : '🖼️ Image'}
                            </p>
                            <p style="color: #64748b; font-size: 14px;">
                                The original report file is attached with this email.
                            </p>
                            ${reportData.fileType !== 'pdf' ? `
                                <img src="${reportData.fileUrl}" alt="Report Preview" style="max-width: 100%; max-height: 300px; border-radius: 8px; margin-top: 15px; border: 1px solid #e2e8f0;" />
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Report Details -->
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="color: #2563eb; margin-top: 0;">📋 Report Details</h2>
                        <p><strong>Title:</strong> ${reportTitle}</p>
                        <p><strong>Type:</strong> ${reportData.reportType?.replace('_', ' ').toUpperCase() || 'Other'}</p>
                        <p><strong>Date:</strong> ${new Date(reportData.reportDate).toLocaleDateString()}</p>
                        <p><strong>Shared on:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>

                    <!-- AI Analysis -->
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #374151;">📝 AI Analysis</h3>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                            <p><strong>English:</strong> ${reportData.aiSummary?.english || 'Analysis pending'}</p>
                        </div>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                            <p><strong>اردو:</strong> ${reportData.aiSummary?.urdu || 'تجزیہ زیر التواء'}</p>
                        </div>
                    </div>

                    ${reportData.dietaryAdvice ? `
                    <!-- Dietary Advice -->
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #374151;">🥗 Dietary Advice</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px;">
                                <h4 style="color: #10b981; margin: 0 0 10px;">✅ Recommended Foods</h4>
                                <ul style="margin: 0; padding-left: 20px;">
                                    ${(reportData.dietaryAdvice.recommended || []).map(food => `<li>${food}</li>`).join('')}
                                </ul>
                            </div>
                            <div style="background: #fef2f2; padding: 15px; border-radius: 8px;">
                                <h4 style="color: #ef4444; margin: 0 0 10px;">🚫 Foods to Avoid</h4>
                                <ul style="margin: 0; padding-left: 20px;">
                                    ${(reportData.dietaryAdvice.avoid || []).map(food => `<li>${food}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    ${reportData.doctorQuestions ? `
                    <!-- Questions for Doctor -->
                    <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #2563eb; margin: 0 0 10px;">❓ Questions for Your Doctor</h3>
                        <ul style="margin: 0; padding-left: 20px;">
                            ${(reportData.doctorQuestions || []).map(q => `<li>${q}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    ${reportData.homeRemedies ? `
                    <!-- Home Remedies -->
                    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #d97706; margin: 0 0 10px;">🏠 Home Remedies</h3>
                        <ul style="margin: 0; padding-left: 20px;">
                            ${(reportData.homeRemedies || []).map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                        <p style="color: #64748b; font-size: 12px;">
                            This report was shared via <strong>HealthMate</strong> - Your AI-Powered Health Assistant<br>
                            ⚕️ Always consult with your healthcare provider for medical advice.
                        </p>
                        <p style="color: #9ca3af; font-size: 11px; margin-top: 10px;">
                            © ${new Date().getFullYear()} HealthMate. All rights reserved.
                        </p>
                    </div>
                </div>
            `,
            attachments: attachment ? [attachment] : []
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email error:', error);
        throw error;
    }
};