# testing


https://prod.liveshare.vsengsaas.visualstudio.com/join?D2B03B2C774D7D2232BDFD40E77AE916A0CE
https://prod.liveshare.vsengsaas.visualstudio.com/join?65320D20FBA1FA9F3688C5FFFCF22A39CEE6
I have a Spring Boot project called "eagle-batch-entry-api".
I need to add functionality to transfer data from AWS S3 to
Google Cloud Storage (GCS) using GKE's Persistent Volume (PV)
as intermediate/temp storage.

IMPORTANT CONSTRAINTS:
- Do NOT create any CloudConfig.java or kubeconfig loading logic
- Do NOT create any k8s-deployment.yaml or kubernetes client code
- Do NOT use any Kubernetes Java client library
- Do NOT use AWS SDK - we are using a pre-signed S3 URL instead
- The PV will just be a mounted directory path (like /mnt/transfer-temp),
  treat it as a regular filesystem path
- No Spring Cloud Config needed

EXISTING PROJECT STRUCTURE:
- Package: com.cvs.eagle
- Layers: applications/, control/, dto/, service/, util/, validation/
- Already has: DataManagementController.java, DataManagementService.java
- Config files: application-default.yaml, application-dev.yaml,
  application-prod.yaml, application-qa.yaml
- Build tool: Maven (pom.xml)

WHAT I NEED YOU TO CREATE:

1. pom.xml additions:
   - Google Cloud Storage SDK dependency only
   - Nothing AWS, nothing kubernetes related

2. DTO classes in dto/ package:
   - S3ToGcsRequest.java (fields: presignedS3Url, gcsBucket,
     gcsDestinationPath, tempStoragePath)
   - S3ToGcsResult.java (fields: success, message,
     bytesTransferred, timeTaken)

3. Service class in service/ package:
   - Name it: StorageTransferService.java
   - Method 1: downloadFromPresignedUrl(presignedS3Url, tempPath)
     → downloads file from pre-signed S3 URL using plain 
     Java HttpClient (no AWS SDK), saves to temp path
   - Method 2: uploadToGcs(tempFilePath, gcsBucket, gcsDestPath)
     → uploads from temp path to GCS using GCS SDK
   - Method 3: transfer(S3ToGcsRequest)
     → orchestrates full flow: download → upload → cleanup temp file
   - Handle exceptions properly, log each step

4. Add new endpoint in DataManagementController.java:
   - POST /api/v1/transfer/s3-to-gcs
   - Accepts S3ToGcsRequest body
   - Returns S3ToGcsResult

5. application-dev.yaml additions:
   - GCS project-id config
   - temp-storage-path config (default: /tmp/transfer)
   - Use @ConfigurationProperties or @Value to bind these

6. A simple StorageTransferConfig.java in applications/ package:
   - Builds and provides Storage bean (GCS only)
   - Reads from application yaml config
   - NO AWS config, NO kubeconfig, NO kubernetes client

KEEP IT SIMPLE:
- Use plain Java HttpClient to download from pre-signed URL
- No AWS SDK dependency at all
- Standard Spring Boot patterns only
- Treat PV mount path as just a regular file system path
- Add proper logging using @Slf4j
- Add @Service, @RestController, @Configuration annotations correctly
