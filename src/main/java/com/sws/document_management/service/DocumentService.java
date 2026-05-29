package com.sws.document_management.service;

import com.sws.document_management.model.Document;
import com.sws.document_management.model.Notification;
import com.sws.document_management.repository.DocumentRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final NotificationService notificationService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadDir, e);
        }
    }

    @Transactional
    public List<Document> uploadFiles(List<MultipartFile> files) {
        List<Document> savedDocuments = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                // Generate unique filename to avoid collisions
                String uniqueFilename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

                // Save file to disk
                Path targetLocation = uploadPath.resolve(uniqueFilename);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                // Create and save Document entity
                Document document = Document.builder()
                        .filename(uniqueFilename)
                        .originalFilename(file.getOriginalFilename())
                        .fileSize(file.getSize())
                        .fileType(file.getContentType())
                        .status(Document.Status.COMPLETE)
                        .filePath(targetLocation.toString())
                        .build();

                Document saved = documentRepository.save(document);
                savedDocuments.add(saved);

            } catch (IOException e) {
                // Save failed document record
                Document failedDoc = Document.builder()
                        .filename(file.getOriginalFilename())
                        .originalFilename(file.getOriginalFilename())
                        .fileSize(file.getSize())
                        .fileType(file.getContentType())
                        .status(Document.Status.FAILED)
                        .build();
                documentRepository.save(failedDoc);

                notificationService.saveNotification(
                        "Failed to upload file: " + file.getOriginalFilename(),
                        Notification.Type.ERROR
                );
            }
        }

        // Send notifications based on file count
        if (files.size() > 3) {
            notificationService.saveNotification(
                    files.size() + " files uploaded successfully at " +
                            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                    Notification.Type.SUCCESS
            );
        } else {
            for (Document doc : savedDocuments) {
                notificationService.saveNotification(
                        "File uploaded successfully: " + doc.getOriginalFilename(),
                        Notification.Type.SUCCESS
                );
            }
        }

        return savedDocuments;
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll(Sort.by(Sort.Direction.DESC, "uploadDate"));
    }

    public Resource getFileAsResource(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        try {
            Path filePath = Paths.get(document.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found or not readable: " + document.getOriginalFilename());
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("File not found: " + document.getOriginalFilename(), e);
        }
    }
}
