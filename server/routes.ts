import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { buildOrder, orderWhatsAppText } from "@shared/products";
import { robotsTxt, sitemapXml } from "@shared/site";
import { hasDatabase, isAdmin, listOrders, saveOrder, updateOrder } from "@shared/orders-db";

export async function registerRoutes(app: Express): Promise<Server> {
  // SEO: robots.txt and sitemap.xml
  app.get("/robots.txt", (_req, res) => { res.type("text/plain").send(robotsTxt()); });
  app.get("/sitemap.xml", (_req, res) => { res.type("application/xml").send(sitemapXml()); });

  // ── Shop orders (same logic as the Vercel Functions in /api) ──
  app.post("/api/orders", async (req, res) => {
    const result = buildOrder(req.body);
    if (!result.ok) return res.status(400).json({ message: result.message });
    const order = result.order;
    console.log(`🛒 NEW ORDER ${order.id}\n${orderWhatsAppText(order)}\n`);
    if (hasDatabase()) {
      try { await saveOrder(order); } catch (err) { console.error(`DB SAVE FAILED for ${order.id}`, err); }
    }
    res.status(201).json(order);
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
