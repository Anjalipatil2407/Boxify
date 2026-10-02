import { useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://boxify-1.onrender.com");

function SocketTest() {
  const [status, setStatus] = useState("packed");

  const updateShipment = () => {
    socket.emit("updateShipmentStatus", {
      shipmentId: "6abdfdd6fb21d2e375e5d071",
      status: status
    });
  };

  return (
    <div style={{ padding: "50px" }}>

      <h1>Socket.io Test</h1>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="preparing">
          Preparing
        </option>

        <option value="packed">
          Packed
        </option>

        <option value="shipped">
          Shipped
        </option>

        <option value="in transit">
          In Transit
        </option>

        <option value="delivered">
          Delivered
        </option>
      </select>

      <button
        onClick={updateShipment}
        style={{ marginLeft: "15px" }}
      >
        Update Status
      </button>

    </div>
  );
}

export default SocketTest;