# personal-expense-tracker
Tracks all expenses

...................................Set up and initialisation....................................
............................For Ubuntu..............................
Open Terminal

Clone the Repository
Run the following commands:

bash

git clone https://github.com/Anil3007/personal-expense-tracker.git
cd yourproject
Install Dependencies
Execute:

bash

npm install
Configure Environment Variables
The project includes a .env file with the following default settings:

makefile

PORT=3000
DATABASE_PATH=expenses.db
Adjust these settings as needed for your environment.

Run the Application
Start the application with:

bash

npm start
The application will start running on http://localhost:3000.

..........................For Windows..........................
Open Command Prompt or PowerShell

Clone the Repository
Run the following commands:

bash

git clone https://github.com/Anil3007/personal-expense-tracker.git
cd yourproject
Install Dependencies
Execute:

bash

npm install
Configure Environment Variables
The project includes a .env file with the following default settings:

PORT=3000
DATABASE_PATH=expenses.db
Adjust these settings as needed for your environment.

Run the Application
Start the application with:

bash

npm start
The application will start running on http://localhost:3000.


...........................................API documentation............................................
Base URL
http://localhost:3000/api/v1
Authentication
All endpoints require the user-id to be sent in the request headers for authentication.

1. Add a New Transaction
Endpoint: /transactions
Method: POST
Headers:
user-id: string (required)
Request Body:
    json
    {
    "type": "income" | "expense",
    "category": 1, // category ID as a number
    "amount": 100.00, // amount as a number
    "description": "Sample description" // optional
    }
Response:
    Success (201):
    json

    {
    "Status": "Success",
    "Msg": "Transaction successfully added",
    "Data": {
        "id": 1,
        "type": "expense",
        "category": 1,
        "amount": 100.00,
        "description": "Sample description"
    }
    }
    Error (400):
    json

    {
    "Status": "Error",
    "Msg": "Invalid transaction type"
    }
2. Retrieve All Transactions
Endpoint: /transactions
Method: GET
Headers:
user-id: string (required)
Response:
    Success (200):
    json
    {
    "Status": "Success",
    "Msg": "Successfully fetched transactions",
    "Data": [
        {
        "id": 1,
        "type": "expense",
        "category": 1,
        "amount": 100.00,
        "description": "Sample description"
        }
    ]
    }
    Error (500):
    json

    {
    "Status": "Error",
    "Msg": "Error retrieving transactions"
    }
3. Retrieve a Transaction by ID
Endpoint: /transactions/:id
Method: GET
Headers:
user-id: string (required)
Response:
    Success (200):
    json
    {
    "Status": "Success",
    "Msg": "Successfully fetched transaction",
    "Data": {
        "id": 1,
        "type": "expense",
        "category": 1,
        "amount": 100.00,
        "description": "Sample description"
    }
    }
    Error (404):
    json
    {
    "Status": "Error",
    "Msg": "Transaction not found"
    }
4. Update a Transaction by ID
Endpoint: /transactions/:id
Method: PUT
Headers:
user-id: string (required)
Request Body:
    json
    {
    "type": "income" | "expense",
    "category": 1,
    "amount": 100.00,
    "description": "Updated description" // optional
    }
Response:
    Success (200):
    json
    {
    "Status": "Success",
    "Msg": "Transaction successfully updated",
    "Data": {
        "id": 1,
        "type": "expense",
        "category": 1,
        "amount": 100.00,
        "description": "Updated description"
    }
    }
    Error (404):
    json
    {
    "Status": "Error",
    "Msg": "Transaction with ID 1 not found"
    }
5. Delete a Transaction by ID
Endpoint: /transactions/:id
Method: DELETE
Headers:
user-id: string (required)
Response:
    Success (204):
    json
    {
    "Status": "Success",
    "Msg": "Transaction id:1 successfully deleted"
    }
    Error (404):
    json
    {
    "Status": "Error",
    "Msg": "Transaction with ID 1 not found"
    }
6. Retrieve Summary of Transactions
Endpoint: /summary
Method: GET
Headers:
user-id: string (required)
Response:
    Success (200):
    json
    {
    "Status": "Success",
    "Msg": "Successfully fetched summary",
    "Data": {
        "totalIncome": 500.00,
        "totalExpenses": 300.00,
        "balance": 200.00
    }
    }
    Error (500):
    json
    {
    "Status": "Error",
    "Msg": "Error retrieving summary"
    }