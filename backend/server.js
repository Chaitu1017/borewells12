const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Routes
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
mongoose.connect(
  "mongodb+srv://yerrachaitanya1017:root123@cluster0.hnrld4e.mongodb.net/borewellDB?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// ✅ API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);

// ✅ Serve Frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => 
  res.sendFile(path.join(__dirname, "../frontend/landing.html"))
);
app.get("/signup", (req, res) => 
  res.sendFile(path.join(__dirname, "../frontend/signup.html"))
);
app.get("/login", (req, res) => 
  res.sendFile(path.join(__dirname, "../frontend/login.html"))
);
app.get("/dashboard/customer", (req, res) => 
  res.sendFile(path.join(__dirname, "../frontend/dashboard_customer.html"))
);
app.get("/dashboard/admin", (req, res) => 
  res.sendFile(path.join(__dirname, "../frontend/dashboard_admin.html"))
);

const PORT = 5000;
app.listen(PORT, () => 
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
