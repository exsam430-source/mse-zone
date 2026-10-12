import axios from "axios";

// returnApi.js
export const submitReturnRequest = async ({ backendURL, token, orderId, street, items }) => {
  const formData = new FormData();
  formData.append("orderId", orderId);
  formData.append("street", street);

  items.forEach((item, i) => {
    formData.append(`items`, JSON.stringify(item)); // optional, or send as one big JSON
    if (item.proofFile) {
      formData.append(`proof${i}`, item.proofFile);
    }
  });

  const res = await axios.post(`${backendURL}/api/returns/request`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

  


export const getUserReturns = async ({ backendURL, token }) => {
  const { data } = await axios.get(
    `${backendURL}/api/returns/user`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const getAllReturns = async ({ backendURL, token }) => {
  const { data } = await axios.get(
    `${backendURL}/api/returns/admin/all`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const updateReturnStatus = async ({
  backendURL,
  token,
  returnId,
  status,
}) => {
  const { data } = await axios.post(
    `${backendURL}/api/returns/admin/status`,
    { returnId, status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};
