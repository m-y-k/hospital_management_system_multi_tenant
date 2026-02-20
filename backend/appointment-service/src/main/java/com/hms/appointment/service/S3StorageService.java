package com.hms.appointment.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import jakarta.annotation.PostConstruct;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "storage.type", havingValue = "s3")
public class S3StorageService implements StorageService {

    private S3Client s3Client;

    @Value("${aws.s3.bucket:hms-images}")
    private String bucket;

    @Value("${aws.s3.region:us-east-1}")
    private String region;

    @Value("${aws.s3.accessKey:}")
    private String accessKey;

    @Value("${aws.s3.secretKey:}")
    private String secretKey;

    @PostConstruct
    public void init() {
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        try {
            String key = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(key)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );
            return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to S3: " + e.getMessage(), e);
        }
    }
}
