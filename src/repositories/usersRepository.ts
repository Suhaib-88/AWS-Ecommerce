import { get, put, post } from "aws-amplify/api";

const resource = "/users";
const apiName = "demoServices";

interface User {
    id: string;
    username: string;
    email: string;
    identity_id?: string;
    [key:string] : any;

}

interface GetUnclaimedUserOptions {
    primaryInterest?:string;
    ageRange?:string;
}

const UsersRepository = {
    async get(offset: number=0, count: number=50): Promise<User[]>{
        const restOperation = await get({apiName:apiName, path:`${resource}/all`, options: {queryParams: {offset: offset, count:count,}}});
        const {body} = await restOperation.response;
        return body.json()
    },

    async getUnclaimed({primaryInterest, ageRange}: GetUnclaimedUserOptions): Promise<User[]>{
        const restOperation = await get({apiName:apiName, path:`${resource}/unclaimed`, options: {queryParams: {primaryInterest: primaryInterest, ageRange: ageRange},},});
        const {body} = await restOperation.response;
        return body.json()
    },

    async getRandomUser(): Promise<User>{
        const restOperation = await get({apiName:apiName, path:`${resource}/random`});
        const {body} = await restOperation.response;
        return body.json()
    },

    async getUserByID(userID:string): Promise<User>{
        if (!userID || userID.length === 0) throw new Error("User ID is required")
        
        const restOperation = await get({apiName:apiName, path:`${resource}/id/${userID}`});
        const {body} = await restOperation.response;
        return body.json()
    },

    async getUserByUsername(username:string): Promise<User>{
        if (!username || username.length === 0) throw new Error("Username is required")

        const restOperation = await get({apiName:apiName, path:`${resource}/username/${username}`});
        const {body} = await restOperation.response;
        return body.json()
    },

    async getUserByIdentityId(identityId:string): Promise<User>{
        if (!identityId || identityId.length === 0) throw new Error("Identity ID is required")

        const restOperation = await get({apiName:apiName, path:`${resource}/identityid/${identityId}`});
        const {body} = await restOperation.response;
        return body.json()
    },

    async createUser(provisionalUserId:string, username:string, email:string, identityId?:string): Promise<User>{
        if (!username || username.length === 0) throw new Error("Username is required")
        const user: User = {
            id: provisionalUserId,
            username,
            email,
            identity_id: identityId,
        };
        const restOperation = await post({apiName:apiName, path:resource, options:{ body:user}});
        const {body} = await restOperation.response;
        return body.json()
    },

    async updateUser(user:User): Promise<User>{
        if (!user) throw new Error("User is required")

        const restOperation = await put({apiName:apiName, path:`${resource}/id/${user.id}`,options:{ body:user}});
        const {body} = await restOperation.response;
        return body.json()
    },

    async claimUser(userID:string): Promise<User>{
        const restOperation = await post({apiName:apiName, path:`${resource}/id/${userID}/claim`});
        const {body} = await restOperation.response;
        return body.json()
    },

    async verifyAndUpdateUserPhoneNumber(userID:string, phoneNumber:string): Promise<User>{
        if (!userID || userID.length === 0) throw new Error("User ID is required")

        const payload={
            user_id:userID,
            phone_number:phoneNumber,
        }
        const restOperation = await post({apiName:apiName, path:`${resource}/id/${userID}/verifyphone`, options:{ body:payload}});
        const {body} = await restOperation.response;
        return body.json()
    },
}


export default UsersRepository;
