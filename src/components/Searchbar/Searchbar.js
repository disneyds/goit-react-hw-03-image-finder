import React, { Component } from 'react';
import PropTypes from 'prop-types';
import s from './Searchbar.module.css';

export default class Searchbar extends Component {
  state = {
    query: '',
  };

  handleChange = e => {
    const { value } = e.target;
    this.setState({
      query: value,
    });
  };

  onSubmitForm = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.query);
    this.setState({ query: '' });
  };

  render() {
    return (
      <header className={s.header}>
        <p className={s.title}>Polaroid is BACK!</p>
        <form
          className={s.searchForm}
          id="search-form"
          onSubmit={this.onSubmitForm}
        >
          <input
            className={`${s.formInput} form-control`}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Найти изображение..."
            onChange={this.handleChange}
            value={this.state.query}
          />

          <button className={`btn btn-warning ${s.btnSub}`} type="submit">
            <span
              className={`spinner spinner-border spinner-border-sm ${s.isHidden}`}
              role="status"
              aria-hidden="true"
            ></span>
            <span className={s.label}>Найти</span>
          </button>
        </form>
      </header>
    );
  }
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
