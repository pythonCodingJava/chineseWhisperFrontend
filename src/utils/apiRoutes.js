const host = process.env.HOST_URL;
export const register = `${host}auth/register`;
export const login = `${host}auth/login`;
export const content = `${host}content`;
export const contentFromDate = `${host}content/from`;
export const likeURL = `${host}content/action/like`;
export const createURL = `${host}content/action/create`;
export const getPost = `${host}content/fetch`;
export const getCmtPath = `${host}content/fetchCmt`;
export const getReplies = `${host}content/replies`
export const likeCmntURL = `${host}content/action/likecmnt`;
export const addCmnt = `${host}content/action/comment`;
export const logoutURL = `${host}content/action/logout`;
export const deleteURL = `${host}content/action/delete`;
