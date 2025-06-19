"use client";
import { useState, ChangeEvent } from 'react';
import { EventType } from '../types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface EventFormData {
  title: string;
  type: EventType;
  date: string;
  description: string;
  mode: 'online' | 'in_person' | 'hybrid';
  locationAddress?: string;
  locationLink?: string;
  isFree: boolean;
  price?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  sharedTo: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => void;
  role: 'university' | 'employer';
}

export default function EventFormModal({ isOpen, onClose, onSave, role }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('career_fair');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'online' | 'in_person' | 'hybrid'>('in_person');
  const [locationAddress, setLocationAddress] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [sharedTo, setSharedTo] = useState<string[]>([]);

  const reset = () => {
    setTitle('');
    setType('career_fair');
    setDate('');
    setDescription('');
    setSharedTo([]);
    setMode('online');
    setLocationAddress('');
    setLocationLink('');
    setIsFree(true);
    setPrice('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
  };

  const save = () => {
    onSave({
      title,
      type,
      date,
      description,
      mode,
      locationAddress: mode !== 'online' ? locationAddress : undefined,
      locationLink: locationLink || undefined,
      isFree,
      price: isFree ? undefined : Number(price),
      contactName: contactName || undefined,
      contactEmail: contactEmail || undefined,
      contactPhone: contactPhone || undefined,
      sharedTo,
    });
    reset();
    onClose();
  };

  const shareOptions = role === 'university'
    ? [
        { id: 'students', label: 'Your Students' },
        { id: 'companies', label: 'Partner Companies' },
      ]
    : [
        { id: 'universities', label: 'Partner Universities' },
        { id: 'companies', label: 'Companies' },
      ];

  const toggleShare = (id: string) => {
    setSharedTo((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={title} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select onValueChange={(value: EventType) => setType(value)} defaultValue={type}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="career_fair">Career Fair</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="webinar">Webinar</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mode" className="text-right">Mode</Label>
            <Select onValueChange={(value: 'online' | 'in_person' | 'hybrid') => setMode(value)} defaultValue={mode}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in_person">In-Person</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {mode !== 'online' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationAddress" className="text-right">Location</Label>
              <Input id="locationAddress" placeholder="123 Main St..." value={locationAddress} onChange={(e: ChangeEvent<HTMLInputElement>) => setLocationAddress(e.target.value)} className="col-span-3" />
            </div>
          )}
           <div className="grid grid-cols-4 items-center gap-4">
             <Label className="text-right">Pricing</Label>
             <RadioGroup defaultValue="free" className="col-span-3 flex items-center space-x-4" onValueChange={(value: string) => setIsFree(value === 'free')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="r1" />
                  <Label htmlFor="r1">Free</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="r2" />
                  <Label htmlFor="r2">Paid</Label>
                </div>
                {!isFree && (
                    <Input type="number" min="0" placeholder="Price (€)" className="w-32" value={price} onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)} />
                )}
             </RadioGroup>
           </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Share With</Label>
            <div className="col-span-3 space-y-2">
                {shareOptions.map((opt) => (
                    <div key={opt.id} className="flex items-center space-x-2">
                        <Checkbox id={opt.id} onCheckedChange={() => toggleShare(opt.id)} checked={sharedTo.includes(opt.id)} />
                        <label htmlFor={opt.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{opt.label}</label>
                    </div>
                ))}
            </div>
           </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save}>Save Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
