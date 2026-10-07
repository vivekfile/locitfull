package com.vaya.locit.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${locit.frontend.path:../locitFrontend}")
    private String frontendPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path absolutePath = Paths.get(frontendPath).toAbsolutePath().normalize();
        String location = "file:" + absolutePath + "/";

        registry.addResourceHandler(
                        "/auth/**",
                        "/sign-up/**",
                        "/main/**",
                        "/cart/**",
                        "/seller-page/**",
                        "/js/**",
                        "/assets/**"
                )
                .addResourceLocations(location);
    }
}
