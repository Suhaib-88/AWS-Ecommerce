import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store'; // Adjust according to your Redux store structure
import LoadingFallback from '../../../components/LoadingFallback/LoadingFallback';
import SearchItem from './SearchItem/SearchItem';
import { RepositoryFactory } from '../../../repositories/RepositoryFactory';
// import { personalizeUserID, personalizeRecommendationsForVisitor } from '../../../store/store';
// import { AnalyticsHandler } from '@/analytics/AnalyticsHandler';

const SearchRepository = RepositoryFactory.get('search');
const RecommendationsRepository = RepositoryFactory.get('recommendations');
const ProductsRepository = RepositoryFactory.get('products');
const EXPERIMENT_FEATURE = 'search_results';
const DISPLAY_SEARCH_PAGE_SIZE = 10;
const EXTENDED_SEARCH_PAGE_SIZE = 25;

const Search: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const ispersonalizeUserID = useSelector(personalizeUserID);
  const isPersonalized = useSelector(personalizeRecommendationsForVisitor);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isReranked, setIsReranked] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (val: string) => {
    const size = isPersonalized
      ? EXTENDED_SEARCH_PAGE_SIZE * Math.max(1, 4 - Math.min(val.length, 3))
      : DISPLAY_SEARCH_PAGE_SIZE;

    try {
      const response = await SearchRepository.searchProducts(val, size);
      const rerankedItems = await rerank(response);
      const lookupResults = await lookupProducts(rerankedItems);
      // AnalyticsHandler.productSearched(user, val, lookupResults.length);
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          setSearchError('Search index not found. Please complete the search workshop.');
        } else {
          console.error(error);
          setSearchError(`Unexpected error (${error.response.status}) encountered when performing search.`);
        }
      } else {
        console.error(error);
        setSearchError('Unexpected error encountered when performing search.');
      }
    }
  };

  const rerank = async (items: any[]) => {
    if (isPersonalized && items.length > 0) {
      const { body } = await RecommendationsRepository.getRerankedItems(ispersonalizeUserID, items, EXPERIMENT_FEATURE);
      const data = await body.json();
      setIsReranked(JSON.stringify(items) !== JSON.stringify(data));
      return data.slice(0, DISPLAY_SEARCH_PAGE_SIZE);
    } else {
      setIsReranked(false);
      return items;
    }
  };

  const lookupProducts = async (items: any[]) => {
    if (items.length > 0) {
      const itemIds = items.map(item => item.itemId);
      const data = await ProductsRepository.getProduct(itemIds);

      if (Array.isArray(data)) {
        setResults(items.map(item => ({
          ...item,
          product: data.find(({ id }) => id === item.itemId)
        })));
      } else {
        setResults([{ itemId: data?.id, product: data }]);
      }
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length > 0) {
        setIsSearching(true);
        setResults([]);
        setSearchError(null);

        await handleSearch(searchTerm);

        setIsSearching(false);
      } else {
        setIsSearching(false);
        setIsReranked(false);
        setResults([]);
      }
    };

    performSearch();
  }, [searchTerm]);

  return (
    <div className="d-inline-flex dropdown">
      <i className={`fa fa-search ${inputFocused ? 'fa-search--focused' : ''}`} aria-hidden="true"></i>
      <input
        type="text"
        autoComplete="off"
        id="search"
        className="input py-2"
        value={searchTerm}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="search-results dropdown-menu" role="menu" aria-labelledby="search" style={{ display: searchTerm ? 'block' : 'none' }}>
        {isSearching && (
          <li className="text-center">
            <LoadingFallback small />
          </li>
        )}
        {searchError && (
          <li className="pr-2 pl-2 small text-secondary">
            <em>{searchError}</em>
          </li>
        )}
        {results.length === 0 && !isSearching && <li className="text-center text-secondary">No Results</li>}
        {isReranked && (
          <li className="text-center text-secondary">
            <small><i className="fa fa-user-check"></i> <em>Personalized Ranking</em></small>
          </li>
        )}
        {results.map(result => (
          <SearchItem
            key={result.itemId}
            product={result.product}
            experiment={result.experiment}
            feature={EXPERIMENT_FEATURE}
          />
        ))}
      </ul>
    </div>
  );
};

export default Search;
