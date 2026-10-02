import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Customize() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [mood, setMood] = useState("RESET");
  const [categories, setCategories] = useState([]);
  const [fragrance, setFragrance] = useState("Lavender");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =====================================================
  // OPTIONS
  // =====================================================

  const moods = ["RESET", "GLOW", "COZY", "FOCUS"];

  const categoryOptions = [
    "Skincare",
    "Candles",
    "Journaling",
    "Wellness",
  ];

  const fragrances = [
    "Vanilla",
    "Lavender",
    "Rose",
    "None",
  ];

  // =====================================================
  // EDIT OR NEW MODE
  // =====================================================

  const customizeMode =
    localStorage.getItem("customizeMode");

  const isEditMode =
    customizeMode === "edit";

  // =====================================================
  // LOAD EXISTING CUSTOMIZATION
  // =====================================================

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const token =
      localStorage.getItem("token");

    const subscriptionId =
      localStorage.getItem("subscriptionId");

    if (!token) {
      navigate("/auth");
      return;
    }

    if (!subscriptionId) {
      navigate("/dashboard");
      return;
    }

    const loadCustomization = async () => {
      setPageLoading(true);

      try {
        const response = await fetch(
          "https://boxify-1.onrender.com/api/customizations",
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
              "Could not load your preferences."
          );
          return;
        }

        const customizations =
          Array.isArray(data)
            ? data
            : data.customizations || [];

        const currentCustomization =
          customizations.find((item) => {
            const itemSubscriptionId =
              typeof item.subscription === "object"
                ? item.subscription?._id
                : item.subscription;

            return (
              itemSubscriptionId?.toString() ===
              subscriptionId.toString()
            );
          });

        if (currentCustomization) {
          setMood(
            currentCustomization.mood ||
              "RESET"
          );

          setCategories(
            currentCustomization.categories ||
              []
          );

          setFragrance(
            currentCustomization.fragrance ||
              "Lavender"
          );
        }
      } catch (error) {
        console.error(
          "Customization load error:",
          error
        );

        setMessage(
          "Could not load your preferences."
        );
      } finally {
        setPageLoading(false);
      }
    };

    loadCustomization();
  }, [isEditMode, navigate]);

  // =====================================================
  // SELECT / UNSELECT CATEGORY
  // =====================================================

  const toggleCategory = (category) => {
    if (categories.includes(category)) {
      setCategories(
        categories.filter(
          (item) => item !== category
        )
      );
    } else {
      setCategories([
        ...categories,
        category,
      ]);
    }
  };

  // =====================================================
  // SAVE CUSTOMIZATION
  // =====================================================

  const saveCustomization = async (
    subscriptionId,
    token
  ) => {
    const response = await fetch(
      `https://boxify-1.onrender.com/api/customizations/${subscriptionId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          categories,
          fragrance,
          mood,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Could not save customization."
      );
    }

    return data;
  };

  // =====================================================
  // CONTINUE / SAVE
  // =====================================================

  const handleContinue = async () => {
    setMessage("");

    const token =
      localStorage.getItem("token");

    // At least one category required
    if (categories.length === 0) {
      setMessage(
        "Please select at least one category."
      );
      return;
    }

    // ===================================================
    // EDIT MODE
    // ===================================================

    if (isEditMode) {
      if (!token) {
        navigate("/auth");
        return;
      }

      const subscriptionId =
        localStorage.getItem(
          "subscriptionId"
        );

      if (!subscriptionId) {
        setMessage(
          "Subscription not found."
        );
        return;
      }

      setLoading(true);

      try {
        // Only update customization.
        // Do NOT create another subscription.
        await saveCustomization(
          subscriptionId,
          token
        );

        localStorage.removeItem(
          "customizeMode"
        );

        setMessage(
          "Preferences updated successfully!"
        );

        navigate("/dashboard");
      } catch (error) {
        console.error(
          "Update customization error:",
          error
        );

        setMessage(
          error.message ||
            "Could not update preferences."
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    // ===================================================
    // NEW SUBSCRIPTION MODE
    // ===================================================

    const selectedPlanId =
      localStorage.getItem(
        "selectedPlanId"
      );

    if (!selectedPlanId) {
      setMessage(
        "Please select a plan first."
      );
      return;
    }

    // User customized before login
    if (!token) {
      localStorage.setItem(
        "pendingMood",
        mood
      );

      localStorage.setItem(
        "pendingCategories",
        JSON.stringify(categories)
      );

      localStorage.setItem(
        "pendingFragrance",
        fragrance
      );

      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      // ===============================================
      // STEP 1: CREATE SUBSCRIPTION
      // ===============================================

      const subscriptionResponse =
        await fetch(
          "https://boxify-1.onrender.com/api/subscriptions",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              plan: selectedPlanId,
            }),
          }
        );

      const subscriptionData =
        await subscriptionResponse.json();

      if (!subscriptionResponse.ok) {
        setMessage(
          subscriptionData.message ||
            "Could not create subscription."
        );
        return;
      }

      const subscriptionId =
        subscriptionData.subscription?._id ||
        subscriptionData._id;

      if (!subscriptionId) {
        setMessage(
          "Subscription created but ID was not returned."
        );
        return;
      }

      // Save current subscription
      localStorage.setItem(
        "subscriptionId",
        subscriptionId
      );

      // ===============================================
      // STEP 2: SAVE CUSTOMIZATION
      // ===============================================

      await saveCustomization(
        subscriptionId,
        token
      );

      // ===============================================
      // CLEAN TEMP DATA
      // ===============================================

      localStorage.removeItem(
        "pendingMood"
      );

      localStorage.removeItem(
        "pendingCategories"
      );

      localStorage.removeItem(
        "pendingFragrance"
      );

      localStorage.removeItem(
        "customizeMode"
      );

      setMessage(
        "Your Boxify subscription is ready!"
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Subscription error:",
        error
      );

      setMessage(
        error.message ||
          "Cannot connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAGE LOADING
  // =====================================================

  if (pageLoading) {
    return (
      <div className="new-customize-loading">
        <span>✦</span>
        <p>Loading your Boxify...</p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="new-customize-page">

      {/* ================= NAVBAR ================= */}

      <nav className="new-nav">

        <Link
          to="/"
          className="new-logo"
        >
          BOXIFY <span>✦</span>
        </Link>

        <div className="custom-nav-progress">

          <span>01 MOOD</span>
          <i>→</i>

          <span>02 PRODUCTS</span>
          <i>→</i>

          <span>03 SCENT</span>
          <i>→</i>

          <span>04 DONE</span>

        </div>

        <Link
          to={
            isEditMode
              ? "/dashboard"
              : "/plans"
          }
          className="plans-home-btn"
        >
          {isEditMode
            ? "← Dashboard"
            : "← Plans"}
        </Link>

      </nav>


      {/* ================= HEADER ================= */}

      <header className="custom-new-header">

        <p>
          {isEditMode
            ? "YOUR BOX / EDIT MODE"
            : "YOUR BOX / MAKE IT YOURS"}
        </p>

        <h1>
          Build a box that
          <br />
          feels like <em>you.</em>
        </h1>

        <span>
          Pick your mood, favourite products
          and fragrance. Watch your box change
          as you choose.
        </span>

      </header>


      {/* ================= BUILDER ================= */}

      <section className="custom-builder">


        {/* =========================================
            LEFT SIDE
        ========================================= */}

        <div className="custom-builder-form">


          {/* ================= MOOD ================= */}

          <div className="builder-step">

            <div className="builder-step-title">

              <span>01</span>

              <div>
                <p>
                  START WITH A FEELING
                </p>

                <h2>
                  What's your mood?
                </h2>
              </div>

            </div>


            <div className="builder-moods">

              {moods.map((item) => {

                const moodIcons = {
                  RESET: "☁",
                  GLOW: "✦",
                  COZY: "♡",
                  FOCUS: "◌",
                };

                return (
                  <button
                    key={item}
                    type="button"
                    className={
                      mood === item
                        ? `builder-mood mood-${item.toLowerCase()} builder-selected`
                        : `builder-mood mood-${item.toLowerCase()}`
                    }
                    onClick={() =>
                      setMood(item)
                    }
                  >

                    <span>
                      {moodIcons[item]}
                    </span>

                    <strong>
                      {item}
                    </strong>

                    <small>
                      {mood === item
                        ? "SELECTED ✓"
                        : "CHOOSE"}
                    </small>

                  </button>
                );
              })}

            </div>

          </div>


          {/* ================= PRODUCTS ================= */}

          <div className="builder-step">

            <div className="builder-step-title">

              <span>02</span>

              <div>
                <p>
                  WHAT BELONGS IN YOUR BOX?
                </p>

                <h2>
                  Choose your favourites.
                </h2>
              </div>

            </div>


            <div className="builder-products">

              {categoryOptions.map(
                (category) => {

                  const categoryIcons = {
                    Skincare: "◌",
                    Candles: "♨",
                    Journaling: "✎",
                    Wellness: "✦",
                  };

                  const selected =
                    categories.includes(
                      category
                    );

                  return (
                    <button
                      key={category}
                      type="button"
                      className={
                        selected
                          ? "builder-product selected-product"
                          : "builder-product"
                      }
                      onClick={() =>
                        toggleCategory(
                          category
                        )
                      }
                    >

                      <span className="product-choice-icon">
                        {
                          categoryIcons[
                            category
                          ]
                        }
                      </span>

                      <strong>
                        {category}
                      </strong>

                      <span className="product-check">
                        {selected
                          ? "✓"
                          : "+"}
                      </span>

                    </button>
                  );
                }
              )}

            </div>


            <p className="selection-count">

              {categories.length === 0
                ? "Choose at least one product category."
                : `${categories.length} ${
                    categories.length === 1
                      ? "category"
                      : "categories"
                  } selected ✦`}

            </p>

          </div>


          {/* ================= FRAGRANCE ================= */}

          <div className="builder-step">

            <div className="builder-step-title">

              <span>03</span>

              <div>
                <p>
                  THE FINISHING TOUCH
                </p>

                <h2>
                  Pick your fragrance.
                </h2>
              </div>

            </div>


            <div className="builder-fragrances">

              {fragrances.map((item) => (

                <button
                  key={item}
                  type="button"
                  className={
                    fragrance === item
                      ? "builder-fragrance selected-fragrance"
                      : "builder-fragrance"
                  }
                  onClick={() =>
                    setFragrance(item)
                  }
                >

                  <span>
                    {item === "Vanilla"
                      ? "◯"
                      : item === "Lavender"
                      ? "❀"
                      : item === "Rose"
                      ? "♡"
                      : "—"}
                  </span>

                  <strong>
                    {item}
                  </strong>

                  <small>
                    {fragrance === item
                      ? "SELECTED"
                      : "CHOOSE"}
                  </small>

                </button>

              ))}

            </div>

          </div>


          {/* ================= MESSAGE ================= */}

          {message && (
            <div className="custom-new-message">
              {message}
            </div>
          )}


          {/* ================= FINISH ================= */}

          <div className="builder-finish">

            <div>

              <span>
                04 / DONE
              </span>

              <h2>
                Your Boxify is
                <br />
                ready to go.
              </h2>

            </div>


            <button
              type="button"
              className="builder-save-button"
              onClick={handleContinue}
              disabled={loading}
            >

              {loading
                ? isEditMode
                  ? "SAVING..."
                  : "CREATING..."
                : isEditMode
                ? "SAVE CHANGES"
                : "CREATE MY BOX"}

              {!loading && (
                <span>→</span>
              )}

            </button>

          </div>

        </div>


        {/* =========================================
            LIVE PREVIEW
        ========================================= */}

        <aside className="new-box-preview">


          <div className="preview-heading">

            <span>
              LIVE PREVIEW
            </span>

            <strong>
              YOUR BOX
            </strong>

          </div>


          <div
            className={`preview-stage preview-${mood.toLowerCase()}`}
          >

            <span className="preview-floating-star star-one">
              ✦
            </span>

            <span className="preview-floating-star star-two">
              ♡
            </span>


            {/* SKINCARE */}

            {categories.includes(
              "Skincare"
            ) && (

              <div className="preview-item preview-skincare">

                <small>
                  BOXIFY
                </small>

                <strong>
                  DEW
                </strong>

              </div>

            )}


            {/* CANDLE */}

            {categories.includes(
              "Candles"
            ) && (

              <div className="preview-item preview-candle">

                <span>✦</span>

                <strong>
                  REST
                </strong>

              </div>

            )}


            {/* JOURNAL */}

            {categories.includes(
              "Journaling"
            ) && (

              <div className="preview-item preview-journal">

                <small>
                  NOTES
                </small>

                <strong>
                  today.
                </strong>

                <span>
                  ♡
                </span>

              </div>

            )}


            {/* WELLNESS */}

            {categories.includes(
              "Wellness"
            ) && (

              <div className="preview-item preview-wellness">

                <small>
                  RITUAL
                </small>

                <strong>
                  RESET
                </strong>

              </div>

            )}


            {/* ================= MAIN BOX ================= */}

            <div className="custom-main-box">

              <div className="custom-box-lid">

                <small>
                  CURATED FOR YOU
                </small>

                <strong>
                  {mood}
                </strong>

              </div>


              <div className="custom-box-front">

                <p>
                  BOXIFY
                </p>

                <span>

                  {mood === "RESET"
                    ? "☁"
                    : mood === "GLOW"
                    ? "✦"
                    : mood === "COZY"
                    ? "♡"
                    : "◌"}

                </span>

                <small>
                  THE {mood} EDITION
                </small>

              </div>

            </div>

          </div>


          {/* ================= SUMMARY ================= */}

          <div className="preview-summary">


            <div>

              <span>
                MOOD
              </span>

              <strong>
                {mood}
              </strong>

            </div>


            <div>

              <span>
                FRAGRANCE
              </span>

              <strong>
                {fragrance}
              </strong>

            </div>


            <div className="preview-summary-products">

              <span>
                YOUR PICKS
              </span>

              <strong>

                {categories.length > 0
                  ? categories.join(" · ")
                  : "Nothing selected yet"}

              </strong>

            </div>

          </div>


          <p className="preview-small-text">
            Your preview changes as you
            personalize your box ✦
          </p>

        </aside>

      </section>

    </div>
  );
}

export default Customize;