import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import expressAsyncHandler from 'express-async-handler';
import cors from 'cors'
dotenv.config()

const Team = mongoose.model('Team', new mongoose.Schema(
    {
        managerName: { type: String, required: true },
        managerContact: { type: Number, required: true },
        sport: { type: String, required: true },
        collegeName: { type: String, required: true },
        numberOfPlayers: { type: Number, required: true },
        players: { type: Array, required: true },
        tId: { type: String, required: true, unique: true }
    }
))

const app = express()
app.use(express.json())
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }))
mongoose.connect(process.env.DATABASE, function (err) {
    if (err) throw err
})
app.get('/', (req, res) => {
    res.send('Server started successfully!')
})
app.get('/getTeams', expressAsyncHandler(async (req, res) => {
    const teams = await Team.find({})
    if (teams) {
        res.send(teams);
    } else {
        res.status(404).send({ message: 'Teams Not Found!' });
    }
}))
app.post('/teamsignup', expressAsyncHandler(async (req, res) => {
    const team = new Team({
        managerName: req.body.managerName,
        managerContact: req.body.managerPhone,
        sport: req.body.sport,
        collegeName: req.body.collegeName,
        numberOfPlayers: req.body.playerNumber,
        players: req.body.playerNameandContact,
        tId: req.body.tId
    })
    const createdTeam = await team.save()
    if (createdTeam) {
        res.status(201).send({ message: 'New Team Registered', team: createdTeam, success: 1 });
    } else {
        res.status(500).send({ message: "Team not registered! Try Again.", success: 0 })
    }
}))
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message })
})
app.listen(process.env.PORT || 4000, () => {
    console.log("server started at localhost:4000")
})