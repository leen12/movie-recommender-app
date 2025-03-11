import { useState, useCallback } from '@lynx-js/react';
import { useAuth } from '../../context/AuthContext';

interface LoginProps {
  onRegisterClick: () => void;
}

export function Login({ onRegisterClick }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login } = useAuth();
  
  const handleEmailChange = useCallback((e: any) => {
    'background only'
    setEmail(e.target.value);
  }, []);
  
  const handlePasswordChange = useCallback((e: any) => {
    'background only'
    setPassword(e.target.value);
  }, []);
  
  const handleLogin = useCallback(async () => {
    'background only'
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      await login({ email, password });
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login]);
  
  const handleRegisterClick = useCallback(() => {
    'background only'
    onRegisterClick();
  }, [onRegisterClick]);
  
  return (
    <view className="login-container">
      <view className="login-form">
        <text className="login-title">Sign In</text>
        
        {errorMessage && (
          <text className="login-error">{errorMessage}</text>
        )}
        
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
            placeholder="Enter your password"
          />
        </view>
        
        <button 
          className={`login-button ${isLoading ? 'loading' : ''}`} 
          bindtap={handleLogin}
          disabled={isLoading}
        >
          <text>{isLoading ? 'Signing In...' : 'Sign In'}</text>
        </button>
        
        <view className="register-prompt">
          <text className="register-text">Don't have an account?</text>
          <text className="register-link" bindtap={handleRegisterClick}>Sign Up</text>
        </view>
      </view>
    </view>
  );
} 