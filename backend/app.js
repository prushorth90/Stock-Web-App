const express = require("express");
const axios = require("axios")
const cors = require("cors")

const app = express();
const { MongCli, ObjectId } = require("mongodb")
app.use(cors())


const shareSchema = new mongoose.Schema({
    symbol: String,
    price: Number,
  });
  const shares = mong.model('shares', shareSchema);
  
  // API Routes
  app.get('/api/shares', async (req, res) => {
    const shares = await Share.find();
  });
  
  app.post('/api/sharesGet', async (req, res) => {
    const share1 = new Share(req.body);
    await share1.save();
    res.json(newShare);
  });

  app.get('/api/shares/:co', async (req, res) => {
    try {
      const share = await Share.findOne({ symbol: req.params.symbol.toUpperCase() });
      if (!share) {
        return res.status(404).json({ message: 'Share not found' });
      }
      res.json(share);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/shares/:id', async (req, res) => {
    try {
      const result = await Share.findByIdAndDelete(req.params.id);
      if (!result) {
        return res.status(404).json({ message: 'Shares not found' });
      }
      res.json({ message: 'Share deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/shares', async (req, res) => {
    try {
      const updatedShares = await Shares.findByIdAndUpdate(
        req.params.id,
        req.body, // Updates fields sent in the body (price, company, etc.)
        { new: true } // Returns the updated document instead of the old one
      );
      res.json(updatedShares);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    
    app.get('/api/search', async (req, res) => {
        const query = req.query.q; // Usage: /api/search?q=Apple
        if (!query) return res.status(400).json({ message: 'Query parameter "q" required' });
      
        try {
          const shares= await Share.find({
            $or: [
              { symbol: { $regex: query, $options: 'i' } }, // 'i' = case insensitive
              { company: { $regex: query, $options: 'i' } }
            ]
          });
          res.json(shares);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      });

      app.get('/api/portfolio/shares', async (req, res) => {
        try {
          const summary = await Share.aggregate([
            {
              $group: {
                _id: null,
                totalValue: { $sum: "$price" }, // Sums up all prices
                count: { $sum: 1 },             // 
                avgPrice: { $avg: "$price" }    // Calculates average price
              }
            }
          ]);
          res.json(summary[0] || { totalValue: 0, count: 0 });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      });

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "w3prushorthout/browser", "index.html"));
});

module.exports = app;
