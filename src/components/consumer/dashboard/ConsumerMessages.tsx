import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Search } from "lucide-react";

const ConsumerMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");

  // Mock data - replace with actual API calls
  const conversations = [
    {
      id: "1",
      with: "TechStore Support",
      type: "vendor",
      lastMessage: "Your order has been shipped and is on its way!",
      lastMessageTime: "2 hours ago",
      unreadCount: 0,
      status: "active",
      orderRef: "ORD-001"
    },
    {
      id: "2",
      with: "Customer Support",
      type: "admin",
      lastMessage: "We've processed your refund request. You should see the amount in your account within 3-5 business days.",
      lastMessageTime: "1 day ago",
      unreadCount: 1,
      status: "active",
      ticketRef: "TK-12345"
    },
    {
      id: "3",
      with: "FashionHub",
      type: "vendor",
      lastMessage: "Thank you for your review! We're glad you liked the product.",
      lastMessageTime: "3 days ago",
      unreadCount: 0,
      status: "closed",
      orderRef: "ORD-002"
    }
  ];

  const messages = selectedConversation ? [
    {
      id: "1",
      sender: "TechStore Support",
      message: "Hello! Thank you for your order. We're processing it now.",
      timestamp: "2024-01-15 10:00",
      isFromMe: false
    },
    {
      id: "2",
      sender: "Me",
      message: "When will it be shipped?",
      timestamp: "2024-01-15 10:15",
      isFromMe: true
    },
    {
      id: "3",
      sender: "TechStore Support",
      message: "Your order has been shipped and is on its way! Tracking number: TN123456789",
      timestamp: "2024-01-15 14:30",
      isFromMe: false
    }
  ] : [];

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Implement send message functionality
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="text-lg font-medium">Messages</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9 w-64" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-sm">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                      selectedConversation?.id === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm truncate">
                            {conversation.with}
                          </h4>
                          <Badge 
                            variant={conversation.type === 'admin' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {conversation.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {conversation.lastMessageTime}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        {(conversation.orderRef || conversation.ticketRef) && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Ref: {conversation.orderRef || conversation.ticketRef}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedConversation.with}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={selectedConversation.type === 'admin' ? 'default' : 'secondary'}
                        >
                          {selectedConversation.type}
                        </Badge>
                        <Badge 
                          variant={selectedConversation.status === 'active' ? 'default' : 'secondary'}
                        >
                          {selectedConversation.status}
                        </Badge>
                        {(selectedConversation.orderRef || selectedConversation.ticketRef) && (
                          <span className="text-sm text-muted-foreground">
                            Ref: {selectedConversation.orderRef || selectedConversation.ticketRef}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.isFromMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  {selectedConversation.status === 'active' && (
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="resize-none"
                          rows={2}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                        />
                        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to view messages
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {conversations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Messages from vendors and support will appear here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsumerMessages;