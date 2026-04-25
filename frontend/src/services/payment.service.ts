import { payments } from "../data/mockData";

const wait = async (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const paymentService = {
  async getPayments() {
    await wait();
    return payments;
  }
};
