import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Users, Plus, Search, ChevronRight } from "lucide-react";

const MyCircle = () => {
  const [count, setCount] = useState<number>(0);
  const [members, setMembers] = useState<{ name: string; phone: string }[]>([]);

  const handleCountChange = (val: string) => {
    const n = parseInt(val || "0", 10) || 0;
    setCount(n);
    setMembers((prev) => {
      const next = [...prev];
      while (next.length < n) next.push({ name: "", phone: "" });
      return next.slice(0, n);
    });
  };

  const updateMember = (idx: number, key: "name" | "phone", value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [key]: value } : m)));
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary"/> My Circle</CardTitle>
        <CardDescription>Add family & friends</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-sm">
          <Label>No. of members travelling</Label>
          <Select onValueChange={handleCountChange}>
            <SelectTrigger className="glass-card border-glass-border mt-1"><SelectValue placeholder="Select count"/></SelectTrigger>
            <SelectContent className="glass-card border-glass-border">
              {[0,1,2,3,4,5,6].map(n => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-2">
                <div>
                  <Label>Member {i + 1} Name</Label>
                  <Input value={members[i]?.name || ""} onChange={e => updateMember(i, "name", e.target.value)} className="glass-card border-glass-border"/>
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input value={members[i]?.phone || ""} onChange={e => updateMember(i, "phone", e.target.value)} className="glass-card border-glass-border"/>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {count > 0 && (
          <Button className="btn-hero">Save Circle</Button>
        )}
      </CardContent>
    </Card>
  );
};

