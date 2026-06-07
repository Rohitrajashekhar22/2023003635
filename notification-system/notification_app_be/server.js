const express = require("express");
const cors = require("cors");
const pool = require("./db");
const { Log, getToken } = require("./logger");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  Log("notification_app_be", "info", "middleware", `${req.method} ${req.url}`);
  next();
});

app.get("/notifications", async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const notificationType = req.query.notification_type;
    const offset = (page - 1) * limit;

    let where = "";
    const params = [];

    if (notificationType) {
      where = " WHERE notification_type = ?";
      params.push(notificationType);
    }

    const [rows] = await pool.query(
      `SELECT * FROM notifications${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [count] = await pool.query(
      `SELECT COUNT(*) AS total FROM notifications${where}`,
      params
    );

    res.json({
      notifications: rows,
      total: count[0].total,
      page,
      limit
    });
  } catch (err) {
    console.error(err);
    Log("notification_app_be", "error", "controller", "Get notifications failed");
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/notifications/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM notifications WHERE id=?", [
      req.params.id
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    Log("notification_app_be", "error", "controller", "Get notification failed");
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/notifications", async (req, res) => {
  try {
    const { student_id, title, notification_type, message } = req.body;

    await pool.query(
      "INSERT INTO notifications(student_id, title, notification_type, message) VALUES(?,?,?,?)",
      [student_id || 1, title || "Notification", notification_type, message]
    );

    res.json({ message: "Notification created" });
  } catch (err) {
    Log("notification_app_be", "error", "controller", "Create notification failed");
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/notifications/:id/read", async (req, res) => {
  try {
    await pool.query("UPDATE notifications SET is_read=1 WHERE id=?", [
      req.params.id
    ]);

    res.json({ message: "Marked as read" });
  } catch (err) {
    Log("notification_app_be", "error", "controller", "Mark read failed");
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/notifications/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM notifications WHERE id=?", [req.params.id]);

    res.json({ message: "Deleted" });
  } catch (err) {
    Log("notification_app_be", "error", "controller", "Delete notification failed");
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/external-notifications", async (req, res) => {
  try {
    Log("notification_app_be", "info", "route", "Fetching external notifications");

    const token = await getToken();

    const response = await fetch(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("External API failed");
    }

    const data = await response.json();

    Log("notification_app_be", "info", "route", "External notifications fetched");

    res.json(data);
  } catch (err) {
    Log("notification_app_be", "error", "route", "External API failed");
    res.status(500).json({ error: "External API failed" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});