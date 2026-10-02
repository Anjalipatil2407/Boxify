import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import { firebaseAuth } from "../firebase.js";


function Auth() {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] =
    useState(true);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: ""
    });

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {

    const { name, value } =
      event.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };


  // =====================================================
  // LOGIN / REGISTER
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setMessage("");
    setLoading(true);


    try {

      // =================================================
      // STEP 1 - BOXIFY BACKEND
      // =================================================

      const endpoint = isLogin

        ? "http://localhost:3000/api/auth/login"

        : "http://localhost:3000/api/auth/register";


      const bodyData = isLogin

        ? {
            email: formData.email,
            password: formData.password
          }

        : {
            name: formData.name,
            email: formData.email,
            password: formData.password
          };


      const response =
        await fetch(
          endpoint,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(bodyData)
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        setMessage(
          data.message ||
          "Something went wrong"
        );

        return;

      }


      // =================================================
      // REGISTER
      // =================================================

      if (!isLogin) {

        // Create same user in Firebase
        try {

          await createUserWithEmailAndPassword(
            firebaseAuth,
            formData.email,
            formData.password
          );

        } catch (firebaseError) {

          // If Firebase account already exists,
          // don't break MongoDB registration

          if (
            firebaseError.code !==
            "auth/email-already-in-use"
          ) {

            console.error(
              "Firebase registration error:",
              firebaseError
            );

          }

        }


        setMessage(
          "Account created! Please login."
        );


        setIsLogin(true);


        setFormData({
          name: "",
          email: formData.email,
          password: ""
        });


        return;

      }


      // =================================================
      // LOGIN
      // =================================================


      // -------------------------------------------------
      // Save Boxify JWT
      // -------------------------------------------------

      localStorage.setItem(
        "token",
        data.token
      );


      // -------------------------------------------------
      // Save logged-in user information
      // -------------------------------------------------

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      // =================================================
      // FIREBASE LOGIN
      // =================================================

      const firebaseUserCredential =
        await signInWithEmailAndPassword(
          firebaseAuth,
          formData.email,
          formData.password
        );


      // =================================================
      // GET FIREBASE ID TOKEN
      // =================================================

      const firebaseToken =
        await firebaseUserCredential
          .user
          .getIdToken();


      localStorage.setItem(
        "firebaseToken",
        firebaseToken
      );


      // =================================================
      // VERIFY FIREBASE TOKEN WITH BACKEND
      // =================================================

      const firebaseResponse =
        await fetch(
          "http://localhost:3000/api/firebase/verify",
          {
            method: "GET",

            headers: {

              Authorization:
                `Bearer ${firebaseToken}`

            }
          }
        );


      const firebaseData =
        await firebaseResponse.json();


      if (!firebaseResponse.ok) {

        console.error(
          "Firebase verification failed:",
          firebaseData
        );

        setMessage(
          "Firebase authentication failed."
        );

        return;

      }


      console.log(
        "Firebase verified:",
        firebaseData
      );


      // =================================================
      // LOGIN SUCCESS
      // =================================================

      setMessage(
        "Login successful!"
      );


      // =================================================
      // ROLE-BASED REDIRECT
      // =================================================

      if (
        data.user?.role === "admin"
      ) {

        // ADMIN
        navigate("/admin");

      } else {

        // NORMAL CUSTOMER
        navigate("/dashboard");

      }


    } catch (error) {

      console.error(
        "Authentication error:",
        error
      );


      // Firebase wrong email/password
      if (
        error.code ===
        "auth/invalid-credential"
      ) {

        setMessage(
          "Invalid email or password."
        );

      } else {

        setMessage(
          "Authentication failed. Please try again."
        );

      }


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="auth-page">


      {/* ================= LEFT SIDE ================= */}

      <div className="auth-left">

        <Link
          to="/"
          className="auth-logo"
        >
          BOXIFY ✦
        </Link>


        <div className="auth-message">

          <p>
            WELCOME TO YOUR RITUAL
          </p>


          <h1>

            A little care,

            <br />

            made just for

            <br />

            <span>
              you.
            </span>

          </h1>


          <p className="auth-description">

            Choose your mood, personalize your box
            and make every month feel a little better.

          </p>

        </div>

      </div>


      {/* ================= RIGHT SIDE ================= */}

      <div className="auth-right">

        <div className="auth-form-container">


          <p className="section-label">

            {isLogin
              ? "WELCOME BACK"
              : "JOIN BOXIFY"
            }

          </p>


          <h2>

            {isLogin
              ? "Login to Boxify"
              : "Create your account"
            }

          </h2>


          <p className="auth-subtitle">

            {isLogin
              ? "Your next self-care ritual is waiting."
              : "Start creating a box that feels like you."
            }

          </p>


          {/* ================= TABS ================= */}

          <div className="auth-tabs">


            <button
              type="button"

              className={
                isLogin
                  ? "active-auth-tab"
                  : ""
              }

              onClick={() => {

                setIsLogin(true);
                setMessage("");

              }}
            >

              Login

            </button>


            <button
              type="button"

              className={
                !isLogin
                  ? "active-auth-tab"
                  : ""
              }

              onClick={() => {

                setIsLogin(false);
                setMessage("");

              }}
            >

              Register

            </button>


          </div>


          {/* ================= FORM ================= */}

          <form onSubmit={handleSubmit}>


            {/* NAME */}

            {!isLogin && (

              <div className="form-group">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Your name"

                  value={
                    formData.name
                  }

                  onChange={
                    handleChange
                  }

                  required
                />

              </div>

            )}


            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"

                value={
                  formData.email
                }

                onChange={
                  handleChange
                }

                required
              />

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                name="password"

                placeholder=
                  "Enter your password"

                value={
                  formData.password
                }

                onChange={
                  handleChange
                }

                minLength="6"
                required
              />

            </div>


            {/* MESSAGE */}

            {message && (

              <p className="auth-status">

                {message}

              </p>

            )}


            {/* SUBMIT */}

            <button
              type="submit"
              className="auth-submit"

              disabled={
                loading
              }
            >

              {loading
                ? "Please wait..."
                : isLogin
                ? "Login →"
                : "Create Account →"
              }

            </button>


          </form>


          <Link
            to="/"
            className="back-home"
          >

            ← Back to home

          </Link>


        </div>

      </div>

    </div>

  );

}


export default Auth;