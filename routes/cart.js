/*
 * Since this file is loaded in server.js into /cart,
 * these routes are mounted onto /cart
 */

const express = require('express');
const cartRoutes = express.Router();
const ngrok = require('ngrok');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_NUMBER;
const restaurantPhone = process.env.RESTAURANT_NUMBER;
const client = require('twilio')(accountSid, authToken);


module.exports = (dbHelpers) => {


  cartRoutes.post("/", (req, res) => {

    // ----- req.body is an object containing the cart object and the comment text ----- //
    if (!req.session.userId) {
      res.status(500);
      res.send();
    } else {
      const cartData = req.body.cart;
      const comments = req.body.comments;

      let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const food = {
        user_id: req.session.userId,
        created_at: date,
        updated_at: date,
        completed_at: date,
        comments: comments
      };

      // ----- adds the submitted food order/ order_item into the database ----- //
      dbHelpers.addFoodOrder(food)
        .then((order) => {
          const foodOrderId = order.id;
          const promises = Object.keys(cartData).map((menuItem) => {
            return dbHelpers.getMenuItemByTitle(menuItem)
              .then((item) => {
                return dbHelpers.addOrderItem({
                  food_order_id: foodOrderId,
                  menu_item_id: item.id,
                  amount: cartData[menuItem].amount
                });
              });
          });

          return Promise.all(promises);

        })
        .then((data) => {
          dbHelpers.getOrderInfo(data[0].food_order_id)
            .then(orderInfo => {

              let phoneNum = orderInfo[0].phone;
              let name = orderInfo[0].first_name;
              let orderNum = orderInfo[0].food_order_id;
              let comments = orderInfo[0].comments;
              let order = [];

              for (const foodOrder of orderInfo) {
                order.push(`\n ${foodOrder.title}: ${foodOrder.amount}\n`);
              }
              // ----- sends sms to restaurant with cart order ----- //
              client.messages
                .create({
                  from: twilioPhone,
                  body: `\nNew Order #${orderNum} from: ${name}, @${phoneNum}, order items: ${order},\n special comments: ${comments}`,
                  to: restaurantPhone
                })
                .then(message => console.log(message.sid))
                .catch(err => {
                  console.log(err);
                });
            });

        })
        .then(() => {
          res.status(200);
          res.send();
        })
        .catch((err) =>{
          res
            .status(500)
            .json({error:err.message});
        });

    }
  });

  return cartRoutes;
};
