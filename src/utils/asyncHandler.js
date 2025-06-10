// Frist Method
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((errro) => next.err);
  };
};
export { asyncHandler };

// Second Method
/*
const asyncHandler = () => {}
const asyncHandler = (func) => {() => {}}  
const asyncHandler = (func) => async() => {}  
*/ /*
const asyncHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};*/
