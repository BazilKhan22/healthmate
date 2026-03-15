import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_PUBLIC_KEY = "jNUpvuaqPRLmk8pr4";
const EMAILJS_SERVICE_ID = "service_qs7ehie";
const EMAILJS_TEMPLATE_ID = "template_3qohydl";

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendReportEmail = async (toEmail, reportTitle, reportData) => {
    try {
        console.log('📧 Sending email via EmailJS...');
        
        const templateParams = {
            to_email: toEmail,
            report_title: reportTitle,
            report_summary: reportData.aiSummary?.english || 'No summary available',
            report_link: window.location.origin + '/reports',
            report_date: new Date(reportData.reportDate).toLocaleDateString(),
            user_name: reportData.user?.name || 'HealthMate User'
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