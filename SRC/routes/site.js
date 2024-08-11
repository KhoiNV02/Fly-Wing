var express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/', siteController.index);
router.get('/getLeaderBoard', siteController.getLeaderboard);
router.post('/saveScore', siteController.saveScore);

module.exports = router;
