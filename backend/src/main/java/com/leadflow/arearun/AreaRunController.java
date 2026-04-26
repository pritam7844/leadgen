package com.leadflow.arearun;

import com.leadflow.common.response.ApiResponse;
import com.leadflow.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/area-run")
public class AreaRunController {

    private final AreaRunRepository areaRunRepository;
    private final AreaRunService areaRunService;

    public AreaRunController(AreaRunRepository areaRunRepository, AreaRunService areaRunService) {
        this.areaRunRepository = areaRunRepository;
        this.areaRunService = areaRunService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AreaRun>> startRun(
            @AuthenticationPrincipal User user,
            @RequestBody AreaRun.Filters filters) {
        return ResponseEntity.ok(ApiResponse.ok(areaRunService.startRun(user.getWorkspaceId(), filters)));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<AreaRun>>> getHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(areaRunRepository.findByWorkspaceIdOrderByStartedAtDesc(user.getWorkspaceId())));
    }
}
