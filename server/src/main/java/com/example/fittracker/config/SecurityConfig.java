package com.example.fittracker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class SecurityConfig {

    @Value("${app.auth.allowed-emails:}")
    private String allowedEmailsRaw;

    @Value("${app.auth.post-login-redirect:/}")
    private String postLoginRedirect;

    @Bean
    @Profile("!prod")
    public SecurityFilterChain devFilterChain(HttpSecurity http) throws Exception {
        // Dev profile: no auth, so curl + local dev still work as before.
        http.csrf(c -> c.disable())
            .authorizeHttpRequests(a -> a.anyRequest().permitAll());
        return http.build();
    }

    @Bean
    @Profile("prod")
    public SecurityFilterChain prodFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(c -> c.disable()) // session-cookie SPA, same-origin only via Vercel proxy
            .authorizeHttpRequests(a -> a
                .requestMatchers("/actuator/health", "/actuator/health/**").permitAll()
                .requestMatchers("/api/auth/me").permitAll()
                .requestMatchers("/oauth2/**", "/login/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(s -> s
                // Keep the same JSESSIONID across authentication so the cookie the
                // browser has from /oauth2/authorization/google stays valid after
                // /login/oauth2/code/google — avoids relying on Vercel's proxy
                // forwarding the new Set-Cookie on the post-login 302.
                .sessionFixation(f -> f.none())
            )
            .oauth2Login(o -> o
                .userInfoEndpoint(u -> u.userService(allowlistUserService()))
                .successHandler(successHandler())
                .failureHandler(new SimpleUrlAuthenticationFailureHandler("/?auth=denied"))
            )
            .logout(l -> l
                .logoutUrl("/logout")
                .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.NO_CONTENT))
            )
            .exceptionHandling(e -> e
                .defaultAuthenticationEntryPointFor(
                    (req, res, ex) -> res.sendError(HttpStatus.UNAUTHORIZED.value()),
                    r -> r.getRequestURI().startsWith("/api/")
                )
            );
        return http.build();
    }

    private AuthenticationSuccessHandler successHandler() {
        SimpleUrlAuthenticationSuccessHandler h = new SimpleUrlAuthenticationSuccessHandler(postLoginRedirect);
        h.setAlwaysUseDefaultTargetUrl(true);
        return h;
    }

    /**
     * Wrap the default OAuth2 user service with an email allowlist.
     * Only emails in {@code app.auth.allowed-emails} (comma-separated) can sign in.
     */
    private OAuth2UserService<OAuth2UserRequest, OAuth2User> allowlistUserService() {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        Set<String> allowed = parseAllowlist(allowedEmailsRaw);

        return request -> {
            OAuth2User user = delegate.loadUser(request);
            String email = (String) user.getAttributes().getOrDefault("email", "");
            if (email.isBlank() || !allowed.contains(email.toLowerCase())) {
                throw new OAuth2AuthenticationException(new OAuth2Error("access_denied",
                    "Email not in allowlist: " + email, null));
            }
            return user;
        };
    }

    private static Set<String> parseAllowlist(String raw) {
        if (raw == null || raw.isBlank()) return Set.of();
        return new HashSet<>(Arrays.asList(raw.toLowerCase().split("\\s*,\\s*")));
    }
}
