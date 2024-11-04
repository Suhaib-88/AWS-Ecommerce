// // RecommendationsRepo.ts
// import { get, post } from 'aws-amplify/api';

// const apiName = 'demoServices';

// const popular = '/popular';
// const related = '/related';
// const recommendations = '/recommendations';
// const rerank = '/rerank';
// const chooseDiscounted = '/choose_discounted';
// const couponOffer = '/coupon_offer';
// const experimentOutcome = '/experiment/outcome';

// interface Params {
//     userID: string;
//     currentItemID?: string;
//     currentItemCategory?: string;
//     numResults?: number;
//     feature?: string;
// }

// interface Payload {
//     userID: string;
//     items?: string[];
//     feature?: string;
//     correlationId?: string;
// }

// const RecommendationsRepository = {
//     async getPopularProducts(userID: string, currentItemID: string, numResults: number, feature?: string) {
//         const params: Params = {
//             userID,
//             currentItemID,
//             numResults,
//             feature
//         };

//         const restOperation = await get({
//             apiName: apiName,
//             path: popular,
//             options: {
//                 queryParams: params
//             }
//         });

//         return restOperation.response;
//     },

//     async getRelatedProducts(userID: string, currentItemID: string, currentItemCategory: string, numResults: number, feature?: string) {
//         const params: Params = {
//             userID,
//             currentItemID,
//             currentItemCategory,
//             numResults,
//             feature
//         };

//         const restOperation = await get({
//             apiName: apiName,
//             path: related,
//             options: {
//                 queryParams: params
//             }
//         });

//         return restOperation.response;
//     },

//     async getRecommendationsForUser(userID: string, currentItemID: string, numResults: number, feature?: string) {
//         const params: Params = {
//             userID,
//             currentItemID,
//             numResults,
//             feature
//         };

//         const restOperation = await get({
//             apiName: apiName,
//             path: recommendations,
//             options: {
//                 queryParams: params
//             }
//         });

//         return restOperation.response;
//     },

//     async getRerankedItems(userID: string, items: string[], feature?: string) {
//         const payload: Payload = {
//             userID,
//             items,
//             feature
//         };

//         const restOperation = await post({
//             apiName: apiName,
//             path: rerank,
//             options: {
//                 body: payload
//             }
//         });

//         return restOperation.response;
//     },

//     async chooseDiscounts(userID: string, items: string[], feature?: string) {
//         const payload: Payload = {
//             userID,
//             items,
//             feature
//         };

//         const restOperation = await post({
//             apiName: apiName,
//             path: chooseDiscounted,
//             options: {
//                 body: payload
//             }
//         });

//         const { body } = await restOperation.response;
//         return body.json(); // inserts discount and discounted keys into items
//     },

//     async getCouponOffer(userID: string) {
//         const restOperation = await get({
//             apiName: apiName,
//             path: couponOffer,
//             options: {
//                 queryParams: {
//                     userID
//                 }
//             }
//         });

//         const { body } = await restOperation.response;
//         return body.json();
//     },

//     async recordExperimentOutcome(correlationId: string) {
//         const payload: Payload = {
//             correlationId
//         };

//         const restOperation = await post({
//             apiName: apiName,
//             path: experimentOutcome,
//             options: {
//                 body: payload
//             }
//         });

//         const { body } = await restOperation.response;
//         return body.json();
//     }
// };

// export default RecommendationsRepository;
