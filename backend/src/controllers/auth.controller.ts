import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Validate required fields
    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });
    
    // Return user data without password
    const { password: _, ...userData } = newUser;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userData,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_default_secret',
      { expiresIn: '24h' }
    );
    
    // Return user data without password
    const { password: _, ...userData } = user;
    
    res.status(200).json({
      message: 'Login successful',
      user: userData,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        organizationId: true,
      },
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};
