package com.hms.appointment.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "storage.type", havingValue = "minio", matchIfMissing = true)
public class MinioStorageService implements StorageService {

    private MinioClient minioClient;

    @Value("${minio.endpoint:http://localhost:9000}")
    private String endpoint;

    @Value("${minio.accessKey:minioadmin}")
    private String accessKey;

    @Value("${minio.secretKey:minioadmin}")
    private String secretKey;

    @Value("${minio.bucket:hms-images}")
    private String bucket;

    @PostConstruct
    public void init() {
        this.minioClient = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();

        try {
            boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
            if (!exists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not connect to MinIO. Image uploads will fail. " + e.getMessage());
        }
    }

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        try {
            String fileName = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
            return endpoint + "/" + bucket + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to MinIO: " + e.getMessage(), e);
        }
    }
}
