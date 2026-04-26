package com.leadflow.common.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PaginationUtil {

    public static Pageable of(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(Math.max(0, page), Math.min(100, size), sort);
    }

    public static Pageable of(int page, int size) {
        return PageRequest.of(Math.max(0, page), Math.min(100, size), Sort.by("createdAt").descending());
    }
}
