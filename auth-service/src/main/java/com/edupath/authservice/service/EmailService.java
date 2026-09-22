package com.edupath.authservice.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:gokulnath.ad.1827@gmail.com}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public boolean sendPasswordResetEmail(String toEmail, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        log.info("[EmailService] Generating password reset email for recipient: {}", toEmail);
        log.info("[EmailService] Generated Reset URL: {}", resetUrl);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "EduPath AI Security");
            helper.setTo(toEmail);
            helper.setSubject("Reset Your EduPath AI Password");

            String htmlContent = "<div style=\"font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;\">"
                    + "  <div style=\"text-align: center; margin-bottom: 25px;\">"
                    + "    <h2 style=\"color: #75070C; margin: 0; font-size: 24px; font-weight: 700;\">EduPath <span style=\"color: #1e293b;\">AI</span></h2>"
                    + "  </div>"
                    + "  <h3 style=\"color: #0f172a; margin-top: 0;\">Password Reset Request</h3>"
                    + "  <p style=\"color: #475569; font-size: 15px; line-height: 1.6;\">We received a request to reset the password for your EduPath AI account. Click the button below to reset your password. This link is valid for 30 minutes.</p>"
                    + "  <div style=\"text-align: center; margin: 30px 0;\">"
                    + "    <a href=\"" + resetUrl + "\" style=\"background-color: #75070C; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 15px;\">Reset Password</a>"
                    + "  </div>"
                    + "  <p style=\"color: #64748b; font-size: 13px; line-height: 1.5;\">If button does not work, copy and paste this link into your browser:<br>"
                    + "  <a href=\"" + resetUrl + "\" style=\"color: #75070C; word-break: break-all;\">" + resetUrl + "</a></p>"
                    + "  <hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;\">"
                    + "  <p style=\"color: #94a3b8; font-size: 12px; text-align: center;\">If you did not request a password reset, please ignore this email.</p>"
                    + "</div>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("[EmailService] SUCCESS: Password reset email successfully dispatched via SMTP to {}", toEmail);
            return true;
        } catch (Exception e) {
            log.error("[EmailService] ERROR sending SMTP email to {}: {}. Reset Link was: {}", toEmail, e.getMessage(), resetUrl);
            return false;
        }
    }
}
