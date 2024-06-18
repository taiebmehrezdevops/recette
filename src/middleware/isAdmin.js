const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      return next();
    }
    return res.status(401).send({ message: 'Admin Token is not valid.' });
  };
 
module.exports=isAdmin