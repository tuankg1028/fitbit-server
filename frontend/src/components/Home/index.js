import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import Sidebar from '../Sidebar';
import agent from '../../agent';
import { connect } from 'react-redux';

// 
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER,
  CHANGE_TAB
} from '../../constants/actionTypes';
import { DATA_TYPE } from '../../constants'

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  sidebarTab: state.home.sidebarTab,
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  onLoad: (sidebarTab, payload) =>
    dispatch({ type: HOME_PAGE_LOADED, sidebarTab, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED }),
  changeSidebarTab: tab => 
    dispatch({  type: CHANGE_TAB, tab }),
});

class Home extends React.Component {
  componentWillMount() { 
    const { dataType } = this.props.match.params
    const sidebarTab = dataType && Object.values(DATA_TYPE).includes(dataType) ? dataType : DATA_TYPE.HEART_RATE
      
    this.props.onLoad(sidebarTab, Promise.all([agent.Data.getAll(sidebarTab)]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="home-page">

        <div className="container page">
          <div className="row">
            <Sidebar />
            <MainView />

            
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
