import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';

const Checkbox = props => (
  <label htmlFor="user" className={styles.checkbox}>
    {props.label}
    <input
      id="user"
      type="checkbox"
      name="checkbox"
      className={styles.checkboxInput}
      onChange={props.onChange}
    />
    <span className={styles.checkboxElement}>check</span>
  </label>
);

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export { Checkbox };
