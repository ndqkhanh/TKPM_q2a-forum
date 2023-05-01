import {getFeed} from '../services/feed';

const getFeedController = async (token, page) => {
    const data = await getFeed(token, page);
    return data;
}

export {getFeedController};