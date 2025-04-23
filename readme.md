<p align="center">
  <img src="./logo.png" alt="URL Shortener Logo" width="200" height="150"/>
</p>

<h1 align="center">URL Shortener Service</h1>

<p align="center">
  A Robust Backend for Generating and Redirecting Short URLs
</p>

<p align="center">
  <!-- Badges - Adjust versions as needed -->
  <img src="https://img.shields.io/badge/Node.js-18.x+-339933?style=flat-square&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Express-5.x-lightgrey?style=flat-square&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-With_Mongoose-4EA94B?style=flat-square&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/Jest-Testing-C21325?style=flat-square&logo=jest" alt="Jest">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License: MIT">
</p>

---

## 👋 Introduction

Welcome! This is a backend service designed to shorten long URLs into neat, unique, and easy-to-share links. When someone clicks the short link, they are instantly redirected to the original, longer URL.

This project was developed as a take-home task for **Sheba Platform Limited**, focusing on creating a functional, efficient, and well-tested service.

## ✨ Features

*   **URL Shortening:** Accepts a long URL via a simple API (`POST /api/v1`) and returns its shortened version.
*   **Guaranteed Unique IDs:** Implements a collision-proof algorithm to generate unique short IDs, ready to handle billions of links.
*   **Fast Redirection:** Quickly redirects users from the short URL (`GET /:shortId`) to the original destination.
*   **URL Validation:** Checks if the submitted URL is valid before processing.
*   **Robust Error Handling:** Gracefully handles potential issues like invalid inputs or missing URLs.
*   **Comprehensive Unit Tests:** Includes a suite of unit tests (using Jest) to ensure reliability and correctness.

## 🛠️ Technical Deep Dive

This section explains some of the key technical choices made in building this service, directly addressing the task requirements.

### 1. Data Storage: Choosing the Right Structure

**Requirement:** Choose a suitable data structure to store the mapping between original and short URLs.

**Solution:** We chose **MongoDB**, managed via **Mongoose**, as our data storage solution.

**Why MongoDB?**

*   **Persistence:** Unlike simple in-memory maps, MongoDB ensures that our URL mappings are saved permanently and survive server restarts – essential for a real service.
*   **Scalability:** MongoDB is designed to handle large amounts of data and can be scaled horizontally if needed.
*   **Efficient Lookups:** We've added **indexes** to the `shortId` and `originalUrl` fields in our `Url` model.
    *   The `shortId` index makes redirecting incredibly fast, even with millions or billions of entries.
    *   The `originalUrl` index helps quickly check if we've already shortened a specific URL, preventing duplicates.
*   **Flexibility:** While simple now, MongoDB allows easy schema evolution if more features are added later.

By using MongoDB, we leverage its highly optimized internal data structures (like B-trees for indexes) to provide a robust and efficient mapping system suitable for a production service.

### 2. Short URL Uniqueness: No Collisions Allowed!

**Requirement:** Implement an algorithm to generate a unique, shorter string representation... Consider techniques to ensure short URLs are unique and don't conflict.

**Solution:** We implemented a **deterministic approach using an Atomic Counter + Base-62 Encoding**.

**Why not just random strings?**

Generating short random strings (like using `nanoid` with a fixed length, e.g., 5 characters) seems easy initially. However, as the number of URLs grows, the chance of generating a random ID that *already exists* (a collision) increases dramatically (due to the "Birthday Problem"). Checking the database and retrying becomes inefficient and can even fail at scale.

**How the Atomic Counter + Base-62 Method Works:**

1.  **Atomic Counter:** We maintain a single, global counter stored in a separate MongoDB collection (`counters`). When a new URL needs shortening, we use MongoDB's atomic `findOneAndUpdate` operation with `$inc` to increment this counter and get the next unique sequence number (1, 2, 3, ... 1000, ... 1000000, ...). This operation is **atomic**, meaning it's safe even if multiple requests come in at the exact same time – each gets a unique number.
2.  **Base-62 Encoding:** We take the unique integer sequence number (e.g., 1000) and convert it into a **Base-62** string. Base-62 uses characters `0-9`, `a-z`, and `A-Z` (62 possibilities).
    *   `1` -> `"1"`
    *   `61` -> `"Z"`
    *   `62` -> `"10"`
    *   `1000` -> `"g8"`
    *   `3844` -> `"100"`
    *   ... and so on.

**Benefits:**

*   **Guaranteed Uniqueness:** Since every sequence number is unique, the resulting Base-62 string is also guaranteed to be unique. No collisions, ever!
*   **No Database Checks Needed (During Generation):** We don't need to check if the generated ID already exists, making the generation process very fast.
*   **Scalability:** This method scales incredibly well.

**How Short ID Length Grows:**

The length of the Base-62 short ID increases naturally as the counter grows. Here's how many URLs can be handled by different lengths:

