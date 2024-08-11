//trang điều phối chung đến các trang 
const sitesRouter = require('./site');
function route(app) {
    app.use('/', sitesRouter);
}
module.exports = route;
