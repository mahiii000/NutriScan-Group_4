# NutriScan


NutriScan is a web application developed using React that helps users make more informed food choices by providing nutritional information, dietary preference matching, and product comparisons.


The application retrieves food product information from the Open Food Facts API and presents it in an accessible interface, allowing users to search for products, review their nutritional information, and compare products based on their needs.


## Features


- Product Search: Search for food products by name using the Open Food Facts API.
- Product Filtering Filter products by categories and dietary labels, including snacks, beverages, vegan, gluten-free, dairy-free, and organic options.
- Product Details: View detailed product information, including ingredients, nutritional values, Nutri-Score, and allergen information.
- Dietary Preferences: Select a dietary goal and specify allergens to avoid. The application uses these preferences to display relevant indicators on product cards.
- Product Pinning: Pin products to keep track of items of interest.
- Product Comparison: Compare selected products and their nutritional information.
- Local Storage: Save dietary preferences, pinned products, and comparison selections in the browser so they remain available between visits.


## Technologies Used


- React 19: Frontend development and component-based user interface.
- JavaScript: Application logic and API integration.
- React Router: Navigation between application pages.
- CSS: Application styling and responsive layouts.
- Open Food Facts API: External food product and nutritional information.
- Context API: Shared application state across components.
- localStorage: Persistent storage of user preferences and product selections.
- Vite: Development server and build tool.


## Prerequisites


Before running the application, make sure you have installed:


- [Node.js](https://nodejs.org/) (LTS version recommended).
- npm (included with Node.js).
- An internet connection to retrieve product information from the Open Food Facts API.


## Installation and Setup


Follow these steps to run NutriScan locally.


### 1. Clone the repository




git clone https://github.com/mahiii000/NutriScan-Group_4




### 2. Navigate to the project directory


cd NutriScan-Group_4


### 3. Install dependencies


npm install


This installs the dependencies specified in `package.json`.


### 4. Start the development server


npm run dev


Vite will start the development server and display a local URL in the terminal, usually:


http://localhost:5173/




Open this URL in your browser to access NutriScan.




## API Integration


NutriScan uses the [Open Food Facts API](https://world.openfoodfacts.org/) to retrieve food product information.


The application sends search requests to the following endpoint:


https://world.openfoodfacts.org/cgi/search.pl


Product information is retrieved in JSON format and used to display product details, nutritional values, dietary labels, and allergen information.


An active internet connection is required for product searches. The availability and completeness of product information depend on the data provided by Open Food Facts.


## Data Storage


NutriScan uses the browser's localStorage to retain selected information between visits.


The application stores:


- Dietary preferences.
- Pinned product selections.
- Selected products for comparison.
- Product information needed across application pages.


This information is stored locally in the user's browser. The application does not currently use user accounts or a backend database.


## Project Structure


The project is organized into the following main directories:




NutriScan-Group_4/
│
├── public/
│  
│
├── src/
│   ├──assets
│   │   └── nutriscan.svg
│   │    
│   ├── components/
│   │   └── Reusable UI components
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── PinContext.jsx
│   │   └── PreferencesContext.jsx
│   │
│   │
│   ├── pages/
│   │   ├── SearchPage.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Compare.jsx
│   │   └── Preferences.jsx
│   │   └── Login.jsx
│   │
│   ├── services/
│   │   └── productService.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
└── README.md


## Usage Notes


- Product searches require an internet connection.
- Product information may vary depending on the availability of data in Open Food Facts.
- Dietary preference indicators are based on available product information and should be treated as guidance rather than a guarantee of suitability.
- Allergen information may be incomplete or unavailable for some products.
- Preferences and product selections are stored locally in the browser and are not synchronized across devices.
