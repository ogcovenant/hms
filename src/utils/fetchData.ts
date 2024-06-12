import axios from "axios";

export const fetchData = async( url: string ) => {
  try {
    const res = await axios.get( url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res
  } catch (err) {
    console.log(err)
    throw new Error("An error occured while fecthing data")
  }
};

export default fetchData