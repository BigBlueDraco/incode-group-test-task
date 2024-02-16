### Setting up the Application

To get started with our application, follow these simple steps:

1. **Environment Setup**:

   - Begin by duplicating the provided `example.env` file and rename it to `.env`.
   - Ensure to fill in all the necessary fields within the `.env` file.
   - The `CORS` variable should contain a string of URLs separated by spaces.

2. **Installation of Dependencies**:

   - Install all project dependencies by running the following command in your terminal:
     ```bash
     npm install
     ```

3. **Database Migration**:

   - If you do not intend to test the application, you can simply run the database migration using the following command:
     ```bash
     npx prisma migrate
     ```

4. **Testing the Application**:

   - If you wish to test the application, you can populate the database with test data using the following command:
     ```bash
     npm run seed
     ```
   - Note: All users in the test data will have the same password: `password123123123`.

5. **Running the Application**:

   - Once the above steps are completed, you can run the application like any other Nest.js application.

6. **Swagger Endpoint**:
   - The Swagger documentation for the API endpoints can be accessed at `/api`.
