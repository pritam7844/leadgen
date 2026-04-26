package com.leadflow.user;

import com.leadflow.common.exception.LeadFlowException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    public User getById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new LeadFlowException("User not found", HttpStatus.NOT_FOUND));
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new LeadFlowException("User not found", HttpStatus.NOT_FOUND));
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}
