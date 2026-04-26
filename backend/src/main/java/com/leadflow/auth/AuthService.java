package com.leadflow.auth;

import com.leadflow.auth.dto.AuthResponse;
import com.leadflow.auth.dto.LoginRequest;
import com.leadflow.auth.dto.RegisterRequest;
import com.leadflow.common.exception.LeadFlowException;
import com.leadflow.user.User;
import com.leadflow.user.UserRepository;
import com.leadflow.workspace.Workspace;
import com.leadflow.workspace.WorkspaceService;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final WorkspaceService workspaceService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final RedisTemplate<String, String> redisTemplate;

    public AuthService(UserRepository userRepository, WorkspaceService workspaceService,
                       JwtService jwtService, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, RedisTemplate<String, String> redisTemplate) {
        this.userRepository = userRepository;
        this.workspaceService = workspaceService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.redisTemplate = redisTemplate;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new LeadFlowException("Email already registered", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPlan(User.Plan.FREE);
        user.setCredits(500L);
        user.setVerified(true);

        Workspace workspace = workspaceService.createWorkspace(
                request.getFirstName() + "'s Workspace", null);
        user.setWorkspaceId(workspace.getId());

        workspaceService.addOwner(workspace.getId(), null);
        userRepository.save(user);
        workspace.getMembers().get(0).setUserId(user.getId());
        workspaceService.save(workspace);

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new LeadFlowException("User not found", HttpStatus.NOT_FOUND));
        return buildAuthResponse(user);
    }

    public AuthResponse refresh(String refreshToken) {
        String email = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new LeadFlowException("User not found", HttpStatus.NOT_FOUND));
        return buildAuthResponse(user);
    }

    public void logout(String token) {
        redisTemplate.opsForValue().set("blacklist:" + token, "1", Duration.ofDays(7));
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user.getEmail(),
                Map.of("userId", user.getId(), "workspaceId", user.getWorkspaceId()));
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessExpiry())
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .plan(user.getPlan().name())
                        .credits(user.getCredits())
                        .workspaceId(user.getWorkspaceId())
                        .build())
                .build();
    }
}
