import { doPostRequest } from "../common/messager";

export const sendPromotionMessage = async (message: string) => {
  await doPostRequest(message);
};
