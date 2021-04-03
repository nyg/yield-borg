
export default async (req, res) => {

  res.status(200).json({
    one: req.headers,
    two: req.connection?.remoteAddress,
    three: req.socket?.remoteAddress,
    four: req.connection?.socket?.remoteAddress
  })
}
