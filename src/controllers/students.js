const model = require('../models/students')

//////////////////////////////////////////////////////////////////////////////
// Basic CRUD Methods
//////////////////////////////////////////////////////////////////////////////

function getAll(req, res, next) {
  model.getAll()
    .then(function(data) {
      res.status(200).send({
        data
      })
    })
    .catch(next)
}

function getOne(req, res, next) {
  model.getOne(parseInt(req.params.studentId))
    .then(function(data) {
      if (data) {
        return res.status(200).send({
          data
        })
      } else {
        throw {
          status: 404,
          message: 'Student Not Found'
        }
      }
    })
    .catch(next)
}

function create(req, res, next) {
  if (!req.body.name) {
    return next({
      status: 400,
      message: 'Bad Request'
    })
  }
  if (!req.body.cohortId) {
    return next({
      status: 400,
      message: 'Bad Request'
    })
  }

  model.create(req.body.name, req.body.cohortId)
    .then(function(data) {
      res.status(201).send({
        data
      })
    })
    .catch(next)
}

function update(req, res, next) {
  if (!req.body.name || !req.body.cohortId) {
    return next({
      status: 400,
      message: 'Bad Request'
    })
  }

  model.update(parseInt(req.params.studentId), req.body.name)
    .then(function(data) {
      res.status(200).send({
        data
      })
    })
    .catch(next)
}

function remove(studentId){
  return (
    db('students')
    .del() // this actually deletes it from the table in the database
    .where({ id: studentId })
    .returning('*')
    .then(function([data]){
      delete data.id //only delete the id from the data
      return data
    })
  )
}

//////////////////////////////////////////////////////////////////////////////
// Nested CRUD Methods
//////////////////////////////////////////////////////////////////////////////


function getAllStudents(req, res, next){
  model.getAllStudents(parseInt(req.params.cohortId))
  .then(function(data) {
    return res.status(200).send ({ data })
  })
}

function getAllInstructors(req, res, next) {
  model.getAllInstructors(parseInt(req.params.studentId))
    .then(function(data) {
      return res.status(200).send({
        data
      })
    })
    .catch(next)
}

//////////////////////////////////////////////////////////////////////////////
// Quality of Life functions
//////////////////////////////////////////////////////////////////////////////

function checkIfStudentExists(req, res, next) {
  model.getOne(parseInt(req.params.studentId))
    .then(function(data) {
      if (!data) next({
        status: 404,
        message: 'Student Not Found'
      })
      next()
    })
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  getAllInstructors,
  checkIfStudentExists
}
