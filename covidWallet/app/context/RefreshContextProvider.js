import React, { useState, useEffect } from 'react'

const RefreshContext = React.createContext(false);

// This context maintain a counter that can be used as a dependencies on other hooks to force a periodic refresh
const RefreshContextProvider = ({ children }) => {
  const [refreshState, setRefreshState] = useState(false);

  return <RefreshContext.Provider value={{ refreshState, setRefreshState }}>{children}</RefreshContext.Provider>
}

export { RefreshContext, RefreshContextProvider }

