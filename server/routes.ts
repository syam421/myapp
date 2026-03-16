import express, { type Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import expressSession from "express-session";
import MemoryStore from "memorystore";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Basic session types
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const SessionStore = MemoryStore(expressSession);
  app.use(
    expressSession({
      cookie: { maxAge: 86400000 },
      store: new SessionStore({
        checkPeriod: 86400000,
      }),
      resave: false,
      saveUninitialized: false,
      secret: "cloudnest-secret-key",
    })
  );

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Auth Routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(input.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Basic password handling (in a real app, hash this)
      const user = await storage.createUser({
          email: input.email,
          password: input.password,
          name: input.name
      });
      
      req.session.userId = user.id;
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(input.email);
      
      if (!user || user.password !== input.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(401).json({ message: "Not found" });
    }
    res.json(user);
  });

  // Folders Routes
  app.get(api.folders.list.path, requireAuth, async (req, res) => {
    try {
      const { parentId } = req.query;
      const parsedParentId = parentId ? parseInt(parentId as string) : undefined;
      const folders = await storage.getFolders(req.session.userId!, parsedParentId);
      res.json(folders);
    } catch(err) {
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.post(api.folders.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.folders.create.input.parse(req.body);
      const folder = await storage.createFolder({
        name: input.name,
        parentId: input.parentId || null,
        userId: req.session.userId!
      });
      res.status(201).json(folder);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.delete(api.folders.delete.path, requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFolder(id, req.session.userId!);
      res.status(204).send();
    } catch(err) {
      res.status(500).json({ message: "Internal error" });
    }
  });

  // Files Routes
  app.get(api.files.list.path, requireAuth, async (req, res) => {
     try {
       const { folderId, category, search, isFavorite } = req.query;
       const parsedFolderId = folderId ? parseInt(folderId as string) : undefined;
       
       const files = await storage.getFiles(
           req.session.userId!, 
           parsedFolderId, 
           category as string, 
           search as string, 
           isFavorite as string
       );
       res.json(files);
     } catch(err) {
       res.status(500).json({ message: "Internal error" });
     }
  });

  app.get(api.files.get.path, requireAuth, async (req, res) => {
     try {
         const id = parseInt(req.params.id);
         const file = await storage.getFile(id, req.session.userId!);
         if (!file) return res.status(404).json({ message: "File not found" });
         res.json(file);
     } catch(err) {
         res.status(500).json({ message: "Internal error" });
     }
  });

  app.patch(api.files.update.path, requireAuth, async (req, res) => {
      try {
         const id = parseInt(req.params.id);
         const input = api.files.update.input.parse(req.body);
         const updated = await storage.updateFile(id, req.session.userId!, input);
         if (!updated) return res.status(404).json({ message: "File not found" });
         res.json(updated);
      } catch(err) {
          if (err instanceof z.ZodError) {
              return res.status(400).json({ message: err.errors[0].message });
          }
          res.status(500).json({ message: "Internal error" });
      }
  });

  app.delete(api.files.delete.path, requireAuth, async (req, res) => {
      try {
          const id = parseInt(req.params.id);
          const file = await storage.getFile(id, req.session.userId!);
          if (file) {
              // Delete actual file if needed (not implementing complex fs logic for demo, but good practice)
              await storage.deleteFile(id, req.session.userId!);
          }
          res.status(204).send();
      } catch(err) {
          res.status(500).json({ message: "Internal error" });
      }
  });

  // File Upload Route (Custom, not in shared/routes.ts since it uses FormData)
  app.post("/api/files/upload", requireAuth, upload.single('file'), async (req, res) => {
     if (!req.file) {
         return res.status(400).json({ message: "No file uploaded" });
     }
     
     try {
         const folderId = req.body.folderId ? parseInt(req.body.folderId) : null;
         
         // Determine category
         let category = 'other';
         if (req.file.mimetype.startsWith('image/')) category = 'image';
         else if (req.file.mimetype.startsWith('video/')) category = 'video';
         else if (req.file.mimetype.startsWith('audio/')) category = 'audio';
         else if (req.file.mimetype.includes('pdf') || req.file.mimetype.includes('document')) category = 'document';

         const file = await storage.createFile({
             userId: req.session.userId!,
             folderId: folderId,
             filename: req.file.filename,
             originalName: req.file.originalname,
             mimeType: req.file.mimetype,
             size: req.file.size,
             category,
             url: `/uploads/${req.file.filename}`, // Serve from express static
             isFavorite: false,
             isPublic: false
         });
         
         res.status(201).json(file);
     } catch(err) {
         console.error(err);
         res.status(500).json({ message: "Upload failed" });
     }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  app.get(api.stats.get.path, requireAuth, async (req, res) => {
     try {
         const stats = await storage.getStats(req.session.userId!);
         res.json(stats);
     } catch(err) {
         res.status(500).json({ message: "Internal error" });
     }
  });

  return httpServer;
}
