import PropTypes from 'prop-types';
import React, { Component } from 'react';
export default class Error extends Component {
  handleEscButton = e => {
    if (e.code !== 'Escape') {
      return;
    }
    this.props.onOverlayClick();
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleEscButton);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscButton);
  }
  render() {
    return (
      <>
        <div className="overlay" onClick={this.props.onOverlayClick}></div>
        <div className="modal">
          Something went wrong!
          <br />
          {this.props.appError}
        </div>
      </>
    );
  }
}

Error.propTypes = {
  onOverlayClick: PropTypes.func,
  appError: PropTypes.string,
};
