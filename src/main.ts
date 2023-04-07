import { error } from 'console';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import mongoose, { Document, Schema } from 'mongoose';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';
import userModel from './user.js'

interface IUser extends mongoose.Document {
    $__?: {
        activePaths?: {
            paths?: {
                password: string,
                email: string,
                fullName: string
            },
            states?: {
                require: {
                    password: boolean,
                    email: boolean,
                    fullName: boolean
                },
                default: {},
                modify: {}
            }
        },
        op?: null,
        saving?: null,
        $versionError?: null,
        saveOptions?: null,
        validating?: null,
        cachedRequired?: {},
        backup?: {
            activePaths?: {
                modify?: {
                    fullName: boolean,
                    email: boolean,
                    password: boolean,
                    avatarUrl: boolean,
                    createdAt: boolean,
                    updatedAt: boolean
                },
                default: {
                    _id: boolean
                }
            },
            validationError?: null
        },
        inserting?: boolean,
        savedState?: {}
    },
    _doc: {
        fullName: string,
        email: string,
        password: string,
        avatarUrl: string,
        _id?: string,
        createdAt?: string,
        updatedAt?: string,
        __v?: number
    },
    $isNew?: boolean,
    token?: string
}
interface IDoc {
    fullName: string,
    email: string,
    password: string,
    avatarUrl: string,
    _id?: string,
    createdAt?: string,
    updatedAt?: string,
    __v?: number
}

mongoose
    .connect('mongodb+srv://pechkoaleks:kMBCbcWIXBe3MiaJ@datacloud.w2wnoou.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((error) => console.log('DB error', error));

const app = express();

app.use(express.json());

app.post('/auth/login', async(req: express.Request, res: express.Response) => {
    try {
        const user = await userModel.findOne({email:req.body.email});
        if(!user){
            return res.status(404).json({
                message:'Not found'
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password,user._doc.password);
        if(!isValidPass){
            return res.status(404).json({
                message:'Else login or password'
            })
        }
        const token = jwt.sign({
            _id: user._id
        }, 'secretPass', { expiresIn: '30d' });
        const { password, ...userData } = user._doc;

        res.json({ ...userData, token })
     } catch (err) { 
        console.log(err);
        res.status(500).json({
            message: 'Failed to register'
        })
     }
})

app.post('/auth/register', registerValidation, async (req: express.Request, res: express.Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const passwordPPass = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordBcrypt = await bcrypt.hash(passwordPPass, salt);

        const doc = new userModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            password: passwordBcrypt,
        });

        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id
        }, 'secretPass', { expiresIn: '30d' });
        const { password, ...userData } = user._doc;

        res.json({ ...userData, token })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to register'
        })
    }
})



app.listen(4444, () => {
    console.log('Server OK');
})