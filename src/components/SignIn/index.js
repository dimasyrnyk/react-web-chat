import { fb } from '../../service'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useState } from 'react'
import { Form, Formik } from 'formik'
import { useHistory } from 'react-router-dom'
import { validationSchema, defaultValues } from './formikConfig'
import { Button, FormField } from '../'
import './SignIn.scss'

export const SignIn = () => {
  const history = useHistory()
  const [serverError, setServerError] = useState('')
  // generate user code for an opportunity to get user in feature for Chack Norris API
  const userCode = '_' + Math.random().toString(18).substr(2, 13)

  const signin = ({ email, password }, { setSubmitting }) => {
    fb.auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        if (!res.user) {
          setServerError(
            "We're having trouble signing you in. Please try again.",
          )
        }
      })
      .catch(err => {
        if (err.code === 'auth/wrong-password') {
          setServerError('Invalid credentials');
        } else if (err.code === 'auth/user-not-found') {
          setServerError('No account for this email')
        } else {
          setServerError('Something went wrong :(')
        }
      })
      .finally(() => setSubmitting(false))
  }

  const signinWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    fb.auth
      .signInWithPopup(provider)
      .then(res => {
        if (res?.user?.uid) {
          fetch('/api/createUser', {
            method: 'PUT',
            body: JSON.stringify({
              userName: res.user.displayName,
              userId: res.user.uid,
              userCode,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(() => {
            fb.firestore
              .collection('chatUsers')
              .doc(res.user.uid)
              .set({ userName: res.user.displayName, userCode, avatar: '' })
          })
        } else {
          setServerError(
            "We're having trouble signing you in. Please try again.",
          )
        }
      })
  }

  return (
    <div className="auth-form">
      <h1>Sign In</h1>
      <Formik
        onSubmit={signin}
        validateOnMount={true}
        initialValues={defaultValues}
        validationSchema={validationSchema}
      >
        {({ isValid, isSubmitting }) => (
          <Form>
            <FormField name="email" label="Email" type="email" />
            <FormField name="password" label="Password" type="password" />

            <div className="auth-nav-container">
              <div className="auth-link-container">
                Don't have an account?{' '}
                <span
                  className="auth-link"
                  onClick={() => history.push('signup')}
                >
                  Sign Up!
                </span>
              </div>

              <Button
                type="submit"
                title="Sign In"
                disabled={isSubmitting || !isValid}
              />
            </div>
            <hr />
            <div className="auth-sdk-container">
              <button className="auth-btn-google" onClick={signinWithGoogle}>
                Sign In with Google
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {!!serverError && <div className="error">{serverError}</div>}
    </div>
  )
}