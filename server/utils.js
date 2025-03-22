import fetch from "node-fetch";

/**
 * Получить псевдо рандомное число от 0 до max.
 * max в результат не входит
 * @param max
 * @returns
 */
export const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

export const getImgFromFetch = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from ${url}`);
    }
    return response.url;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
};
