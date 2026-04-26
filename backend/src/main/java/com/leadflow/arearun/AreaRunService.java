package com.leadflow.arearun;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AreaRunService {

    private final AreaRunRepository areaRunRepository;

    public AreaRun startRun(String workspaceId, AreaRun.Filters filters) {
        AreaRun run = new AreaRun();
        run.setWorkspaceId(workspaceId);
        run.setFilters(filters);
        run.setStatus(AreaRun.Status.RUNNING);
        AreaRun saved = areaRunRepository.save(run);
        executeAsync(saved);
        return saved;
    }

    @Async
    public void executeAsync(AreaRun run) {
        try {
            Thread.sleep(2000);
            run.setLeadsAdded((long) (100 + Math.random() * 400));
            run.setStatus(AreaRun.Status.COMPLETED);
            run.setCompletedAt(Instant.now());
        } catch (Exception e) {
            run.setStatus(AreaRun.Status.FAILED);
        }
        areaRunRepository.save(run);
    }
}
