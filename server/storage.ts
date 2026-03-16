import { db } from "./db";
import { users, folders, files, type User, type InsertUser, type Folder, type InsertFolder, type File, type InsertFile } from "@shared/schema";
import { eq, and, like, or } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Folders
  getFolders(userId: number, parentId?: number | null): Promise<Folder[]>;
  createFolder(folder: InsertFolder & { userId: number }): Promise<Folder>;
  deleteFolder(id: number, userId: number): Promise<void>;

  // Files
  getFiles(userId: number, folderId?: number | null, category?: string, search?: string, isFavorite?: string): Promise<File[]>;
  getFile(id: number, userId: number): Promise<File | undefined>;
  createFile(file: InsertFile & { userId: number }): Promise<File>;
  updateFile(id: number, userId: number, updates: Partial<InsertFile>): Promise<File | undefined>;
  deleteFile(id: number, userId: number): Promise<void>;
  
  // Stats
  getStats(userId: number): Promise<{ totalFiles: number, totalSize: number, categories: Record<string, number> }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getFolders(userId: number, parentId?: number | null): Promise<Folder[]> {
    let query = db.select().from(folders).where(eq(folders.userId, userId));
    
    // Explicit check for undefined or null vs explicit null mapping
    if (parentId !== undefined) {
       const [results] = await db.select().from(folders).where(and(eq(folders.userId, userId), parentId === null ? or(eq(folders.parentId, null as any)) : eq(folders.parentId, parentId)));
       // Drizzle makes querying nulls tricky in 'and'. So let's filter after for simplicity or use custom where
    }

    const allFolders = await query;
    if (parentId !== undefined) {
      return allFolders.filter(f => f.parentId === parentId);
    }
    return allFolders;
  }

  async createFolder(folder: InsertFolder & { userId: number }): Promise<Folder> {
    const [created] = await db.insert(folders).values(folder).returning();
    return created;
  }

  async deleteFolder(id: number, userId: number): Promise<void> {
    await db.delete(folders).where(and(eq(folders.id, id), eq(folders.userId, userId)));
  }

  async getFiles(userId: number, folderId?: number | null, category?: string, search?: string, isFavorite?: string): Promise<File[]> {
    const conditions = [eq(files.userId, userId)];
    
    if (category) {
      conditions.push(eq(files.category, category));
    }
    
    if (search) {
      conditions.push(like(files.filename, `%${search}%`));
    }
    
    if (isFavorite === "true") {
      conditions.push(eq(files.isFavorite, true));
    }

    let query = db.select().from(files).where(and(...conditions));
    let allFiles = await query;
    
    if (folderId !== undefined) {
        allFiles = allFiles.filter(f => f.folderId === folderId);
    }
    
    return allFiles;
  }

  async getFile(id: number, userId: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(and(eq(files.id, id), eq(files.userId, userId)));
    return file;
  }

  async createFile(file: InsertFile & { userId: number }): Promise<File> {
    const [created] = await db.insert(files).values(file).returning();
    return created;
  }

  async updateFile(id: number, userId: number, updates: Partial<InsertFile>): Promise<File | undefined> {
    const [updated] = await db.update(files).set(updates).where(and(eq(files.id, id), eq(files.userId, userId))).returning();
    return updated;
  }

  async deleteFile(id: number, userId: number): Promise<void> {
    await db.delete(files).where(and(eq(files.id, id), eq(files.userId, userId)));
  }

  async getStats(userId: number) {
     const allFiles = await db.select().from(files).where(eq(files.userId, userId));
     
     let totalSize = 0;
     let categories: Record<string, number> = {
         'image': 0,
         'video': 0,
         'audio': 0,
         'document': 0,
         'other': 0
     };
     
     for (const f of allFiles) {
         totalSize += f.size;
         if (categories[f.category] !== undefined) {
             categories[f.category] += f.size;
         } else {
             categories['other'] += f.size;
         }
     }
     
     return {
         totalFiles: allFiles.length,
         totalSize,
         categories
     };
  }
}

export const storage = new DatabaseStorage();
