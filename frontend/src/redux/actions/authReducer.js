const initialState = {
    accessToken: null,
    // other authentication-related state properties
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'CLEAR_AUTH_STATE':
        return initialState;
      // handle other authentication-related actions
  
      default:
        return state;
    }
  };
  
  export default authReducer;