import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { reduxForm } from 'redux-form'
import { login, forgot } from 'actions/user'
import styles from './styles'

@reduxForm(
  {
    form: 'login-form',
    fields: ['email', 'password'],
    validate: ({ email, password }) => { // eslint-disable-line
      const errors = {}
      if (!email) { errors.email = 'Field Required *' }
      if (!password) { errors.password = 'Field Required *' }
      return errors
    },
  },
  null,
  {
    login: login.init,
    forgot: forgot.init,
  },
)
class Login extends Component {
  @autobind
  loginFlow(values) {
    return new Promise((resolve, reject) => {
      this.props.login({ ...values, resolve, reject })
    })
  }

  render() {
    const {
      handleSubmit,
      submitting,
      fields: { email, password },
      error,
    } = this.props

    return (
      <form className={styles.loginForm} onSubmit={handleSubmit(this.loginFlow)}>
        <input {...email} type="email" value={email.value} placeholder="email" />
        {
          email.touched &&
          <div className={styles.error}>{email.error}</div>
        }
        <input {...password} type="password" value={password.value} placeholder="password" />
        {
          password.touched &&
          <div className={styles.error}>{password.error}</div>
        }
        {
          error &&
          <div className={styles.error}>{error.error}</div>
        }
        <a className={styles.forgot} onClick={this.props.forgot}>
          Forgot password
        </a>
        <button className={styles.login} disabled={submitting}>
          { submitting ? '+' : '-' } Log in
        </button>
      </form>
    )
  }
}
