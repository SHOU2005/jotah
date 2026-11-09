import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { robotsTxt, sitemapXml } from "@shared/site";
import { hasDatabase, isAdmin, listOrders, updateOrder } from "@shared/orders-db";
import { addScore, cleanName, hasScoresDb, MAX_SCORE, topScores, weekKey } from "@shared/scores-db";
import { createPaymentOrder, ORDERS_RETIRED, verifyPayment } from "@shared/razorpay";

export async function registerRoutes(app: Express): Promise<Server> {
  // SEO: robots.txt and sitemap.xml
  app.get("/robots.txt", (_req, res) => { res.type("text/plain").send(robotsTxt()); });
  app.get("/sitemap.xml", (_req, res) => { res.type("application/xml").send(sitemapXml()); });

  // ── Game leaderboard (same logic as api/scores.ts) ──
  app.get("/api/scores", async (_req, res) => {
    if (!hasScoresDb()) return res.status(503).json({ message: "Leaderboard unavailable" });
    res.json({ week: weekKey(), top: await topScores(10) });
  });
  app.post("/api/scores", async (req, res) => {
    if (!hasScoresDb()) return res.status(503).json({ message: "Leaderboard unavailable" });
    const name = cleanName(req.body?.name);
    if (!name) return res.status(400).json({ message: "Use 2–16 letters or numbers for your name" });
    const score = Number(req.body?.score);
    if (!Number.isInteger(score) || score < 1 || score > MAX_SCORE) return res.status(400).json({ message: "Invalid score" });
    res.status(201).json(await addScore(name, score));
  });

  // ── Shop orders (same logic as the Vercel Functions in /api) ──
  app.post("/api/orders", (_req, res) => {
    res.status(ORDERS_RETIRED.status).json(ORDERS_RETIRED.body);
  });

  // ── Razorpay online payment (same logic as api/create-order.ts, api/verify-payment.ts) ──
  app.post("/api/create-order", async (req, res) => {
    const { status, body } = await createPaymentOrder(req.body);
    res.status(status).json(body);
  });
  app.post("/api/verify-payment", async (req, res) => {
    const { status, body } = await verifyPayment(req.body);
    res.status(status).json(body);
  });

  app.get("/api/admin", async (req, res) => {
    if (!isAdmin(req.get("x-admin-key"))) return res.status(401).json({ message: "Wrong admin password" });
    if (!hasDatabase()) return res.status(503).json({ message: "Database not connected yet" });
    res.set("cache-control", "no-store").json(await listOrders());
  });

  app.patch("/api/admin", async (req, res) => {
    if (!isAdmin(req.get("x-admin-key"))) return res.status(401).json({ message: "Wrong admin password" });
    if (!hasDatabase()) return res.status(503).json({ message: "Database not connected yet" });
    try {
      const { id, status, paymentStatus, adminNote } = req.body ?? {};
      const updated = await updateOrder(String(id), { status, paymentStatus, adminNote });
      if (!updated) return res.status(404).json({ message: "Order not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Update failed" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      
      // In a real application, you would send an email here
      console.log("New contact submission:", contact);
      
      res.json({ success: true, message: "Contact form submitted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data",
          errors: error.errors 
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit contact form" 
        });
      }
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    if (!isAdmin(req.get("x-admin-key"))) return res.status(401).json({ message: "Unauthorized" });
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Dealer search
  app.get("/api/dealers/search", async (req, res) => {
    try {
      const { city, zipCode } = req.query;
      const dealers = await storage.searchDealers(
        city as string,
        zipCode as string
      );
      res.json(dealers);
    } catch (error) {
      console.error("Error searching dealers:", error);
      res.status(500).json({ message: "Failed to search dealers" });
    }
  });

  // Get all dealers
  app.get("/api/dealers", async (req, res) => {
    try {
      const dealers = await storage.getAllDealers();
      res.json(dealers);
    } catch (error) {
      console.error("Error fetching dealers:", error);
      res.status(500).json({ message: "Failed to fetch dealers" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
