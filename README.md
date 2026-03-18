# testing


https://prod.liveshare.vsengsaas.visualstudio.com/join?D2B03B2C774D7D2232BDFD40E77AE916A0CE
https://prod.liveshare.vsengsaas.visualstudio.com/join?65320D20FBA1FA9F3688C5FFFCF22A39CEE6

7. GKE Persistent Volume as intermediate storage:
   - The PV will be mounted in the GKE pod at a path like 
     /mnt/transfer-temp (configured in application yaml)
   - When running locally, use /tmp/transfer as the temp path
   - The tempStoragePath in S3ToGcsRequest should override 
     the default config path if provided
   - After successful GCS upload, always delete the temp file 
     from the PV mount path to free up space
   - Add a check: if temp directory does not exist, create it 
     before downloading
   - Log the temp file path at each step so we can monitor 
     PV usage in GKE logs
