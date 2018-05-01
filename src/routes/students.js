const express = require('express')
const router = express.Router()
const studentsController = require('../controllers/students')

//////////////////////////////////////////////////////////////////////////////
// Basic CRUD Methods
//////////////////////////////////////////////////////////////////////////////

router.get('/', studentsController.getAll)

router.get('/:studentId', studentsController.getOne)

router.post('/', studentsController.create)

router.put('/:studentId',
            studentsController.checkIfStudentExists,
            studentsController.update)

router.delete('/:studentId',
            studentsController.checkIfStudentExists,
            studentsController.remove)

//////////////////////////////////////////////////////////////////////////////
// Nested CRUD Methods
//////////////////////////////////////////////////////////////////////////////

router.get('/:studentId/instructors',
            studentsController.checkIfStudentExists,
            studentsController.getAllInstructors)

module.exports = router
