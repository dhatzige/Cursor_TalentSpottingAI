'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Calendar, 
  Clock,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  joinedAt: string;
  lastActive?: string;
  invitedBy?: string;
}

interface PendingInvitation {
  id: string;
  email: string;
  expiresAt: string;
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
}

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  // Parse emails in real-time for preview
  const parseEmailsPreview = (input: string) => {
    if (!input.trim()) return [];
    return input
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
  };

  const parsedEmails = parseEmailsPreview(inviteEmails);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      
      const [membersRes, invitationsRes] = await Promise.all([
        fetch('http://localhost:4000/api/organization/members', {
          headers: { 'x-dev-bypass': 'true' }
        }),
        fetch('http://localhost:4000/api/organization/invitations', {
          headers: { 'x-dev-bypass': 'true' }
        })
      ]);

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(membersData.members || []);
        setOrganization(membersData.organization);
      }

      if (invitationsRes.ok) {
        const invitationsData = await invitationsRes.json();
        setInvitations(invitationsData.invitations || []);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
      toast({
        title: "Error",
        description: "Failed to load team data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleInviteMembers = async () => {
    if (!inviteEmails.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one email address",
        variant: "destructive"
      });
      return;
    }

    setIsInviting(true);
    
    try {
      const emails = inviteEmails
        .split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email.length > 0);

      // Test logging to verify email parsing works with both methods
      console.log('📧 Original input:', inviteEmails);
      console.log('✅ Parsed emails:', emails);
      console.log('📊 Email count:', emails.length);

      const response = await fetch('http://localhost:4000/api/organization/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-dev-bypass': 'true'
        },
        body: JSON.stringify({
          emails,
          message: inviteMessage.trim() || undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Invitations Sent",
          description: `Successfully sent ${data.sent.length} invitations${data.failed.length > 0 ? `, ${data.failed.length} failed` : ''}`,
        });
        
        // Clear form and refresh data
        setInviteEmails('');
        setInviteMessage('');
        fetchTeamData();
      } else {
        throw new Error(data.message || 'Failed to send invitations');
      }
    } catch (error) {
      console.error('Error inviting members:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitations",
        variant: "destructive"
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/organization/members/${memberId}`, {
        method: 'DELETE',
        headers: { 'x-dev-bypass': 'true' }
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Member Removed",
          description: `Successfully removed ${memberName} from the team`,
        });
        fetchTeamData();
      } else {
        throw new Error(data.message || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove member",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading team data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your organization's team members and invitations
          </p>
          {organization && (
            <Badge variant="outline" className="mt-2 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
              {organization.name}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Users className="h-4 w-4" />
          <span>{members.length} team member{members.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invite Members Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <span>Invite Team Members</span>
              </CardTitle>
              <CardDescription>
                Add new members to your organization. All members have equal access to the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emails">Email Addresses</Label>
                <Textarea
                  id="emails"
                  placeholder="Enter email addresses (one per line or comma-separated)&#10;john@company.com, jane@company.com&#10;or&#10;bob@company.com"
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
                
                {/* Email parsing preview */}
                {parsedEmails.length > 0 && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Parsed {parsedEmails.length} email{parsedEmails.length !== 1 ? 's' : ''}:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {parsedEmails.map((email, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {email}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message to the invitation..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={handleInviteMembers}
                disabled={isInviting || !inviteEmails.trim()}
                className="w-full"
              >
                {isInviting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Invitations...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitations
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Team Members List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Team Members ({members.length})</span>
              </CardTitle>
              <CardDescription>
                All team members have equal access to the organization dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No team members yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Start by inviting your first team member
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {members.map((member, index) => (
                    <div key={member.id}>
                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                                 <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                             {getInitials(member.name)}
                           </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {member.name}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{member.email}</span>
                            </p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Joined {formatDate(member.joinedAt)}</span>
                              </div>
                              {member.lastActive && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Active {formatRelativeTime(member.lastActive)}</span>
                                </div>
                              )}
                            </div>
                            {member.invitedBy && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Invited by {member.invitedBy}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove <strong>{member.name}</strong> from the organization? 
                                  They will lose access to the dashboard immediately.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveMember(member.id, member.name)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remove Member
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      {index < members.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Pending Invitations ({invitations.length})</span>
            </CardTitle>
            <CardDescription>
              Invitations that haven't been accepted yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations.map((invitation, index) => (
                <div key={invitation.id}>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {invitation.email}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                          <span>Sent {formatDate(invitation.createdAt)}</span>
                          <span>Expires {formatDate(invitation.expiresAt)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-yellow-700 dark:text-yellow-300">
                      Pending
                    </Badge>
                  </div>
                  {index < invitations.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Equal Access:</strong> All team members have the same level of access to your organization dashboard. 
          Anyone can invite new members, view team information, and manage organization settings.
        </AlertDescription>
      </Alert>
    </div>
  );
} 