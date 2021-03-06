import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { isLoggedIn as isLoggedInService } from '../../../selectors/index';

function mapStateToProps(state) {
  return {
    isLoggedIn: isLoggedInService(state),
  };
}

@withRouter
@connect(mapStateToProps)
class PrivateRoutes extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    isLoggedIn: PropTypes.bool,
  }

  static defaultProps = {
    isLoggedIn: false,
  }

  render() {
    const { props: { isLoggedIn, children } } = this;
    if (isLoggedIn) {
      return children;
    }

    return <Redirect to="/login" />;
  }
}

export { PrivateRoutes };
