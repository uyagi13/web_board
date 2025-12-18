package com.example.subject_board.admin.dto;

public class AdminSummaryDto {
    private long userCount;
    private long postCount;
    private long fileCount;
    public AdminSummaryDto(long userCount, long postCount,long fileCount) {
        this.userCount = userCount;
        this.postCount = postCount;
        this.fileCount = fileCount;
    }

    public long getUserCount() {
        return userCount;
    }

    public long getPostCount() {
        return postCount;
    }
    public long getFileCount() {
        return fileCount;
    }
}
