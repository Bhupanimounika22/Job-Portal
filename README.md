 

# Job Portal Application

## Overview

This project is a Job Portal Application designed to connect job seekers (candidates) with employers (companies). It allows companies to post job listings and candidates to apply for jobs , and manage their profiles.

## Features

- **User Authentication**: Sign up and log in for both companies and candidates.
- **Job Management**: Companies can create, read, update, and delete job listings.
- **Application Management**: Candidates can apply for jobs, view their application status, and track their application history.
- **Dashboard**: Personalized dashboards for companies and candidates to manage job postings and applications respectively.
- **Session Management**: User sessions are maintained to ensure secure and personalized user experiences.
 

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript templates)
- **Database**: MongoDB, Mongoose
- **Middleware**: express-session, connect-flash, body-parser, multer
- **Styling**: CSS (located in the `public` directory)

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/job-portal.git
    cd job-portal
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Start MongoDB**: Make sure you have MongoDB installed and running. You can start it using the following command:
    ```bash
    mongod
    ```

4. **Run the application**:
    ```bash
    npm start
    ```

5. **Access the application**: Open your web browser and go to `http://localhost:9990`.

## Directory Structure

- `views/`: Contains the EJS templates for rendering the web pages.
- `public/`: Contains static assets like CSS and images.
- `uploads/`: Directory for storing uploaded files.
- `routes/`: Contains route handlers (currently defined in the main file).
- `models/`: Contains Mongoose schemas and models for database interaction (currently defined in the main file).

 
