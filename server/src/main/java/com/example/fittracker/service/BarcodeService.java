package com.example.fittracker.service;

import com.example.fittracker.api.dto.FoodScanResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class BarcodeService {

    private static final String OPEN_FOOD_FACTS_URL = "https://world.openfoodfacts.org/api/v2/product/";
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public BarcodeService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public FoodScanResult lookupBarcode(String barcode) throws Exception {
        String url = OPEN_FOOD_FACTS_URL + barcode + ".json";

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("User-Agent", "FitTracker/1.0")
            .GET()
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Product not found");
        }

        JsonNode root = objectMapper.readTree(response.body());

        if (root.path("status").asInt() != 1) {
            throw new RuntimeException("Product not found in database");
        }

        JsonNode product = root.path("product");
        JsonNode nutriments = product.path("nutriments");

        String name = product.path("product_name").asText("Unknown Product");
        String brand = product.path("brands").asText(null);

        int calories = (int) nutriments.path("energy-kcal_100g").asDouble(0);
        double protein = nutriments.path("proteins_100g").asDouble(0);
        double carbs = nutriments.path("carbohydrates_100g").asDouble(0);
        double fat = nutriments.path("fat_100g").asDouble(0);

        String servingSize = product.path("serving_size").asText("100g");

        String nutriScore = null;
        if (product.has("nutriscore_grade") && !product.path("nutriscore_grade").isNull()) {
            String grade = product.path("nutriscore_grade").asText("").toLowerCase();
            if (!grade.isBlank() && "abcde".contains(grade)) {
                nutriScore = grade;
            }
        }

        Integer novaGroup = null;
        if (product.has("nova_group") && !product.path("nova_group").isNull()) {
            int nova = product.path("nova_group").asInt(0);
            if (nova >= 1 && nova <= 4) {
                novaGroup = nova;
            }
        }

        return new FoodScanResult(
            name,
            brand,
            calories,
            protein,
            carbs,
            fat,
            servingSize,
            1.0,
            "barcode",
            nutriScore,
            novaGroup
        );
    }
}
