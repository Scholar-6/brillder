export const sendError = (err: string) => {
  const errorPromise = new Promise(() => {
    throw new Error("Error Screen: " + err);
  });

  errorPromise.then(() => {});
}