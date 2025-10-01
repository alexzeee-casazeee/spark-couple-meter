import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash2, Quote } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QuoteData {
  id: string;
  message: string;
  source: string;
  created_at: string;
}

const QuotesManager = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [editingQuote, setEditingQuote] = useState<QuoteData | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // Form states
  const [newMessage, setNewMessage] = useState("");
  const [newSource, setNewSource] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editSource, setEditSource] = useState("");

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error: any) {
      console.error("Error loading quotes:", error);
      toast({
        title: "Error",
        description: "Failed to load quotes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuote = async () => {
    if (!newMessage.trim() || !newSource.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both message and source",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("quotes")
        .insert({ message: newMessage, source: newSource });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quote added successfully",
      });

      setNewMessage("");
      setNewSource("");
      setAddDialogOpen(false);
      loadQuotes();
    } catch (error: any) {
      console.error("Error adding quote:", error);
      toast({
        title: "Error",
        description: "Failed to add quote",
        variant: "destructive",
      });
    }
  };

  const handleEditQuote = async () => {
    if (!editingQuote || !editMessage.trim() || !editSource.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both message and source",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("quotes")
        .update({ message: editMessage, source: editSource })
        .eq("id", editingQuote.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quote updated successfully",
      });

      setEditingQuote(null);
      setEditMessage("");
      setEditSource("");
      setEditDialogOpen(false);
      loadQuotes();
    } catch (error: any) {
      console.error("Error updating quote:", error);
      toast({
        title: "Error",
        description: "Failed to update quote",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quote?")) return;

    try {
      const { error } = await supabase
        .from("quotes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quote deleted successfully",
      });

      loadQuotes();
    } catch (error: any) {
      console.error("Error deleting quote:", error);
      toast({
        title: "Error",
        description: "Failed to delete quote",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (quote: QuoteData) => {
    setEditingQuote(quote);
    setEditMessage(quote.message);
    setEditSource(quote.source);
    setEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--gradient-splash)" }}>
      <header className="p-2 shadow-glow" style={{ background: "var(--gradient-primary)" }}>
        <div className="container mx-auto flex items-center gap-3 px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-white hover:bg-white/10 h-7 w-7"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Quote className="w-5 h-5 text-white" />
          <h1 className="text-base font-bold text-white">Manage Quotes</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            {quotes.length} quote{quotes.length !== 1 ? "s" : ""} total
          </p>
          
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Quote
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Quote</DialogTitle>
                <DialogDescription>
                  Add an inspirational quote about relationships and communication.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="newMessage">Quote Message</Label>
                  <Textarea
                    id="newMessage"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter the quote message..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newSource">Source / Attribution</Label>
                  <Input
                    id="newSource"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="e.g., John Gottman, The Seven Principles (1999)"
                  />
                </div>
                <Button onClick={handleAddQuote} className="w-full">
                  Add Quote
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {quotes.map((quote) => (
            <Card key={quote.id} className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-2 italic">
                      "{quote.message}"
                    </p>
                    <p className="text-xs text-muted-foreground">
                      — {quote.source}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(quote)}
                      className="h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteQuote(quote.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Quote</DialogTitle>
              <DialogDescription>
                Update the quote message or source attribution.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="editMessage">Quote Message</Label>
                <Textarea
                  id="editMessage"
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  placeholder="Enter the quote message..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSource">Source / Attribution</Label>
                <Input
                  id="editSource"
                  value={editSource}
                  onChange={(e) => setEditSource(e.target.value)}
                  placeholder="e.g., John Gottman, The Seven Principles (1999)"
                />
              </div>
              <Button onClick={handleEditQuote} className="w-full">
                Update Quote
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QuotesManager;
