"use client";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if(open && items.length === 0) load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function load(){
    setLoading(true);
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' });
      const data = await res.json();
      setItems(data.notifications || []);
    } catch(e){
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" aria-label="Notifications" onClick={()=> setOpen(o=> !o)}>
        {/* bell icon handled by parent previously; keep consistent by children injection */}
        { /* Placeholder; parent will not pass icon so we import dynamic? Simpler: keep textless button; rely on aria-label. */ }
        <span className="relative inline-block h-5 w-5">
          <span className="absolute inset-0 rounded-full border border-primary/50" />
        </span>
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto rounded-md border border-gray-300 bg-background shadow-xl z-50 p-2 text-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Notifications</span>
            <button onClick={()=> setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
          </div>
          {loading && (
            <div className="flex items-center gap-2 py-6 justify-center text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
          )}
          {!loading && items.length === 0 && <div className="py-6 text-center text-muted-foreground">No notifications</div>}
          {!loading && items.map(n => (
            <div key={n.id} className="rounded-md p-2 hover:bg-accent flex flex-col gap-0.5 transition-all">
              <span className="font-medium text-foreground text-sm">{n.title}</span>
              <span className="text-xs text-muted-foreground leading-snug">{n.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}