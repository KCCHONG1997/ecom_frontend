const PORT =
    process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_BACKEND_PROD_PORT
        : process.env.REACT_APP_BACKEND_DEV_PORT;

export default PORT;
