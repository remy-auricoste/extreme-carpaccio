class Order {
  constructor({ prices, quantities, country, reduction }) {
    this.prices = prices;
    this.quantities = quantities;
    this.country = country;
    this.reduction = reduction;

    if (!(prices && quantities && prices.length === quantities.length)) {
      throw new Error("400");
    }
    if (!reduction) {
      throw new Error("400");
    }
  }
}

exports.Order = Order;
