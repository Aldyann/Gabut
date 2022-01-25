const http = require('http')
const port = 8080

const web = http.createServer(function(req, res){
  res.write("AKU OREp COK")
  res.end()
})

web.listen(port, function(err) {
  if (err) {
    console.log(err)
  } else {
    console.log(`Web Ready`)
  }
})