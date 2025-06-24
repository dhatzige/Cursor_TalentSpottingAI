import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { ApiError } from '../../middleware/errorMiddleware';
import { AuthRequest } from '../../middleware/authMiddleware';
import crypto from 'crypto';
import { z } from 'zod';

// Validation schemas
const inviteSchema = z.object({
  emails: z.array(z.string().email('Invalid email address')).min(1, 'At least one email is required'),
  message: z.string().optional()
});

const acceptInviteSchema = z.object({
  token: z.string().min(1, 'Token is required')
});

// Helper function to generate secure tokens
const generateInviteToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Helper function to check if user is part of organization
const checkOrganizationMembership = async (userId: string, organizationId: string) => {
  const member = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organizationId,
      isActive: true
    }
  });

  if (!member) {
    throw new ApiError('You are not a member of this organization', 403);
  }

  return member;
};

/**
 * Invite team members to organization
 * @route POST /api/organization/invite
 */
export const inviteTeamMembers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const userEmail = (req as any).user?.email;
    
    if (!userId && !userEmail) {
      throw new ApiError('User not authenticated', 401);
    }

    const validationResult = inviteSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw new ApiError('Invalid request data', 400);
    }

    const { emails, message } = validationResult.data;

    // Get user's organization (handle dev bypass)
    let user;
    if (userId === 'dev-user-123' && userEmail) {
      user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { organization: true }
      });
    } else {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { organization: true }
      });
    }

    if (!user?.organizationId) {
      throw new ApiError('You must be part of an organization to invite members', 400);
    }

    // Check if user is a member (any member can invite others)
    await checkOrganizationMembership(user.id, user.organizationId);

    const results = {
      sent: [] as string[],
      failed: [] as string[],
      inviteIds: [] as string[]
    };

    for (const email of emails) {
      try {
        // Check if user is already a member
        const existingMember = await prisma.organizationMember.findFirst({
          where: {
            organizationId: user.organizationId,
            user: { email }
          }
        });

        if (existingMember) {
          results.failed.push(email);
          continue;
        }

        // Check if there's already a pending invitation
        const existingInvite = await prisma.organizationInvite.findFirst({
          where: {
            email,
            organizationId: user.organizationId,
            acceptedAt: null,
            expiresAt: { gt: new Date() }
          }
        });

        if (existingInvite) {
          results.failed.push(email);
          continue;
        }

        // Create invitation
        const token = generateInviteToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

        const invitation = await prisma.organizationInvite.create({
          data: {
            email,
            organizationId: user.organizationId,
            token,
            invitedBy: user.id,
            expiresAt
          }
        });

        // TODO: Send email invitation here
        // await sendInvitationEmail(email, token, user.organization.name, message);

        results.sent.push(email);
        results.inviteIds.push(invitation.id);
      } catch (error) {
        console.error(`Failed to invite ${email}:`, error);
        results.failed.push(email);
      }
    }

    res.json({
      success: true,
      message: `Sent ${results.sent.length} invitations, ${results.failed.length} failed`,
      ...results
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Accept organization invitation
 * @route POST /api/organization/invite/accept
 */
export const acceptInvitation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new ApiError('User not authenticated', 401);
    }

    const validationResult = acceptInviteSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw new ApiError('Invalid token', 400);
    }

    const { token } = validationResult.data;

    // Find invitation
    const invitation = await prisma.organizationInvite.findUnique({
      where: { token },
      include: { organization: true }
    });

    if (!invitation) {
      throw new ApiError('Invalid or expired invitation', 404);
    }

    if (invitation.acceptedAt) {
      throw new ApiError('Invitation already accepted', 400);
    }

    if (invitation.expiresAt < new Date()) {
      throw new ApiError('Invitation has expired', 400);
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.email !== invitation.email) {
      throw new ApiError('Invitation email does not match your account', 400);
    }

    // Check if user is already a member
    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        userId,
        organizationId: invitation.organizationId
      }
    });

    if (existingMember) {
      throw new ApiError('You are already a member of this organization', 400);
    }

    // Create organization membership
    await prisma.organizationMember.create({
      data: {
        userId,
        organizationId: invitation.organizationId,
        invitedById: invitation.invitedBy,
        acceptedAt: new Date()
      }
    });

    // Update user's organization if they don't have one
    if (!user.organizationId) {
      await prisma.user.update({
        where: { id: userId },
        data: { organizationId: invitation.organizationId }
      });
    }

    // Mark invitation as accepted
    await prisma.organizationInvite.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() }
    });

    res.json({
      success: true,
      message: 'Successfully joined organization',
      organization: {
        id: invitation.organization.id,
        name: invitation.organization.name
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get team members
 * @route GET /api/organization/members
 */
export const getTeamMembers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const userEmail = (req as any).user?.email;
    
    if (!userId && !userEmail) {
      throw new ApiError('User not authenticated', 401);
    }

    // Get user's organization (handle dev bypass)
    let user;
    if (userId === 'dev-user-123' && userEmail) {
      user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { organization: true }
      });
    } else {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { organization: true }
      });
    }

    if (!user?.organizationId) {
      throw new ApiError('You are not part of any organization', 400);
    }

    // Check if user is a member
    await checkOrganizationMembership(user.id, user.organizationId);

    // Get team members
    const members = await prisma.organizationMember.findMany({
      where: {
        organizationId: user.organizationId,
        isActive: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            lastActive: true
          }
        },
        invitedBy: {
          select: {
            name: true
          }
        }
      },
      orderBy: { acceptedAt: 'asc' }
    });

    const formattedMembers = members.map(member => ({
      id: member.id,
      userId: member.user.id,
      name: member.user.name,
      email: member.user.email,
      joinedAt: member.acceptedAt,
      lastActive: member.user.lastActive,
      invitedBy: member.invitedBy?.name
    }));

    res.json({
      success: true,
      members: formattedMembers,
      organization: user.organization ? {
        id: user.organization.id,
        name: user.organization.name
      } : null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get pending invitations
 * @route GET /api/organization/invitations
 */
export const getInvitations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new ApiError('User not authenticated', 401);
    }

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user?.organizationId) {
      throw new ApiError('You are not part of any organization', 400);
    }

    // Check if user is a member (any member can view invitations)
    await checkOrganizationMembership(userId, user.organizationId);

    // Get pending invitations
    const invitations = await prisma.organizationInvite.findMany({
      where: {
        organizationId: user.organizationId,
        acceptedAt: null,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      invitations: invitations.map(invite => ({
        id: invite.id,
        email: invite.email,
        expiresAt: invite.expiresAt,
        createdAt: invite.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove member from organization
 * @route DELETE /api/organization/members/:memberId
 */
export const removeMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { memberId } = req.params;

    if (!userId) {
      throw new ApiError('User not authenticated', 401);
    }

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user?.organizationId) {
      throw new ApiError('You are not part of any organization', 400);
    }

    // Check if user is a member (any member can remove others)
    await checkOrganizationMembership(userId, user.organizationId);

    // Get target member
    const targetMember = await prisma.organizationMember.findFirst({
      where: {
        id: memberId,
        organizationId: user.organizationId,
        isActive: true
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (!targetMember) {
      throw new ApiError('Member not found', 404);
    }

    // Deactivate member instead of deleting (for audit trail)
    await prisma.organizationMember.update({
      where: { id: memberId },
      data: { isActive: false }
    });

    // If this was the user's primary organization, clear it
    if (targetMember.userId !== userId) {
      const targetUser = await prisma.user.findUnique({
        where: { id: targetMember.userId }
      });

      if (targetUser?.organizationId === user.organizationId) {
        await prisma.user.update({
          where: { id: targetMember.userId },
          data: { organizationId: null }
        });
      }
    }

    res.json({
      success: true,
      message: `Successfully removed ${targetMember.user.name} from the organization`,
      removedMember: {
        name: targetMember.user.name,
        email: targetMember.user.email
      }
    });
  } catch (error) {
    next(error);
  }
}; 