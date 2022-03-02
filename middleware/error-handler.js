module.exports = {
<<<<<<< HEAD
  apiErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      res.status(500).json({
        status: 'error',
        message: `${err.name}:${err.message}`
=======
  generalErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      const { name, message } = err
      res.status(500).json({
        status: 'error',
        message: `${name}: ${message}`
>>>>>>> master
      })
    } else {
      res.status(500).json({
        status: 'error',
<<<<<<< HEAD
        message: `${err}`
      })
    }
    next(err)
  }
}
=======
        message: err
      })
    }

    next(err)
  }
}
>>>>>>> master
