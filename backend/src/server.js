require('dotenv').config();
const express = require('express');

const corsConfig = require('./middlewares/corsConfig');
const errorHandler = require('./middlewares/errorHandler');
const UsersRoutes = require('./services/users/UsersRoutes');
const AuthRoutes = require('./services/authentications/AuthRoutes');
const ReviewsRoutes = require('./services/reviews/ReviewsRoutes');
const CompetitorsRoutes = require('./services/competitors/CompetitorsRoutes');
const AiRoutes = require('./services/ai/AiRoutes');
const ExpansionRoutes = require('./services/expansion/ExpansionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(corsConfig);
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Lintang Bakso API is running' });
});

// Routes
app.use('/users', UsersRoutes);
app.use('/authentications', AuthRoutes);
app.use('/reviews', ReviewsRoutes);
app.use('/competitors', CompetitorsRoutes);
app.use('/ai', AiRoutes);
app.use('/expansion', ExpansionRoutes);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Lintang Bakso API running on port ${PORT}`);
});
