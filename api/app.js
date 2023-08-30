const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

dotenv.config();
app.use(cors(
    {
        origin: ['http://localhost:4200','http://localhost:8080','http://localhost:3000'],
        credentials: true,
    }
));
// app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/uploads', express.static('uploads'));

app.use("/api/admins",require("./routes/admin.route"));
app.use("/api/users",require("./routes/user.route"));
app.use("/api/auth",require("./routes/auth.route"));
app.use("/api/workspace",require("./routes/workspace.route"));

app.get("/api/validatetoken/:token",async (req,res)=>{
    try
    {
        const token = req.params.token;        
        if(!token) return res.status(401).json({message:"user token missing."});

        const verified = jwt.verify(token,process.env.JWT_SECRET);

        if(!verified) return res.status(401).json({message:"invalid token."});

        const userId = jwt.decode(token).userId;
        res.json({userId})
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
});


const PORT = 8080;
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT,()=>{
        console.log(`API running in port ${PORT}`);
});
})
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});