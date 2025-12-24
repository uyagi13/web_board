package com.example.subject_board.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    // ✅ API는 제외하고, 화면 라우팅은 index.html로 넘김
    @GetMapping(value = {
            "/",
            "/signin",
            "/signup",
            "/board",
            "/board/**",
            "/admin",
            "/admin/**",
            "/file/**",
            "/post/**"
            
    })
    public String forward() {
        return "forward:/index.html";
    }
}