| Length | Max Base62 Value | Decimal Equivalent (`seq`) | Max URLs Handled |
| :----- | :--------------- | :------------------------- | :---------------- |
| 1      | `Z`              | 61                         | 61                |
| 2      | `ZZ`             | 3,843                      | ~3.8 thousand     |
| 3      | `ZZZ`            | 238,327                    | ~238 thousand     |
| 4      | `ZZZZ`           | 14,776,335                 | ~14.7 million     |
| 5      | `ZZZZZ`          | 916,132,831                | ~916 million      |
| **6**  | `ZZZZZZ`         | **56,800,235,583**         | **~56.8 billion** |
| 7      | `ZZZZZZZ`        | ~3.5 trillion              | ~3.5 trillion     |
| 8      | `ZZZZZZZZ`       | ~218 trillion              | ~218 trillion     |

This approach ensures that even billions of URLs can be handled efficiently with relatively short IDs.

### 3. Error Handling

**Requirement:** Implement logic to handle potential errors like invalid URLs...

**Solution:**

*   **Input Validation:** Incoming URLs are validated using `zod` schemas within the `validateRequest` middleware, and further checks (`isValidUrl`) happen in the service layer.
*   **Custom Errors:** A custom `AppError` class is used for specific, known application errors (like "Invalid URL" or "URL not found").
*   **Async Wrapper:** A `catchAsync` utility wraps controller functions to automatically catch any errors (including those from `async` operations) and pass them to the global error handler.
*   **Global Error Handler:** A dedicated middleware (`globalErrorHandler`) catches all errors passed via `next(error)`. It formats different error types (e.g., `AppError`, `ZodError`, generic `Error`) into a consistent JSON response structure with appropriate HTTP status codes.

## 🚀 API Endpoints

### Create a Short URL

*   **Endpoint:** `POST /api/v1`
*   **Description:** Takes a long URL and returns its shortened version.
*   **Request Body:**
    ```json
    {
      "originalUrl": "https://www.example.com/a-very-long-url-that-needs-shortening"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "Shorten URL created successfully",
      "data": {
        "originalUrl": "https://www.example.com/a-very-long-url-that-needs-shortening",
        "shortId": "g8", // Example short ID
        "shortUrl": "http://localhost:5000/g8" // Example full short URL (host/port depends on env)
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If the `originalUrl` is missing or invalid.
    *   `500 Internal Server Error`: For unexpected server issues.
    (Error response format handled by `globalErrorHandler`)

### Redirect Short URL

*   **Endpoint:** `GET /:shortId` (e.g., `GET /g8`)
*   **Description:** Redirects the user to the original long URL associated with the `shortId`.
*   **Success Response:**
    *   `302 Found` HTTP redirect to the `originalUrl`.
*   **Error Responses:**
    *   `404 Not Found`: If the `shortId` does not exist. (Handled by `globalErrorHandler`)

## ⚙️ Running Locally

1.  **Prerequisites:**
    *   Node.js (v18 or later recommended)
    *   npm or yarn
    *   A running MongoDB instance (local or cloud like MongoDB Atlas)

2.  **Clone the Repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>/backend
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

4.  **Set Up Environment Variables:**
    *   Create a `.env` file in the `backend` directory.
    *   Copy the contents of `.env.example` (if provided) into `.env`.
    *   Fill in the required environment variables:
        ```dotenv
        PORT=5000 # Or any port you prefer
        NODE_ENV=development
        DATABASE_URL=mongodb://localhost:27017/url-shortener # Your MongoDB connection string
        # Add any other necessary variables (e.g., CORS origin)
        ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The server should start, typically on the `PORT` specified in your `.env` file.

6.  **Build for Production:**
    ```bash
    npm run build
    # or
    yarn build
    ```

7.  **Start Production Server:**
    ```bash
    npm start
    # or
    yarn start
    ```

## ✅ Running Tests

This project uses Jest for unit testing. Tests are co-located with the source files they test (e.g., `url.service.test.ts` is alongside `url.service.ts`).

*   **Run all tests:**
    ```bash
    npm test
    # or
    yarn test
    ```
*   **Run tests with coverage report:**
    ```bash
    npm run test:coverage
    # or
    yarn test:coverage
    ```

## 📝 Meeting the Evaluation Criteria

This project aims to meet the evaluation criteria outlined in the take-home task:

*   **Functionality, Correctness, Efficiency, Best Practices:**
    *   The core shortening and redirection functionalities are implemented correctly.
    *   The atomic counter + base-62 approach ensures correctness and uniqueness at scale.
    *   Database indexes (`shortId`, `originalUrl`) ensure efficient lookups.
    *   Code follows common best practices: separation of concerns (controller, service, model), use of TypeScript, consistent error handling, environment variables, clear utility functions.
*   **Test Quality and Comprehensiveness:**
    *   Unit tests are written using Jest, focusing on testing components in isolation via mocking.
    *   Key modules like `UrlService`, `UrlController`, `base62`, `shortIdGenerator`, and `validateUrl` have dedicated tests covering various scenarios (success cases, error cases, edge conditions).
*   **Clarity of Explanation:**
    *   The "Technical Deep Dive" section above provides a clear explanation of the chosen data structure (MongoDB) and the robust approach to handling short URL uniqueness (atomic counter + base-62).

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details (if applicable).