const Ip = require('../models/ip')
const allowed_Ip = require('../models/allowed_ip');

exports.getIps = async (req, res) => {
    Ip.find()
    .then((ips) =>
      res.send( ips )
    )
    .catch((err) => {
      console.log(err)
    })
};

exports.getGoodIps = async (req, res) => {
  allowed_Ip.find()
  .then((ips) => 
  res.send( ips )
  )
  .catch((err) => {
    console.log(err)
  })
}

exports.getIp = async (req, res) => {
  Ip.find({ip: req.body.ip})
  .then((ip) =>
    res.send( ip )
  )
  .catch((err) => {
    console.log(err)
  })
}

exports.updateIP = async (req, res) => {

  //return 0 if not found
  //return 1 if found
  const isip = await Ip.find({ip: req.body.ip})
  const isipgood = await allowed_Ip.find({ip: req.body.ip})

  // if found in badips and not in good ips
  console.log(isip.length)
  console.log(isipgood.length)
  if (isip.length != 0 && isipgood.length == 0){

    const filter = { ip: isip[0].ip.toString() }

    const update = { allow_list: 1 }

    let doc = await Ip.findOneAndUpdate(filter, update, {new: true})
    console.log(doc)

    let allow_ip = new allowed_Ip({
      "ip": isip[0].ip,
      "allow_list": true
    })
    allow_ip.save((err, result) => {
      if(err) {
        return err
      }
      
    })
    res.send("Updating badips, adding good ips")
    return
  } 
  // if found in badips and in good ips
  if (isip.length != 0 && isipgood.length == 1) {
    res.send("Value found in good ips and bad ips - no update needed")
    return
  }
  // if not found in badips and in good ips
  if (isip.length != 1 && isipgood.length == 1) {
    res.send("value found in good ips and not bad ips- not update needed")
    return
  }
  // if not found in badips and not in good ips
  if (isip.length == 0 && isipgood.length == 0) {
    let allow_ip_v3 = new allowed_Ip({
      "ip": req.body.ip,
      "allow_list": true
    })
    allow_ip_v3.save((err, result) => {
      if(err) {
        return err
      }
      console.log(result)
      
    })
    res.send("Value not found in badips and not in good ips, adding to good ip")
    return
  } else {
    res.send("No conditions met")
  }

}

exports.getBadIp = async (req, res) => {
  Ip.find({ allow_list: false }, function (err, docs) {
    if (err) {
      console.log(err)
    } else
    console.log(docs)
  });
  const docs = await Ip.find({ allow_list: {$ne: 1}});
  res.send(docs)
}
