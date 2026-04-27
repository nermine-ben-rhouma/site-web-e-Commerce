package com.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void envoyerEmailVerification(String destinataire, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(destinataire);
            helper.setSubject("🛒 ShopApp - Confirmez votre email");
            helper.setText(buildEmailHtml(token), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Erreur envoi email: " + e.getMessage());
        }
    }

    private String buildEmailHtml(String token) {
        String verificationUrl = "http://localhost:3000/verify-email?token=" + token;
        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #4f46e5; padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">🛒 ShopApp</h1>
                </div>
                <div style="padding: 30px; background: #f9fafb;">
                    <h2 style="color: #1f2937;">Confirmez votre email</h2>
                    <p style="color: #6b7280;">
                        Merci de vous être inscrit sur ShopApp ! 
                        Cliquez sur le bouton ci-dessous pour confirmer votre adresse email.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" 
                           style="background: #4f46e5; color: white; padding: 15px 30px; 
                                  border-radius: 8px; text-decoration: none; font-weight: bold;">
                            ✅ Confirmer mon email
                        </a>
                    </div>
                    <p style="color: #9ca3af; font-size: 12px;">
                        Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, ignorez cet email.
                    </p>
                </div>
            </div>
            """.formatted(verificationUrl);
    }
}