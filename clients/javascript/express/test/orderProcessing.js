const expect = require("chai").expect;
const orderProcessing = require("../lib/orderProcessing");

const {
  processOrder,
  getTvaRate,
  getReduction,
  getTotalPrice
} = orderProcessing;

describe("orderProcessing", () => {
  it("should return the total when reduction is pay the price", () => {
    expect(
      processOrder({
        prices: [10, 20, 30],
        quantities: [1, 2, 3],
        country: "FR",
        reduction: "PAY THE PRICE"
      })
    ).to.deep.equal({ total: 168 });
  });
  it("should return undefined", () => {
    expect(
      processOrder({
        prices: [10, 20, 30],
        quantities: [1, 2, 3],
        reduction: "PLOP"
      })
    ).to.equal(undefined);
  });
});

describe("getTvaRate", () => {
  it("should 20% for Malte", () => {
    expect(getTvaRate("MT")).to.equal(0.2);
  });
  it("should fail if country does not exist", () => {
    expect(() => getTvaRate("plop")).to.throw();
  });
});

describe("getReduction", () => {
  it("should 0", () => {
    expect(getReduction(0)).to.equal(0);
    expect(getReduction(100)).to.equal(0);
  });
  it("should 3%", () => {
    expect(getReduction(1000)).to.equal(0.03);
    expect(getReduction(1001)).to.equal(0.03);
    expect(getReduction(4999)).to.equal(0.03);
  });
  it("should 15%", () => {
    expect(getReduction(50000)).to.equal(0.15);
    expect(getReduction(1000000)).to.equal(0.15);
  });
});

describe("getTotalPrice", () => {
  it("should return the total", () => {
    expect(
      getTotalPrice({
        prices: [10, 20, 30],
        quantities: [1, 2, 3]
      })
    ).to.deep.equal(140);
  });
});
