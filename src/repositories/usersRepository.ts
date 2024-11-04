import { get, post, put } from 'aws-amplify/api';

const resource = "/users";
const apiName = 'demoServices';

export const UsersRepository = {
  async get(offset: number = 0, count: number = 50): Promise<any> {
    const restOperation = get({
      apiName,
      path: `${resource}/all`,
      options: {
        queryParams: { offset: offset.toString(), count: count.toString() },
      },
    });
    const { body } = await restOperation.response;
    console.log(body);
    return body.json();
  },

  async getUnclaimedUser(primaryInterest: string, ageRange: string): Promise<any> {
    const restOperation = get({
      apiName,
      path: `${resource}/unclaimed`,
      options: {
        queryParams: { primaryPersona: primaryInterest, ageRange },
      },
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async getRandomUser(): Promise<any> {
    const restOperation = get({
      apiName,
      path: `${resource}/random`,
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async getUserByID(userID: string): Promise<any> {
    if (!userID) throw new Error("userID required");
    
    const restOperation = get({
      apiName,
      path: `${resource}/id/${userID}`,
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async getUserByUsername(username: string): Promise<any> {
    if (!username) throw new Error("username required");

    const restOperation = get({
      apiName,
      path: `${resource}/username/${username}`,
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async getUserByIdentityId(identityId: string): Promise<any> {
    if (!identityId) throw new Error("identityId required");

    const restOperation = get({
      apiName,
      path: `${resource}/identityid/${identityId}`,
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async createUser(provisionalUserId: string, username: string, email: string, identityId: string): Promise<any> {
    if (!username) throw new Error("username required");

    const user = {
      id: provisionalUserId,
      username,
      email,
      identity_id: identityId,
    };

    const restOperation = post({
      apiName,
      path: resource,
      options: {
        body: user,
      },
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async updateUser(user: any): Promise<any> {
    if (!user) throw new Error("user required");

    const restOperation = put({
      apiName,
      path: `${resource}/id/${user.id}`,
      options: {
        body: user,
      },
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async claimUser(userId: string): Promise<any> {
    const restOperation = put({
      apiName,
      path: `${resource}/id/${userId}/claim`,
    });
    const { body } = await restOperation.response;
    return body.json();
  },

  async verifyAndUpdateUserPhoneNumber(userId: string, phoneNumber: string): Promise<any> {
    if (!userId) throw new Error("userId required");

    const payload = {
      user_id: userId,
      phone_number: phoneNumber,
    };

    const restOperation = put({
      apiName,
      path: `${resource}/id/${userId}/verifyphone`,
      options: {
        body: payload,
      },
    });
    const { body } = await restOperation.response;
    return body.json();
  },
};


export default UsersRepository;
