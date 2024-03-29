/* ~~~~~~~ users.js - User Routes ~~~~~~~ */
const express = require('express');
const router = express.Router();

module.exports = (db) => {

  /* ------- Login Route ------- */
  /* ------- (only gets first user in db) ------- */
  router.get("/login", (req, res) => {
    db.query(`SELECT * FROM users WHERE id = 1;`)
      .then(data => {
        const users = data.rows;
        req.session.userId = users[0].id;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  router.get("/loggedin", (req, res) => {
    db.query(`SELECT * FROM users WHERE id = $1;`,[req.session.userId])
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  /* ------- Logout Route ------- */
  router.get("/logout", (req, res) => {
    if (req.session.userId) {
      req.session.userId = null;
      res.status(200);
    } else {
      res
        .status(304)
        .json({ error: err.message });
    }
    res.send();
  });


  // ----- update phone number ----- //
  router.post("/updatePN", (req, res) => {
    if (req.session.userId) {
      db.query(`UPDATE users SET phone = $1 WHERE id = 1;`,[req.body.phone])
        .then(() => {
          res.status(200);
          res.send();
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
      res.status(200);
    } else {
      res
        .status(304);
      res.send();
    }
  });


  return router;
};
