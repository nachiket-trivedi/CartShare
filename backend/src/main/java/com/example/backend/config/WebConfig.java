package com.example.backend.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * class defining the necessary web configurations for the project
 */
@SuppressWarnings("deprecation")
@Configuration
@EnableWebMvc
public class WebConfig extends WebMvcConfigurerAdapter  {

@Override
public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {

	configurer.favorPathExtension(false).
    favorParameter(true).
    ignoreAcceptHeader(true).
    useJaf(false).
    defaultContentType(MediaType.APPLICATION_JSON).
    mediaType("xml", MediaType.APPLICATION_XML).
    mediaType("json", MediaType.APPLICATION_JSON);
  }

}
