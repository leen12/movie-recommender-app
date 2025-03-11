import { useState, useCallback } from '@lynx-js/react';
import { useAuth } from '../../context/AuthContext';

interface RegisterProps {
  onLoginClick: () => void;
}

export function Register({ onLoginClick }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { register } = useAuth();
  
  const handleUsernameChange = useCallback((e: any) => {
    'background only'
    setUsername(e.target.value);
  }, []);
  
  const handleEmailChange = useCallback((e: any) => {
    'background only'
    setEmail(e.target.value);
  }, []);
  
  const handlePasswordChange = useCallback((e: any) => {
    'background only'
    setPassword(e.target.value);
  }, []);
  
  const handleConfirmPasswordChange = useCallback((e: any) => {
    'background only'
    setConfirmPassword(e.target.value);
  }, []);
  
  const handleRegister = useCallback(async () => {
    'background only'
    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      await register({ username, email, password });
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }, [username, email, password, confirmPassword, register]);
  
  const handleLoginClick = useCallback(() => {
    'background only'
    onLoginClick();
  }, [onLoginClick]);
  
  return (
    <view className="register-container">
      <view className="register-form">
        <text className="register-title">Create Account</text>
        
        {errorMessage && (
          <text className="register-error">{errorMessage}</text>
        )}
        
        <view className="form-group">
          <text className="form-label">Username</text>
          <input 
            type="text" 
            className="form-input" 
            value={username} 
            onInput={handleUsernameChange} 
            placeholder="Choose a username"
          />
        </view>
        
        <view className="form-group">
          <text className="form-label">Email</text>
          <input 
            type="email" 
            className="form-input" 
            value={email} 
            onInput={handleEmailChange} 
            placeholder="Enter your email"
          />
        </view>
        
        <view className="form-group">
          <text className="form-label">Password</text>
          <input 
            type="password" 
            className="form-input" 
            value={password} 
            onInput={handlePasswordChange} 
            placeholder="Create a password"
          />
        </view>
        
        <view className="form-group">
          <text className="form-label">Confirm Password</text>
          <input 
            type="password" 
            className="form-input" 
            value={confirmPassword} 
            onInput={handleConfirmPasswordChange} 
            placeholder="Confirm your password"
          />
        </view>
        
        <button 
          className={`register-button ${isLoading ? 'loading' : ''}`} 
          bindtap={handleRegister}
          disabled={isLoading}
        >
          <text>{isLoading ? 'Creating Account...' : 'Create Account'}</text>
        </button>
        
        <view className="login-prompt">
          <text className="login-text">Already have an account?</text>
          <text className="login-link" bindtap={handleLoginClick}>Sign In</text>
        </view>
      </view>
    </view>
  );
} 