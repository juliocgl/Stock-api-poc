# Stock REST API - Proof of Concept

 This project is a proof of concept made in Node.js for an API to manage the available stock for products.
 
## Technologies used

- Node.js - Javascript runtime environment
- Express.js - web application framework for Node.js
- Mongoose.js - library to connect to MongoDB

## Requirements

The application needs a MongoDB instance to run. I have used Docker to make it easy but could be installed directly in your machine.

If you decide to use docker, there is a *docker-compose.yml* file you can use with:

```bash
docker-compose up -d
```

## Usage

To run the application just use NPM to download the dependencies:

```bash
npm install
```

To run the application use:

```bash
node index.js
```

### How to test
In order to test it, I have used Postman to perform the requests to the API, but you can use whatever you want or just use the command line tool cURL.
If you decide to use Postman, in the *postman_config* folder there are two files with the configuration needed for making the requests.
Just import the postman collection and the environment variables in your Postman application.