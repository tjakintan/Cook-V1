# goMeal - 2026 (Serveless) - Frontend develoment

This repository contains a part of the source code for the GoMeal platform.

# INSTALLATION 

Enviroment variables(AWS REGION, AWS COGNITO IDENTITY) in the ".env" file
Configuration variables in the "vite.config.js" file; entails the vite frameworks(Reacts, Tailwind) used and ports which local developments will be used("https://localhost:3000")
Dependencies(importantly:- dropzone, oidc-context, framer-motion, router-dom, aws-sdk, etc.) can be found in the "package.json"; dependencjes can be added but on every instanstion of deployment run "rm -rf node_modules package-lock.json
npm install" 

# DEPLOYMENT 

goMeal can deploy in 2 ways:
1. Locally(2 ways):
    a. Run "npm install npm run dev". This starts gomeal on web server "localhost" with port 3000 on your local computer 
    b. Run "npm install npm run dev --host". This starts gomeal on webserver "10.0.0.234" with port 30 on your network

2. Deployed:
    This reposity is connected to the dev branch all, commits are ONLY made to dev, this repository should NEVER run any git commands other than to start deployment 
	•	git status
	•	git add .
	•	git commit -m "description-date&time-full_name"
	•	git push
    Upon success gomeal starts on "https://dev.gomeal.org" 


# FILES 

./
├── public/                  # Static files (gomeal's ico, png, psd. Other images/svg used)
├── src/
│   ├── assets/              # Images, fonts
│   ├── components/          # Reusable UI components
│   │   ├── user_post_meal/
|   |   |    ├── index.js
|   |   |    ├── Head.jsx 
|   |   |    ├── MealInfo.jsx
|   |   |    ├── Ingredients.jsx 
|   |   |    ├── Steps.jsx
|   |   |    ├── Dietary.jsx 
|   |   |    └── Nutrition.jsx
│   │   |
│   │   ├── Messages.jsx
│   │   ├── NavBar.jsx
│   │   └── Profile.jsx
│   │
│   ├── pages/               # Page-level components (routes)
│   │   ├── Home.jsx
│   │   ├── Feed.jsx
│   │   ├── Post.jsx
│   │   ├── Discover.jsx
│   │   ├── Auth.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   └── Settings.jsx
│   │
│   ├── style/               # Styles 
│   │   ├── component_style.css
│   │   ├── main_page.css
│   │   └── page_style.css
│   ├── services/            # API calls
│   │   └── api.js
│   │
│   ├── utils/             # Auth, global state
│   │   ├── auth.js
│   │   ├── cognito.js
│   │   └── user.jsx
│   │
│   ├── hooks/               # Helpers
│   │   ├── AuthHeader.jsx
│   │   ├── WobblyText.jsx
│   │   ├── UsePasscode.jsx
│   │   └── Placrholder.jsx
│   |
│   ├── App.jsx
│   └── main.jsx
├── .env             # Example environment vars
├── eslint.config.js
├── package.json
├── README.md
└─vite.config.js
