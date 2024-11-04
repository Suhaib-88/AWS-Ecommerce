// SearchRepo.ts
import { get } from 'aws-amplify/api';

const resource = '/search/products';
const apiName = 'demoServices';

const SearchRepo = {
    async searchProducts(val: string, size: number = 10, offset: number = 0) {
        if (!val || val.length === 0) {
            throw new Error('val required');
        }

        const restOperation = await get({
            apiName: apiName,
            path: resource,
            options: {
                queryParams: {
                    searchTerm: val,
                    // size,
                    // offset
                }
            }
        });

        const { body } = await restOperation.response;
        return body.json();
    }
};

export default SearchRepo;
