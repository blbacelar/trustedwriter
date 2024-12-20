import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Button, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ContactFormProps {
  onClose: () => void;
}

export const ContactForm = ({ onClose }: ContactFormProps) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit ticket');
      }

      setTicketId(data.ticketId);
      // Clear form
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <Button 
          startIcon={<CloseIcon />}
          onClick={onClose}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h6" sx={{ mb: 2 }}>Contact Support</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {ticketId && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Ticket created! ID: {ticketId}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Message"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Button 
          variant="contained" 
          fullWidth
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Send Message'}
        </Button>
      </Box>
    </motion.div>
  );
}; 