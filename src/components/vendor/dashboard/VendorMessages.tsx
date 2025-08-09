import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Search, 
  Send, 
  User, 
  Shield, 
  Clock, 
  CheckCheck,
  Plus,
  Filter,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  conversationId: string;
  sender: 'customer' | 'vendor' | 'admin';
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  type: 'customer_inquiry' | 'order_support' | 'admin_notification';
  subject: string;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'open' | 'resolved' | 'pending';
  orderId?: string;
}

const VendorMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState<'all' | 'unread' | 'customer' | 'admin'>('all');

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: "1",
      type: "customer_inquiry",
      subject: "Product availability question",
      customerName: "Sarah Johnson",
      customerAvatar: "/api/placeholder/40/40",
      lastMessage: "Is the iPhone 15 Pro still available in blue?",
      lastMessageTime: "2 minutes ago",
      unreadCount: 2,
      status: "open"
    },
    {
      id: "2",
      type: "order_support",
      subject: "Order #12345 - Shipping inquiry",
      customerName: "Mike Chen",
      customerAvatar: "/api/placeholder/40/40",
      lastMessage: "When will my order be shipped?",
      lastMessageTime: "1 hour ago",
      unreadCount: 1,
      status: "pending",
      orderId: "12345"
    },
    {
      id: "3",
      type: "admin_notification",
      subject: "Policy Update Notification",
      customerName: "Admin",
      lastMessage: "New shipping policy has been implemented...",
      lastMessageTime: "3 hours ago",
      unreadCount: 0,
      status: "resolved"
    }
  ];

  // Mock messages for selected conversation
  const messages: Message[] = [
    {
      id: "1",
      conversationId: "1",
      sender: "customer",
      senderName: "Sarah Johnson",
      senderAvatar: "/api/placeholder/40/40",
      content: "Hi! I'm interested in the iPhone 15 Pro. Do you have it available in blue color?",
      timestamp: "10:30 AM",
      read: true
    },
    {
      id: "2",
      conversationId: "1",
      sender: "vendor",
      senderName: "You",
      content: "Hello Sarah! Yes, we do have the iPhone 15 Pro in blue color available. Would you like me to check the current stock level for you?",
      timestamp: "10:32 AM",
      read: true
    },
    {
      id: "3",
      conversationId: "1",
      sender: "customer",
      senderName: "Sarah Johnson",
      senderAvatar: "/api/placeholder/40/40",
      content: "That would be great! Also, what's the current price and do you offer any warranty?",
      timestamp: "10:35 AM",
      read: false
    }
  ];

  const filteredConversations = conversations.filter(conv => {
    if (filter === 'unread' && conv.unreadCount === 0) return false;
    if (filter === 'customer' && conv.type === 'admin_notification') return false;
    if (filter === 'admin' && conv.type !== 'admin_notification') return false;
    
    return conv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           conv.subject.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'admin_notification':
        return <Shield className="h-4 w-4" />;
      case 'order_support':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In real app, send message via API
    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Messages</h2>
          <p className="text-muted-foreground">Communicate with customers and support</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilter('all')}>
                    All Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('unread')}>
                    Unread Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('customer')}>
                    Customer Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('admin')}>
                    Admin Messages
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="space-y-1 p-4 pt-0">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.id
                        ? 'bg-muted'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.customerAvatar} />
                          <AvatarFallback>
                            {conversation.customerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ${getStatusColor(conversation.status)}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(conversation.type)}
                            <span className="font-medium text-sm truncate">
                              {conversation.customerName}
                            </span>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-1">
                          {conversation.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {conversation.lastMessageTime}
                          </span>
                          {conversation.orderId && (
                            <Badge variant="outline" className="text-xs">
                              #{conversation.orderId}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2">
          {selectedConv ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConv.customerAvatar} />
                      <AvatarFallback>
                        {selectedConv.customerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedConv.customerName}</CardTitle>
                      <CardDescription>{selectedConv.subject}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
                      <DropdownMenuItem>Block customer</DropdownMenuItem>
                      <DropdownMenuItem>Archive conversation</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <ScrollArea className="h-[450px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.sender === 'vendor' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.senderAvatar} />
                          <AvatarFallback>
                            {message.senderName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`flex-1 max-w-xs ${
                          message.sender === 'vendor' ? 'text-right' : ''
                        }`}>
                          <div className={`inline-block p-3 rounded-lg ${
                            message.sender === 'vendor'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{message.timestamp}</span>
                            {message.sender === 'vendor' && message.read && (
                              <CheckCheck className="h-3 w-3 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <Separator />
                
                <div className="p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 min-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose a conversation from the left to view messages</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VendorMessages;