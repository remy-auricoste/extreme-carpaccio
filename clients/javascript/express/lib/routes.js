const orderProcessing = require("./orderProcessing");

const { processOrder } = orderProcessing;

exports.order = function order(req, res, next) {
  // TODO implement from here
  try {
    const order = req.body;
    const result = processOrder(order);
    if (!(result && typeof result.total === "number")) {
      throw new Error("no result !");
    }
    res.json(result);
  } catch (err) {
    if (err.message === "400") {
      res.status(400);
      res.end();
    } else {
      console.error(err);
      res.status(404);
      res.end();
    }
  }
};

exports.feedback = function feedback(req, res, next) {
  console.info("FEEDBACK:", req.body.type, req.body.content);
  next();
};
