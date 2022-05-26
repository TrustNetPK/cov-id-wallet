import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, View } from 'react-native';
import NetworkContext from './app/context/NetworkContext';
import NavigationComponent from './app/Navigation';
import { PRIMARY_COLOR } from './app/theme/Colors';
import ErrorBoundary from 'react-native-error-boundary'
import { analytics_log_app_error } from './app/helpers/analytics';
import ErrorFallback from './app/components/ErrorFallback';

const App = () => {

  const errorHandler = (error, stackTrace) => {
    analytics_log_app_error(stackTrace.toString())
  }

  return (
    <NetworkContext>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
        <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
        <View style={{
          flex: 1,
          backgroundColor: PRIMARY_COLOR
        }}>
          <NavigationComponent />
        </View>
      </ErrorBoundary>
    </NetworkContext>
  );
};

export default App;
