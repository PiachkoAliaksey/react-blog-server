import mongoose,{Document,Schema,Model} from "mongoose";



interface IUser {
    $__?: {
        activePaths: {
            paths: {
                password: string,
                email: string,
                fullName: string
            },
            states: {
                require: {
                    password: boolean,
                    email: boolean,
                    fullName: boolean
                },
                default: {},
                modify: {}
            }
        },
        op: null,
        saving: null,
        $versionError: null,
        saveOptions: null,
        validating: null,
        cachedRequired: {},
        backup: {
            activePaths: {
                modify: {
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
            validationError: null
        },
        inserting: boolean,
        savedState: {}
    },
    _doc: {
        fullName: {type:string,required:boolean},
        email: {type:string,required:boolean,unique:boolean},
        password: {type:string,required:boolean},
        avatarUrl: string,
        _id?: string,
        createdAt?: string,
        updatedAt?: string,
        __v?: number
    },
    $isNew?: boolean,
    token?: string
}

const UserSchema:Schema = new mongoose.Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    avatarUrl:String
}
,{timestamps:true,});

export default mongoose.model('UserModel',UserSchema)