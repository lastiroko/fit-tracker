package com.example.fittracker.service;

import com.example.fittracker.api.dto.FoodScanResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class FoodRecognitionService {

    private static final String ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

    @Value("${anthropic.api.key:}")
    private String apiKey;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public FoodRecognitionService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public FoodScanResult analyzeImage(String base64Image) throws Exception {
        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("Anthropic API key not configured");
        }

        String mediaType = "image/jpeg";
        String imageData = base64Image;

        if (base64Image.startsWith("data:")) {
            int commaIdx = base64Image.indexOf(',');
            if (commaIdx > 0) {
                String header = base64Image.substring(0, commaIdx);
                if (header.contains("image/png")) {
                    mediaType = "image/png";
                } else if (header.contains("image/webp")) {
                    mediaType = "image/webp";
                }
                imageData = base64Image.substring(commaIdx + 1);
            }
        }

        String prompt = """
            Analyze this food image and provide nutritional information.

            Respond in this exact JSON format only, with no additional text:
            {
              "name": "food name",
              "calories": number (estimated per serving),
              "protein": number (grams),
              "carbs": number (grams),
              "fat": number (grams),
              "servingSize": "estimated serving size",
              "confidence": number (0.0 to 1.0, how confident you are in the identification),
              "nutriScore": "a" | "b" | "c" | "d" | "e" (estimated Nutri-Score grade; a = most nutritious, e = least),
              "novaGroup": 1 | 2 | 3 | 4 (estimated NOVA classification; 1 = unprocessed, 4 = ultra-processed)
            }

            Be reasonable with estimates. If you cannot identify the food, use confidence 0.3 or lower.
            Omit nutriScore or novaGroup (or set them to null) if you genuinely cannot estimate them.
            """;

        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", "claude-sonnet-4-20250514");
        requestBody.put("max_tokens", 1024);

        ArrayNode messages = requestBody.putArray("messages");
        ObjectNode message = messages.addObject();
        message.put("role", "user");

        ArrayNode content = message.putArray("content");

        ObjectNode imageContent = content.addObject();
        imageContent.put("type", "image");
        ObjectNode source = imageContent.putObject("source");
        source.put("type", "base64");
        source.put("media_type", mediaType);
        source.put("data", imageData);

        ObjectNode textContent = content.addObject();
        textContent.put("type", "text");
        textContent.put("text", prompt);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(ANTHROPIC_API_URL))
            .header("Content-Type", "application/json")
            .header("x-api-key", apiKey)
            .header("anthropic-version", "2023-06-01")
            .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(requestBody)))
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Claude API error: " + response.body());
        }

        JsonNode root = objectMapper.readTree(response.body());
        String textResponse = root.path("content").get(0).path("text").asText();

        JsonNode foodData = extractJson(textResponse);

        String nutriScore = null;
        JsonNode nutriNode = foodData.path("nutriScore");
        if (!nutriNode.isMissingNode() && !nutriNode.isNull()) {
            String grade = nutriNode.asText("").toLowerCase();
            if (!grade.isBlank() && "abcde".contains(grade)) {
                nutriScore = grade;
            }
        }

        Integer novaGroup = null;
        JsonNode novaNode = foodData.path("novaGroup");
        if (!novaNode.isMissingNode() && !novaNode.isNull()) {
            int nova = novaNode.asInt(0);
            if (nova >= 1 && nova <= 4) {
                novaGroup = nova;
            }
        }

        return new FoodScanResult(
            foodData.path("name").asText("Unknown Food"),
            null,
            foodData.path("calories").asInt(0),
            foodData.path("protein").asDouble(0),
            foodData.path("carbs").asDouble(0),
            foodData.path("fat").asDouble(0),
            foodData.path("servingSize").asText("1 serving"),
            foodData.path("confidence").asDouble(0.5),
            "ai",
            nutriScore,
            novaGroup
        );
    }

    private JsonNode extractJson(String text) throws Exception {
        Pattern pattern = Pattern.compile("\\{[^{}]*\\}", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return objectMapper.readTree(matcher.group());
        }
        throw new RuntimeException("Could not parse Claude response");
    }
}
