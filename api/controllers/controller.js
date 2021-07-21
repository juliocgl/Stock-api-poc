// This is the controller where resides all the logic of the application
const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');
const Stock = mongoose.model('Stock');
const Reservation = mongoose.model('Reservation');

// PATCH - Sets the stock that is available to be sold
exports.setStock = (req, res) => {
    console.log(`PATCH /product/${req.params.id}/stock - Payload: {"stock": "${req.body.stock}"}`);

    const add_stock = new Stock({
        _id: req.params.id,
        in_stock: req.body.stock
    });
    Stock.findOneAndUpdate({_id: req.params.id}, add_stock, {upsert: true}, (err, stock) => {
        if (err) res.send(err);
        res.sendStatus(200);
    });
};

// GET - Returns a JSON Object with the stock level for the product
exports.getStock = (req, res) => {
    console.log(`GET /product/${req.params.id}`);

    Stock.findOne({_id: req.params.id}, '-_id in_stock reserved sold', {}, (err, stock) => {
        if (err) res.send(err);
        if (stock != null) {
            let show_stock = stock.toObject();
            if (!show_stock.hasOwnProperty('reserved'))
                show_stock.reserved = 0;
            if (!show_stock.hasOwnProperty('sold'))
                show_stock.sold = 0;
            res.json(show_stock);
        } else
            res.sendStatus(404);
    });
};

// POST - Reserves one item of stock. Moves one item of stock from IN_STOCK to RESERVED
exports.reserve = (req, res) => {
    console.log(`POST /product/${req.params.id}/reserve`);

    Stock.findOne({_id: req.params.id}, 'in_stock', {}, (err, stock) => {
        if (err) res.send(err);
        if (stock != null) {
            if (stock.in_stock < 1)
                // Not enough stock
                res.sendStatus(400);
            else {
                Stock.findOneAndUpdate({_id: req.params.id, in_stock: {$gt: 0}}, {
                        $inc: {
                            in_stock: -1,
                            reserved: +1
                        }
                    }, {}, (err, stock) => {
                        if (err) res.send(err);
                        const new_reservation = new Reservation({
                            product_id: req.params.id,
                            reservation_token: uuidv4()
                        });
                        new_reservation.save((err, reservation) => {
                            if (err) res.send(err);
                            let show_reservation = reservation.toObject();
                            delete show_reservation._id;
                            delete show_reservation.product_id;
                            res.json(show_reservation);
                        });
                    }
                );
            }
        } else
            res.sendStatus(404);
    });
};

// POST - Cancel a reservation of an item. Moves one item of stock from RESERVED to IN_STOCK
exports.unreserve = (req, res) => {
    console.log(`POST /product/${req.params.id}/unreserve - Payload: {"reservationToken": "${req.body.reservationToken}"}`);

    Reservation.findOne({reservation_token: req.body.reservationToken}, '_id product_id', {}, (err, reservation) => {
        if (err) res.send(err);
        if (reservation != null) {
            Stock.findOneAndUpdate({_id: reservation.product_id}, {
                $inc: {
                    in_stock: +1,
                    reserved: -1
                }
            }, {}, (err, stock) => {
                if (err) res.send(err);
                Reservation.findByIdAndDelete(reservation._id, (err, reservation) => {
                    if (err) res.send(err);
                    res.sendStatus(200);
                });
            });
        } else
            res.sendStatus(404);
    });
};

// POST - Sell the item reserved. Moves a stock unit from RESERVED to the state of SOLD
exports.sell = (req, res) => {
    console.log(`POST /product/${req.params.id}/sold - Payload: {"reservationToken": "${req.body.reservationToken}"}`);

    Reservation.findOne({reservation_token: req.body.reservationToken}, '_id product_id', {}, (err, reservation) => {
        if (err) res.send(err);
        if (reservation != null) {
            Stock.findOneAndUpdate({_id: reservation.product_id}, {
                $inc: {
                    reserved: -1,
                    sold: +1
                }
            }, {}, (err, stock) => {
                if (err) res.send(err);
                Reservation.findByIdAndDelete(reservation._id, (err, reservation) => {
                    if (err) res.send(err);
                    res.sendStatus(200);
                });
            });
        } else
            res.sendStatus(404);
    });
};