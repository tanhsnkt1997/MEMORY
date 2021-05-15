/**
 *
 * @param {*} timeStamp
 * @returns
 */
export const coverTimeStampToDMY = (timeStamp) => {
  let jsDate = new Date(timeStamp);
  let day = jsDate.getDate();
  let month = jsDate.getMonth() + 1;
  let year = jsDate.getFullYear();
  return { day, month, year };
};
