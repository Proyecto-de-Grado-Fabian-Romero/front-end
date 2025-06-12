export const getPaymentSummary = async () => {
  const response = await fetch(
    "http://localhost:5101/api/owners/payments/summary"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch payment summary");
  }
  return await response.json();
};

export const getIncomeList = async (page = 1, limit = 20) => {
  const response = await fetch(
    `http://localhost:5101/api/owners/payments/income?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch income list");
  }
  return await response.json();
};

export const getReceivedPayments = async (page = 1, limit = 20) => {
  const response = await fetch(
    `http://localhost:5101/api/owners/payments/received?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch received payments");
  }
  return await response.json();
};

export const getIncomeDetails = async (id: string) => {
  const response = await fetch(
    `http://localhost:5101/api/owners/payments/income/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch income details");
  }
  return await response.json();
};

export const getReceivedPaymentDetails = async (id: string) => {
  const response = await fetch(
    `http://localhost:5101/api/owners/payments/received/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch received payment details");
  }
  return await response.json();
};
