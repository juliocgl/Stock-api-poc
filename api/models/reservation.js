const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    product_id: {type: String},
    reservation_token: {type: String}
}, {versionKey: false});

// reservationSchema.set('toJSON', {
//     transform: function (doc, ret, options) {
//         delete ret._id
//         delete ret.product_id;
//         return ret;
//     }
// });
module.exports = mongoose.model('Reservation', reservationSchema);