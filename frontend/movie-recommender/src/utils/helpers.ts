// Format date to a readable format
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format runtime to hours and minutes
export const formatRuntime = (minutes: number): string => {
  if (!minutes) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// Format vote average to display with one decimal place
export const formatRating = (rating: number): string => {
  if (!rating && rating !== 0) return 'N/A';
  
  return rating.toFixed(1);
};

// Get image URL from TMDB
export const getImageUrl = (path: string, size: string = 'w500'): string => {
  if (!path) return '/placeholder-image.jpg';
  
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Truncate text to a specific length
export const truncateText = (text: string, maxLength: number = 150): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

// Get YouTube video URL
export const getYouTubeUrl = (key: string): string => {
  return `https://www.youtube.com/embed/${key}`;
};

// Get YouTube thumbnail URL
export const getYouTubeThumbnail = (key: string): string => {
  return `https://img.youtube.com/vi/${key}/mqdefault.jpg`;
};

// Format number with commas
export const formatNumber = (num: number): string => {
  if (!num && num !== 0) return 'N/A';
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Get year from date string
export const getYearFromDate = (dateString: string): string => {
  if (!dateString) return '';
  
  return new Date(dateString).getFullYear().toString();
};

// Calculate age rating based on vote average
export const getAgeRating = (voteAverage: number): string => {
  if (!voteAverage && voteAverage !== 0) return 'N/A';
  
  if (voteAverage >= 8) return 'PG-13';
  if (voteAverage >= 6) return 'PG';
  return 'G';
}; 