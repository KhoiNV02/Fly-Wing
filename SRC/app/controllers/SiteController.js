const Leaderboard = require('../models/LeaderBoardModel');
class SiteController {
  //[get]/news
  index(req, res) {
      res.render('home');
  }

  async getLeaderboard(req, res) {
    try {
      const leaderboard = await Leaderboard.find({})
        .sort({ score: 1, time: 1 }); // Sắp xếp theo điểm số tăng dần và thời gian

      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving leaderboard data', error });
    }
  }

  async saveScore(req, res) {
    try {
      const { name, score, time } = req.body;
      // Kiểm tra dữ liệu đầu vào
      // if (name!==null && score!==null && time!==null) {
      //   return res.status(400).json({ message: 'Name, score, and time are required' });
      // }

      // Tạo đối tượng leaderboard mới
      const newScore = new Leaderboard({
        name,
        score: score,
        time: time
      });

      // Lưu đối tượng vào cơ sở dữ liệu
      await newScore.save();

      res.status(201).json({ message: 'Score saved successfully', data: newScore });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while saving the score' });
    }
  }
}
module.exports = new SiteController();
