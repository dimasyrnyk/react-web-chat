import { fb } from '../../service'
import { useState } from 'react'
import { Form, Formik } from 'formik'
import { useHistory } from 'react-router-dom'
import { defaultValues, validationSchema } from './formikConfig'
import { Button, FormField } from '../'

export const SignUp = () => {
  const history = useHistory()
  const [serverError, setServerError] = useState('')
  // generate user code for an opportunity to get user in feature for Chack Norris API
  const userCode = '_' + Math.random().toString(18).substr(2, 13)

  const signup = ({ email, userName, password }, { setSubmitting }) => {
    fb.auth
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        if (res?.user?.uid) {
          fetch('/api/createUser', {
            method: 'PUT',
            body: JSON.stringify({
              userName,
              userCode,
              userId: res.user.uid,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(() => {
            fb.firestore
              .collection('chatUsers')
              .doc(res.user.uid)
              .set({ userName, avatar: '', userCode })
          })
        } else {
          setServerError(
            "We're having trouble signing you up. Please try again.",
          )
        }
      })
      .catch(err => {
        if (err.code === 'auth/email-already-in-use') {
          setServerError('An account with this email already exists');
        } else {
          setServerError(
            "We're having trouble signing you up. Please try again.",
          )
        }
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="auth-form">
      <h1>Sign Up</h1>
      <Formik
        onSubmit={signup}
        validateOnMount={true}
        initialValues={defaultValues}
        validationSchema={validationSchema}
      >
        {({ isValid, isSubmitting }) => (
          <Form>
            <FormField name="userName" label="User Name" />
            <FormField name="email" label="Email" type="email" />
            <FormField name="password" label="Password" type="password" />
            <FormField
              type="password"
              name="confirmPassword"
              label="Confirm Password"
            />
            <div className="auth-nav-container">
              <div className="auth-link-container">
                Already have an account?{' '}
                <span className="auth-link" onClick={() => history.push('signin')}>
                  Sign In!
                </span>
              </div>

              <Button
                type="submit"
                title="Sign Up"
                disabled={isSubmitting || !isValid}
              />
            </div>
          </Form>
        )}
      </Formik>

      {!!serverError && <div className="error">{serverError}</div>}
    </div>
  )
}