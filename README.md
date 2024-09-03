# REST API for GoodReads Book Data

This project is a backend REST API built using Javascript, Node.js, Express, and MongoDB. It was created to gain more experience in building RESTful services and working with datasets from Kaggle. A custom database was created in Mongo
using this CSV file put together by Soumik - [Here](https://www.kaggle.com/datasets/jealousleopard/goodreadsbooks). Currently the API is relatively basic, users are able to filter the dataset based on author, title, publication year,
and average rating. All endpoints maintain a consistent response structure in the form of a JSON object to facilitate frontend work later. 

## Technologies Used
* JavaScript
* Node.js
* Express.js
* MongoDB -- database
* Postman -- endpoint testing
* JEST -- unit testing

## Test Coverage
![image](https://github.com/user-attachments/assets/603a6d4d-4a37-4fa7-b040-518a7c7407a8)
* Unit Tests: Project achieves 100% code coverage using tests written with Jest
* Manual Testing: Postman was used to fully test all API endpoints
* Database Testing: MongoDB Compass was utilized to verify data and ensure correct operations

## Endpoints
* http://localhost:3000/api/books - list all books from dataset
* http://localhost:3000/api/books/:bookID - find book by specified ID
* http://localhost:3000/api/books/author/:author - find books by specified author
* http://localhost:3000/api/books/title/:title - find books by specified title
* http://localhost:3000/api/rating/:rating - find books by specified rating
* http://localhost:3000/api/year-ge/:year - find books published on or after specified year
* http://localhost:3000/api/year-le/:year - find books published on or before specified year

## POSTMAN endpoint testing success
![image](https://github.com/user-attachments/assets/97a265ff-9cc7-4246-8157-81124da5e550)


## Run it yourself
1. `git clone https://github.com/sacredpoom/GoodReads_backend_demo_API.git`
2. `cd books-rest-api`
3. `npm install`
4. Install / Run MongoDB
5. Import Dataset into Mongo instance
6. `node index.js` - starts server on localhost
7. Run the unit tests - `npm test`

## Contact
Any inquiries or feedback, please contact me directly at JCVenesk@gmail.com
