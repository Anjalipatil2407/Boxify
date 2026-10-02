import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import requestNotificationPermission from "../notification.js";

function Dashboard() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [subscription, setSubscription] = useState(null);
  const [customization, setCustomization] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      // User must be logged in
      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        // ===============================================
        // GET SUBSCRIPTIONS
        // ===============================================

        const subscriptionResponse = await fetch(
          "http://localhost:3000/api/subscriptions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const subscriptionData =
          await subscriptionResponse.json();

        if (!subscriptionResponse.ok) {
          throw new Error(
            subscriptionData.message ||
              "Could not load subscription"
          );
        }

        const subscriptions =
          Array.isArray(subscriptionData)
            ? subscriptionData
            : subscriptionData.subscriptions || [];

        if (subscriptions.length > 0) {
          // Get newest subscription
          const newestSubscription =
            subscriptions[
              subscriptions.length - 1
            ];

          setSubscription(
            newestSubscription
          );

          // Save current subscription ID
          localStorage.setItem(
            "subscriptionId",
            newestSubscription._id
          );
        } else {
          setSubscription(null);

          localStorage.removeItem(
            "subscriptionId"
          );
        }

        // ===============================================
        // GET CUSTOMIZATIONS
        // ===============================================

        const customizationResponse =
          await fetch(
            "http://localhost:3000/api/customizations",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const customizationData =
          await customizationResponse.json();

        if (!customizationResponse.ok) {
          throw new Error(
            customizationData.message ||
              "Could not load customization"
          );
        }

        const customizations =
          Array.isArray(customizationData)
            ? customizationData
            : customizationData.customizations ||
              [];

        if (customizations.length > 0) {
          setCustomization(
            customizations[
              customizations.length - 1
            ]
          );
        } else {
          setCustomization(null);
        }
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        setMessage(
          "Could not load your Boxify dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // =====================================================
  // EDIT EXISTING PREFERENCES
  // =====================================================

  const editPreferences = () => {
    if (!subscription) {
      navigate("/plans");
      return;
    }

    // Save current subscription
    localStorage.setItem(
      "subscriptionId",
      subscription._id
    );

    // Tell Customize page that we are editing
    // NOT creating another subscription
    localStorage.setItem(
      "customizeMode",
      "edit"
    );

    navigate("/customize");
  };

  // =====================================================
  // PAUSE SUBSCRIPTION
  // =====================================================

  const pauseSubscription = async () => {
    if (!subscription) return;

    const token =
      localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/api/subscriptions/${subscription._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: "paused",
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not pause subscription."
        );

        return;
      }

      setSubscription(
        (previous) => ({
          ...previous,
          status: "paused",
        })
      );

      setMessage(
        "Subscription paused."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not connect to the server."
      );
    }
  };

  // =====================================================
  // CANCEL SUBSCRIPTION
  // =====================================================

  const cancelSubscription = async () => {
    if (!subscription) return;

    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel your subscription?"
      );

    if (!confirmCancel) return;

    const token =
      localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/api/subscriptions/${subscription._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not cancel subscription."
        );

        return;
      }

      setSubscription(null);
      setCustomization(null);

      localStorage.removeItem(
        "subscriptionId"
      );

      localStorage.removeItem(
        "customizeMode"
      );

      setMessage(
        "Subscription cancelled."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not connect to the server."
      );
    }
  };

  // =====================================================
  // ENABLE FIREBASE NOTIFICATIONS
  // =====================================================

  const enableNotifications = async () => {
    const fcmToken =
      await requestNotificationPermission();

    if (fcmToken) {
      localStorage.setItem(
        "fcmToken",
        fcmToken
      );

      setMessage(
        "Notifications enabled successfully! 🔔"
      );
    } else {
      setMessage(
        "Could not enable notifications."
      );
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem(
      "firebaseToken"
    );

    localStorage.removeItem(
      "fcmToken"
    );

    localStorage.removeItem(
      "subscriptionId"
    );

    localStorage.removeItem(
      "customizeMode"
    );

    localStorage.removeItem(
      "selectedPlanId"
    );

    localStorage.removeItem(
      "selectedPlanName"
    );

    localStorage.removeItem(
      "selectedPlanPrice"
    );

    navigate("/");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="new-dashboard-loading">
        <span>✦</span>
        <h2>Preparing your Boxify...</h2>
      </div>
    );
  }

  // =====================================================
  // REAL VALUES
  // =====================================================

  const planName =
    subscription?.plan?.name ||
    localStorage.getItem(
      "selectedPlanName"
    ) ||
    "No active plan";

  const planPrice =
    subscription?.plan?.price ||
    localStorage.getItem(
      "selectedPlanPrice"
    );

  const mood =
    customization?.mood ||
    "RESET";

  const fragrance =
    customization?.fragrance ||
    "None";

  const categories =
    customization?.categories || [];

  const subscriptionStatus =
    subscription?.status
      ? subscription.status.toUpperCase()
      : "NO PLAN";

  const moodIcon =
    mood === "RESET"
      ? "☁"
      : mood === "GLOW"
      ? "✦"
      : mood === "COZY"
      ? "♡"
      : "◌";

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="new-dashboard-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="new-dashboard-nav">

        <Link
          to="/"
          className="new-dashboard-logo"
        >
          BOXIFY <span>✦</span>
        </Link>


        <div className="dashboard-nav-links">

          <button
            type="button"
            className="dashboard-nav-active"
          >
            MY BOX
          </button>

          <button
            type="button"
            onClick={editPreferences}
          >
            CUSTOMIZE
          </button>

          <Link to="/track">
            TRACK
          </Link>

          <Link to="/plans">
            PLANS
          </Link>

        </div>


        <div className="dashboard-nav-actions">

          {/* Notification bell */}
          <button
            type="button"
            className="dashboard-bell"
            onClick={enableNotifications}
            title="Enable notifications"
          >
            ♢
            <span></span>
          </button>

          <button
            type="button"
            className="dashboard-logout"
            onClick={handleLogout}
          >
            LOGOUT
          </button>

        </div>

      </nav>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="new-dashboard-main">


        {/* =================================================
            HEADER
        ================================================= */}

        <section className="new-dashboard-header">

          <div>

            <p className="dashboard-eyebrow">
              YOUR BOXIFY / OCTOBER EDIT
            </p>

            <h1>
              A little something
              <br />
              <em>just for you.</em>
            </h1>

            <p className="dashboard-intro">
              Your monthly self-care ritual,
              personalized around your mood,
              favourites and fragrance.
            </p>

          </div>


          <div className="dashboard-header-side">

            <span>
              SUBSCRIPTION
            </span>

            <strong
              className={
                subscription?.status ===
                "paused"
                  ? "dashboard-status paused-status"
                  : "dashboard-status"
              }
            >
              <i></i>
              {subscriptionStatus}
            </strong>

          </div>

        </section>


        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (
          <div className="new-dashboard-message">
            <span>✦</span>
            {message}
          </div>
        )}


        {/* =================================================
            MAIN BOX FEATURE
        ================================================= */}

        {subscription ? (

          <section className="dashboard-box-feature">


            {/* LEFT CONTENT */}

            <div className="dashboard-box-copy">

              <p className="dashboard-small-label">
                THIS MONTH
              </p>

              <h2>
                Your {mood}
                <br />
                <em>Box.</em>
              </h2>

              <p className="dashboard-box-description">

                {categories.length > 0
                  ? `A thoughtful mix of ${categories.join(
                      ", "
                    )}, curated around your ${mood.toLowerCase()} mood.`
                  : "Your personalized self-care ritual is ready for you."}

              </p>


              <div className="dashboard-box-tags">

                <span>
                  {moodIcon} {mood}
                </span>

                <span>
                  ❀ {fragrance}
                </span>

              </div>


              <div className="dashboard-main-actions">

                <button
                  type="button"
                  onClick={editPreferences}
                >
                  EDIT MY BOX
                  <span>→</span>
                </button>

                <Link to="/track">
                  TRACK DELIVERY
                  <span>↗</span>
                </Link>

              </div>

            </div>


            {/* BOX ART */}

            <div
              className={`dashboard-box-art dashboard-box-${mood.toLowerCase()}`}
            >

              <span className="dash-decoration dash-star-one">
                ✦
              </span>

              <span className="dash-decoration dash-heart">
                ♡
              </span>

              <span className="dash-decoration dash-star-two">
                ✦
              </span>


              {/* PRODUCT 1 */}

              {categories.includes(
                "Skincare"
              ) && (

                <div className="dash-product dash-product-skincare">

                  <small>
                    BOXIFY
                  </small>

                  <strong>
                    DEW
                  </strong>

                  <span>
                    daily glow
                  </span>

                </div>

              )}


              {/* PRODUCT 2 */}

              {categories.includes(
                "Candles"
              ) && (

                <div className="dash-product dash-product-candle">

                  <span>
                    ✦
                  </span>

                  <strong>
                    REST
                  </strong>

                  <small>
                    slow down
                  </small>

                </div>

              )}


              {/* PRODUCT 3 */}

              {categories.includes(
                "Journaling"
              ) && (

                <div className="dash-product dash-product-journal">

                  <small>
                    NOTES FOR
                  </small>

                  <strong>
                    today.
                  </strong>

                  <span>
                    ♡
                  </span>

                </div>

              )}


              {/* PRODUCT 4 */}

              {categories.includes(
                "Wellness"
              ) && (

                <div className="dash-product dash-product-wellness">

                  <small>
                    DAILY
                  </small>

                  <strong>
                    RITUAL
                  </strong>

                </div>

              )}


              {/* MAIN BOX */}

              <div className="dashboard-main-box">

                <div className="dashboard-main-box-lid">

                  <small>
                    CURATED FOR YOU
                  </small>

                  <strong>
                    {mood}
                  </strong>

                </div>


                <div className="dashboard-main-box-front">

                  <p>
                    BOXIFY
                  </p>

                  <span>
                    {moodIcon}
                  </span>

                  <small>
                    THE {mood} EDITION
                  </small>

                </div>

              </div>

            </div>

          </section>

        ) : (

          /* =================================================
             NO SUBSCRIPTION
          ================================================= */

          <section className="dashboard-empty-box">

            <span>✦</span>

            <p>
              YOUR BOX IS WAITING
            </p>

            <h2>
              Ready for a little
              <br />
              self-care?
            </h2>

            <Link to="/plans">
              CHOOSE A PLAN →
            </Link>

          </section>

        )}


        {/* =================================================
            INFORMATION CARDS
        ================================================= */}

        <section className="dashboard-info-grid">


          {/* PLAN */}

          <div className="dashboard-info-card plan-info-card">

            <div className="info-card-top">

              <span>
                01
              </span>

              <small>
                YOUR PLAN
              </small>

            </div>

            <h3>
              {planName}
            </h3>

            <p>
              {planPrice
                ? `₹${planPrice} / month`
                : "Choose your Boxify plan"}
            </p>

            <Link to="/plans">
              VIEW PLANS →
            </Link>

          </div>


          {/* MOOD */}

          <div className="dashboard-info-card mood-info-card">

            <div className="info-card-top">

              <span>
                02
              </span>

              <small>
                YOUR MOOD
              </small>

            </div>

            <div className="dashboard-big-icon">
              {moodIcon}
            </div>

            <h3>
              {mood}
            </h3>

            <button
              type="button"
              onClick={editPreferences}
            >
              CHANGE MOOD →
            </button>

          </div>


          {/* FRAGRANCE */}

          <div className="dashboard-info-card scent-info-card">

            <div className="info-card-top">

              <span>
                03
              </span>

              <small>
                YOUR SCENT
              </small>

            </div>

            <div className="dashboard-big-icon">
              ❀
            </div>

            <h3>
              {fragrance}
            </h3>

            <button
              type="button"
              onClick={editPreferences}
            >
              EDIT SCENT →
            </button>

          </div>

        </section>


        {/* =================================================
            WHAT'S INSIDE
        ================================================= */}

        <section className="dashboard-inside-section">

          <div className="dashboard-inside-heading">

            <div>

              <p>
                YOUR PICKS
              </p>

              <h2>
                What's inside
                <br />
                your ritual.
              </h2>

            </div>


            <button
              type="button"
              onClick={editPreferences}
            >
              EDIT PREFERENCES →
            </button>

          </div>


          <div className="dashboard-category-list">

            {categories.length > 0 ? (

              categories.map(
                (category, index) => {

                  const icons = {
                    Skincare: "◌",
                    Candles: "♨",
                    Journaling: "✎",
                    Wellness: "✦",
                  };

                  const descriptions = {
                    Skincare:
                      "A little glow for your everyday ritual.",

                    Candles:
                      "Slow evenings and softer moments.",

                    Journaling:
                      "Space for thoughts, dreams and plans.",

                    Wellness:
                      "Small rituals for feeling your best.",
                  };

                  return (

                    <div
                      className="dashboard-category-item"
                      key={category}
                    >

                      <span className="category-number">
                        0{index + 1}
                      </span>

                      <div className="category-symbol">
                        {icons[category] || "✦"}
                      </div>

                      <div>

                        <h3>
                          {category}
                        </h3>

                        <p>
                          {descriptions[
                            category
                          ] ||
                            "Curated specially for your Boxify."}
                        </p>

                      </div>

                      <span className="category-check">
                        ✓
                      </span>

                    </div>

                  );
                }
              )

            ) : (

              <div className="dashboard-no-categories">

                <p>
                  No product preferences
                  selected yet.
                </p>

                <button
                  type="button"
                  onClick={editPreferences}
                >
                  CUSTOMIZE MY BOX →
                </button>

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            TRACKING CTA
        ================================================= */}

        {subscription && (

          <section className="dashboard-track-banner">

            <div>

              <p>
                ON ITS WAY
              </p>

              <h2>
                Wondering where
                <br />
                your box is?
              </h2>

              <span>
                Follow your Boxify from
                preparation to your doorstep.
              </span>

            </div>


            <div className="dashboard-track-visual">

              <div className="track-line"></div>

              <div className="track-dot track-dot-one">
                <span>✓</span>
                <small>ORDERED</small>
              </div>

              <div className="track-dot track-dot-two">
                <span>✦</span>
                <small>PREPARING</small>
              </div>

              <div className="track-dot track-dot-three">
                <span>○</span>
                <small>DELIVERY</small>
              </div>

            </div>


            <Link
              to="/track"
              className="dashboard-track-button"
            >
              TRACK MY BOX
              <span>→</span>
            </Link>

          </section>

        )}


        {/* =================================================
            SUBSCRIPTION MANAGEMENT
        ================================================= */}

        <section className="dashboard-manage-section">

          <div>

            <p>
              SUBSCRIPTION
            </p>

            <h2>
              Need a little break?
            </h2>

            <span>
              You can pause or cancel your
              monthly Boxify subscription.
            </span>

          </div>


          <div className="dashboard-manage-actions">

            <button
              type="button"
              className="new-pause-button"
              onClick={pauseSubscription}
              disabled={
                !subscription ||
                subscription.status ===
                  "paused"
              }
            >

              {subscription?.status ===
              "paused"
                ? "SUBSCRIPTION PAUSED"
                : "PAUSE SUBSCRIPTION"}

            </button>


            <button
              type="button"
              className="new-cancel-button"
              onClick={cancelSubscription}
              disabled={!subscription}
            >
              CANCEL
            </button>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="dashboard-footer">

          <Link to="/">
            BOXIFY ✦
          </Link>

          <span>
            SELF-CARE, CURATED FOR YOU.
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Dashboard;