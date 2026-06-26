import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = "jNUpvuaqPRLmk8pr4";
const EMAILJS_SERVICE_ID = "service_qs7ehie";
const EMAILJS_TEMPLATE_ID = "template_3qohydl";

emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendReportEmail = async (toEmail, reportTitle, reportData, reportLink) => {
    try {
        console.log('📧 Sending email via EmailJS...');

        // Image embed nahi karni — sirf report type batao
        const fileInfo = reportData.fileType?.includes('pdf') 
            ? '📄 PDF Document' 
            : '🖼️ Image Report';

        const templateParams = {
            to_email: toEmail,
            report_title: reportTitle,
            report_summary: reportData.aiSummary?.english || 'No summary available',
            report_link: reportLink,
            report_date: new Date(reportData.reportDate).toLocaleDateString(),
            user_name: reportData.user?.name || 'HealthMate User',
            report_image: `<p style="background:#f0f4ff;padding:12px;border-radius:8px;text-align:center;font-size:16px;">${fileInfo} — <a href="${reportLink}" style="color:#667eea;">Click here to view report</a></p>`,
            doctor_questions: (reportData.doctorQuestions || []).map((q, i) => `${i+1}. ${q}`).join('<br/>'),
            dietary_avoid: (reportData.dietaryAdvice?.avoid || []).join(', '),
            dietary_recommended: (reportData.dietaryAdvice?.recommended || []).join(', '),
        };

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );

        console.log('✅ Email sent:', response);
        return { success: true };

    } catch (error) {
        console.error('❌ Email error:', error);
        throw error;
    }
};