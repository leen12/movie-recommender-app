# Movie Recommender App

A feature-rich movie recommendation app built with Lynx, Node.js, Express, and MongoDB.

## Overview

This application helps users discover, track, and share movies and TV shows while providing a personalized and engaging experience. The app uses legal content sourced from free APIs like The Movie Database (TMDb), ensuring compliance and accessibility.

## Features

- User Authentication: Sign up, log in, and manage profiles
- Movie/TV Browsing: Browse with posters, titles, and descriptions
- Watch Tracking: Mark movies and episodes as watched and track progress
- Custom Lists: Create, edit, and share personalized lists
- Personalized Recommendations: Get content suggestions based on watch history
- Social Sharing: Share movies, lists, or profiles on social platforms
- Reviews and Ratings: Rate movies/TV shows and write reviews
- Gamification: Earn badges and achievements for watching movies
- Advanced Search Filters: Search by release year, director, cast, etc.
- Dashboard: Central hub for activity, recommendations, and lists

## Tech Stack

- **Frontend**: Lynx (with ReactLynx for a React-like experience)
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **APIs**: TMDb (primary), with optional integration of TVmaze or OMDb

## Project Structure

```
movie-recommender-app/
├── frontend/               # Lynx frontend application
│   └── movie-recommender/  # Main frontend code
├── backend/                # Node.js + Express backend
│   ├── routes/             # API routes
│   ├── models/             # MongoDB models
│   ├── middleware/         # Express middleware
│   └── config/             # Configuration files
└── functions/              # Firebase Cloud Functions (optional)
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- API keys for TMDb

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/leen12/movie-recommender-app.git
   cd movie-recommender-app
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend/movie-recommender
   npm install
   ```

4. Create a `.env` file in the backend directory with your MongoDB connection string and API keys.

5. Start the development servers:
   - Backend: `npm run dev` (from the backend directory)
   - Frontend: `npm start` (from the frontend/movie-recommender directory)

## Development Roadmap

See the [app plan](app%20plan.docx) for a detailed development roadmap and task list.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The Movie Database (TMDb) for providing the movie data API
- Lynx for the frontend framework