const asynchandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export default asynchandler; 

/*
const asynchandler = (func) => { (func) => {} }; // frist step
const asynchandler = (func) => () => {}; // second step
const asynchandler = (func) => async () => {}; // third step
*/

/*const asynchandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    // First step error handling
    next(error); // forward the error to the error-handling middleware

    // Second step error handling
    // res.status(error.code || 500).json({
    // success: false,
    // message: error.message || "Internal Server Error",
    // });
  }
};*/
