import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Plans() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // GET PLANS
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(
          "https://boxify-1.onrender.com/api/plans"
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Could not load plans.");
          return;
        }

        const planList = Array.isArray(data)
          ? data
          : data.plans || [];

        setPlans(planList);

      } catch (error) {
        console.error("Plan fetch error:", error);
        setMessage("Cannot connect to the server.");

      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // CHOOSE PLAN
  const choosePlan = (plan) => {
    localStorage.setItem("selectedPlanId", plan._id);
    localStorage.setItem("selectedPlanName", plan.name);
    localStorage.setItem("selectedPlanPrice", plan.price);

    localStorage.setItem("customizeMode", "new");
    localStorage.removeItem("subscriptionId");

    navigate("/customize");
  };

  // PLAN UI DETAILS
  const getPlanUI = (plan) => {
    if (plan.name === "Mini Box") {
      return {
        number: "01",
        tag: "THE ESSENTIALS",
        symbol: "♡",
        theme: "new-plan-mini",
        items: [
          "2–3 curated products",
          "Mood personalization",
          "Choose your favourites",
          "Monthly delivery",
        ],
      };
    }

    if (plan.name === "Self-Care Plus") {
      return {
        number: "02",
        tag: "MOST LOVED",
        symbol: "✦",
        theme: "new-plan-plus",
        items: [
          "4–5 curated products",
          "Full mood personalization",
          "Fragrance preference",
          "Monthly delivery",
        ],
      };
    }

    return {
      number: "03",
      tag: "THE FULL RITUAL",
      symbol: "◌",
      theme: "new-plan-luxe",
      items: [
        "6+ curated products",
        "Premium self-care selection",
        "Mood + fragrance personalization",
        "Monthly delivery",
      ],
    };
  };

  return (
    <div className="new-plans-page">

      {/* NAVBAR */}
      <nav className="new-nav">
        <Link to="/" className="new-logo">
          BOXIFY <span>✦</span>
        </Link>

        <div className="new-nav-links">
          <Link to="/">Home</Link>
          <Link to="/plans">Plans</Link>
          <Link to="/track">Track</Link>
        </div>

        <div className="new-nav-actions">
          <Link to="/auth" className="new-login">
            Login
          </Link>

          <Link to="/" className="plans-home-btn">
            ← Back Home
          </Link>
        </div>
      </nav>


      {/* HEADER */}
      <section className="new-plans-header">

        <p>01 / CHOOSE YOUR RITUAL</p>

        <h1>
          Pick your kind
          <br />
          of <em>self-care.</em>
        </h1>

        <div className="plans-header-bottom">
          <p>
            Whether you want a small monthly reset or the
            full ritual, there's a Boxify made for your month.
          </p>

          <span>
            STARTING AT ₹499 / MONTH
          </span>
        </div>

      </section>


      {/* LOADING */}
      {loading && (
        <div className="new-plan-status">
          <span>✦</span>
          <p>Preparing your plans...</p>
        </div>
      )}


      {/* ERROR */}
      {!loading && message && (
        <div className="new-plan-status">
          <p>{message}</p>
        </div>
      )}


      {/* PLAN CARDS */}
      {!loading && plans.length > 0 && (

        <section className="new-plans-grid">

          {plans.map((plan) => {
            const ui = getPlanUI(plan);

            return (
              <article
                key={plan._id}
                className={`new-plan-card ${ui.theme}`}
              >

                <div className="new-plan-top">

                  <span className="new-plan-number">
                    {ui.number}
                  </span>

                  <span className="new-plan-tag">
                    {ui.tag}
                  </span>

                </div>


                <div className="new-plan-visual">

                  <div className="plan-box-art">

                    <small>BOXIFY</small>

                    <span>{ui.symbol}</span>

                    <strong>
                      {plan.name === "Mini Box"
                        ? "MINI"
                        : plan.name === "Self-Care Plus"
                        ? "PLUS"
                        : "LUXE"}
                    </strong>

                    <p>
                      CURATED FOR YOU
                    </p>

                  </div>

                </div>


                <div className="new-plan-content">

                  <h2>{plan.name}</h2>

                  <p className="new-plan-description">
                    {plan.description ||
                      "A personalized self-care box curated around you."}
                  </p>


                  <div className="new-plan-price">

                    <span>₹</span>

                    <strong>
                      {plan.price}
                    </strong>

                    <small>/ month</small>

                  </div>


                  <div className="new-plan-line"></div>


                  <div className="new-plan-includes">

                    <p>WHAT'S INSIDE</p>

                    {ui.items.map((item) => (
                      <div key={item}>
                        <span>✦</span>
                        {item}
                      </div>
                    ))}

                  </div>


                  <button
                    type="button"
                    className="new-choose-plan"
                    onClick={() => choosePlan(plan)}
                  >
                    CHOOSE {plan.name.toUpperCase()}
                    <span>→</span>
                  </button>

                </div>

              </article>
            );
          })}

        </section>

      )}


      {/* BOTTOM MESSAGE */}
      <section className="plans-bottom-message">

        <span>♡</span>

        <h2>
          Whichever you choose,
          <br />
          we'll make it <em>yours.</em>
        </h2>

        <p>
          Choose your mood, categories and fragrance
          after selecting a plan.
        </p>

      </section>

    </div>
  );
}

export default Plans;