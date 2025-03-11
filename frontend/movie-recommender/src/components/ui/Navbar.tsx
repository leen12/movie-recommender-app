import { useCallback } from '@lynx-js/react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onHomeClick: () => void;
  onMoviesClick: () => void;
  onTVShowsClick: () => void;
  onSearchClick: () => void;
  onProfileClick: () => void;
  onLoginClick: () => void;
}

export function Navbar({
  onHomeClick,
  onMoviesClick,
  onTVShowsClick,
  onSearchClick,
  onProfileClick,
  onLoginClick,
}: NavbarProps) {
  const { user, logout } = useAuth();
  
  const handleHomeClick = useCallback(() => {
    'background only'
    onHomeClick();
  }, [onHomeClick]);
  
  const handleMoviesClick = useCallback(() => {
    'background only'
    onMoviesClick();
  }, [onMoviesClick]);
  
  const handleTVShowsClick = useCallback(() => {
    'background only'
    onTVShowsClick();
  }, [onTVShowsClick]);
  
  const handleSearchClick = useCallback(() => {
    'background only'
    onSearchClick();
  }, [onSearchClick]);
  
  const handleProfileClick = useCallback(() => {
    'background only'
    onProfileClick();
  }, [onProfileClick]);
  
  const handleLoginClick = useCallback(() => {
    'background only'
    onLoginClick();
  }, [onLoginClick]);
  
  const handleLogoutClick = useCallback(() => {
    'background only'
    logout();
  }, [logout]);
  
  return (
    <view className="navbar">
      <view className="navbar-brand" bindtap={handleHomeClick}>
        <text className="navbar-logo">MovieApp</text>
      </view>
      
      <view className="navbar-menu">
        <view className="navbar-item" bindtap={handleHomeClick}>
          <text className="navbar-link">Home</text>
        </view>
        
        <view className="navbar-item" bindtap={handleMoviesClick}>
          <text className="navbar-link">Movies</text>
        </view>
        
        <view className="navbar-item" bindtap={handleTVShowsClick}>
          <text className="navbar-link">TV Shows</text>
        </view>
        
        <view className="navbar-item" bindtap={handleSearchClick}>
          <text className="navbar-link">Search</text>
        </view>
      </view>
      
      <view className="navbar-auth">
        {user ? (
          <view className="navbar-user">
            <view className="navbar-profile" bindtap={handleProfileClick}>
              {user.profilePicture ? (
                <image src={user.profilePicture} className="navbar-avatar" />
              ) : (
                <view className="navbar-avatar-placeholder">
                  <text className="navbar-avatar-text">{user.username.charAt(0).toUpperCase()}</text>
                </view>
              )}
            </view>
            
            <view className="navbar-logout" bindtap={handleLogoutClick}>
              <text className="navbar-logout-text">Logout</text>
            </view>
          </view>
        ) : (
          <view className="navbar-login" bindtap={handleLoginClick}>
            <text className="navbar-login-text">Sign In</text>
          </view>
        )}
      </view>
    </view>
  );
} 