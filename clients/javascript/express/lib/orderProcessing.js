const { Order } = require("./Order");

const TVAMap = {
  DE: 20,
  UK: 21,
  FR: 20,
  IT: 25,
  ES: 19,
  PL: 21,
  RO: 20,
  NL: 20,
  BE: 24,
  EL: 20,
  CZ: 19,
  PT: 23,
  HU: 27,
  SE: 23,
  AT: 22,
  BG: 21,
  DK: 21,
  FI: 17,
  SK: 18,
  IE: 21,
  HR: 23,
  LT: 23,
  SI: 24,
  LV: 20,
  EE: 22,
  CY: 21,
  LU: 25,
  MT: 20
};

const reductionMap = [
  [50000, 15],
  [10000, 10],
  [7000, 7],
  [5000, 5],
  [1000, 3]
];

const getReduction = value => {
  const result = reductionMap.find(tuple => {
    const [amount, _] = tuple;
    return value >= amount;
  });
  if (!result) {
    return 0;
  }
  const [_, reduction] = result;
  return reduction / 100;
};
exports.getReduction = getReduction;

const getTvaRateMap = countryCode => {
  const result = TVAMap[countryCode];
  if (result === undefined) {
    throw new Error("400");
  }
  return result / 100;
};
const getTvaRate = (countryCode, amount) => {
  switch (countryCode) {
    case "FR":
      if (amount <= 2000) {
        return 0.25;
      } else if (amount > 2000) {
        return 0.23;
      } else {
        return getTvaRateMap(countryCode);
      }
    case "DE":
      if (amount <= 1000) {
        return 0.25;
      } else if (amount > 1000) {
        return 0.15;
      } else {
        return getTvaRateMap(countryCode);
      }
    case "EE":
      if (amount > 1000) {
        return 0.2;
      } else {
        return getTvaRateMap(countryCode);
      }
    default:
      return getTvaRateMap(countryCode);
  }
};
exports.getTvaRate = getTvaRate;

const getTotalPrice = ({ prices, quantities }) => {
  return prices
    .map((price, index) => {
      return quantities[index] * price;
    })
    .reduce((a, b) => a + b, 0);
};

exports.getTotalPrice = getTotalPrice;

exports.processOrder = order => {
  order = new Order(order);
  const { prices, quantities, reduction, country } = order;
  console.log("processOrder", order);
  const totalHT = getTotalPrice({ prices, quantities });
  const totalAfterTaxes = totalHT * (1 + getTvaRate(country, totalHT));
  if (reduction === "PAY THE PRICE") {
    return {
      total: totalAfterTaxes
    };
  } else if (reduction === "STANDARD") {
    const total = (1 - getReduction(totalAfterTaxes)) * totalAfterTaxes;
    return {
      total: total
    };
  }
  if (reduction === "HALF PRICE") {
    return {
      total: totalAfterTaxes / 2
    };
  }
  return undefined;
};
