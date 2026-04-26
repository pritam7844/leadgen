package com.leadflow.automation.email;

import com.leadflow.common.exception.LeadFlowException;
import com.leadflow.common.util.EncryptionUtil;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.util.List;
import java.util.Map;
import java.util.Properties;

@Service
public class EmailService {

    private final EmailProviderRepository emailProviderRepository;
    private final EncryptionUtil encryptionUtil;

    public EmailService(EmailProviderRepository emailProviderRepository, EncryptionUtil encryptionUtil) {
        this.emailProviderRepository = emailProviderRepository;
        this.encryptionUtil = encryptionUtil;
    }

    public List<EmailProvider> findByWorkspace(String workspaceId) {
        List<EmailProvider> providers = emailProviderRepository.findByWorkspaceId(workspaceId);
        providers.forEach(p -> p.setEncryptedPassword(encryptionUtil.mask(p.getEncryptedPassword())));
        return providers;
    }

    public EmailProvider create(String workspaceId, EmailProvider provider) {
        provider.setWorkspaceId(workspaceId);
        provider.setEncryptedPassword(encryptionUtil.encrypt(provider.getEncryptedPassword()));
        if (provider.isDefault()) {
            clearDefaults(workspaceId);
        }
        return emailProviderRepository.save(provider);
    }

    public EmailProvider update(String workspaceId, String id, EmailProvider updated) {
        EmailProvider provider = getById(workspaceId, id);
        if (updated.getLabel() != null) provider.setLabel(updated.getLabel());
        if (updated.getHost() != null) provider.setHost(updated.getHost());
        if (updated.getPort() > 0) provider.setPort(updated.getPort());
        if (updated.getUsername() != null) provider.setUsername(updated.getUsername());
        if (updated.getEncryptedPassword() != null && !updated.getEncryptedPassword().startsWith("****")) {
            provider.setEncryptedPassword(encryptionUtil.encrypt(updated.getEncryptedPassword()));
        }
        if (updated.getFromName() != null) provider.setFromName(updated.getFromName());
        if (updated.getFromEmail() != null) provider.setFromEmail(updated.getFromEmail());
        if (updated.getReplyToEmail() != null) provider.setReplyToEmail(updated.getReplyToEmail());
        if (updated.isDefault()) {
            clearDefaults(workspaceId);
            provider.setDefault(true);
        }
        return emailProviderRepository.save(provider);
    }

    public void delete(String workspaceId, String id) {
        emailProviderRepository.delete(getById(workspaceId, id));
    }

    public Map<String, Object> testConnection(String workspaceId, String id) {
        EmailProvider provider = getById(workspaceId, id);
        try {
            JavaMailSenderImpl sender = buildSender(provider);
            sender.testConnection();
            return Map.of("success", true, "message", "Connection successful");
        } catch (Exception e) {
            return Map.of("success", false, "message", e.getMessage());
        }
    }

    public void sendEmail(String workspaceId, String to, String subject, String body) {
        EmailProvider provider = emailProviderRepository.findByWorkspaceIdAndIsDefaultTrue(workspaceId)
                .orElseThrow(() -> new LeadFlowException("No default email provider configured"));
        try {
            JavaMailSenderImpl sender = buildSender(provider);
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(provider.getFromEmail(), provider.getFromName());
            helper.setTo(to);
            if (provider.getReplyToEmail() != null) helper.setReplyTo(provider.getReplyToEmail());
            helper.setSubject(subject);
            helper.setText(body, true);
            sender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    private EmailProvider getById(String workspaceId, String id) {
        EmailProvider p = emailProviderRepository.findById(id)
                .orElseThrow(() -> new LeadFlowException("Email provider not found", HttpStatus.NOT_FOUND));
        if (!p.getWorkspaceId().equals(workspaceId))
            throw new LeadFlowException("Access denied", HttpStatus.FORBIDDEN);
        return p;
    }

    private void clearDefaults(String workspaceId) {
        emailProviderRepository.findByWorkspaceId(workspaceId).forEach(p -> {
            p.setDefault(false);
            emailProviderRepository.save(p);
        });
    }

    private JavaMailSenderImpl buildSender(EmailProvider provider) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(provider.getHost());
        sender.setPort(provider.getPort());
        sender.setUsername(provider.getUsername());
        sender.setPassword(encryptionUtil.decrypt(provider.getEncryptedPassword()));
        Properties props = sender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        return sender;
    }
}
