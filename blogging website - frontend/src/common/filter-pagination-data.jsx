import axios from "axios";

export const filterPaginationData = async ({
  create_new_obj = false,
  state,
  data,
  page,
  countRoute,
  data_to_send = {},
}) => {
  let obj;
  if (state !== null && !create_new_obj) {
    obj = { ...state, results: [...state.results, ...data], page };
  } else {
    await axios
      .post(import.meta.env.VITE_SERVER_CONTEXT + countRoute, data_to_send)
      .then(({ data: { totalDocs } }) => {
        obj = { results: [...data], page: 1, totalDocs };
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return obj;
};
