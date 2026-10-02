import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function Track() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =====================================================
  // FETCH USER'S SHIPMENT
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchShipment = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/shipments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message ||
              "Could not load shipment."
          );
          return;
        }

        const shipments = Array.isArray(data)
          ? data
          : data.shipments || [];

        if (shipments.length > 0) {
          // Last shipment = newest shipment
          const newestShipment =
            shipments[shipments.length - 1];

          setShipment(newestShipment);
          setMessage("");
        } else {
          setShipment(null);

          setMessage(
            "No shipment found yet."
          );
        }
      } catch (error) {
        console.error(
          "Shipment fetch error:",
          error
        );

        setMessage(
          "Cannot connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [navigate]);

  // =====================================================
  // SOCKET.IO - LIVE SHIPMENT UPDATE
  // =====================================================

  useEffect(() => {
    const socket = io(
      "http://localhost:3000"
    );

    socket.on(
      "shipmentStatusUpdated",
      (updatedShipment) => {
        console.log(
          "Live shipment update:",
          updatedShipment
        );

        setShipment(
          (currentShipment) => {
            // Ignore updates for another shipment
            if (
              !currentShipment ||
              currentShipment._id !==
                updatedShipment._id
            ) {
              return currentShipment;
            }

            // Update current shipment
            return {
              ...currentShipment,
              ...updatedShipment,
            };
          }
        );
      }
    );

    // Disconnect when leaving Track page
    return () => {
      socket.disconnect();
    };
  }, []);

  // =====================================================
  // SHIPMENT STATUS LEVEL
  // =====================================================

  const getStatusLevel = (status) => {
    const currentStatus =
      status?.toLowerCase();

    switch (currentStatus) {
      case "preparing":
        return 1;

      case "packed":
        return 2;

      case "shipped":
      case "in transit":
        return 3;

      case "delivered":
        return 4;

      default:
        return 0;
    }
  };

  const statusLevel = getStatusLevel(
    shipment?.status
  );

  // =====================================================
  // SHIPMENT TIMELINE
  // =====================================================

  const shipmentSteps = [
    {
      name: "Box confirmed",
      shortName: "CONFIRMED",
      icon: "✓",
      description:
        "Your Boxify order has been confirmed.",
      completed: Boolean(shipment),
    },

    {
      name: "Preparing your box",
      shortName: "PREPARING",
      icon: "✦",
      description:
        "We're curating your products.",
      completed: statusLevel >= 1,
    },

    {
      name: "Packed with care",
      shortName: "PACKED",
      icon: "□",
      description:
        "Your box is almost ready to travel.",
      completed: statusLevel >= 2,
    },

    {
      name: "On the way",
      shortName: "ON THE WAY",
      icon: "→",
      description:
        "Your Boxify package is travelling to you.",
      completed: statusLevel >= 3,
    },

    {
      name: "Delivered",
      shortName: "DELIVERED",
      icon: "♡",
      description:
        "Time to unbox your ritual ✦",
      completed: statusLevel >= 4,
    },
  ];

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // CURRENT STEP
  // =====================================================

  const getCurrentStepText = () => {
    const status =
      shipment?.status?.toLowerCase();

    switch (status) {
      case "preparing":
        return "We're curating your box";

      case "packed":
        return "Your box is packed";

      case "shipped":
      case "in transit":
        return "Your box is on the way";

      case "delivered":
        return "Your Boxify has arrived";

      default:
        return "Your box journey has started";
    }
  };

  // =====================================================
  // PROGRESS %
  // =====================================================

  const progressPercentage =
    shipment && statusLevel === 0
      ? 5
      : statusLevel === 1
      ? 25
      : statusLevel === 2
      ? 50
      : statusLevel === 3
      ? 75
      : statusLevel === 4
      ? 100
      : 0;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="new-track-loading">
        <span>✦</span>

        <h2>
          Finding your Boxify...
        </h2>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="new-track-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="new-track-nav">
        <Link
          to="/"
          className="new-track-logo"
        >
          BOXIFY <span>✦</span>
        </Link>

        <div className="new-track-nav-links">
          <Link to="/dashboard">
            MY BOX
          </Link>

          <span className="track-nav-active">
            TRACK
          </span>

          <Link to="/plans">
            PLANS
          </Link>
        </div>

        <Link
          to="/dashboard"
          className="track-dashboard-button"
        >
          ← DASHBOARD
        </Link>
      </nav>

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="new-track-header">
        <div>
          <p className="new-track-eyebrow">
            YOUR BOX JOURNEY / LIVE
          </p>

          <h1>
            Good things are
            <br />
            <em>on their way.</em>
          </h1>

          <p className="new-track-description">
            Follow your Boxify from our
            hands to your doorstep. Your
            journey updates automatically
            as your package moves.
          </p>
        </div>

        {shipment && (
          <div className="track-live-indicator">
            <span></span>

            <div>
              <small>
                LIVE TRACKING
              </small>

              <strong>
                CONNECTED
              </strong>
            </div>
          </div>
        )}
      </header>

      {/* =================================================
          ERROR / NO SHIPMENT
      ================================================= */}

      {message && !shipment && (
        <section className="new-track-empty">
          <span>□</span>

          <p>
            NOTHING TO TRACK YET
          </p>

          <h2>
            Your next box
            <br />
            starts here.
          </h2>

          <span className="track-empty-description">
            {message}
          </span>

          <Link to="/plans">
            CHOOSE A PLAN →
          </Link>
        </section>
      )}

      {/* =================================================
          SHIPMENT
      ================================================= */}

      {shipment && (
        <>
          {/* =============================================
              HERO TRACKING CARD
          ============================================= */}

          <section className="track-feature-section">

            {/* LEFT */}

            <div className="track-feature-copy">
              <div className="track-feature-top">
                <p>
                  CURRENT STATUS
                </p>

                <span className="track-live-pill">
                  <i></i>
                  LIVE
                </span>
              </div>

              <div className="track-current-icon">
                {shipment.status
                  ?.toLowerCase() ===
                "delivered"
                  ? "♡"
                  : shipment.status
                        ?.toLowerCase() ===
                      "in transit" ||
                    shipment.status
                      ?.toLowerCase() ===
                      "shipped"
                  ? "→"
                  : shipment.status
                        ?.toLowerCase() ===
                      "packed"
                  ? "□"
                  : "✦"}
              </div>

              <h2>
                {getCurrentStepText()}.
              </h2>

              <p className="track-current-description">
                {shipment.status
                  ?.toLowerCase() ===
                "delivered"
                  ? "Your monthly self-care ritual has reached your doorstep."
                  : "Your Boxify is moving through its journey. We'll keep this page updated for you."}
              </p>

              <div className="track-status-row">
                <span>
                  STATUS
                </span>

                <strong>
                  {shipment.status?.toUpperCase()}
                </strong>
              </div>
            </div>

            {/* RIGHT PACKAGE VISUAL */}

            <div className="track-package-area">
              <span className="track-floating-decoration track-deco-one">
                ✦
              </span>

              <span className="track-floating-decoration track-deco-two">
                ♡
              </span>

              <span className="track-floating-decoration track-deco-three">
                ✦
              </span>

              <div className="track-package-shadow"></div>

              <div
                className={
                  statusLevel >= 3
                    ? "track-package moving-package"
                    : "track-package"
                }
              >
                <div className="track-package-top">
                  <span>
                    CURATED WITH CARE
                  </span>
                </div>

                <div className="track-package-front">
                  <p>
                    BOXIFY
                  </p>

                  <span>
                    ✦
                  </span>

                  <small>
                    SELF-CARE / DELIVERED
                    DIFFERENTLY
                  </small>
                </div>

                <div className="track-package-label">
                  <small>
                    SHIP TO
                  </small>

                  <strong>
                    YOU ♡
                  </strong>

                  <span>
                    {shipment.trackingNumber}
                  </span>
                </div>
              </div>

              {statusLevel >= 3 &&
                statusLevel < 4 && (
                  <div className="track-motion-lines">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
            </div>
          </section>

          {/* =============================================
              INFORMATION BAR
          ============================================= */}

          <section className="track-info-bar">

            <div>
              <span>
                TRACKING NUMBER
              </span>

              <strong>
                {shipment.trackingNumber}
              </strong>
            </div>

            <div>
              <span>
                YOUR BOX
              </span>

              <strong>
                {shipment.subscription?.plan
                  ?.name || "Boxify"}
              </strong>
            </div>

            <div>
              <span>
                ESTIMATED DELIVERY
              </span>

              <strong>
                {formatDate(
                  shipment.estimatedDelivery
                )}
              </strong>
            </div>

            <div>
              <span>
                STATUS
              </span>

              <strong className="track-info-status">
                <i></i>
                {shipment.status?.toUpperCase()}
              </strong>
            </div>
          </section>

          {/* =============================================
              PROGRESS
          ============================================= */}

          <section className="new-track-progress-section">
            <div className="track-progress-heading">
              <div>
                <p>
                  FROM US TO YOU
                </p>

                <h2>
                  Your box journey.
                </h2>
              </div>

              <div className="track-progress-percentage">
                <strong>
                  {progressPercentage}%
                </strong>

                <span>
                  COMPLETE
                </span>
              </div>
            </div>

            {/* MAIN PROGRESS BAR */}

            <div className="new-track-progress-bar">
              <div
                className="new-track-progress-fill"
                style={{
                  width: `${progressPercentage}%`,
                }}
              ></div>
            </div>

            {/* DESKTOP STEP DOTS */}

            <div className="track-horizontal-steps">
              {shipmentSteps.map(
                (step, index) => (
                  <div
                    className={
                      step.completed
                        ? "track-horizontal-step completed-track-step"
                        : "track-horizontal-step"
                    }
                    key={step.name}
                  >
                    <div className="horizontal-step-dot">
                      {step.completed
                        ? "✓"
                        : index + 1}
                    </div>

                    <small>
                      {step.shortName}
                    </small>
                  </div>
                )
              )}
            </div>
          </section>

          {/* =============================================
              DETAILED JOURNEY
          ============================================= */}

          <section className="track-journey-section">
            <div className="track-journey-heading">
              <p>
                STEP BY STEP
              </p>

              <h2>
                The journey,
                <br />
                so far.
              </h2>
            </div>

            <div className="new-track-timeline">
              {shipmentSteps.map(
                (step, index) => (
                  <div
                    className={
                      step.completed
                        ? "new-track-step new-track-step-complete"
                        : "new-track-step"
                    }
                    key={step.name}
                  >
                    {/* NUMBER */}

                    <div className="new-track-step-number">
                      0{index + 1}
                    </div>

                    {/* ICON */}

                    <div className="new-track-step-icon">
                      {step.completed
                        ? "✓"
                        : step.icon}
                    </div>

                    {/* CONTENT */}

                    <div className="new-track-step-content">
                      <span>
                        {step.completed
                          ? "COMPLETED"
                          : "UP NEXT"}
                      </span>

                      <h3>
                        {step.name}
                      </h3>

                      <p>
                        {step.description}
                      </p>
                    </div>

                    {/* STATE */}

                    <div className="new-track-step-state">
                      {step.completed ? (
                        <span className="journey-complete">
                          DONE
                        </span>
                      ) : (
                        <span>
                          —
                        </span>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* =============================================
              LIVE UPDATE EXPLANATION
          ============================================= */}

          <section className="track-live-section">
            <div className="track-live-symbol">
              <span>✦</span>

              <div className="live-ring ring-one"></div>
              <div className="live-ring ring-two"></div>
            </div>

            <div className="track-live-copy">
              <p>
                LIVE WITH SOCKET.IO
              </p>

              <h2>
                No refreshing
                <br />
                required.
              </h2>

              <span>
                When your shipment status
                changes, this page updates
                automatically in real time.
              </span>
            </div>

            <div className="track-live-status-card">
              <span>
                CONNECTION
              </span>

              <strong>
                <i></i>
                LISTENING
              </strong>

              <small>
                shipmentStatusUpdated
              </small>
            </div>
          </section>

          {/* =============================================
              BOTTOM CTA
          ============================================= */}

          <section className="track-bottom-section">
            <div>
              <p>
                WHILE YOU WAIT
              </p>

              <h2>
                Your ritual is
                <br />
                almost home.
              </h2>
            </div>

            <Link to="/dashboard">
              BACK TO MY BOX
              <span>→</span>
            </Link>
          </section>
        </>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="track-footer">
        <Link to="/">
          BOXIFY ✦
        </Link>

        <span>
          SELF-CARE, CURATED FOR YOU.
        </span>
      </footer>
    </div>
  );
}

export default Track;