const FindAITribe = () => {
  const [destination, setDestination] = useState("Jaipur");
  const [dates, setDates] = useState({ start: "2025-10-10", end: "2025-10-14" });
  const [budget, setBudget] = useState("Mid");
  const [interests, setInterests] = useState<string[]>(["Heritage", "Food"]);

  // Mock recommender ("ML model")
  const recommendations = useMemo(() => {
    const people = [
      { name: "Arjun", interests: ["Heritage", "Photography"], dates: "Oct 10-14", score: 0.86 },
      { name: "Meera", interests: ["Food", "Markets"], dates: "Oct 11-15", score: 0.81 },
      { name: "Ravi", interests: ["Adventure", "Heritage"], dates: "Oct 9-13", score: 0.72 },
    ];
    const scoreBoost = (p: any) => p.interests.filter((x: string) => interests.includes(x)).length * 0.1 + (destination ? 0.2 : 0);
    return people.map(p => ({ ...p, score: Math.min(0.99, p.score + scoreBoost(p)) })).sort((a,b)=>b.score-a.score);
  }, [destination, interests]);

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Trip Preferences</CardTitle>
          <CardDescription>We will match travelers with similar preferences and dates</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Destination</Label>
            <Input value={destination} onChange={e=>setDestination(e.target.value)} className="glass-card border-glass-border"/>
          </div>
          <div>
            <Label>Start Date</Label>
            <Input type="date" value={dates.start} onChange={e=>setDates(s=>({...s,start:e.target.value}))} className="glass-card border-glass-border"/>
          </div>
          <div>
            <Label>End Date</Label>
            <Input type="date" value={dates.end} onChange={e=>setDates(s=>({...s,end:e.target.value}))} className="glass-card border-glass-border"/>
          </div>
          <div>
            <Label>Budget</Label>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger className="glass-card border-glass-border"><SelectValue/></SelectTrigger>
              <SelectContent className="glass-card border-glass-border">
                {['Low','Mid','High'].map(b=> (<SelectItem key={b} value={b}>{b}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Interests (comma separated)</Label>
            <Input value={interests.join(', ')} onChange={e=>setInterests(e.target.value.split(',').map(x=>x.trim()).filter(Boolean))} className="glass-card border-glass-border"/>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recommended Travel Tribe</CardTitle>
          <CardDescription>Match with people going to {destination}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between glass-card p-3 rounded">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-muted-foreground">Interests: {p.interests.join(', ')} • Dates: {p.dates}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm">Match: {(p.score*100).toFixed(0)}%</div>
                <Button className="btn-hero">Request Match</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const JoinOrCreateTribe = () => {
  const groups = [
    { title: "Delhi Heritage Walk", dates: "Oct 12-14", activities: ["Red Fort", "Humayun's Tomb"], total: 6, open: 2 },
    { title: "Jaipur Food & Forts", dates: "Oct 10-13", activities: ["Amber Fort", "Chokhi Dhani"], total: 8, open: 3 },
    { title: "Rishikesh Adventure", dates: "Oct 18-20", activities: ["Rafting", "Cliff Jumping"], total: 10, open: 4 },
  ];

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Open Travel Groups</CardTitle>
          <CardDescription>Join a group heading to your destination</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {groups.map((g, i) => (
            <div key={i} className="glass-card p-3 rounded flex items-center justify-between">
              <div>
                <div className="font-semibold">{g.title}</div>
                <div className="text-sm text-muted-foreground">{g.dates} • Activities: {g.activities.join(', ')}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm">{g.total - g.open}/{g.total} filled</div>
                <Button className="btn-hero">Join</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Create a Tribe</CardTitle>
          <CardDescription>Start a new travel group and invite others</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Title</Label>
            <Input placeholder="e.g., Goa Beaches & Cafes" className="glass-card border-glass-border"/>
          </div>
          <div>
            <Label>Dates</Label>
            <Input placeholder="e.g., Nov 1-5" className="glass-card border-glass-border"/>
          </div>
          <div className="md:col-span-2">
            <Label>Activities</Label>
            <Input placeholder="e.g., Beach walk, Cafe hopping, Night market" className="glass-card border-glass-border"/>
          </div>
          <div>
            <Label>Total Spots</Label>
            <Input type="number" placeholder="8" className="glass-card border-glass-border"/>
          </div>
          <div>
            <Label>Open Spots</Label>
            <Input type="number" placeholder="3" className="glass-card border-glass-border"/>
          </div>
          <div className="md:col-span-2">
            <Button className="btn-hero"><Plus className="h-4 w-4 mr-1"/> Create Tribe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TravelCirclePage = () => {
  const [active, setActive] = useState<'mycircle' | 'newcircle'>('mycircle');
  const [subTab, setSubTab] = useState<'find' | 'join'>('find');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="text-3xl font-bold mb-6">Travel Circle</motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {active === 'mycircle' ? (
            <MyCircle />
          ) : (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Find Your Travel Companion</CardTitle>
                <CardDescription>Discover or join a tribe that matches your travel plans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Top navbar for New Circle */}
                <div className="flex justify-end">
                  <Tabs value={subTab} onValueChange={(v)=>setSubTab(v as any)}>
                    <TabsList>
                      <TabsTrigger value="find" className="flex items-center gap-1"><Search className="h-4 w-4"/> Find AI Travel Tribe</TabsTrigger>
                      <TabsTrigger value="join" className="flex items-center gap-1"><Users className="h-4 w-4"/> Join a Tribe</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                {subTab === 'find' ? <FindAITribe /> : <JoinOrCreateTribe />}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right side aligned navbar */}
        <div className="lg:col-span-1">
          <Card className="glass-card sticky top-24">
            <CardHeader>
              <CardTitle>Menu</CardTitle>
              <CardDescription>Manage your circle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant={active==='mycircle'? 'default':'outline'} className="w-full justify-between" onClick={()=>setActive('mycircle')}>
                My Circle <ChevronRight className="h-4 w-4"/>
              </Button>
              <Button variant={active==='newcircle'? 'default':'outline'} className="w-full justify-between" onClick={()=>setActive('newcircle')}>
                New Circle <ChevronRight className="h-4 w-4"/>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TravelCirclePage;
