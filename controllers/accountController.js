const account = require('../models/account');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const accountController = {
    getAll: (req, res) => {
        account.getAll((err, data) => {
            if (err) {
                res.json(err);
            } else {
                res.status(200).json(data);
            }
        });
    },
    register: (req, res) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                req.body.password = hash;
                account.register(req.body, (err, data) => {
                    if (err) {
                        res.json(err);
                    } else {
                        res.status(200).json(data);
                    }
                });
            });
        });
    },
    login: (req, res) => {
        account.checkLogin(req.body.email, (err, data) => {
            if (err) {
                res.json(err);
            } else {
                if (data.length > 0) {
                    bcrypt.compare(req.body.password, data[0].password, (err, result) => {
                        if (err) {
                            res.json(err);
                        } else {
                            if (result) {
                                res.json({ result, message: "Success" });
                            } else {
                                res.json({ result, message: "Failed" });
                            }
                        }
                    })
                }
            }
        })
    }
};

module.exports = accountController;
