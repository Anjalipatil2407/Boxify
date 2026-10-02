import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminShipments() {

  const navigate = useNavigate();

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);


  // =====================================================
  // GET ALL SHIPMENTS - ADMIN ONLY
  // =====================================================

  const fetchShipments = async () => {

    const token =
      localStorage.getItem("token");


    if (!token) {

      navigate("/auth");

      return;

    }


    try {

      const response = await fetch(
        "https://boxify-1.onrender.com/api/shipments/admin/all",
        {
          headers: {

            Authorization:
              `Bearer ${token}`

          }
        }
      );


      const data =
        await response.json();


      if (response.status === 403) {

        setMessage(
          "Access denied. Please login with an admin account."
        );

        return;

      }


      if (!response.ok) {

        setMessage(
          data.message ||
          "Could not load shipments."
        );

        return;

      }


      setShipments(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (error) {

      console.error(
        "Admin shipment error:",
        error
      );

      setMessage(
        "Cannot connect to server."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD SHIPMENTS
  // =====================================================

  useEffect(() => {

    fetchShipments();

  }, []);


  // =====================================================
  // UPDATE SHIPMENT STATUS - ADMIN ONLY
  // =====================================================

  const updateStatus = async (
    shipmentId,
    newStatus
  ) => {

    const token =
      localStorage.getItem("token");


    setUpdatingId(shipmentId);
    setMessage("");


    try {

      const response = await fetch(

        `https://boxify-1.onrender.com/api/shipments/${shipmentId}/status`,

        {

          method: "PUT",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`

          },

          body: JSON.stringify({

            status: newStatus

          })

        }

      );


      const data =
        await response.json();


      if (response.status === 403) {

        setMessage(
          "Access denied. Admin account required."
        );

        return;

      }


      if (!response.ok) {

        setMessage(
          data.message ||
          "Could not update shipment."
        );

        return;

      }


      // Update admin screen immediately
      setShipments(
        (currentShipments) =>
          currentShipments.map(
            (shipment) =>
              shipment._id === shipmentId
                ? data.shipment
                : shipment
          )
      );


      setMessage(
        `Shipment changed to ${newStatus.toUpperCase()} ✓`
      );


    } catch (error) {

      console.error(
        "Status update error:",
        error
      );

      setMessage(
        "Cannot connect to server."
      );

    } finally {

      setUpdatingId(null);

    }

  };


  // =====================================================
  // PROGRESS
  // =====================================================

  const getProgress = (status) => {

    switch (
      status?.toLowerCase()
    ) {

      case "preparing":
        return 25;

      case "packed":
        return 50;

      case "shipped":
      case "in transit":
        return 75;

      case "delivered":
        return 100;

      default:
        return 0;

    }

  };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="admin-shipment-page">


      {/* NAVBAR */}

      <nav className="admin-shipment-nav">

        <Link
          to="/"
          className="admin-logo"
        >
          BOXIFY ✦
        </Link>


        <span>
          ADMIN / SHIPMENTS
        </span>


        <Link
          to="/"
          className="admin-dashboard-link"
        >
          CUSTOMER SITE →
        </Link>

      </nav>


      {/* HEADER */}

      <header className="admin-shipment-header">

        <p>
          BOXIFY OPERATIONS
        </p>

        <h1>
          Shipment
          <br />
          <em>control.</em>
        </h1>

        <span>
          Manage customer shipments and
          update delivery progress in real time.
        </span>

      </header>


      {/* MESSAGE */}

      {message && (

        <div className="admin-message">

          {message}

        </div>

      )}


      {/* LOADING */}

      {loading && (

        <div className="admin-loading">

          Loading customer shipments...

        </div>

      )}


      {/* NO SHIPMENTS */}

      {!loading &&
        shipments.length === 0 &&
        !message && (

          <div className="admin-no-shipments">

            <span>□</span>

            <h2>
              No shipments yet.
            </h2>

            <p>
              Customer shipments will appear here.
            </p>

          </div>

        )}


      {/* SHIPMENT LIST */}

      {!loading &&
        shipments.map(
          (shipment) => {

            const progress =
              getProgress(
                shipment.status
              );


            const customer =
              shipment
                .subscription
                ?.user;


            const plan =
              shipment
                .subscription
                ?.plan;


            return (

              <section
                className="admin-shipment-card"
                key={shipment._id}
              >


                {/* TOP */}

                <div className="admin-card-top">

                  <div>

                    <span>
                      TRACKING NUMBER
                    </span>

                    <h2>
                      {
                        shipment.trackingNumber
                      }
                    </h2>

                  </div>


                  <div
                    className="admin-current-status"
                  >

                    <span></span>

                    {
                      shipment.status
                        ?.toUpperCase()
                    }

                  </div>

                </div>


                {/* INFORMATION */}

                <div className="admin-shipment-info">


                  {/* CUSTOMER */}

                  <div>

                    <span>
                      CUSTOMER
                    </span>

                    <strong>
                      {
                        customer?.name ||
                        "Customer"
                      }
                    </strong>

                    {customer?.email && (

                      <small
                        style={{
                          display: "block",
                          marginTop: "5px",
                          opacity: 0.6
                        }}
                      >
                        {customer.email}
                      </small>

                    )}

                  </div>


                  {/* PLAN */}

                  <div>

                    <span>
                      PLAN
                    </span>

                    <strong>

                      {
                        plan?.name ||
                        "Boxify Plan"
                      }

                    </strong>

                  </div>


                  {/* PROGRESS */}

                  <div>

                    <span>
                      PROGRESS
                    </span>

                    <strong>
                      {progress}%
                    </strong>

                  </div>

                </div>


                {/* PROGRESS BAR */}

                <div className="admin-progress">

                  <div
                    style={{
                      width:
                        `${progress}%`
                    }}
                  ></div>

                </div>


                {/* STATUS CONTROL */}

                <div className="admin-status-control">

                  <p>
                    UPDATE DELIVERY STATUS
                  </p>


                  <div className="admin-status-buttons">


                    <button
                      onClick={() =>
                        updateStatus(
                          shipment._id,
                          "preparing"
                        )
                      }
                      className={
                        shipment.status ===
                        "preparing"
                          ? "admin-status-active"
                          : ""
                      }
                      disabled={
                        updatingId ===
                        shipment._id
                      }
                    >
                      PREPARING
                    </button>


                    <button
                      onClick={() =>
                        updateStatus(
                          shipment._id,
                          "packed"
                        )
                      }
                      className={
                        shipment.status ===
                        "packed"
                          ? "admin-status-active"
                          : ""
                      }
                      disabled={
                        updatingId ===
                        shipment._id
                      }
                    >
                      PACKED
                    </button>


                    <button
                      onClick={() =>
                        updateStatus(
                          shipment._id,
                          "shipped"
                        )
                      }
                      className={
                        shipment.status ===
                        "shipped"
                          ? "admin-status-active"
                          : ""
                      }
                      disabled={
                        updatingId ===
                        shipment._id
                      }
                    >
                      SHIPPED
                    </button>


                    <button
                      onClick={() =>
                        updateStatus(
                          shipment._id,
                          "delivered"
                        )
                      }
                      className={
                        shipment.status ===
                        "delivered"
                          ? "admin-status-active"
                          : ""
                      }
                      disabled={
                        updatingId ===
                        shipment._id
                      }
                    >
                      DELIVERED
                    </button>


                  </div>

                </div>

              </section>

            );

          }
        )}

    </div>

  );

}

export default AdminShipments;