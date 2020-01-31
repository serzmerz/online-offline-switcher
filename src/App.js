import React from 'react';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import OnlineStatusMock from './OnlineStatusMock';
import './App.css';
import {compose} from "redux";

/*
Feel free to edit this all. If you don't need the HoC, go remove it.
If you wish to save the state somewhere else, go for it.
Just keep rendering <OnlineStatusMock />
*/

const withOnlineStatus = WrappedComponent =>
  class WithOnlineStatus extends React.Component {
    constructor(props) {
      super(props);
      this.state = { isOnline: false };
    }
    render() {
      const { isOnline } = this.state;
      return (
        <>
          <OnlineStatusMock
            onIsOnlineChange={isOnline => this.setState({ isOnline })}
          />
          <WrappedComponent {...this.props} isOnline={isOnline} />
        </>
      );
    }
  };

const INTERNET_TIMEOUT = 2000;

const withPushNotifications = WrappedComponent =>
  class WithPushNotifications extends React.Component {
    componentDidUpdate(prevProps) {
      const { isOnline } = this.props;

      if (isOnline === prevProps.isOnline) return;
      if (this.timeout) return;

      if (isOnline) return NotificationManager.info('Online');

      this.timeout = setTimeout(this.notifyIfOffline, INTERNET_TIMEOUT);
    }

    notifyIfOffline = () => {
      const { isOnline } = this.props;
      if (!isOnline) {
        NotificationManager.info('Offline');
      }
      this.timeout = null;
    };

    render() {
      return <WrappedComponent {...this.props} />
    }
  };

class App extends React.Component {
  render() {
    const { isOnline } = this.props;
    return (
      <>
        <div className={isOnline ? 'online' : 'offline'}>
          {isOnline ? 'Online' : 'Offline'}
          <NotificationContainer />
        </div>
      </>
    );
  }
}

export default compose(
    withOnlineStatus,
    withPushNotifications
)(App);
