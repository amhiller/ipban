const express = require("express")
const { getIps, getIp, updateIP, getGoodIps, getBadIp } = require('../controllers/ips')

const router = express.Router();

router.get('/ipban', getIps)
router.get('/goodip', getGoodIps)
router.get('/ipbanip', getIp)
router.post('/updateip', updateIP)
router.get("/badip", getBadIp)

module.exports = router;