package com.example.board.controller;

import com.example.board.entity.Board;
import com.example.board.repository.BoardPostRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BoardController {

    private final BoardPostRepository boardPostRepository;

    public BoardController(BoardPostRepository boardPostRepository) {
        this.boardPostRepository = boardPostRepository;
    }

    @GetMapping("/board")
    public List<Board> getPosts() {
        return boardPostRepository.findAll();
    }
}
