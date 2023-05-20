import { API_URL } from "@env";

const getMetrics = async (token) => {
  try {
    let data = await fetch(`${API_URL}/admin/metrics`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    data = await data.json();
    return data;
  } catch (error) {
    console.error("error---", error);
  }
};

const getPendingQuestions = async (token, page, limit) => {
  try {
    let data = await fetch(
      `${API_URL}/admin/manage-questions/${page}/${limit}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    data = await data.json();
    return data;
  } catch (error) {
    console.error("error---", error);
  }
};

const approveDeclineQuestion = async (token, questionId, status) => {
  try {
    let data = await fetch(`${API_URL}/admin/manage-questions`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questionId,
        status,
      }),
    });
    data = await data.json();
    return data;
  } catch (error) {
    console.error("error---", error);
  }
};

const getUsers = async (token, page, limit) => {
  try {
    let data = await fetch(`${API_URL}/admin/list-users/${page}/${limit}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    data = await data.json();
    return data;
  } catch (error) {
    console.error("error---", error);
  }
};

const getListConfigurations = async (token) => {
  try {
    let data = await fetch(`${API_URL}/admin/list-configuration`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    data = await data.json();
    return data;
  } catch (error) {
    console.error("error---", error);
  }
};

const updateConfiguration = async (token, slug, value) => {
  try {
    let data = await fetch(`${API_URL}/admin/set-configuration/${slug}`, {
      method: "POST",
      body: JSON.stringify({
        value,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    data = await data.json();
    return data;
  } catch (error) {
    console.error("error---", error);
  }
};

const banUser = async (token, userId, status) => {
  try {
    let data = await fetch(`${API_URL}/admin/ban-user/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    });
    data = await data.json();
    return data;
  } catch (error) {
    console.error("error---", error);
  }
};

export {
  getMetrics,
  getPendingQuestions,
  approveDeclineQuestion,
  getUsers,
  getListConfigurations,
  updateConfiguration,
  banUser,
};
