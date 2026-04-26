package com.leadflow.source;

import com.leadflow.common.exception.LeadFlowException;
import com.leadflow.common.util.EncryptionUtil;
import com.leadflow.lead.Lead;
import com.leadflow.lead.LeadService;
import com.leadflow.source.types.CsvImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SourceService {

    private final SourceRepository sourceRepository;
    private final EncryptionUtil encryptionUtil;
    private final CsvImportService csvImportService;
    private final LeadService leadService;

    public List<Source> findByWorkspace(String workspaceId) {
        return sourceRepository.findByWorkspaceId(workspaceId);
    }

    public Source create(String workspaceId, Source source) {
        source.setWorkspaceId(workspaceId);
        if (source.getConfig() != null && source.getConfig().getEncryptedAuthValue() != null) {
            source.getConfig().setEncryptedAuthValue(
                    encryptionUtil.encrypt(source.getConfig().getEncryptedAuthValue()));
        }
        return sourceRepository.save(source);
    }

    public Source getById(String workspaceId, String id) {
        Source source = sourceRepository.findById(id)
                .orElseThrow(() -> new LeadFlowException("Source not found", HttpStatus.NOT_FOUND));
        if (!source.getWorkspaceId().equals(workspaceId))
            throw new LeadFlowException("Access denied", HttpStatus.FORBIDDEN);
        return source;
    }

    public Source update(String workspaceId, String id, Source updated) {
        Source source = getById(workspaceId, id);
        source.setName(updated.getName());
        source.setActive(updated.isActive());
        source.setConfig(updated.getConfig());
        source.setSchedule(updated.getSchedule());
        return sourceRepository.save(source);
    }

    public void delete(String workspaceId, String id) {
        Source source = getById(workspaceId, id);
        sourceRepository.delete(source);
    }

    public Map<String, Object> runCsvUpload(String workspaceId, MultipartFile file) {
        List<Lead> leads = csvImportService.importCsv(workspaceId, file);
        int saved = 0;
        for (Lead lead : leads) {
            if (!isDuplicate(workspaceId, lead)) {
                leadService.saveOrUpdate(lead);
                saved++;
            }
        }
        return Map.of("leadsAdded", saved, "total", leads.size());
    }

    private boolean isDuplicate(String workspaceId, Lead lead) {
        if (lead.getEmail() == null) return false;
        return leadService.getStats(workspaceId) != null &&
                leadService.findLeads(workspaceId, buildFilter(lead)).getTotalElements() > 0;
    }

    private com.leadflow.lead.dto.LeadFilterRequest buildFilter(Lead lead) {
        com.leadflow.lead.dto.LeadFilterRequest f = new com.leadflow.lead.dto.LeadFilterRequest();
        f.setSearch(lead.getEmail());
        f.setSize(1);
        return f;
    }
}
