import React, { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: input }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: Date.now() + 1,
          text: data.reply,
          sender: 'bot',
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: 'Sorry, I could not process your request.',
          sender: 'bot',
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: 'Error connecting to chat service.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setOpen(true)}
      >
        <ChatIcon />
      </Fab>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Chatbot</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <List sx={{ height: 300, overflowY: 'auto', mb: 2 }}>
            {messages.map((msg) => (
              <ListItem key={msg.id} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <ListItemText
                  primary={msg.text}
                  sx={{
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.200',
                    color: msg.sender === 'user' ? 'white' : 'black',
                    borderRadius: 2,
                    p: 1,
                    maxWidth: '70%',
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button variant="contained" onClick={handleSend} endIcon={<SendIcon />}>
              Send
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;