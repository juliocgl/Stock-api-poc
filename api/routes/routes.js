// These are the routing instructions for Express to respond client requests on an specific endpoint for an specific HTTP method
module.exports = (app) => {

    // Define the controller
    const stock = require('../controllers/controller');

    app.route('/product/:id/stock')
        .patch(stock.setStock);

    app.route('/product/:id')
        .get(stock.getStock);

    app.route('/product/:id/reserve')
        .post(stock.reserve);

    app.route('/product/:id/unreserve')
        .post(stock.unreserve);

    app.route('/product/:id/sold')
        .post(stock.sell);
};