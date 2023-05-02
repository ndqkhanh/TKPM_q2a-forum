import {
    getMetrics,
    getPendingQuestions,
    approveDeclineQuestion,
    getUsers,
    getListConfigurations,
    updateConfiguration,
    banUser,
} from "../services/admin";

const getMetricsController = async (token) => {
    const data = await getMetrics(token);
    return data;
}

const getPendingQuestionsController = async (token, page, limit) => {
    const data = await getPendingQuestions(token, page, limit);
    return data;
}

const approveDeclineQuestionController = async (token, questionId, status) => {
    const data = await approveDeclineQuestion(token, questionId, status);
    return data;
}

const getUsersController = async (token, page, limit) => {
    const data = await getUsers(token, page, limit);
    return data;
}

const getListConfigurationsController = async (token) => {
    const data = await getListConfigurations(token);
    return data;
}

const updateConfigurationController = async (token, slug, value) => {
    const data = await updateConfiguration(token, slug, value);
    return data;
}

const banUserController = async (token, userId, status) => {
    const data = await banUser(token, userId, status);
    return data;
}

export {
    getMetricsController,
    getPendingQuestionsController,
    approveDeclineQuestionController,
    getUsersController,
    getListConfigurationsController,
    updateConfigurationController,
    banUserController,
};
