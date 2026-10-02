import { Link } from "react-router-dom";
import { useState } from "react";

function Home() {
  const [activeMood, setActiveMood] = useState("GLOW");

  const moods = [
    {
      name: "RESET",
      icon: "☁",
      number: "01",
      text: "Slow down, breathe and begin again.",
    },
    {
      name: "GLOW",
      icon: "✦",
      number: "02",
      text: "Feel fresh, confident and radiant.",
    },
    {
      name: "COZY",
      icon: "♡",
      number: "03",
      text: "Soft comfort for slower days.",
    },
    {
      name: "FOCUS",
      icon: "◌",
      number: "04",
      text: "Clear your mind and get things done.",
    },
  ];

  return (
    <div className="new-home">

      {/* ================= NAVBAR ================= */}

      <nav className="new-nav">

        <Link to="/" className="new-logo">
          BOXIFY <span>✦</span>
        </Link>

        <div className="new-nav-links">
          <a href="#moods">Moods</a>
          <a href="#inside">Inside the Box</a>
          <a href="#how">How It Works</a>
          <Link to="/plans">Plans</Link>
        </div>

        <div className="new-nav-actions">
          <Link to="/auth" className="new-login">
            Login
          </Link>

          <Link to="/plans" className="new-nav-button">
            Build My Box <span>→</span>
          </Link>
        </div>

      </nav>


      {/* ================= HERO ================= */}

      <main className="new-hero">

        <div className="new-hero-copy">

          <p className="new-kicker">
            SELF-CARE, CURATED FOR YOU ✦
          </p>

          <h1>
            Your month.
            <br />

            Your mood.
            <br />

            <em>Your Boxify.</em>
          </h1>

          <p className="new-hero-text">
            A monthly self-care box built around how you're
            actually feeling — filled with little rituals
            chosen just for you.
          </p>

          <div className="new-hero-price">
            <span>STARTING AT</span>

            <strong>₹499</strong>

            <small>/ month</small>
          </div>

          <div className="new-hero-actions">

            <Link to="/plans" className="new-primary-button">
              BUILD MY BOX
              <span>→</span>
            </Link>

            <a href="#moods" className="new-explore">
              Explore Boxify ↓
            </a>

          </div>

          <div className="new-trust-row">
            <span>✦ Mood based</span>
            <span>♡ Personalized</span>
            <span>□ Monthly</span>
          </div>

        </div>


        {/* HERO PRODUCT VISUAL */}

        <div className="new-hero-art">

          <div className="hero-art-circle"></div>

          <div className="hero-note note-top">
            THIS MONTH
            <strong>GLOW ✦</strong>
          </div>

          <div className="hero-product product-bottle">
            <span>BOXIFY</span>
            <strong>GLOW</strong>
            <small>face serum</small>
          </div>

          <div className="hero-product product-candle">
            <span>✦</span>
            <strong>slow</strong>
            <small>vanilla candle</small>
          </div>

          <div className="hero-product product-journal">
            <small>BOXIFY NOTES</small>
            <strong>
              today
              <br />
              feels
              <br />
              good.
            </strong>
            <span>♡</span>
          </div>

          <div className="hero-main-box">

            <div className="box-lid">
              <span>CURATED FOR</span>
              <strong>YOU.</strong>
            </div>

            <div className="box-front">
              <p>BOXIFY</p>
              <span>✦</span>
              <small>THE GLOW EDITION</small>
            </div>

          </div>

          <div className="hero-note note-bottom">
            FROM
            <strong>₹499 / MONTH</strong>
          </div>

        </div>

      </main>


      {/* ================= MARQUEE ================= */}

      <div className="new-marquee">

        <div>
          <span>SKINCARE</span>
          <b>✦</b>

          <span>CANDLES</span>
          <b>✦</b>

          <span>JOURNALING</span>
          <b>✦</b>

          <span>WELLNESS</span>
          <b>✦</b>

          <span>YOUR MOOD</span>
          <b>✦</b>

          <span>YOUR BOX</span>
        </div>

      </div>


      {/* ================= MOODS ================= */}

      <section className="new-moods" id="moods">

        <div className="new-section-heading">

          <div>
            <p>01 / START WITH A FEELING</p>

            <h2>
              How do you want
              <br />
              to feel this month?
            </h2>
          </div>

          <p className="new-section-copy">
            Pick your mood. We'll use it to shape
            the personality of your Boxify experience.
          </p>

        </div>


        <div className="new-mood-grid">

          {moods.map((mood) => (

            <button
              type="button"
              key={mood.name}
              className={`new-mood-card mood-${mood.name.toLowerCase()} ${
                activeMood === mood.name ? "active-mood" : ""
              }`}
              onClick={() => setActiveMood(mood.name)}
            >

              <div className="mood-card-top">
                <span>{mood.number}</span>

                <span className="new-mood-icon">
                  {mood.icon}
                </span>
              </div>

              <div className="mood-card-bottom">

                <h3>{mood.name}</h3>

                <p>{mood.text}</p>

                <span className="mood-select-arrow">
                  {activeMood === mood.name ? "SELECTED ✓" : "CHOOSE →"}
                </span>

              </div>

            </button>

          ))}

        </div>


        <div className="mood-result">

          <span>Your mood</span>

          <strong>
            {activeMood}{" "}
            {moods.find((mood) => mood.name === activeMood)?.icon}
          </strong>

          <Link to="/plans">
            Continue with {activeMood} →
          </Link>

        </div>

      </section>


      {/* ================= INSIDE BOX ================= */}

      <section className="new-inside" id="inside">

        <div className="inside-title">

          <p>02 / LITTLE THINGS, CHOSEN WELL</p>

          <h2>
            What's waiting
            <br />
            inside?
          </h2>

        </div>


        <div className="product-showcase">

          <article className="showcase-card skincare-card">

            <div className="fake-product serum-product">
              <small>BOXIFY</small>
              <strong>DEW</strong>
              <span>01</span>
            </div>

            <div className="showcase-info">
              <span>01</span>

              <div>
                <h3>Skincare</h3>
                <p>
                  Everyday essentials for your
                  little glow ritual.
                </p>
              </div>
            </div>

          </article>


          <article className="showcase-card candle-card">

            <div className="fake-product candle-product">
              <span>✦</span>
              <strong>REST</strong>
              <small>slow burn</small>
            </div>

            <div className="showcase-info">
              <span>02</span>

              <div>
                <h3>Candles</h3>
                <p>
                  Scents designed for softer,
                  slower evenings.
                </p>
              </div>
            </div>

          </article>


          <article className="showcase-card journal-card">

            <div className="fake-product journal-product">
              <small>NOTES TO SELF</small>

              <strong>
                take
                <br />
                your
                <br />
                time.
              </strong>

              <span>♡</span>
            </div>

            <div className="showcase-info">
              <span>03</span>

              <div>
                <h3>Journaling</h3>
                <p>
                  A little space for thoughts,
                  plans and reflection.
                </p>
              </div>
            </div>

          </article>


          <article className="showcase-card wellness-card">

            <div className="fake-product wellness-product">
              <span>BOXIFY</span>
              <strong>RESET</strong>
              <small>wellness ritual</small>
            </div>

            <div className="showcase-info">
              <span>04</span>

              <div>
                <h3>Wellness</h3>
                <p>
                  Tiny rituals made to make
                  everyday life feel better.
                </p>
              </div>
            </div>

          </article>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="new-how" id="how">

        <div className="how-intro">

          <p>03 / FROM MOOD TO DOORSTEP</p>

          <h2>
            Your box.
            <br />
            Four simple steps.
          </h2>

        </div>


        <div className="new-steps">

          <div className="new-step">
            <span>01</span>
            <div className="step-symbol">☁</div>
            <h3>Pick a mood</h3>
            <p>Tell Boxify how you want to feel.</p>
          </div>

          <div className="new-step">
            <span>02</span>
            <div className="step-symbol">₹</div>
            <h3>Choose a plan</h3>
            <p>Pick the box that fits your month.</p>
          </div>

          <div className="new-step">
            <span>03</span>
            <div className="step-symbol">♡</div>
            <h3>Make it yours</h3>
            <p>Choose categories and fragrance.</p>
          </div>

          <div className="new-step">
            <span>04</span>
            <div className="step-symbol">→</div>
            <h3>Track your box</h3>
            <p>Follow your Boxify journey live.</p>
          </div>

        </div>

      </section>


      {/* ================= PLANS TEASER ================= */}

      <section className="home-plans">

        <div className="home-plans-copy">

          <p>04 / PICK YOUR BOX</p>

          <h2>
            A little.
            <br />
            A lot.
            <br />
            <em>Or luxe.</em>
          </h2>

          <Link to="/plans">
            Compare all plans →
          </Link>

        </div>


        <div className="home-plan-stack">

          <Link to="/plans" className="stack-plan mini-stack">

            <div>
              <span>01</span>
              <h3>MINI</h3>
            </div>

            <div>
              <strong>₹499</strong>
              <span>→</span>
            </div>

          </Link>


          <Link to="/plans" className="stack-plan plus-stack">

            <div>
              <span>02 · MOST LOVED</span>
              <h3>SELF-CARE PLUS</h3>
            </div>

            <div>
              <strong>₹999</strong>
              <span>→</span>
            </div>

          </Link>


          <Link to="/plans" className="stack-plan luxe-stack">

            <div>
              <span>03</span>
              <h3>LUXE</h3>
            </div>

            <div>
              <strong>₹1499</strong>
              <span>→</span>
            </div>

          </Link>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}

      <section className="new-final-cta">

        <span className="cta-star">✦</span>

        <p>YOUR NEXT RITUAL IS WAITING</p>

        <h2>
          Make this month
          <br />
          feel a little more
          <em> you.</em>
        </h2>

        <Link to="/plans">
          BUILD MY BOX
          <span>→</span>
        </Link>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="new-footer">

        <div className="footer-brand">
          <h2>BOXIFY ✦</h2>

          <p>
            Self-care for whatever
            <br />
            this month feels like.
          </p>
        </div>


        <div className="new-footer-links">

          <div>
            <span>EXPLORE</span>

            <a href="#moods">Moods</a>
            <Link to="/plans">Plans</Link>
            <Link to="/track">Track</Link>
          </div>

          <div>
            <span>ACCOUNT</span>

            <Link to="/auth">Login</Link>
            <Link to="/dashboard">My Box</Link>
          </div>

        </div>


        <p className="new-copyright">
          © 2026 BOXIFY
        </p>

      </footer>

    </div>
  );
}

export default Home;