package com.vaya.locit;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LocitApplication {

	public static void main(String[] args) {

		Dotenv dotenv = Dotenv.configure()
				.directory(".")
				.ignoreIfMissing()
				.load();

		if (dotenv.get("DB_USERNAME") != null) {
			System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		}
		if (dotenv.get("DB_PASSWORD") != null) {
			System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		}

		SpringApplication.run(LocitApplication.class, args);
	}
}