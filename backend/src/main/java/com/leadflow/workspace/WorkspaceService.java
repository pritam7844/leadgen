package com.leadflow.workspace;

import com.leadflow.common.exception.LeadFlowException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;

    public WorkspaceService(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    public Workspace createWorkspace(String name, String ownerId) {
        Workspace workspace = new Workspace();
        workspace.setName(name);
        workspace.setOwnerId(ownerId);

        Workspace.Member ownerMember = new Workspace.Member();
        ownerMember.setUserId(ownerId);
        ownerMember.setRole(Workspace.Member.Role.OWNER);
        workspace.getMembers().add(ownerMember);

        return workspaceRepository.save(workspace);
    }

    public void addOwner(String workspaceId, String userId) {
        Workspace workspace = getById(workspaceId);
        if (!workspace.getMembers().isEmpty()) {
            workspace.getMembers().get(0).setUserId(userId);
            workspace.setOwnerId(userId);
            workspaceRepository.save(workspace);
        }
    }

    public Workspace getById(String id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new LeadFlowException("Workspace not found", HttpStatus.NOT_FOUND));
    }

    public Workspace save(Workspace workspace) {
        return workspaceRepository.save(workspace);
    }
}
