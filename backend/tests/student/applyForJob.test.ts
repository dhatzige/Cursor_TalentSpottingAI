import { PrismaClient } from '@prisma/client';
import { applyForJob } from '../../src/controllers/student/applications-controller';
import { Request, Response } from 'express';

// Mock PrismaClient – must be declared BEFORE controller import so ts-jest hoists correctly
jest.mock('@prisma/client', () => {
  const mPrisma = {
    job: {
      findUnique: jest.fn(),
    },
    application: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaClient>;

  return { PrismaClient: jest.fn(() => mPrisma) };
});

// Helper to create mock req/res objects
const createMockReqRes = (overrides: Partial<Request & { file?: any }> = {}) => {
  const req = {
    user: { id: 'student123', role: 'student' },
    params: { jobId: 'job1' },
    body: {},
    file: { path: '/tmp/resume.pdf' },
    ...overrides,
  } as unknown as Request & { file?: any };

  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const res = { status } as unknown as Response;
  return { req, res, status, json };
};

const prismaInstance = new PrismaClient() as any;

describe('applyForJob controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if cover letter length invalid', async () => {
    const { req, res, status, json } = createMockReqRes({ body: { coverLetter: 'too short' } });

    await applyForJob(req as any, res as any);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Cover letter must be between 50 and 4000 characters' });
  });

  it('should return 409 if duplicate application exists', async () => {
    prismaInstance.job.findUnique.mockResolvedValue({ id: 'job1' });
    prismaInstance.application.findFirst.mockResolvedValue({ id: 'appExisting' });

    const longCoverLetter = 'L'.repeat(60);
    const { req, res, status, json } = createMockReqRes({ body: { coverLetter: longCoverLetter } });

    await applyForJob(req as any, res as any);

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({
      message: 'You have already applied for this job',
      applicationId: 'appExisting',
    });
  });

  it('should create application and return 201 on success', async () => {
    prismaInstance.job.findUnique.mockResolvedValue({ id: 'job1' });
    prismaInstance.application.findFirst.mockResolvedValue(null);
    prismaInstance.application.create.mockResolvedValue({ id: 'newApp' });

    const longCoverLetter = 'L'.repeat(60);
    const { req, res, status, json } = createMockReqRes({ body: { coverLetter: longCoverLetter } });

    await applyForJob(req as any, res as any);

    expect(status).toHaveBeenCalledWith(201);
    expect(prismaInstance.application.create).toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith({
      message: 'Application submitted successfully',
      applicationId: 'newApp',
    });
  });
});
