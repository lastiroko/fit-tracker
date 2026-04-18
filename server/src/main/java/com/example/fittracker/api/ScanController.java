package com.example.fittracker.api;

import com.example.fittracker.api.dto.BarcodeScanRequest;
import com.example.fittracker.api.dto.FoodScanResult;
import com.example.fittracker.api.dto.PhotoScanRequest;
import com.example.fittracker.service.BarcodeService;
import com.example.fittracker.service.FoodRecognitionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scan")
public class ScanController {

    private final BarcodeService barcodeService;
    private final FoodRecognitionService foodRecognitionService;

    public ScanController(BarcodeService barcodeService, FoodRecognitionService foodRecognitionService) {
        this.barcodeService = barcodeService;
        this.foodRecognitionService = foodRecognitionService;
    }

    @PostMapping("/barcode")
    public ResponseEntity<FoodScanResult> scanBarcode(@RequestBody BarcodeScanRequest request) {
        try {
            FoodScanResult result = barcodeService.lookupBarcode(request.barcode());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/photo")
    public ResponseEntity<FoodScanResult> scanPhoto(@RequestBody PhotoScanRequest request) {
        try {
            FoodScanResult result = foodRecognitionService.analyzeImage(request.image());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
