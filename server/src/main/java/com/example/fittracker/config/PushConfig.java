package com.example.fittracker.config;

import nl.martijndwars.webpush.PushService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.security.Security;

@Configuration
public class PushConfig {

    @Value("${push.vapid.public-key:}")
    private String publicKey;

    @Value("${push.vapid.private-key:}")
    private String privateKey;

    @Value("${push.vapid.subject:mailto:admin@fit-tracker.app}")
    private String subject;

    static {
        // web-push-java needs BouncyCastle registered for ECDSA signing.
        if (Security.getProvider("BC") == null) {
            Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
        }
    }

    @Bean
    public PushService pushService() throws Exception {
        if (publicKey.isBlank() || privateKey.isBlank()) {
            // Not configured — return a bean that will be rejected on use.
            return new PushService();
        }
        PushService ps = new PushService();
        ps.setPublicKey(publicKey);
        ps.setPrivateKey(privateKey);
        ps.setSubject(subject);
        return ps;
    }

    public String getPublicKey() { return publicKey; }
    public boolean isConfigured() { return !publicKey.isBlank() && !privateKey.isBlank(); }
}
