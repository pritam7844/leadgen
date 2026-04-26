package com.leadflow.scraper;

import com.leadflow.common.response.ApiResponse;
import com.leadflow.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scrapers")
public class ScraperController {

    private final ScraperRepository scraperRepository;
    private final ScraperService scraperService;

    public ScraperController(ScraperRepository scraperRepository, ScraperService scraperService) {
        this.scraperRepository = scraperRepository;
        this.scraperService = scraperService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScraperConfig>>> getScrapers(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(scraperRepository.findByWorkspaceId(user.getWorkspaceId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ScraperConfig>> createScraper(
            @AuthenticationPrincipal User user,
            @RequestBody ScraperConfig config) {
        config.setWorkspaceId(user.getWorkspaceId());
        return ResponseEntity.ok(ApiResponse.ok(scraperRepository.save(config)));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<ScraperConfig>> toggle(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        ScraperConfig config = scraperRepository.findById(id).orElseThrow();
        config.setEnabled(!config.isEnabled());
        return ResponseEntity.ok(ApiResponse.ok(scraperRepository.save(config)));
    }

    @PostMapping("/{id}/run")
    public ResponseEntity<ApiResponse<Map<String, Object>>> run(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        ScraperConfig config = scraperRepository.findById(id).orElseThrow();
        Map<String, Object> result = scraperService.runScraper(user.getWorkspaceId(), config);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
